"""FastAPI backend for the AI Object Detection System."""

from __future__ import annotations

import json
import os
import threading
import uuid
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from fastapi import BackgroundTasks, FastAPI, File, Form, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from detector import ObjectDetector

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
HISTORY_FILE = BASE_DIR / "history.json"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_VIDEO_EXTS = {".mp4", ".avi", ".mov"}

app = FastAPI(
    title="AI Object Detection API",
    description="YOLOv11-powered REST API for real-time image and video object detection.",
    version="1.0.0",
)

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = (
    [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
    if allowed_origins_env != "*"
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

_history_lock = threading.Lock()
_jobs_lock = threading.Lock()
_jobs: dict[str, dict[str, Any]] = {}

detector = ObjectDetector()


def _load_history() -> list[dict[str, Any]]:
    if not HISTORY_FILE.exists():
        return []
    try:
        data = json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []


def _save_history_entry(entry: dict[str, Any]) -> None:
    with _history_lock:
        history = _load_history()
        history.insert(0, entry)
        history = history[:50]  # Keep most recent 50 entries
        HISTORY_FILE.write_text(json.dumps(history, indent=2), encoding="utf-8")


def _parse_classes(classes_str: Optional[str]) -> Optional[list[str]]:
    if not classes_str:
        return None
    parsed = [c.strip() for c in classes_str.split(",") if c.strip()]
    return parsed or None


def _validate_confidence(confidence: float) -> float:
    if not 0.05 <= confidence <= 0.99:
        raise HTTPException(
            status_code=400,
            detail="Confidence threshold must be between 0.05 and 0.99.",
        )
    return confidence


@app.get("/api/health")
def health_check() -> dict[str, Any]:
    return {
        "status": "ok",
        "model": detector.model_name,
        "classes_count": len(detector.get_classes()),
    }


@app.get("/api/classes")
def list_classes() -> dict[str, list[str]]:
    return {"classes": detector.get_classes()}


@app.get("/api/stats")
def get_dashboard_stats() -> dict[str, Any]:
    history = _load_history()
    total_images = sum(1 for item in history if item.get("media_type") == "image")
    total_videos = sum(1 for item in history if item.get("media_type") == "video")
    total_objects = sum(int(item.get("total_objects", 0)) for item in history)

    object_counter: Counter[str] = Counter()
    for item in history:
        for row in item.get("summary", []):
            object_counter[row["object"]] += int(row.get("count", 0))

    most_frequent = [
        {"object": name, "count": count}
        for name, count in object_counter.most_common(6)
    ]

    return {
        "total_images_processed": total_images,
        "total_videos_processed": total_videos,
        "total_objects_detected": total_objects,
        "most_frequent_objects": most_frequent,
        "recent_history": history[:15],
    }


@app.delete("/api/history")
def clear_history() -> dict[str, str]:
    with _history_lock:
        if HISTORY_FILE.exists():
            HISTORY_FILE.write_text("[]", encoding="utf-8")
    return {"status": "cleared"}


@app.post("/api/detect/image")
async def detect_image_endpoint(
    file: UploadFile = File(...),
    confidence: float = Form(0.25),
    classes: Optional[str] = Form(None),
) -> dict[str, Any]:
    _validate_confidence(confidence)
    filename = file.filename or "upload.jpg"
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image format '{ext}'. Allowed: JPG, JPEG, PNG, WEBP.",
        )

    uid = uuid.uuid4().hex[:12]
    input_path = UPLOAD_DIR / f"{uid}_{Path(filename).name}"
    output_filename = f"detected_{uid}{ext if ext != '.webp' else '.png'}"
    output_path = OUTPUT_DIR / output_filename

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded image file is empty.")
    input_path.write_bytes(content)

    allowed_classes = _parse_classes(classes)

    try:
        result = detector.detect_image(
            input_path=input_path,
            output_path=output_path,
            conf_threshold=confidence,
            allowed_classes=allowed_classes,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Detection failed: {exc}") from exc

    entry = {
        "id": uid,
        "media_type": "image",
        "filename": Path(filename).name,
        "output_filename": output_filename,
        "output_url": f"/api/outputs/{output_filename}",
        "download_url": f"/api/outputs/{output_filename}?download=true",
        "confidence_threshold": round(confidence * 100),
        "total_objects": result["total_objects"],
        "summary": result["summary"],
        "processing_time_ms": result["processing_time_ms"],
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    _save_history_entry(entry)

    return {
        **entry,
        "detections": result["detections"],
        "width": result["width"],
        "height": result["height"],
        "model": result["model"],
    }


def _run_video_job(
    job_id: str,
    input_path: Path,
    output_path: Path,
    original_filename: str,
    output_filename: str,
    confidence: float,
    allowed_classes: Optional[list[str]],
) -> None:
    def on_progress(processed: int, total: int) -> None:
        pct = min(99, int((processed / max(1, total)) * 100))
        with _jobs_lock:
            if job_id in _jobs:
                _jobs[job_id]["processed_frames"] = processed
                _jobs[job_id]["total_frames"] = total
                _jobs[job_id]["progress"] = pct

    try:
        result = detector.detect_video(
            input_path=input_path,
            output_path=output_path,
            conf_threshold=confidence,
            allowed_classes=allowed_classes,
            progress_callback=on_progress,
        )

        entry = {
            "id": job_id,
            "media_type": "video",
            "filename": original_filename,
            "output_filename": output_filename,
            "output_url": f"/api/outputs/{output_filename}",
            "download_url": f"/api/outputs/{output_filename}?download=true",
            "confidence_threshold": round(confidence * 100),
            "total_objects": result["total_objects"],
            "summary": result["summary"],
            "processing_time_ms": result["processing_time_ms"],
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        _save_history_entry(entry)

        payload = {
            **entry,
            "total_frame_detections": result["total_frame_detections"],
            "peak_objects_in_frame": result["peak_objects_in_frame"],
            "processed_frames": result["processed_frames"],
            "total_frames": result["total_frames"],
            "fps": result["fps"],
            "width": result["width"],
            "height": result["height"],
            "model": result["model"],
        }

        with _jobs_lock:
            _jobs[job_id].update(
                {
                    "status": "completed",
                    "progress": 100,
                    "processed_frames": result["processed_frames"],
                    "total_frames": result["total_frames"],
                    "result": payload,
                }
            )
    except Exception as exc:
        with _jobs_lock:
            _jobs[job_id].update(
                {
                    "status": "failed",
                    "error": str(exc),
                }
            )


@app.post("/api/detect/video")
async def detect_video_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    confidence: float = Form(0.25),
    classes: Optional[str] = Form(None),
) -> dict[str, Any]:
    _validate_confidence(confidence)
    filename = file.filename or "upload.mp4"
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_VIDEO_EXTS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported video format '{ext}'. Allowed: MP4, AVI, MOV.",
        )

    job_id = uuid.uuid4().hex[:12]
    input_path = UPLOAD_DIR / f"{job_id}_{Path(filename).name}"
    output_filename = f"detected_{job_id}.mp4"
    output_path = OUTPUT_DIR / output_filename

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded video file is empty.")
    input_path.write_bytes(content)

    allowed_classes = _parse_classes(classes)

    with _jobs_lock:
        _jobs[job_id] = {
            "job_id": job_id,
            "status": "processing",
            "progress": 0,
            "processed_frames": 0,
            "total_frames": 0,
            "result": None,
            "error": None,
        }

    background_tasks.add_task(
        _run_video_job,
        job_id,
        input_path,
        output_path,
        Path(filename).name,
        output_filename,
        confidence,
        allowed_classes,
    )

    return {"job_id": job_id, "status": "processing"}


@app.get("/api/jobs/{job_id}")
def get_job_status(job_id: str) -> dict[str, Any]:
    with _jobs_lock:
        job = _jobs.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Video processing job not found.")
        return dict(job)


@app.get("/api/outputs/{filename}")
def get_output_file(
    filename: str,
    download: bool = Query(False),
) -> FileResponse:
    safe_name = Path(filename).name
    file_path = OUTPUT_DIR / safe_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Output file not found.")

    ext = file_path.suffix.lower()
    media_type_map = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".mp4": "video/mp4",
    }
    media_type = media_type_map.get(ext, "application/octet-stream")

    headers = {}
    if download:
        headers["Content-Disposition"] = f'attachment; filename="{safe_name}"'

    return FileResponse(path=file_path, media_type=media_type, headers=headers)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
