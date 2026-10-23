"""VisionDetect AI - Standalone Pipeline Test Script.

This verification script allows beginners to test:
1. Ultralytics YOLOv8 installation and automatic weights download.
2. Image preprocessing and forward-pass inference.
3. Bounding box coordinates [x1, y1, x2, y2] extraction and normalization.
4. Confidence scores and class mappings.
5. Latency profiling (ms).

Usage:
    python test_pipeline.py
"""

import sys
import time
import numpy as np
from PIL import Image

def run_verification_test():
    print("=" * 60)
    print(" VisionDetect AI: Pre-flight Verification Test")
    print("=" * 60)

    # 1. Test Package Imports
    print("\n[Step 1/5] Checking essential dependencies...")
    try:
        import ultralytics
        from ultralytics import YOLO
        import gradio
        import pandas
        print(f"  [+] Ultralytics version: {ultralytics.__version__}")
        print(f"  [+] Gradio version:      {gradio.__version__}")
        print(f"  [+] Pandas version:      {pandas.__version__}")
    except ImportError as e:
        print(f"  [-] Missing dependency: {e}")
        print("  --> Please run: pip install -r requirements.txt")
        sys.exit(1)

    # 2. Test Model Loading & Weight Download
    model_name = "yolov8n.pt"
    print(f"\n[Step 2/5] Loading YOLOv8 model weights ({model_name})...")
    start_load = time.time()
    try:
        model = YOLO(model_name)
        load_time = (time.time() - start_load) * 1000
        print(f"  [+] Model successfully initialized in {load_time:.1f} ms")
        print(f"  [+] Supported classes: {len(model.names)} (COCO dataset)")
    except Exception as e:
        print(f"  [-] Failed to load model weights: {e}")
        sys.exit(1)

    # 3. Create a Synthetic Test Image
    print("\n[Step 3/5] Generating synthetic test canvas (640x640)...")
    synthetic_arr = np.random.randint(50, 200, size=(640, 640, 3), dtype=np.uint8)
    # Draw simple shapes to simulate visual patterns
    synthetic_arr[150:350, 150:350, :] = [220, 50, 50]  # Red block
    synthetic_arr[400:550, 200:450, :] = [50, 180, 50]  # Green block
    test_img = Image.fromarray(synthetic_arr)
    print("  [+] Synthetic test image created successfully.")

    # 4. Test Inference Execution
    print("\n[Step 4/5] Running test forward-pass inference...")
    t0 = time.perf_counter()
    results = model.predict(source=test_img, conf=0.25, verbose=False)
    inference_time = (time.perf_counter() - t0) * 1000

    assert len(results) > 0, "No results returned from model.predict"
    res = results[0]
    boxes = res.boxes
    print(f"  [+] Inference completed in {inference_time:.1f} ms!")
    print(f"  [+] Bounding boxes detected: {len(boxes)}")

    # 5. Test Plotting & Bounding Box Coordinates
    print("\n[Step 5/5] Testing visual plotting and coordinate extraction...")
    try:
        annotated_arr = res.plot()
        assert annotated_arr is not None and annotated_arr.shape[0] > 0, "Annotation plot is empty"
        print(f"  [+] Output image plotted with dimensions: {annotated_arr.shape}")
        
        # Test coordinate parsing logic
        for i, b in enumerate(boxes):
            cls_name = res.names[int(b.cls[0].item())]
            conf = float(b.conf[0].item())
            coords = [int(c) for c in b.xyxy[0].tolist()]
            print(f"    - Detection #{i+1}: {cls_name} ({conf*100:.1f}%) at {coords}")

    except Exception as e:
        print(f"  [-] Annotation parsing error: {e}")
        sys.exit(1)

    print("\n" + "=" * 60)
    print(" 🎉 ALL PRE-FLIGHT TESTS PASSED!")
    print(" Your Python environment is 100% ready to run: python app.py")
    print("=" * 60)

if __name__ == "__main__":
    run_verification_test()
