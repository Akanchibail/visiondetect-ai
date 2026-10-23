/**
 * VisionDetect AI - Detection Datasets, COCO 80 Classes, and Model Specs
 */

export interface BoundingBox {
  id: string;
  label: string;
  classId: number;
  confidence: number;
  // Coordinates in percentage [0..100] for responsive rendering
  pctBox: { left: number; top: number; width: number; height: number };
  // Absolute pixel coordinates for [x1, y1, x2, y2]
  pixelBox: [number, number, number, number];
  area: number;
  color: string;
}

export interface SampleImage {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  inferenceTime: number; // in ms
  device: string;
  detections: BoundingBox[];
}

export const COCO_CLASSES = [
  'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
  'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat',
  'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack',
  'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
  'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
  'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
  'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake',
  'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop',
  'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
  'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
];

export const CLASS_COLORS: Record<string, string> = {
  person: '#2563EB',     // Blue
  car: '#D97706',        // Amber
  bicycle: '#059669',    // Emerald
  chair: '#7C3AED',      // Purple
  'dining table': '#0891B2', // Cyan
  backpack: '#E11D48',   // Rose
  laptop: '#4F46E5',     // Indigo
  keyboard: '#0D9488',   // Teal
  mouse: '#9333EA',      // Purple
  cup: '#EA580C',        // Orange
  couch: '#16A34A',      // Green
  'potted plant': '#15803D', // Forest Green
  dog: '#CA8A04',        // Yellow
  tv: '#2563EB',         // Blue
  cell_phone: '#DB2777', // Pink
  default: '#3B82F6'
};

export function getClassColor(label: string): string {
  const normalized = label.toLowerCase();
  return CLASS_COLORS[normalized] || CLASS_COLORS.default;
}

// Sample 1: The Urban Street scene from the Stitch design screenshot!
export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'urban-street',
    name: 'Urban Street',
    // High-resolution urban street photo matching Image_1_11553826.png
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=80',
    width: 1376,
    height: 768,
    inferenceTime: 28.4,
    device: 'NVIDIA RTX 4090 / CUDA:0',
    detections: [
      {
        id: 'det-1',
        label: 'car',
        classId: 2,
        confidence: 0.962,
        pctBox: { left: 54, top: 40, width: 32, height: 38 },
        pixelBox: [743, 307, 1183, 599],
        area: 128480,
        color: '#D97706'
      },
      {
        id: 'det-2',
        label: 'person',
        classId: 0,
        confidence: 0.941,
        pctBox: { left: 14, top: 28, width: 11, height: 52 },
        pixelBox: [192, 215, 344, 614],
        area: 60648,
        color: '#2563EB'
      },
      {
        id: 'det-3',
        label: 'person',
        classId: 0,
        confidence: 0.914,
        pctBox: { left: 31, top: 32, width: 10, height: 48 },
        pixelBox: [426, 245, 564, 614],
        area: 50922,
        color: '#2563EB'
      },
      {
        id: 'det-4',
        label: 'bicycle',
        classId: 1,
        confidence: 0.890,
        pctBox: { left: 4, top: 58, width: 18, height: 35 },
        pixelBox: [55, 445, 302, 714],
        area: 66443,
        color: '#059669'
      },
      {
        id: 'det-5',
        label: 'backpack',
        classId: 24,
        confidence: 0.853,
        pctBox: { left: 23, top: 38, width: 6, height: 16 },
        pixelBox: [316, 291, 399, 414],
        area: 10209,
        color: '#E11D48'
      },
      {
        id: 'det-6',
        label: 'chair',
        classId: 56,
        confidence: 0.821,
        pctBox: { left: 88, top: 56, width: 9, height: 28 },
        pixelBox: [1210, 430, 1334, 645],
        area: 26660,
        color: '#7C3AED'
      },
      {
        id: 'det-7',
        label: 'dining table',
        classId: 60,
        confidence: 0.784,
        pctBox: { left: 77, top: 62, width: 14, height: 26 },
        pixelBox: [1059, 476, 1252, 675],
        area: 38407,
        color: '#0891B2'
      },
      {
        id: 'det-8',
        label: 'person',
        classId: 0,
        confidence: 0.760,
        pctBox: { left: 44, top: 35, width: 8, height: 42 },
        pixelBox: [605, 268, 715, 591],
        area: 35530,
        color: '#2563EB'
      },
      {
        id: 'det-9',
        label: 'chair',
        classId: 56,
        confidence: 0.715,
        pctBox: { left: 70, top: 59, width: 7, height: 24 },
        pixelBox: [963, 453, 1059, 637],
        area: 17664,
        color: '#7C3AED'
      },
      {
        id: 'det-10',
        label: 'person',
        classId: 0,
        confidence: 0.680,
        pctBox: { left: 66, top: 36, width: 6, height: 35 },
        pixelBox: [908, 276, 990, 545],
        area: 22058,
        color: '#2563EB'
      },
      {
        id: 'det-11',
        label: 'chair',
        classId: 56,
        confidence: 0.640,
        pctBox: { left: 84, top: 58, width: 6, height: 23 },
        pixelBox: [1155, 445, 1238, 622],
        area: 14691,
        color: '#7C3AED'
      },
      {
        id: 'det-12',
        label: 'person',
        classId: 0,
        confidence: 0.580,
        pctBox: { left: 2, top: 40, width: 5, height: 38 },
        pixelBox: [27, 307, 96, 599],
        area: 20148,
        color: '#2563EB'
      },
      {
        id: 'det-13',
        label: 'chair',
        classId: 56,
        confidence: 0.420,
        pctBox: { left: 94, top: 60, width: 5, height: 22 },
        pixelBox: [1293, 460, 1362, 629],
        area: 11661,
        color: '#7C3AED'
      },
      {
        id: 'det-14',
        label: 'person',
        classId: 0,
        confidence: 0.350,
        pctBox: { left: 50, top: 36, width: 4, height: 32 },
        pixelBox: [688, 276, 743, 522],
        area: 13530,
        color: '#2563EB'
      }
    ]
  },
  {
    id: 'living-room',
    name: 'Living Room',
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80',
    width: 1280,
    height: 720,
    inferenceTime: 31.2,
    device: 'NVIDIA RTX 4090 / CUDA:0',
    detections: [
      {
        id: 'lr-1',
        label: 'couch',
        classId: 57,
        confidence: 0.954,
        pctBox: { left: 18, top: 42, width: 64, height: 44 },
        pixelBox: [230, 302, 1050, 619],
        area: 259940,
        color: '#16A34A'
      },
      {
        id: 'lr-2',
        label: 'potted plant',
        classId: 58,
        confidence: 0.912,
        pctBox: { left: 84, top: 32, width: 14, height: 50 },
        pixelBox: [1075, 230, 1254, 590],
        area: 64440,
        color: '#15803D'
      },
      {
        id: 'lr-3',
        label: 'chair',
        classId: 56,
        confidence: 0.885,
        pctBox: { left: 4, top: 45, width: 16, height: 38 },
        pixelBox: [51, 324, 256, 597],
        area: 55965,
        color: '#7C3AED'
      },
      {
        id: 'lr-4',
        label: 'dining table',
        classId: 60,
        confidence: 0.830,
        pctBox: { left: 32, top: 68, width: 36, height: 26 },
        pixelBox: [410, 490, 870, 677],
        area: 86020,
        color: '#0891B2'
      },
      {
        id: 'lr-5',
        label: 'cup',
        classId: 41,
        confidence: 0.742,
        pctBox: { left: 46, top: 71, width: 4, height: 7 },
        pixelBox: [589, 511, 640, 561],
        area: 2550,
        color: '#EA580C'
      }
    ]
  },
  {
    id: 'office-desk',
    name: 'Office Desk',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=80',
    width: 1280,
    height: 800,
    inferenceTime: 25.8,
    device: 'NVIDIA RTX 4090 / CUDA:0',
    detections: [
      {
        id: 'od-1',
        label: 'laptop',
        classId: 63,
        confidence: 0.978,
        pctBox: { left: 34, top: 38, width: 32, height: 36 },
        pixelBox: [435, 304, 845, 592],
        area: 118080,
        color: '#4F46E5'
      },
      {
        id: 'od-2',
        label: 'chair',
        classId: 56,
        confidence: 0.932,
        pctBox: { left: 24, top: 48, width: 48, height: 48 },
        pixelBox: [307, 384, 921, 768],
        area: 235776,
        color: '#7C3AED'
      },
      {
        id: 'od-3',
        label: 'keyboard',
        classId: 66,
        confidence: 0.894,
        pctBox: { left: 38, top: 58, width: 24, height: 12 },
        pixelBox: [486, 464, 793, 560],
        area: 29472,
        color: '#0D9488'
      },
      {
        id: 'od-4',
        label: 'mouse',
        classId: 64,
        confidence: 0.841,
        pctBox: { left: 66, top: 62, width: 6, height: 8 },
        pixelBox: [845, 496, 921, 560],
        area: 4864,
        color: '#9333EA'
      },
      {
        id: 'od-5',
        label: 'cup',
        classId: 41,
        confidence: 0.812,
        pctBox: { left: 26, top: 54, width: 7, height: 11 },
        pixelBox: [333, 432, 422, 520],
        area: 7832,
        color: '#EA580C'
      }
    ]
  }
];

export const YOLO_MODELS = [
  {
    name: 'YOLOv8n (Nano)',
    filename: 'yolov8n.pt',
    params: '3.2M',
    flops: '8.7G',
    cpuSpeed: '28 ms',
    gpuSpeed: '1.5 ms',
    mAP: '37.3',
    memory: '6.3 MB',
    tier: 'Free Tier (HF Spaces)',
    description: 'Ultra-lightweight model ideal for CPU servers, free Hugging Face Spaces, and embedded edge devices.'
  },
  {
    name: 'YOLOv8s (Small)',
    filename: 'yolov8s.pt',
    params: '11.2M',
    flops: '28.6G',
    cpuSpeed: '85 ms',
    gpuSpeed: '2.5 ms',
    mAP: '44.9',
    memory: '22.5 MB',
    tier: 'Balanced',
    description: 'Great trade-off between rapid processing speed and elevated detection recall for varied environments.'
  },
  {
    name: 'YOLOv8m (Medium)',
    filename: 'yolov8m.pt',
    params: '25.9M',
    flops: '78.9G',
    cpuSpeed: '210 ms',
    gpuSpeed: '4.8 ms',
    mAP: '50.2',
    memory: '52.0 MB',
    tier: 'High Precision',
    description: 'High-capacity feature extraction for cluttered street scenes and dense object aggregations.'
  },
  {
    name: 'YOLOv8l (Large)',
    filename: 'yolov8l.pt',
    params: '43.7M',
    flops: '165.2G',
    cpuSpeed: '440 ms',
    gpuSpeed: '8.2 ms',
    mAP: '52.9',
    memory: '87.7 MB',
    tier: 'Heavy Workloads',
    description: 'Designed for production systems with dedicated GPU infrastructure demanding high mAP.'
  },
  {
    name: 'YOLOv8x (Extra Large)',
    filename: 'yolov8x.pt',
    params: '68.2M',
    flops: '257.8G',
    cpuSpeed: '780 ms',
    gpuSpeed: '11.5 ms',
    mAP: '53.9',
    memory: '136.7 MB',
    tier: 'Maximum Accuracy',
    description: 'State-of-the-art vision accuracy with maximum parameters and highest multi-scale feature resolution.'
  }
];
