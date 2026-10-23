import React, { useState, useRef } from 'react';
import { BoundingBox } from '../data/detectionData';
import { Download, Copy, Check, ZoomIn, ZoomOut, Eye, Layers } from 'lucide-react';

interface DetectionViewportProps {
  imageUrl: string;
  imageDimensions: { width: number; height: number };
  detections: BoundingBox[];
  totalPredictionsCount: number;
  modelName: string;
  device: string;
  showBoxes: boolean;
  showLabels: boolean;
  classColorCoding: boolean;
  hoveredBoxId: string | null;
  setHoveredBoxId: (id: string | null) => void;
  selectedBoxId: string | null;
  setSelectedBoxId: (id: string | null) => void;
}

export const DetectionViewport: React.FC<DetectionViewportProps> = ({
  imageUrl,
  imageDimensions,
  detections,
  totalPredictionsCount,
  modelName,
  device,
  showBoxes,
  showLabels,
  classColorCoding,
  hoveredBoxId,
  setHoveredBoxId,
  selectedBoxId,
  setSelectedBoxId
}) => {
  const [viewMode, setViewMode] = useState<'annotated' | 'original'>('annotated');
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Copy detections as JSON
  const handleCopyJson = () => {
    const jsonOutput = {
      image: {
        width: imageDimensions.width,
        height: imageDimensions.height,
      },
      model: modelName,
      total_predictions: detections.length,
      detections: detections.map(d => ({
        id: d.id,
        label: d.label,
        confidence: Number((d.confidence * 100).toFixed(1)),
        bounding_box: {
          x1: d.pixelBox[0],
          y1: d.pixelBox[1],
          x2: d.pixelBox[2],
          y2: d.pixelBox[3],
        },
        area_px2: d.area
      }))
    };

    navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Download annotated image via HTML5 Canvas
  const handleDownloadOverlay = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = imageDimensions.width;
    canvas.height = imageDimensions.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load original image to canvas
    const drawImg = new Image();
    drawImg.crossOrigin = 'anonymous';
    drawImg.src = imageUrl;
    drawImg.onload = () => {
      ctx.drawImage(drawImg, 0, 0, canvas.width, canvas.height);

      if (viewMode === 'annotated') {
        detections.forEach(det => {
          const [x1, y1, x2, y2] = det.pixelBox;
          const boxWidth = x2 - x1;
          const boxHeight = y2 - y1;
          const boxColor = classColorCoding ? det.color : '#2563EB';

          if (showBoxes) {
            // Box fill
            ctx.fillStyle = `${boxColor}22`;
            ctx.fillRect(x1, y1, boxWidth, boxHeight);
            // Box stroke
            ctx.strokeStyle = boxColor;
            ctx.lineWidth = 3;
            ctx.strokeRect(x1, y1, boxWidth, boxHeight);
          }

          if (showLabels) {
            const labelText = `${det.label} ${(det.confidence * 100).toFixed(0)}%`;
            ctx.font = 'bold 16px "JetBrains Mono", sans-serif';
            const textWidth = ctx.measureText(labelText).width;
            
            // Background label tag
            ctx.fillStyle = boxColor;
            ctx.fillRect(x1, Math.max(0, y1 - 24), textWidth + 12, 24);

            // Label text
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(labelText, x1 + 6, Math.max(16, y1 - 6));
          }
        });
      }

      // Trigger download
      const link = document.createElement('a');
      link.download = `visiondetect-${modelName}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-xs border border-[#eaedff] flex flex-col gap-4">
      {/* Viewport Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6] text-[20px] font-bold">
            view_in_ar
          </span>
          <span className="font-semibold text-[16px] text-[#131b2e] font-['Plus_Jakarta_Sans']">
            Detection Viewport
          </span>
          <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-[#dbe1ff] text-[#00174b] font-semibold">
            {detections.length} Predictions
          </span>
        </div>

        {/* View Switcher (Annotated Result vs Original Image) */}
        <div className="inline-flex p-1 rounded-lg bg-[#eaedff] font-mono text-xs">
          <button
            onClick={() => setViewMode('annotated')}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'annotated'
                ? 'bg-white text-[#004ac6] font-semibold shadow-xs'
                : 'text-[#434655] hover:text-[#131b2e]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Annotated Result</span>
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'original'
                ? 'bg-white text-[#004ac6] font-semibold shadow-xs'
                : 'text-[#434655] hover:text-[#131b2e]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Original Image</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas Wrapper with SVG / CSS Bounding Box Overlays */}
      <div 
        className={`relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#1e293b] shadow-inner group select-none flex items-center justify-center transition-all ${
          isZoomed ? 'scale-105 z-10 cursor-zoom-out' : 'cursor-default'
        }`}
        onClick={() => isZoomed && setIsZoomed(false)}
      >
        {/* Source Image */}
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Detection viewport"
          className="w-full h-full object-cover transition-opacity duration-200"
          crossOrigin="anonymous"
        />

        {/* Interactive Bounding Boxes Layer */}
        {viewMode === 'annotated' && (
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-200">
            {detections.map(box => {
              const isHovered = hoveredBoxId === box.id;
              const isSelected = selectedBoxId === box.id;
              const boxColor = classColorCoding ? box.color : '#2563EB';

              return (
                <div
                  key={box.id}
                  onMouseEnter={() => setHoveredBoxId(box.id)}
                  onMouseLeave={() => setHoveredBoxId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBoxId(selectedBoxId === box.id ? null : box.id);
                  }}
                  className={`absolute pointer-events-auto cursor-pointer transition-all duration-150 ${
                    isHovered || isSelected ? 'z-20 scale-[1.01]' : 'z-10'
                  }`}
                  style={{
                    left: `${box.pctBox.left}%`,
                    top: `${box.pctBox.top}%`,
                    width: `${box.pctBox.width}%`,
                    height: `${box.pctBox.height}%`,
                  }}
                >
                  {/* Bounding Box Border */}
                  {showBoxes && (
                    <div
                      className={`w-full h-full rounded-[2px] relative transition-colors ${
                        isHovered || isSelected
                          ? 'border-[3px] shadow-lg'
                          : 'border-2'
                      }`}
                      style={{
                        borderColor: boxColor,
                        backgroundColor: `${boxColor}${isHovered || isSelected ? '33' : '15'}`,
                        boxShadow: isHovered || isSelected ? `0 0 12px ${boxColor}66` : 'none'
                      }}
                    >
                      {/* Technical Corner Reticles */}
                      <span
                        className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2"
                        style={{ borderColor: boxColor }}
                      />
                      <span
                        className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2"
                        style={{ borderColor: boxColor }}
                      />
                      <span
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2"
                        style={{ borderColor: boxColor }}
                      />
                      <span
                        className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2"
                        style={{ borderColor: boxColor }}
                      />

                      {/* Pill Label & Confidence Tag */}
                      {showLabels && (
                        <div
                          className="box-label absolute -top-5 left-0 px-1.5 py-0.5 rounded-t font-mono text-[10px] text-white flex items-center gap-1 leading-tight tracking-tight shadow-sm whitespace-nowrap"
                          style={{ backgroundColor: boxColor }}
                        >
                          <span className="font-semibold">{box.label}</span>
                          <span className="opacity-95 font-mono">
                            {(box.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Viewport Bottom HUD Bar */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3.5 py-1.5 rounded-lg bg-[#131b2e]/90 backdrop-blur-md text-white flex items-center justify-between font-mono text-[11px] pointer-events-auto border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {imageDimensions.width} × {imageDimensions.height} px
            </span>
            <span className="opacity-40">|</span>
            <span className="text-slate-300 font-medium">{modelName} FP16</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="hover:text-blue-300 transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/10"
              title="Toggle preview zoom"
            >
              {isZoomed ? (
                <>
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>Fit View</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>100%</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Utility Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadOverlay}
            className="px-3 py-1.5 rounded-lg bg-[#eaedff] hover:bg-[#dbe1ff] text-[#131b2e] font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            type="button"
          >
            <Download className="w-3.5 h-3.5 text-[#004ac6]" />
            <span>Download Overlay</span>
          </button>
          <button
            onClick={handleCopyJson}
            className="px-3 py-1.5 rounded-lg bg-[#eaedff] hover:bg-[#dbe1ff] text-[#131b2e] font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            type="button"
          >
            {copiedJson ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#004ac6]" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>

        <span className="font-mono text-[11px] text-[#434655] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Device: {device}</span>
        </span>
      </div>
    </div>
  );
};
