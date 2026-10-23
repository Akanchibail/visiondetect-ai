# VisionDetect AI

VisionDetect AI is a browser-based object detection dashboard built with React, TypeScript, Vite, and YOLOv8n. It uses ONNX Runtime Web to run object detection directly in the browser.

## Features

- Upload images for object detection.
- Visualize detected objects with bounding boxes and class labels.
- View confidence scores, object counts, class breakdowns, and bounding-box coordinates.
- Adjust confidence and Intersection over Union (IoU) thresholds.
- Review detection telemetry, including inference time.
- Explore the sample images and dashboard interface.

## Technology Stack

- React and TypeScript
- Vite
- ONNX Runtime Web
- YOLOv8n ONNX model
- Tailwind CSS

## How It Works

For uploaded images, the application preprocesses the image in the browser and runs the YOLOv8n ONNX model using WebAssembly. The model predictions are processed and displayed as bounding boxes and telemetry.

Sample images may display predefined demonstration results. Upload an image and run detection to test real model inference.

## Run Locally

### Prerequisites

- Node.js and npm
- A modern browser

### Installation

Clone the repository and enter the project directory:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd visiondetect-ai
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

### Production Build

To create a production build:

```bash
npm run build
```

The generated files are placed in the `dist` directory.

## Model File

The browser detector loads the YOLOv8n ONNX model from:

`public/models/yolov8n.onnx`

Keep this file in place when running or deploying the browser-based detector.

## Notes

- Browser inference performance depends on the device and browser.
- The current browser inference implementation supports YOLOv8n.
- The Python directory contains supporting experimentation and model-related files; the browser detector does not require the Python virtual environment.

## License

Add a license before redistributing this project or its model weights. Check the applicable licenses for the source code, dependencies, and model.
