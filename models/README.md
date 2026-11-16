# YOLO Model Weights

Large model weight files (`.pt`) are excluded from Git version control via `.gitignore` to keep the repository lightweight.

## Supported Models

The backend uses **Ultralytics YOLO** (`yolo11n.pt` by default, or `yolov8n.pt`).

## Automatic Download

When you start the backend (`python app.py`) or run the detector for the first time, `ultralytics` automatically downloads `yolo11n.pt` (approx. 5.4 MB) into the configured model cache or `models/` directory.

## Manual Download

You can also download the weights manually using Python:

```bash
python -c "from ultralytics import YOLO; YOLO('yolo11n.pt')"
```

Or download directly from the official Ultralytics releases:
- **YOLO11n**: `https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11n.pt`
- **YOLOv8n**: `https://github.com/ultralytics/assets/releases/download/v8.2.0/yolov8n.pt`

Place the downloaded `.pt` file inside this `models/` directory or in `backend/`.
