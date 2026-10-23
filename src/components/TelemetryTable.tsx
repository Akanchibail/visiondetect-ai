import React, { useState } from 'react';
import { BoundingBox, getClassColor } from '../data/detectionData';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface TelemetryTableProps {
  detections: BoundingBox[];
  confThreshold: number;
  hoveredBoxId: string | null;
  setHoveredBoxId: (id: string | null) => void;
  selectedBoxId: string | null;
  setSelectedBoxId: (id: string | null) => void;
}

export const TelemetryTable: React.FC<TelemetryTableProps> = ({
  detections,
  confThreshold,
  hoveredBoxId,
  setHoveredBoxId,
  selectedBoxId,
  setSelectedBoxId
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayLimit = showAll ? detections.length : 7;
  const displayedDetections = detections.slice(0, displayLimit);

  return (
    <div className="bg-white rounded-xl p-5 shadow-xs border border-[#eaedff] flex flex-col gap-4">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6] text-[20px] font-bold">
            table_rows
          </span>
          <span className="font-semibold text-[16px] text-[#131b2e] font-['Plus_Jakarta_Sans']">
            Object Detection Telemetry
          </span>
        </div>
        <span className="font-mono text-xs text-[#434655]">
          Top {Math.min(displayLimit, detections.length)} of {detections.length}
        </span>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto rounded-lg border border-[#eaedff]">
        <table className="w-full text-left font-sans text-xs">
          <thead>
            <tr className="bg-[#f2f3ff] text-[#434655] font-mono text-[11px] uppercase tracking-wider border-b border-[#eaedff]">
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Class</th>
              <th className="py-2.5 px-3 min-w-[130px]">Confidence</th>
              <th className="py-2.5 px-3">Bounding Box [x1, y1, x2, y2]</th>
              <th className="py-2.5 px-3 text-right">Area (px²)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedff]/60">
            {displayedDetections.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#737686] italic">
                  No objects match the current confidence threshold ({confThreshold.toFixed(2)}).
                </td>
              </tr>
            ) : (
              displayedDetections.map((box, index) => {
                const isHovered = hoveredBoxId === box.id;
                const isSelected = selectedBoxId === box.id;
                const rowDotColor = getClassColor(box.label);
                const confPercent = (box.confidence * 100).toFixed(1);

                return (
                  <tr
                    key={box.id}
                    onMouseEnter={() => setHoveredBoxId(box.id)}
                    onMouseLeave={() => setHoveredBoxId(null)}
                    onClick={() => setSelectedBoxId(selectedBoxId === box.id ? null : box.id)}
                    className={`cursor-pointer transition-colors ${
                      isHovered || isSelected
                        ? 'bg-[#dbe1ff]/50 font-medium'
                        : 'hover:bg-[#f2f3ff]/60'
                    }`}
                  >
                    {/* Index */}
                    <td className="py-2.5 px-3 font-mono text-[#737686]">
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    {/* Class */}
                    <td className="py-2.5 px-3 font-medium text-[#131b2e]">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: rowDotColor }}
                        />
                        <span className="capitalize">{box.label}</span>
                      </div>
                    </td>

                    {/* Confidence Progress */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#eaedff] rounded-full overflow-hidden shrink-0">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${confPercent}%`,
                              backgroundColor: rowDotColor,
                            }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#131b2e]">
                          {confPercent}%
                        </span>
                      </div>
                    </td>

                    {/* Coordinates */}
                    <td className="py-2.5 px-3 font-mono text-[#434655] text-[11px]">
                      [{box.pixelBox.join(', ')}]
                    </td>

                    {/* Area */}
                    <td className="py-2.5 px-3 font-mono text-[#131b2e] text-[11px] text-right">
                      {box.area.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Actions */}
      {detections.length > 7 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[#434655]">
            Showing {Math.min(displayLimit, detections.length)} of {detections.length} detections above {confThreshold.toFixed(2)} conf
          </span>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold text-[#004ac6] hover:text-[#2563eb] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{showAll ? 'Show top 7 records' : `View all ${detections.length} records`}</span>
            {showAll ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
};
