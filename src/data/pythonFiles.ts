/**
 * Python source code and configurations stored for instant viewing,
 * copying, and one-click zip generation in the web app.
 */

export const PYTHON_FILES = {
  'app.py': `"""VisionDetect AI - Pretrained Ultralytics YOLOv8 Object Detection Web Application.

Built with Python, Gradio, and Ultralytics YOLO.
Optimized for deployment on Hugging Face Spaces (CPU or GPU tier).
"""

import os
import time
from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import pandas as pd
from PIL import Image
from ultralytics import YOLO
import gradio as gr

# ==============================================================================
# Model Initialization
# ==============================================================================
DEFAULT_MODEL_NAME = "yolov8n.pt"

print(f"[*] Initializing VisionDetect AI engine with model: {DEFAULT_MODEL_NAME}")
try:
    model = YOLO(DEFAULT_MODEL_NAME)
    print("[+] YOLO model loaded successfully!")
except Exception as e:
    print(f"[-] Error loading default model: {e}")
    model = None


def detect_objects(
    image: Optional[Image.Image],
    conf_threshold: float = 0.25,
    iou_threshold: float = 0.45,
    model_choice: str = "yolov8n.pt"
) -> Tuple[Optional[Image.Image], str, pd.DataFrame, str]:
    """Main prediction pipeline."""
    # 1. Gracefully handle empty or invalid inputs
    if image is None:
        return (
            None,
            "### ⚠️ No Image Provided\\nPlease upload a valid JPG, JPEG, or PNG image to run detection.",
            pd.DataFrame(columns=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"]),
            "Please upload an image before clicking Detect."
        )

    # 2. Ensure model instance is available
    global model, DEFAULT_MODEL_NAME
    if model is None or DEFAULT_MODEL_NAME != model_choice:
        try:
            print(f"[*] Loading model variant: {model_choice}...")
            model = YOLO(model_choice)
            DEFAULT_MODEL_NAME = model_choice
        except Exception as e:
            return (
                image,
                f"### ❌ Model Load Error\\nCould not load \`{model_choice}\`: {str(e)}",
                pd.DataFrame(columns=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"]),
                f"Error loading model: {str(e)}"
            )

    try:
        # 3. Execute YOLOv8 inference
        start_time = time.perf_counter()
        results = model.predict(
            source=image,
            conf=conf_threshold,
            iou=iou_threshold,
            verbose=False
        )
        total_time_ms = (time.perf_counter() - start_time) * 1000.0

        if not results or len(results) == 0:
            return (
                image,
                "### ℹ️ No Results\\nThe model did not return any prediction output.",
                pd.DataFrame(columns=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"]),
                "Inference completed with no results."
            )

        res = results[0]
        
        # 4. Extract annotated image with bounding boxes
        annotated_bgr = res.plot()
        annotated_rgb = annotated_bgr[..., ::-1]
        annotated_image = Image.fromarray(annotated_rgb)

        # 5. Extract bounding boxes, labels, and confidence scores
        boxes = res.boxes
        total_detected = len(boxes) if boxes is not None else 0
        speed_info = getattr(res, "speed", {})
        inference_ms = speed_info.get("inference", total_time_ms)

        if total_detected == 0:
            summary_md = f"""
### 🔍 Detection Complete (No Objects Found)
- **Total Objects:** \`0\`
- **Confidence Threshold:** \`{conf_threshold:.2f}\`
- **Inference Time:** \`{inference_ms:.1f} ms\`
*Tip: Try lowering the confidence threshold slider to capture lower-confidence objects.*
"""
            empty_df = pd.DataFrame(columns=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"])
            return (
                annotated_image,
                summary_md,
                empty_df,
                "No objects detected above the selected confidence threshold."
            )

        # 6. Parse detections into structured table data
        records: List[Dict[str, Any]] = []
        class_counts: Dict[str, int] = {}
        confidences: List[float] = []
        names = res.names

        for idx, box in enumerate(boxes, start=1):
            cls_id = int(box.cls[0].item())
            class_name = names.get(cls_id, f"Class {cls_id}")
            conf = float(box.conf[0].item())
            confidences.append(conf)
            
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = [int(round(coord)) for coord in xyxy]
            area = max(0, (x2 - x1) * (y2 - y1))
            class_counts[class_name] = class_counts.get(class_name, 0) + 1

            records.append({
                "#": f"{idx:02d}",
                "Class": class_name,
                "Confidence": f"{conf * 100:.1f}%",
                "Bounding Box [x1, y1, x2, y2]": f"[{x1}, {y1}, {x2}, {y2}]",
                "Area (px²)": f"{area:,}"
            })

        detection_df = pd.DataFrame(records)
        unique_classes_count = len(class_counts)
        mean_conf = (sum(confidences) / len(confidences)) * 100.0 if confidences else 0.0
        sorted_breakdown = sorted(class_counts.items(), key=lambda item: item[1], reverse=True)
        chips_md = " ".join([f"\`{name}: {count}\`" for name, count in sorted_breakdown])

        summary_md = f"""
### ⚡ Inference Telemetry
| Metric | Value | Detail |
| :--- | :--- | :--- |
| **Total Objects Detected** | **{total_detected}** | Boxes above threshold |
| **Unique Classes** | **{unique_classes_count}** | Distinct categories found |
| **Inference Latency** | **{inference_ms:.1f} ms** | Neural processing time |
| **Mean Confidence** | **{mean_conf:.1f}%** | Average detection precision |

**Class Breakdown:**  
{chips_md}
"""
        status_msg = f"Successfully detected {total_detected} object(s) across {unique_classes_count} class(es) in {inference_ms:.1f} ms."
        return annotated_image, summary_md, detection_df, status_msg

    except Exception as err:
        error_msg = f"An unexpected error occurred during detection: {str(err)}"
        return (
            image,
            f"### ❌ Inference Error\\n\`{error_msg}\`",
            pd.DataFrame(columns=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"]),
            error_msg
        )


def reset_interface():
    """Clears inputs and resets results."""
    return (
        None,
        None,
        "Upload an image and click **Detect Objects** to see real-time bounding boxes and telemetry.",
        pd.DataFrame(columns=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"]),
        "Workspace cleared."
    )


# Gradio UI Theme & Elements
theme = gr.themes.Soft(primary_hue="blue", neutral_hue="slate")

with gr.Blocks(theme=theme, title="VisionDetect AI - YOLOv8 Object Detection") as demo:
    gr.HTML("""
    <div style="padding: 1.5rem 0 0.5rem 0;">
        <span style="background: #eaedff; color: #004ac6; padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-size: 12px;">
            🧠 Ultralytics YOLOv8 Inference Engine • Live Session
        </span>
        <h1 style="font-size: 2rem; font-weight: 700; margin: 8px 0; color: #131b2e;">
            See What's in Your Image
        </h1>
        <p style="color: #434655; margin: 0; max-width: 700px;">
            Upload an image to detect objects, visualize bounding boxes, and explore model confidence scores in real-time.
        </p>
    </div>
    """)

    with gr.Row():
        with gr.Column(scale=5):
            gr.Markdown("### 📷 Source Image Input")
            input_image = gr.Image(type="pil", label="Upload JPG, JPEG, or PNG", height=320)
            
            with gr.Accordion("⚙️ Model Parameters", open=True):
                model_selector = gr.Dropdown(
                    choices=["yolov8n.pt", "yolov8s.pt", "yolov8m.pt"],
                    value="yolov8n.pt",
                    label="Model Variant",
                    info="yolov8n is ultra-fast for CPU inference on free Spaces."
                )
                conf_slider = gr.Slider(0.05, 0.95, value=0.25, step=0.05, label="Confidence Threshold")
                iou_slider = gr.Slider(0.10, 0.90, value=0.45, step=0.05, label="IoU / NMS Suppression")

            with gr.Row():
                detect_btn = gr.Button("⚡ Detect Objects", variant="primary", scale=2)
                clear_btn = gr.Button("🔄 Reset", scale=1)

            status_output = gr.Textbox(label="Status", value="Ready for inference.", interactive=False)

        with gr.Column(scale=7):
            gr.Markdown("### 👁️ Detection Viewport")
            output_image = gr.Image(type="pil", label="Annotated Result", height=380)
            telemetry_markdown = gr.Markdown("Upload an image to inspect telemetry.")
            
            gr.Markdown("### 📋 Object Detection Telemetry Table")
            detection_table = gr.Dataframe(
                headers=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"],
                interactive=False,
                wrap=True
            )

    detect_btn.click(
        fn=detect_objects,
        inputs=[input_image, conf_slider, iou_slider, model_selector],
        outputs=[output_image, telemetry_markdown, detection_table, status_output]
    )

    clear_btn.click(
        fn=reset_interface,
        inputs=[],
        outputs=[input_image, output_image, telemetry_markdown, detection_table, status_output]
    )

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=int(os.environ.get("PORT", 7860)))
`,

  'requirements.txt': `# VisionDetect AI Dependencies
ultralytics>=8.3.0
gradio>=4.44.0
pillow>=10.0.0
numpy>=1.24.0
pandas>=2.0.0
opencv-python-headless>=4.8.0
`,

  'README.md': `---
title: VisionDetect AI - YOLOv8 Object Detection
emoji: 👁️
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 4.44.1
app_file: app.py
pinned: false
license: mit
short_description: Real-time YOLOv8 object detection with Gradio and telemetry
---

# 👁️ VisionDetect AI
Pretrained Ultralytics YOLOv8 object detection web app deployed on Hugging Face Spaces.
`,

  'test_pipeline.py': `"""VisionDetect AI - Standalone Pipeline Test Script.
Run this script to verify dependencies and YOLOv8 weights before launching Gradio.
"""
import sys
import time
import numpy as np
from PIL import Image

def test():
    print("[1/4] Importing libraries...")
    from ultralytics import YOLO
    import gradio
    print("  -> Libraries loaded successfully.")

    print("[2/4] Downloading / loading YOLOv8n weights...")
    model = YOLO("yolov8n.pt")
    print("  -> Model loaded with 80 COCO classes.")

    print("[3/4] Running dummy image prediction...")
    dummy = Image.fromarray(np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8))
    res = model.predict(dummy, conf=0.25, verbose=False)
    print(f"  -> Prediction passed in {res[0].speed.get('inference', 0):.1f} ms.")

    print("[4/4] Verified! Ready to launch: python app.py")

if __name__ == "__main__":
    test()
`
};
