"""VisionDetect AI - Pretrained Ultralytics YOLOv8 Object Detection Web Application.

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
# We use 'yolov8n.pt' (nano) by default because it runs under ~50ms on CPU,
# requires only ~6.3MB of memory, and downloads automatically on first run.
# For higher accuracy, you can change this to 'yolov8s.pt' or 'yolov8m.pt'.
DEFAULT_MODEL_NAME = "yolov8n.pt"

print(f"[*] Initializing VisionDetect AI engine with model: {DEFAULT_MODEL_NAME}")
try:
    model = YOLO(DEFAULT_MODEL_NAME)
    print("[+] YOLO model loaded successfully!")
except Exception as e:
    print(f"[-] Error loading default model: {e}")
    model = None


# ==============================================================================
# Object Detection Logic
# ==============================================================================
def detect_objects(
    image: Optional[Image.Image],
    conf_threshold: float = 0.25,
    iou_threshold: float = 0.45,
    model_choice: str = "yolov8n.pt"
) -> Tuple[
    Optional[Image.Image],  # Annotated Image
    str,                   # Telemetry Summary Markdown
    pd.DataFrame,          # Detection Details Table
    str                    # Status Message
]:
    """
    Main prediction pipeline.
    
    Args:
        image: PIL Image uploaded by the user
        conf_threshold: Minimum detection confidence (0.05 to 0.95)
        iou_threshold: Intersection over Union threshold for Non-Max Suppression
        model_choice: Selected YOLOv8 model variant
        
    Returns:
        Tuple containing:
        - Annotated image with bounding boxes
        - Markdown summary of counts, classes, and inference latency
        - Pandas DataFrame with detection coordinates and confidence
        - Status or warning notification string
    """
    # 1. Gracefully handle empty or invalid inputs
    if image is None:
        return (
            None,
            "### ⚠️ No Image Provided\nPlease upload a valid JPG, JPEG, or PNG image to run detection.",
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
                f"### ❌ Model Load Error\nCould not load `{model_choice}`: {str(e)}",
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
                "### ℹ️ No Results\nThe model did not return any prediction output.",
                pd.DataFrame(columns=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"]),
                "Inference completed with no results."
            )

        res = results[0]
        
        # 4. Extract annotated image with bounding boxes
        # res.plot() produces a BGR numpy array; convert back to RGB for PIL/Gradio
        annotated_bgr = res.plot()
        annotated_rgb = annotated_bgr[..., ::-1]  # BGR to RGB
        annotated_image = Image.fromarray(annotated_rgb)

        # 5. Extract bounding boxes, labels, and confidence scores
        boxes = res.boxes
        total_detected = len(boxes) if boxes is not None else 0

        # Ultralytics internal inference speed telemetry (if available)
        speed_info = getattr(res, "speed", {})
        inference_ms = speed_info.get("inference", total_time_ms)

        # Handle zero detections
        if total_detected == 0:
            summary_md = f"""
### 🔍 Detection Complete (No Objects Found)
- **Total Objects:** `0`
- **Confidence Threshold:** `{conf_threshold:.2f}`
- **Inference Time:** `{inference_ms:.1f} ms`
*Tip: Try lowering the confidence threshold to detect smaller or less distinct objects.*
"""
            empty_df = pd.DataFrame(columns=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"])
            return (
                annotated_image,
                summary_md,
                empty_df,
                "No objects detected above the selected confidence threshold."
            )

        # 6. Parse detections into structured table data & compute class aggregations
        records: List[Dict[str, Any]] = []
        class_counts: Dict[str, int] = {}
        confidences: List[float] = []

        names = res.names  # Dictionary mapping class ID to human-readable label

        for idx, box in enumerate(boxes, start=1):
            # Class ID and label
            cls_id = int(box.cls[0].item())
            class_name = names.get(cls_id, f"Class {cls_id}")
            
            # Confidence score
            conf = float(box.conf[0].item())
            confidences.append(conf)
            
            # Coordinates: [x1, y1, x2, y2]
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = [int(round(coord)) for coord in xyxy]
            area = max(0, (x2 - x1) * (y2 - y1))

            # Update class counter
            class_counts[class_name] = class_counts.get(class_name, 0) + 1

            records.append({
                "#": f"{idx:02d}",
                "Class": class_name,
                "Confidence": f"{conf * 100:.1f}%",
                "Bounding Box [x1, y1, x2, y2]": f"[{x1}, {y1}, {x2}, {y2}]",
                "Area (px²)": f"{area:,}"
            })

        detection_df = pd.DataFrame(records)

        # 7. Formulate Telemetry & Class Breakdown Summary
        unique_classes_count = len(class_counts)
        mean_conf = (sum(confidences) / len(confidences)) * 100.0 if confidences else 0.0

        # Sort class breakdown by frequency
        sorted_breakdown = sorted(class_counts.items(), key=lambda item: item[1], reverse=True)
        chips_md = " ".join([f"`{name}: {count}`" for name, count in sorted_breakdown])

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
        print(f"[-] {error_msg}")
        return (
            image,
            f"### ❌ Inference Error\n`{error_msg}`",
            pd.DataFrame(columns=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"]),
            error_msg
        )


def reset_interface() -> Tuple[None, None, str, pd.DataFrame, str]:
    """Clears inputs and resets results."""
    return (
        None,  # Reset input image
        None,  # Reset output image
        "Upload an image and click **Detect Objects** to see real-time bounding boxes and telemetry.",
        pd.DataFrame(columns=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"]),
        "Workspace cleared."
    )


# ==============================================================================
# Gradio User Interface Construction
# ==============================================================================
CUSTOM_CSS = """
/* VisionDetect AI Styling matching Google Stitch Design */
.gradio-container {
    font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
    max-width: 1280px !important;
    margin: 0 auto !important;
}
.header-badge {
    background-color: #eaedff;
    color: #004ac6;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
}
.primary-btn {
    background-color: #2563eb !important;
    color: white !important;
    font-weight: 600 !important;
    border-radius: 0.5rem !important;
}
.primary-btn:hover {
    background-color: #1d4ed8 !important;
}
"""

theme = gr.themes.Soft(
    primary_hue="blue",
    neutral_hue="slate",
    font=[gr.themes.GoogleFont("Inter"), "sans-serif"],
)

with gr.Blocks(theme=theme, css=CUSTOM_CSS, title="VisionDetect AI - YOLOv8 Object Detection") as demo:
    gr.HTML("""
    <div style="padding: 1.5rem 0 0.5rem 0; text-align: left;">
        <div class="header-badge" style="margin-bottom: 0.75rem;">
            <span>🧠 Ultralytics YOLOv8 Inference Engine</span>
            <span>•</span>
            <span style="color: #006058;">Live Session</span>
        </div>
        <h1 style="font-size: 2rem; font-weight: 700; margin: 0; color: #131b2e; letter-spacing: -0.02em;">
            See What's in Your Image
        </h1>
        <p style="font-size: 1rem; color: #434655; margin-top: 0.4rem; max-width: 750px;">
            Upload an image to detect objects, visualize bounding boxes, and explore model confidence scores in real-time.
        </p>
    </div>
    """)

    with gr.Row():
        # ---------------- Left Column: Input & Settings ----------------
        with gr.Column(scale=5):
            gr.Markdown("### 📷 Source Image Input")
            input_image = gr.Image(
                type="pil",
                label="Upload JPG, JPEG, or PNG (Max 25MB)",
                sources=["upload", "clipboard"],
                height=320
            )

            with gr.Accordion("⚙️ Model Parameters & Overlays", open=True):
                model_selector = gr.Dropdown(
                    choices=["yolov8n.pt", "yolov8s.pt", "yolov8m.pt"],
                    value="yolov8n.pt",
                    label="Model Variant",
                    info="yolov8n (Nano) is optimized for ultra-fast CPU inference on free Spaces."
                )

                conf_slider = gr.Slider(
                    minimum=0.05,
                    maximum=0.95,
                    value=0.25,
                    step=0.05,
                    label="Confidence Threshold",
                    info="Lower to find more objects; raise to filter false positives."
                )

                iou_slider = gr.Slider(
                    minimum=0.10,
                    maximum=0.90,
                    value=0.45,
                    step=0.05,
                    label="IoU / NMS Suppression",
                    info="Controls overlap suppression for duplicate bounding boxes."
                )

            with gr.Row():
                detect_btn = gr.Button("⚡ Detect Objects", variant="primary", scale=2, elem_classes=["primary-btn"])
                clear_btn = gr.Button("🔄 Reset", scale=1)

            status_output = gr.Textbox(
                label="Pipeline Status",
                value="Ready for inference. Upload an image above.",
                interactive=False
            )

        # ---------------- Right Column: Output & Telemetry ----------------
        with gr.Column(scale=7):
            gr.Markdown("### 👁️ Detection Viewport")
            output_image = gr.Image(
                type="pil",
                label="Annotated Result (Bounding Boxes & Class Scores)",
                height=380
            )

            telemetry_markdown = gr.Markdown(
                value="Upload an image and click **Detect Objects** to inspect real-time metrics.",
                label="Inference Telemetry"
            )

            gr.Markdown("### 📋 Object Detection Telemetry Table")
            detection_table = gr.Dataframe(
                headers=["#", "Class", "Confidence", "Bounding Box [x1, y1, x2, y2]", "Area (px²)"],
                datatype=["str", "str", "str", "str", "str"],
                label="Detected Objects Details",
                interactive=False,
                wrap=True
            )

    # ---------------- Examples Section ----------------
    gr.Markdown("---")
    gr.Markdown("#### 💡 Try Sample Images")
    
    # Check if sample assets exist locally, otherwise use remote placeholders
    sample_images = []
    sample_dir = os.path.join(os.path.dirname(__file__), "samples")
    if os.path.exists(sample_dir):
        for f in sorted(os.listdir(sample_dir)):
            if f.lower().endswith((".png", ".jpg", ".jpeg")):
                sample_images.append([os.path.join(sample_dir, f), 0.25, 0.45, "yolov8n.pt"])

    if sample_images:
        gr.Examples(
            examples=sample_images,
            inputs=[input_image, conf_slider, iou_slider, model_selector],
            outputs=[output_image, telemetry_markdown, detection_table, status_output],
            fn=detect_objects,
            cache_examples=False
        )

    # ---------------- Wire Event Handlers ----------------
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

    # Re-run detection when confidence slider changes (if an image is loaded)
    conf_slider.change(
        fn=detect_objects,
        inputs=[input_image, conf_slider, iou_slider, model_selector],
        outputs=[output_image, telemetry_markdown, detection_table, status_output]
    )


# ==============================================================================
# Application Entry Point
# ==============================================================================
if __name__ == "__main__":
    # Launch Gradio on port 7860 (Hugging Face default) or 3000
    demo.launch(
        server_name="0.0.0.0",
        server_port=int(os.environ.get("PORT", 7860)),
        share=False
    )
