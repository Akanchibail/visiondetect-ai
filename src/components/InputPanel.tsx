import React, { useRef, useState } from 'react';
import { SAMPLE_IMAGES, SampleImage } from '../data/detectionData';
import { Upload, RefreshCw, Check, Sliders, Cpu, Crop, Tag, Palette } from 'lucide-react';

interface InputPanelProps {
  selectedSampleId: string;
  onSelectSample: (sample: SampleImage) => void;
  onUploadImage: (file: File) => void;
  confThreshold: number;
  setConfThreshold: (val: number) => void;
  iouThreshold: number;
  setIouThreshold: (val: number) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  showBoxes: boolean;
  setShowBoxes: (show: boolean) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  classColorCoding: boolean;
  setClassColorCoding: (color: boolean) => void;
  onDetect: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  selectedSampleId,
  onSelectSample,
  onUploadImage,
  confThreshold,
  setConfThreshold,
  iouThreshold,
  setIouThreshold,
  selectedModel,
  setSelectedModel,
  showBoxes,
  setShowBoxes,
  showLabels,
  setShowLabels,
  classColorCoding,
  setClassColorCoding,
  onDetect,
  onReset,
  isProcessing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
        onUploadImage(file);
      } else {
        alert('Please upload a valid JPG, JPEG, PNG, or WEBP image.');
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
        onUploadImage(file);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* CARD 1: Image Upload (Gradio Style) */}
      <div className="bg-white rounded-xl p-5 shadow-xs border border-[#eaedff] flex flex-col gap-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[20px] font-bold">
              add_photo_alternate
            </span>
            <span className="font-semibold text-[16px] text-[#131b2e] font-['Plus_Jakarta_Sans']">
              Source Image Input
            </span>
          </div>
          <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-[#eaedff] text-[#434655]">
            JPG, PNG • Max 25MB
          </span>
        </div>

        {/* Drag and Drop Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-xl p-6 transition-all duration-200 flex flex-col items-center justify-center text-center gap-3 border-2 border-dashed ${
            isDragOver
              ? 'bg-[#dbe1ff]/40 border-[#004ac6] scale-[1.01]'
              : 'bg-[#f2f3ff] border-[#c3c6d7] hover:bg-[#eaedff] hover:border-[#004ac6]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-[#004ac6] group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-sm text-[#131b2e]">
              Drop your image here or browse files
            </p>
            <p className="text-xs text-[#434655]">
              High resolution landscape or street views yield optimal detections
            </p>
          </div>
          <button
            type="button"
            className="mt-1 px-4 py-1.5 rounded-lg bg-white text-[#131b2e] text-xs font-semibold shadow-xs border border-[#c3c6d7] group-hover:bg-[#004ac6] group-hover:text-white group-hover:border-[#004ac6] transition-colors"
          >
            Browse Local Disk
          </button>
        </div>

        {/* Try Sample Selectors */}
        <div className="space-y-2">
          <span className="font-mono text-[11px] text-[#434655] uppercase tracking-wider block font-semibold">
            Try Sample Images
          </span>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_IMAGES.map((sample) => {
              const isSelected = selectedSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => onSelectSample(sample)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#004ac6] text-white font-semibold shadow-xs'
                      : 'bg-[#eaedff] text-[#434655] hover:text-[#131b2e] hover:bg-[#dbe1ff]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  <span className="truncate">{sample.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary & Secondary Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onDetect}
            disabled={isProcessing}
            className={`flex-1 py-2.5 px-4 rounded-lg bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition duration-150 cursor-pointer ${
              isProcessing ? 'opacity-75 cursor-wait' : 'active:scale-[0.98]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] font-bold">radar</span>
            <span>{isProcessing ? 'Analyzing...' : 'Detect Objects'}</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="py-2.5 px-4 rounded-lg bg-[#eaedff] hover:bg-[#dbe1ff] text-[#131b2e] font-medium text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#434655]" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* CARD 2: Detection Settings & Overlays */}
      <div className="bg-white rounded-xl p-5 shadow-xs border border-[#eaedff] flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[20px] font-bold">
              tune
            </span>
            <span className="font-semibold text-[16px] text-[#131b2e] font-['Plus_Jakarta_Sans']">
              Model Parameters
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#007b71] font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#007b71] animate-pulse"></span>
            <span>Active Pipeline</span>
          </span>
        </div>

        {/* Model Variant Selector */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-[#131b2e] flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-[#004ac6]" />
              <span>Model Architecture</span>
            </label>
            <span className="font-mono text-[11px] text-[#004ac6] font-semibold bg-[#eaedff] px-2 py-0.5 rounded">
              COCO 80-Class
            </span>
          </div>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-[#f2f3ff] border border-[#c3c6d7] text-xs font-medium text-[#131b2e] focus:outline-hidden focus:border-[#004ac6]"
          >
            
            <option value="YOLOv8m">YOLOv8m (Medium • 25.9M Params • High Recall)</option>
            <option value="YOLOv8s">YOLOv8s (Small • 11.2M Params • Balanced Speed)</option>
            <option value="YOLOv8n">YOLOv8n (Nano • 3.2M Params • Optimal for HF Free Tier)</option>
          </select>
        </div>

        {/* Slider 1: Confidence Threshold */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-[#131b2e]" htmlFor="conf-slider">
              Confidence Threshold
            </label>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#eaedff] text-[#004ac6] font-semibold">
              {confThreshold.toFixed(2)} {confThreshold === 0.25 ? '(Default)' : ''}
            </span>
          </div>
          <input
            id="conf-slider"
            type="range"
            min="0.05"
            max="0.95"
            step="0.05"
            value={confThreshold}
            onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#eaedff] rounded-lg appearance-none cursor-pointer accent-[#004ac6]"
          />
          <div className="flex justify-between font-mono text-[10px] text-[#434655]">
            <span>More detections (0.05)</span>
            <span>Stricter (0.95)</span>
          </div>
        </div>

        {/* Slider 2: IoU / NMS Suppression */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-[#131b2e]" htmlFor="iou-slider">
              IoU / NMS Suppression
            </label>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#eaedff] text-[#434655] font-semibold">
              {iouThreshold.toFixed(2)}
            </span>
          </div>
          <input
            id="iou-slider"
            type="range"
            min="0.10"
            max="0.90"
            step="0.05"
            value={iouThreshold}
            onChange={(e) => setIouThreshold(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#eaedff] rounded-lg appearance-none cursor-pointer accent-[#004ac6]"
          />
          <div className="flex justify-between font-mono text-[10px] text-[#434655]">
            <span>Aggressive merge</span>
            <span>Separate overlaps</span>
          </div>
        </div>

        {/* Canvas Overlays Toggles */}
        <div className="pt-2 flex flex-col gap-3 border-t border-[#eaedff]">
          <span className="font-mono text-[11px] text-[#434655] uppercase tracking-wider font-semibold">
            Canvas Overlays
          </span>

          {/* Toggle 1: Show Bounding Boxes */}
          <label className="flex items-center justify-between cursor-pointer select-none">
            <div className="flex items-center gap-2.5">
              <Crop className="w-4 h-4 text-[#434655]" />
              <span className="text-xs text-[#131b2e] font-medium">Show Bounding Boxes</span>
            </div>
            <input
              type="checkbox"
              checked={showBoxes}
              onChange={(e) => setShowBoxes(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-[#eaedff] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#004ac6] relative"></div>
          </label>

          {/* Toggle 2: Show Labels & Confidence */}
          <label className="flex items-center justify-between cursor-pointer select-none">
            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4 text-[#434655]" />
              <span className="text-xs text-[#131b2e] font-medium">Show Labels & Confidence</span>
            </div>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-[#eaedff] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#004ac6] relative"></div>
          </label>

          {/* Toggle 3: Class Color Coding */}
          <label className="flex items-center justify-between cursor-pointer select-none">
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-[#434655]" />
              <span className="text-xs text-[#131b2e] font-medium">Class Color Coding</span>
            </div>
            <input
              type="checkbox"
              checked={classColorCoding}
              onChange={(e) => setClassColorCoding(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-[#eaedff] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#004ac6] relative"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
