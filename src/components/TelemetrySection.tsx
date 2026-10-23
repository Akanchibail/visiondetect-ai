import React from 'react';
import { BoundingBox, getClassColor } from '../data/detectionData';

interface TelemetrySectionProps {
  detections: BoundingBox[];
  totalAvailableDetections: number;
  confThreshold: number;
  inferenceTime: number;
  device: string;
}

export const TelemetrySection: React.FC<TelemetrySectionProps> = ({
  detections,
  totalAvailableDetections,
  confThreshold,
  inferenceTime,
  device
}) => {
  // Aggregate unique classes and counts
  const classCounts = detections.reduce<Record<string, number>>((acc, d) => {
    acc[d.label] = (acc[d.label] || 0) + 1;
    return acc;
  }, {});

  const uniqueClassesCount = Object.keys(classCounts).length;
  const filteredCount = detections.length;
  const lowConfCount = Math.max(0, totalAvailableDetections - filteredCount);

  // Mean confidence calculation
  const meanConf = filteredCount > 0
    ? (detections.reduce((sum, d) => sum + d.confidence, 0) / filteredCount) * 100
    : 0;

  // Sorted list of classes by frequency
  const sortedClasses = Object.entries(classCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white rounded-xl p-5 shadow-xs border border-[#eaedff] flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6] text-[20px] font-bold">
            analytics
          </span>
          <span className="font-semibold text-[16px] text-[#131b2e] font-['Plus_Jakarta_Sans']">
            Inference Telemetry
          </span>
        </div>
        <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#89f5e7]/30 text-[#006058] font-bold border border-[#89f5e7]">
          Real-time Batch #1
        </span>
      </div>

      {/* 4 Stat Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Detected */}
        <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase text-[#434655] tracking-wider font-medium">
            Detected
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-[#131b2e] font-['Plus_Jakarta_Sans']">
              {filteredCount}
            </span>
            {lowConfCount > 0 && (
              <span className="font-mono text-[11px] text-[#007b71] font-semibold">
                +{lowConfCount} filtered
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#434655]">
            Boxes over {confThreshold.toFixed(2)}
          </span>
        </div>

        {/* Metric 2: Unique Classes */}
        <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase text-[#434655] tracking-wider font-medium">
            Unique Classes
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-[#131b2e] font-['Plus_Jakarta_Sans']">
              {uniqueClassesCount}
            </span>
            <span className="font-mono text-[11px] text-[#434655]">of 80</span>
          </div>
          <span className="text-[11px] text-[#434655]">Active categories</span>
        </div>

        {/* Metric 3: Inference Latency */}
        <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase text-[#434655] tracking-wider font-medium">
            Inference
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-[#131b2e] font-['Plus_Jakarta_Sans']">
              {inferenceTime.toFixed(1)}
            </span>
            <span className="font-mono text-[11px] text-[#434655]">ms</span>
          </div>
          <span className="text-[11px] text-[#006058] font-medium truncate">
            {device.includes('CUDA') ? 'GPU TensorRT' : 'Neural Core'}
          </span>
        </div>

        {/* Metric 4: Mean Confidence */}
        <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase text-[#434655] tracking-wider font-medium">
            Mean Conf
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-[#131b2e] font-['Plus_Jakarta_Sans']">
              {meanConf.toFixed(1)}
            </span>
            <span className="font-mono text-[11px] text-[#004ac6] font-bold">%</span>
          </div>
          <span className="text-[11px] text-[#434655]">
            {meanConf >= 80 ? 'High precision' : 'Moderate precision'}
          </span>
        </div>
      </div>

      {/* Class Distribution Breakdown Chips */}
      <div className="space-y-2">
        <span className="font-mono text-[11px] uppercase text-[#434655] tracking-wider block font-semibold">
          Class Breakdown ({uniqueClassesCount} categories detected)
        </span>
        {sortedClasses.length === 0 ? (
          <p className="text-xs text-[#737686] italic">
            No objects detected above threshold. Lower the slider to reveal objects.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sortedClasses.map(([clsName, count]) => {
              const dotColor = getClassColor(clsName);
              return (
                <div
                  key={clsName}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] border border-[#eaedff] font-mono text-xs text-[#131b2e] shadow-2xs hover:bg-[#eaedff] transition-colors"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className="font-medium capitalize">{clsName}:</span>
                  <span className="font-bold text-[#004ac6]">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
