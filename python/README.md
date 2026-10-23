---
title: VisionDetect AI - YOLOv8 Object Detection
emoji: 👁️
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 4.44.1
app_file: app.py
pinned: false
license: mit
short_description: Pretrained Ultralytics YOLOv8 real-time object detection with Gradio
---

# 👁️ VisionDetect AI — Ultralytics YOLOv8 Object Detection

VisionDetect AI is a production-grade, portfolio-ready Computer Vision web application built with **Python**, **Ultralytics YOLOv8**, and **Gradio**, specifically tailored for deployment on **Hugging Face Spaces**.

---

## 🚀 Key Features

1. **Pretrained Neural Inference**: Employs Ultralytics YOLOv8 (trained on the 80-class MS COCO dataset).
2. **Interactive Visual Bounding Boxes**: Automatically renders reticles, labels, and calibrated confidence scores directly on uploaded images.
3. **Comprehensive Telemetry**:
   - Total detected objects count
   - Unique class count (e.g., Person, Car, Bicycle)
   - Neural inference latency in milliseconds (`results[0].speed['inference']`)
   - Mean confidence percentage across all detected objects
   - Class breakdown distribution
4. **Structured Telemetry Table**: Displays object labels, confidence percentages, bounding box coordinates `[x1, y1, x2, y2]`, and bounding box surface area in square pixels.
5. **Dynamic Control Pipeline**:
   - Configurable Confidence Threshold slider (0.05 to 0.95)
   - Configurable IoU / NMS Suppression slider (0.10 to 0.90)
   - Model switcher (`yolov8n.pt`, `yolov8s.pt`, `yolov8m.pt`)
6. **Graceful Error Handling**: Robust fallbacks for empty inputs, invalid formats, or zero-detection thresholds.
7. **One-Click Reset**: Easily clear the workspace and start fresh.

---

## 🧠 Model Selection & Computational Requirements

| Model | Parameters | FLOPs (640px) | CPU Latency (HF Free) | T4 GPU Latency | Recommended Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **YOLOv8n** *(Default)* | **3.2 Million** | **8.7 G** | **~25–45 ms** | **~1.5 ms** | **Hugging Face Spaces Free Tier (2 vCPU, 16GB RAM)** |
| **YOLOv8s** | 11.2 Million | 28.6 G | ~90–140 ms | ~2.5 ms | Balanced speed & accuracy |
| **YOLOv8m** | 25.9 Million | 78.9 G | ~210–320 ms | ~4.8 ms | Higher recall for crowded scenes |
| **YOLOv8x** | 68.2 Million | 257.8 G | ~550–900 ms | ~11.5 ms | Maximum precision on dedicated GPU |

> **Why YOLOv8n (Nano) is the Default**:
> Hugging Face Spaces free tier provides 2 vCPUs and 16GB RAM without dedicated GPU acceleration. **YOLOv8n** weighs only **6.3 MB**, initiates in milliseconds, and delivers sub-50ms inference on standard CPUs with zero out-of-memory risks.

---

## 🛠️ Step-by-Step Local Development Workflow

### Milestone 1: Clone or Create Project Directory
```bash
mkdir visiondetect-ai
cd visiondetect-ai
```

### Milestone 2: Set Up Python Virtual Environment
We recommend Python 3.10, 3.11, or 3.12:

```bash
# On macOS / Linux:
python3 -m venv venv
source venv/bin/activate

# On Windows (PowerShell):
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### Milestone 3: Install Required Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Milestone 4: Run the Standalone Verification Test
Run the verification script to verify that PyTorch, Ultralytics, and the model weights download and predict correctly:
```bash
python test_pipeline.py
```
Expected output:
```
[+] PASSED: YOLOv8 model loaded successfully!
[+] PASSED: Synthetic image inference completed in 32.4 ms!
[+] PASSED: Telemetry extracted accurately.
```

### Milestone 5: Launch the Gradio Web Application
```bash
python app.py
```
Open your browser at `http://127.0.0.1:7860` to interact with VisionDetect AI!

---

## ☁️ Step-by-Step Deployment to Hugging Face Spaces

Deploying VisionDetect AI to Hugging Face Spaces takes less than 3 minutes and requires no credit card.

### Method A: Web UI Upload (Easiest for Beginners)
1. Navigate to [Hugging Face Spaces](https://huggingface.co/spaces).
2. Click **Create new Space**.
3. Choose a Space name (e.g., `visiondetect-ai`).
4. Select **Gradio** as the Space SDK.
5. Select **Blank** (or Python 3.10) with the default **Free CPU tier (2 vCPU, 16GB RAM)**.
6. Click **Create Space**.
7. In the "Files" tab of your new Space, upload the following files:
   - `app.py`
   - `requirements.txt`
   - `README.md` (Contains the Hugging Face configuration header)
8. Hugging Face Spaces will automatically build the container, install packages, and serve the application live!

### Method B: Git Command Line
```bash
# 1. Clone your empty Hugging Face Space repository
git clone https://huggingface.co/spaces/YOUR_USERNAME/visiondetect-ai
cd visiondetect-ai

# 2. Copy app.py, requirements.txt, and README.md into the folder
cp /path/to/app.py .
cp /path/to/requirements.txt .
cp /path/to/README.md .

# 3. Commit and push
git add .
git commit -m "Deploy VisionDetect AI with YOLOv8 & Gradio"
git push
```

Within 60–90 seconds, your live demo URL will be available at:
`https://huggingface.co/spaces/YOUR_USERNAME/visiondetect-ai`

---

## 📂 Project Structure

```
visiondetect-ai/
├── app.py              # Main Gradio application & Ultralytics YOLOv8 pipeline
├── requirements.txt    # Project Python dependencies
├── README.md           # Hugging Face Space configuration and documentation
├── test_pipeline.py    # Automated test script for model verification
└── samples/            # Optional sample images (Urban street, living room, desk)
```

---

## 📜 License
Released under the [MIT License](LICENSE). Powered by [Ultralytics YOLO](https://github.com/ultralytics/ultralytics) and [Gradio](https://gradio.app).
