
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { DetectionViewport } from './components/DetectionViewport';
import { TelemetrySection } from './components/TelemetrySection';
import { TelemetryTable } from './components/TelemetryTable';
import { PythonHub } from './components/PythonHub';
import { ModelInfo } from './components/ModelInfo';
import { BeginnerGuide } from './components/BeginnerGuide';
import { Footer } from './components/Footer';
import { detectWithBrowser } from './utils/yoloBrowser';
import { SAMPLE_IMAGES, SampleImage, BoundingBox } from './data/detectionData';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'detector' | 'python-hub' | 'model-info' | 'guide'
  >('detector');

  // Current image and detection results
  const [currentImage, setCurrentImage] = useState<string>(
    SAMPLE_IMAGES[0].url
  );
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: SAMPLE_IMAGES[0].width,
    height: SAMPLE_IMAGES[0].height,
  });
  const [selectedSampleId, setSelectedSampleId] =
    useState<string>('urban-street');
  const [allDetections, setAllDetections] = useState<BoundingBox[]>(
    SAMPLE_IMAGES[0].detections
  );
  const [inferenceTime, setInferenceTime] = useState<number>(
    SAMPLE_IMAGES[0].inferenceTime
  );
  const [device, setDevice] = useState<string>(SAMPLE_IMAGES[0].device);

  // Model settings and overlays
  const [confThreshold, setConfThreshold] = useState<number>(0.25);
  const [iouThreshold, setIouThreshold] = useState<number>(0.45);
  const [selectedModel, setSelectedModel] = useState<string>('YOLOv8n');
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [classColorCoding, setClassColorCoding] = useState<boolean>(true);

  // Hover, selection and processing state
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Apply the confidence threshold to displayed detections
  const filteredDetections = useMemo(() => {
    return allDetections.filter(
      (detection) => detection.confidence >= confThreshold
    );
  }, [allDetections, confThreshold]);

  // Select a sample image
  const handleSelectSample = (sample: SampleImage) => {
    setSelectedSampleId(sample.id);
    setUploadedFile(null);
    setCurrentImage(sample.url);
    setImageDimensions({
      width: sample.width,
      height: sample.height,
    });
    setAllDetections(sample.detections);
    setInferenceTime(sample.inferenceTime);
    setDevice(sample.device);
    setHoveredBoxId(null);
    setSelectedBoxId(null);
  };

  // Upload an image from the user's computer
  const handleUploadImage = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    setUploadedFile(file);
    setSelectedSampleId('');
    setAllDetections([]);
    setInferenceTime(0);
    setIsProcessing(false);
    setHoveredBoxId(null);
    setSelectedBoxId(null);

    image.onload = () => {
      setCurrentImage(objectUrl);
      setImageDimensions({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setUploadedFile(null);
      alert('Unable to open this image. Please try another file.');
    };

    image.src = objectUrl;
  };

  // Run YOLOv8n directly in the browser using ONNX Runtime Web
  const handleDetect = async () => {
    if (!uploadedFile) {
      alert(
        'Please upload an image first to run real YOLO detection. Sample images currently show demo results.'
      );
      return;
    }

    if (selectedModel !== 'YOLOv8n') {
      setSelectedModel('YOLOv8n');
      alert(
        'Browser detection currently supports YOLOv8n only. YOLOv8n has been selected.'
      );
      return;
    }

    setIsProcessing(true);
    setHoveredBoxId(null);
    setSelectedBoxId(null);

    try {
      const result = await detectWithBrowser(
        uploadedFile,
        confThreshold,
        iouThreshold
      );

      setAllDetections(result.detections);
      setImageDimensions({
        width: result.imageWidth,
        height: result.imageHeight,
      });
      setInferenceTime(result.inferenceTimeMs);
      setDevice('Browser (WASM)');

      if (result.detections.length === 0) {
        alert(
          'Detection completed, but no objects were found at this confidence threshold. Try lowering the confidence threshold.'
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.';

      console.error('Browser detection error:', error);
      alert(`Detection failed: ${message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset the workspace
  const handleReset = () => {
    handleSelectSample(SAMPLE_IMAGES[0]);
    setConfThreshold(0.25);
    setIouThreshold(0.45);
    setSelectedModel('YOLOv8n');
    setShowBoxes(true);
    setShowLabels(true);
    setClassColorCoding(true);
    setHoveredBoxId(null);
    setSelectedBoxId(null);
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] antialiased min-h-screen flex flex-col font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 w-full pt-16">
        {activeTab === 'detector' && (
          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
            {/* Hero section */}
            <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaedff] text-xs font-mono text-[#004ac6] font-medium shadow-xs">
                  <span className="material-symbols-outlined text-[15px] font-bold">
                    neurology
                  </span>
                  <span>Ultralytics {selectedModel} Inference Engine</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006058]"></span>
                  <span className="text-[#434655]">Live Session</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-[#131b2e] tracking-tight font-['Plus_Jakarta_Sans']">
                  See What's in Your Image
                </h1>

                <p className="text-sm sm:text-base text-[#434655] max-w-2xl leading-relaxed">
                  Upload an image to detect objects, visualize bounding boxes,
                  and explore model confidence scores using browser-based
                  inference.
                </p>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white shadow-xs border border-[#eaedff]">
                  <div className="w-8 h-8 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#004ac6]">
                    <span className="material-symbols-outlined text-[18px]">
                      category
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#131b2e] font-['Plus_Jakarta_Sans']">
                      80 Classes
                    </div>
                    <div className="font-mono text-[10px] text-[#434655]">
                      COCO Dataset
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white shadow-xs border border-[#eaedff]">
                  <div className="w-8 h-8 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#006058]">
                    <span className="material-symbols-outlined text-[18px]">
                      verified
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#131b2e] font-['Plus_Jakarta_Sans']">
                      Confidence
                    </div>
                    <div className="font-mono text-[10px] text-[#434655]">
                      Adjustable Threshold
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white shadow-xs border border-[#eaedff]">
                  <div className="w-8 h-8 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#4b41e1]">
                    <span className="material-symbols-outlined text-[18px]">
                      bolt
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#131b2e] font-['Plus_Jakarta_Sans']">
                      ONNX Runtime
                    </div>
                    <div className="font-mono text-[10px] text-[#434655]">
                      Browser WASM
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Main workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Input settings */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <InputPanel
                  selectedSampleId={selectedSampleId}
                  onSelectSample={handleSelectSample}
                  onUploadImage={handleUploadImage}
                  confThreshold={confThreshold}
                  setConfThreshold={setConfThreshold}
                  iouThreshold={iouThreshold}
                  setIouThreshold={setIouThreshold}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  showBoxes={showBoxes}
                  setShowBoxes={setShowBoxes}
                  showLabels={showLabels}
                  setShowLabels={setShowLabels}
                  classColorCoding={classColorCoding}
                  setClassColorCoding={setClassColorCoding}
                  onDetect={handleDetect}
                  onReset={handleReset}
                  isProcessing={isProcessing}
                />
              </div>

              {/* Results and telemetry */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <DetectionViewport
                  imageUrl={currentImage}
                  imageDimensions={imageDimensions}
                  detections={filteredDetections}
                  totalPredictionsCount={allDetections.length}
                  modelName={selectedModel}
                  device={device}
                  showBoxes={showBoxes}
                  showLabels={showLabels}
                  classColorCoding={classColorCoding}
                  hoveredBoxId={hoveredBoxId}
                  setHoveredBoxId={setHoveredBoxId}
                  selectedBoxId={selectedBoxId}
                  setSelectedBoxId={setSelectedBoxId}
                />

                <TelemetrySection
                  detections={filteredDetections}
                  totalAvailableDetections={allDetections.length}
                  confThreshold={confThreshold}
                  inferenceTime={inferenceTime}
                  device={device}
                />

                <TelemetryTable
                  detections={filteredDetections}
                  confThreshold={confThreshold}
                  hoveredBoxId={hoveredBoxId}
                  setHoveredBoxId={setHoveredBoxId}
                  selectedBoxId={selectedBoxId}
                  setSelectedBoxId={setSelectedBoxId}
                />
              </div>
            </div>
          </div>
        )}

        {/* Python and Hugging Face hub */}
        {activeTab === 'python-hub' && <PythonHub />}

        {/* Model information */}
        {activeTab === 'model-info' && <ModelInfo />}

        {/* Beginner guide */}
        {activeTab === 'guide' && <BeginnerGuide />}
      </main>

      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}
