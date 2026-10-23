import * as ort from 'onnxruntime-web';
import { COCO_CLASSES, getClassColor, BoundingBox } from '../data/detectionData';

const INPUT_SIZE = 640;
let sessionPromise: Promise<ort.InferenceSession> | null = null;

function getSession(): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = ort.InferenceSession.create('/models/yolov8n.onnx', {
      executionProviders: ['wasm'],
    }).catch((error) => {
      sessionPromise = null;
      throw error;
    });
  }
  return sessionPromise;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function intersectionOverUnion(
  a: [number, number, number, number],
  b: [number, number, number, number],
): number {
  const left = Math.max(a[0], b[0]);
  const top = Math.max(a[1], b[1]);
  const right = Math.min(a[2], b[2]);
  const bottom = Math.min(a[3], b[3]);

  const intersection =
    Math.max(0, right - left) * Math.max(0, bottom - top);

  const areaA = Math.max(0, a[2] - a[0]) * Math.max(0, a[3] - a[1]);
  const areaB = Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);

  return intersection / Math.max(areaA + areaB - intersection, 1e-7);
}

export async function detectWithBrowser(
  file: File,
  confidenceThreshold: number,
  iouThreshold: number,
): Promise<{
  detections: BoundingBox[];
  imageWidth: number;
  imageHeight: number;
  inferenceTimeMs: number;
}> {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = imageUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Could not load the uploaded image.'));
    });

    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;

    // Resize proportionally and add padding to make a 640 x 640 image.
    const scale = Math.min(
      INPUT_SIZE / imageWidth,
      INPUT_SIZE / imageHeight,
    );

    const resizedWidth = Math.round(imageWidth * scale);
    const resizedHeight = Math.round(imageHeight * scale);
    const padX = Math.floor((INPUT_SIZE - resizedWidth) / 2);
    const padY = Math.floor((INPUT_SIZE - resizedHeight) / 2);
    const scaleX = resizedWidth / imageWidth;
    const scaleY = resizedHeight / imageHeight;

    const canvas = document.createElement('canvas');
    canvas.width = INPUT_SIZE;
    canvas.height = INPUT_SIZE;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Your browser could not prepare the image.');
    }

    context.fillStyle = 'rgb(114, 114, 114)';
    context.fillRect(0, 0, INPUT_SIZE, INPUT_SIZE);
    context.drawImage(image, padX, padY, resizedWidth, resizedHeight);

    const pixels = context.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE).data;
    const input = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE);
    const planeSize = INPUT_SIZE * INPUT_SIZE;

    // Convert canvas RGBA pixels into normalized RGB, channel-first data.
    for (let y = 0; y < INPUT_SIZE; y++) {
      for (let x = 0; x < INPUT_SIZE; x++) {
        const pixelIndex = (y * INPUT_SIZE + x) * 4;
        const targetIndex = y * INPUT_SIZE + x;

        input[targetIndex] = pixels[pixelIndex] / 255;
        input[planeSize + targetIndex] = pixels[pixelIndex + 1] / 255;
        input[2 * planeSize + targetIndex] = pixels[pixelIndex + 2] / 255;
      }
    }

    const session = await getSession();
    const inputName = session.inputNames[0];
    if (!inputName) {
      throw new Error('The ONNX model has no input tensor.');
    }

    const tensor = new ort.Tensor('float32', input, [
      1,
      3,
      INPUT_SIZE,
      INPUT_SIZE,
    ]);

    const startTime = performance.now();
    const outputs = await session.run({ [inputName]: tensor });
    const inferenceTimeMs = performance.now() - startTime;

    const outputName = session.outputNames[0];
    const output = outputName ? outputs[outputName] : undefined;

    if (!output || !(output.data instanceof Float32Array)) {
      throw new Error('The model returned an unsupported output format.');
    }

    // Standard YOLOv8 detection output is [1, 84, 8400].
    // Also support the transposed [1, 8400, 84] layout.
    const dimensions = output.dims;
    if (dimensions.length !== 3 || dimensions[0] !== 1) {
      throw new Error(`Unexpected model output shape: ${dimensions.join(' x ')}`);
    }

    const data = output.data;
    const firstLayout = dimensions[1] === 4 + COCO_CLASSES.length;
    const featureCount = firstLayout ? dimensions[1] : dimensions[2];
    const candidateCount = firstLayout ? dimensions[2] : dimensions[1];

    if (featureCount !== 4 + COCO_CLASSES.length) {
      throw new Error(
        `Expected ${4 + COCO_CLASSES.length} model features but received ${featureCount}.`,
      );
    }

    const valueAt = (candidate: number, feature: number): number =>
      firstLayout
        ? data[feature * candidateCount + candidate]
        : data[candidate * featureCount + feature];

    const candidates: Array<{
      classId: number;
      confidence: number;
      box: [number, number, number, number];
    }> = [];

    for (let i = 0; i < candidateCount; i++) {
      let classId = -1;
      let score = 0;

      for (let c = 0; c < COCO_CLASSES.length; c++) {
        const classScore = valueAt(i, c + 4);
        if (classScore > score) {
          score = classScore;
          classId = c;
        }
      }

      if (classId < 0 || score < confidenceThreshold) continue;

      // YOLOv8 coordinates are center-x, center-y, width, height.
      const centerX = valueAt(i, 0);
      const centerY = valueAt(i, 1);
      const width = valueAt(i, 2);
      const height = valueAt(i, 3);

      const x1 = clamp((centerX - width / 2 - padX) / scaleX, 0, imageWidth);
      const y1 = clamp((centerY - height / 2 - padY) / scaleY, 0, imageHeight);
      const x2 = clamp((centerX + width / 2 - padX) / scaleX, 0, imageWidth);
      const y2 = clamp((centerY + height / 2 - padY) / scaleY, 0, imageHeight);

      if (x2 <= x1 || y2 <= y1) continue;

      candidates.push({
        classId,
        confidence: score,
        box: [x1, y1, x2, y2],
      });
    }

    // Class-aware non-maximum suppression.
    candidates.sort((a, b) => b.confidence - a.confidence);
    const kept: typeof candidates = [];

    for (const candidate of candidates) {
      const suppressed = kept.some(
        (chosen) =>
          chosen.classId === candidate.classId &&
          intersectionOverUnion(chosen.box, candidate.box) > iouThreshold,
      );

      if (!suppressed) kept.push(candidate);
      if (kept.length >= 300) break;
    }

    const detections: BoundingBox[] = kept.map((item, index) => {
      const [x1, y1, x2, y2] = item.box;
      const width = x2 - x1;
      const height = y2 - y1;
      const label = COCO_CLASSES[item.classId];

      return {
        id: `browser-${index}-${item.classId}`,
        label,
        classId: item.classId,
        confidence: item.confidence,
        pctBox: {
          left: (x1 / imageWidth) * 100,
          top: (y1 / imageHeight) * 100,
          width: (width / imageWidth) * 100,
          height: (height / imageHeight) * 100,
        },
        pixelBox: [x1, y1, x2, y2],
        area: width * height,
        color: getClassColor(label),
      };
    });

    return { detections, imageWidth, imageHeight, inferenceTimeMs };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}