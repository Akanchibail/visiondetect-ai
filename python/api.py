
"""FastAPI bridge between the VisionDetect React frontend and YOLO."""

import base64
import io
import re
import time

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from app import detect_objects

app = FastAPI(title="VisionDetect AI API", version="1.0.0")

# Allow the local React development server to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "VisionDetect AI API"}


@app.post("/api/detect")
async def detect(
    image: UploadFile = File(...),
    conf_threshold: float = Form(0.25),
    iou_threshold: float = Form(0.45),
    model_choice: str = Form("yolov8n.pt"),
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file.")

    if not 0.05 <= conf_threshold <= 0.95:
        raise HTTPException(status_code=400, detail="Confidence must be between 0.05 and 0.95.")

    if not 0.10 <= iou_threshold <= 0.90:
        raise HTTPException(status_code=400, detail="IoU must be between 0.10 and 0.90.")

    allowed_models = {"yolov8n.pt", "yolov8s.pt", "yolov8m.pt"}
    if model_choice not in allowed_models:
        raise HTTPException(status_code=400, detail="Unsupported model selection.")

    try:
        contents = await image.read()
        original = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="The uploaded image could not be opened.")

    width, height = original.size
    started = time.perf_counter()

    annotated, summary, table, status = detect_objects(
        original,
        conf_threshold,
        iou_threshold,
        model_choice,
    )

    elapsed_ms = (time.perf_counter() - started) * 1000
    detections = []

    for index, row in table.iterrows():
        coords = [
            int(value)
            for value in re.findall(
                r"-?\d+",
                str(row.get("Bounding Box [x1, y1, x2, y2]", "")),
            )
        ]

        if len(coords) != 4:
            continue

        x1, y1, x2, y2 = coords
        confidence_text = str(row.get("Confidence", "0")).replace("%", "")
        confidence = float(confidence_text) / 100.0

        label = str(row.get("Class", "unknown"))

        detections.append({
            "id": f"det-{index + 1}",
            "label": label,
            "classId": -1,
            "confidence": confidence,
            "pctBox": {
                "left": x1 / width * 100,
                "top": y1 / height * 100,
                "width": (x2 - x1) / width * 100,
                "height": (y2 - y1) / height * 100,
            },
            "pixelBox": [x1, y1, x2, y2],
            "area": max(0, (x2 - x1) * (y2 - y1)),
        })

    annotated_base64 = None
    if annotated is not None:
        buffer = io.BytesIO()
        annotated.save(buffer, format="PNG")
        encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
        annotated_base64 = f"data:image/png;base64,{encoded}"

    return {
        "image_width": width,
        "image_height": height,
        "detections": detections,
        "inference_time_ms": round(elapsed_ms, 1),
        "summary": summary,
        "status": status,
        "annotated_image": annotated_base64,
    }
