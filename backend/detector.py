"""YOLO Object Detection Engine using Ultralytics YOLO11 and OpenCV."""

from __future__ import annotations

import os
import time
from collections import defaultdict
from pathlib import Path
from typing import Callable, Optional

import cv2
import numpy as np
from ultralytics import YOLO

# Deterministic vibrant color palette (BGR) for bounding boxes
PALETTE: list[tuple[int, int, int]] = [
    (255, 191, 0),    # Deep Sky / Cyan-Blue
    (0, 215, 255),    # Gold
    (127, 255, 0),    # Spring Green
    (255, 105, 180),  # Hot Pink
    (50, 205, 50),    # Lime Green
    (255, 144, 30),   # Dodger Blue
    (0, 165, 255),    # Orange
    (238, 130, 238),  # Violet
    (208, 224, 64),   # Turquoise
    (147, 20, 255),   # Deep Pink
]


def _color_for_class(class_id: int) -> tuple[int, int, int]:
    return PALETTE[class_id % len(PALETTE)]


class ObjectDetector:
    """Wrapper around Ultralytics YOLO for image and video object detection."""

    def __init__(self, model_name: Optional[str] = None) -> None:
        base_dir = Path(__file__).resolve().parent.parent
        models_dir = base_dir / "models"
        models_dir.mkdir(parents=True, exist_ok=True)

        default_model = os.getenv("YOLO_MODEL", "yolo11n.pt")
        chosen = model_name or default_model

        # If a relative filename is given and exists in models/, use it; otherwise
        # let Ultralytics resolve or download it into models/.
        local_candidate = models_dir / chosen
        if local_candidate.exists():
            model_path = str(local_candidate)
        else:
            model_path = str(local_candidate) if chosen.endswith(".pt") and "/" not in chosen and "\\" not in chosen else chosen

        self.model = YOLO(model_path)
        self.model_name = Path(model_path).name

    def get_classes(self) -> list[str]:
        """Return sorted list of class names supported by the loaded YOLO model."""
        names = self.model.names
        if isinstance(names, dict):
            return [names[idx] for idx in sorted(names.keys())]
        return list(names)

    def _draw_detection(
        self,
        frame: np.ndarray,
        box: tuple[int, int, int, int],
        label: str,
        confidence: float,
        color: tuple[int, int, int],
    ) -> None:
        x1, y1, x2, y2 = box
        h, w = frame.shape[:2]
        thickness = max(2, min(4, int(round(max(h, w) / 450))))
        font_scale = max(0.5, min(0.9, max(h, w) / 1400))

        cv2.rectangle(frame, (x1, y1), (x2, y2), color, thickness)

        text = f"{label} {confidence * 100:.1f}%"
        (text_w, text_h), baseline = cv2.getTextSize(
            text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, max(1, thickness - 1)
        )

        pill_top = max(0, y1 - text_h - baseline - 8)
        pill_bottom = max(text_h + baseline + 8, y1)
        pill_right = min(w, x1 + text_w + 12)

        cv2.rectangle(
            frame,
            (x1, pill_top),
            (pill_right, pill_bottom),
            color,
            -1,
        )

        # Choose dark or light text depending on background luminance
        luminance = 0.114 * color[0] + 0.587 * color[1] + 0.299 * color[2]
        text_color = (15, 23, 42) if luminance > 140 else (255, 255, 255)

        cv2.putText(
            frame,
            text,
            (x1 + 6, pill_bottom - baseline - 4),
            cv2.FONT_HERSHEY_SIMPLEX,
            font_scale,
            text_color,
            max(1, thickness - 1),
            cv2.LINE_AA,
        )

    def _extract_and_draw(
        self,
        frame: np.ndarray,
        conf_threshold: float,
        allowed_classes: Optional[set[str]] = None,
    ) -> tuple[np.ndarray, list[dict]]:
        annotated = frame.copy()
        results = self.model.predict(
            source=frame,
            conf=conf_threshold,
            verbose=False,
        )

        detections: list[dict] = []
        if not results:
            return annotated, detections

        result = results[0]
        names = result.names

        if result.boxes is None:
            return annotated, detections

        for box in result.boxes:
            cls_id = int(box.cls[0].item())
            conf = float(box.conf[0].item())
            label = names[cls_id] if isinstance(names, dict) else names[cls_id]

            if allowed_classes and label.lower() not in allowed_classes:
                continue

            x1, y1, x2, y2 = [int(round(v)) for v in box.xyxy[0].tolist()]
            color = _color_for_class(cls_id)
            self._draw_detection(annotated, (x1, y1, x2, y2), label, conf, color)

            detections.append(
                {
                    "class_name": label,
                    "confidence": round(conf * 100, 2),
                    "bbox": [x1, y1, x2, y2],
                }
            )

        return annotated, detections

    @staticmethod
    def _summarize(detections: list[dict]) -> list[dict]:
        grouped: dict[str, list[float]] = defaultdict(list)
        for det in detections:
            grouped[det["class_name"]].append(det["confidence"])

        summary = []
        for obj_name, confs in grouped.items():
            summary.append(
                {
                    "object": obj_name,
                    "confidence": round(sum(confs) / len(confs), 1),
                    "max_confidence": round(max(confs), 1),
                    "count": len(confs),
                }
            )

        summary.sort(key=lambda item: (-item["count"], -item["confidence"]))
        return summary

    def detect_image(
        self,
        input_path: str | Path,
        output_path: str | Path,
        conf_threshold: float = 0.25,
        allowed_classes: Optional[list[str]] = None,
    ) -> dict:
        """Run object detection on an image and save the annotated output."""
        start = time.perf_counter()
        image = cv2.imread(str(input_path))
        if image is None:
            raise ValueError(f"Could not read image file: {input_path}")

        allowed_set = (
            {c.strip().lower() for c in allowed_classes if c.strip()}
            if allowed_classes
            else None
        )

        annotated, detections = self._extract_and_draw(
            image, conf_threshold=conf_threshold, allowed_classes=allowed_set
        )

        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        if not cv2.imwrite(str(output_path), annotated):
            raise RuntimeError(f"Failed to write annotated image to {output_path}")

        elapsed_ms = round((time.perf_counter() - start) * 1000, 1)
        height, width = image.shape[:2]

        return {
            "total_objects": len(detections),
            "detections": detections,
            "summary": self._summarize(detections),
            "width": width,
            "height": height,
            "processing_time_ms": elapsed_ms,
            "model": self.model_name,
        }

    def detect_video(
        self,
        input_path: str | Path,
        output_path: str | Path,
        conf_threshold: float = 0.25,
        allowed_classes: Optional[list[str]] = None,
        progress_callback: Optional[Callable[[int, int], None]] = None,
    ) -> dict:
        """Run frame-by-frame object detection on a video and save annotated MP4."""
        start = time.perf_counter()
        cap = cv2.VideoCapture(str(input_path))
        if not cap.isOpened():
            raise ValueError(f"Could not open video file: {input_path}")

        fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
        if fps <= 0 or fps > 120:
            fps = 24.0
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0

        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Try browser-friendly H.264 first, then fall back to mp4v
        writer = None
        for codec in ("avc1", "H264", "mp4v"):
            fourcc = cv2.VideoWriter_fourcc(*codec)
            candidate = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height))
            if candidate.isOpened():
                writer = candidate
                break
            candidate.release()

        if writer is None:
            cap.release()
            raise RuntimeError("Failed to initialize OpenCV VideoWriter for MP4 output.")

        allowed_set = (
            {c.strip().lower() for c in allowed_classes if c.strip()}
            if allowed_classes
            else None
        )

        processed_frames = 0
        total_frame_detections = 0
        peak_objects_in_frame = 0
        class_confs: dict[str, list[float]] = defaultdict(list)
        class_peak_counts: dict[str, int] = defaultdict(int)

        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                annotated, detections = self._extract_and_draw(
                    frame, conf_threshold=conf_threshold, allowed_classes=allowed_set
                )
                writer.write(annotated)

                processed_frames += 1
                total_frame_detections += len(detections)
                peak_objects_in_frame = max(peak_objects_in_frame, len(detections))

                frame_counts: dict[str, int] = defaultdict(int)
                for det in detections:
                    cls_name = det["class_name"]
                    class_confs[cls_name].append(det["confidence"])
                    frame_counts[cls_name] += 1

                for cls_name, cnt in frame_counts.items():
                    class_peak_counts[cls_name] = max(class_peak_counts[cls_name], cnt)

                if progress_callback and total_frames > 0:
                    progress_callback(processed_frames, total_frames)
        finally:
            cap.release()
            writer.release()

        elapsed_ms = round((time.perf_counter() - start) * 1000, 1)

        summary = []
        for cls_name, confs in class_confs.items():
            summary.append(
                {
                    "object": cls_name,
                    "confidence": round(sum(confs) / len(confs), 1),
                    "count": class_peak_counts[cls_name],
                    "total_frame_detections": len(confs),
                }
            )
        summary.sort(key=lambda item: (-item["count"], -item["confidence"]))

        return {
            "total_objects": sum(item["count"] for item in summary),
            "total_frame_detections": total_frame_detections,
            "peak_objects_in_frame": peak_objects_in_frame,
            "processed_frames": processed_frames,
            "total_frames": total_frames or processed_frames,
            "fps": round(fps, 2),
            "width": width,
            "height": height,
            "summary": summary,
            "processing_time_ms": elapsed_ms,
            "model": self.model_name,
        }
