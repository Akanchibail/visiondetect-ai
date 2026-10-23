import React, { useState } from 'react';
import { YOLO_MODELS, COCO_CLASSES, getClassColor } from '../data/detectionData';
import { Cpu, Search, CheckCircle, Zap, Shield, HelpCircle } from 'lucide-react';

export const ModelInfo: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = COCO_CLASSES.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaedff] text-xs font-mono font-medium text-[#004ac6]">
          <Cpu className="w-3.5 h-3.5" />
          <span>Ultralytics YOLOv8 Architecture Specifications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] font-['Plus_Jakarta_Sans'] tracking-tight">
          Pretrained Model Variants & Computational Requirements
        </h1>
        <p className="text-sm text-[#434655] max-w-3xl leading-relaxed">
          YOLOv8 (You Only Look Once version 8) is an anchor-free, single-stage object detector developed by Ultralytics.
          It uses a modified CSPDarknet53 backbone with C2f modules, Path Aggregation Network (PANet) neck, and decoupled head for classification and box regression.
        </p>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="bg-white rounded-xl p-6 border border-[#eaedff] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-lg text-[#131b2e] font-['Plus_Jakarta_Sans']">
              YOLOv8 Architecture Benchmark
            </h2>
            <p className="text-xs text-[#434655]">
              Empirical metrics measured at 640×640 image input resolution on MS COCO val2017 dataset.
            </p>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
            Recommended: YOLOv8n for HF Spaces Free Tier
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#eaedff]">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="bg-[#f2f3ff] text-[#434655] font-mono text-[11px] uppercase tracking-wider border-b border-[#eaedff]">
                <th className="py-3 px-4">Variant</th>
                <th className="py-3 px-4">Parameters</th>
                <th className="py-3 px-4">FLOPs</th>
                <th className="py-3 px-4">CPU Speed (HF Free 2 vCPU)</th>
                <th className="py-3 px-4">GPU Speed (T4 CUDA)</th>
                <th className="py-3 px-4">mAP 50-95</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Target Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff]">
              {YOLO_MODELS.map((m, idx) => (
                <tr 
                  key={m.name}
                  className={`hover:bg-[#f2f3ff]/60 transition-colors ${
                    idx === 0 ? 'bg-blue-50/50 font-medium' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-semibold text-[#131b2e] flex items-center gap-2">
                    {idx === 0 && <span className="w-2 h-2 rounded-full bg-[#004ac6]"></span>}
                    <span>{m.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#434655]">{m.params}</td>
                  <td className="py-3 px-4 font-mono text-[#434655]">{m.flops}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#007b71]">{m.cpuSpeed}</td>
                  <td className="py-3 px-4 font-mono text-[#004ac6]">{m.gpuSpeed}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#131b2e]">{m.mAP}</td>
                  <td className="py-3 px-4 font-mono text-[#434655]">{m.memory}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      idx === 0 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-[#eaedff] text-[#434655]'
                    }`}>
                      {m.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Why Nano for Hugging Face Spaces Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 border border-[#eaedff] shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-[#131b2e]">Sub-40ms on Standard CPU</h3>
          <p className="text-xs text-[#434655] leading-relaxed">
            Hugging Face Spaces free tier gives 2 vCPUs without dedicated GPU acceleration. YOLOv8n is uniquely optimized with lightweight C2f blocks to deliver 25-45ms latencies without lagging.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#eaedff] shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-[#131b2e]">6.3 MB Weight Footprint</h3>
          <p className="text-xs text-[#434655] leading-relaxed">
            Ultralytics automatically downloads pretrained checkpoint weights on first execution. A 6.3MB footprint downloads in under 1 second, ensuring your Hugging Face Space boots instantaneously.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#eaedff] shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-[#131b2e]">Zero Memory Thrashing</h3>
          <p className="text-xs text-[#434655] leading-relaxed">
            Larger models like YOLOv8x consume upwards of 4GB VRAM and over 1GB system RAM per batch inference. YOLOv8n consumes less than 300MB RAM, leaving the remaining 15.7GB RAM free.
          </p>
        </div>
      </div>

      {/* COCO 80-Class Interactive Explorer */}
      <div className="bg-white rounded-xl p-6 border border-[#eaedff] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg text-[#131b2e] font-['Plus_Jakarta_Sans']">
              MS COCO 80 Detection Categories
            </h2>
            <p className="text-xs text-[#434655]">
              VisionDetect AI identifies these 80 everyday object classes natively without any custom fine-tuning.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#737686]" />
            <input
              type="text"
              placeholder="Search classes (e.g. dog, car)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#f2f3ff] border border-[#c3c6d7] text-xs text-[#131b2e] focus:outline-hidden focus:border-[#004ac6]"
            />
          </div>
        </div>

        {/* Classes Badges Grid */}
        <div className="flex flex-wrap gap-2 pt-2">
          {filteredClasses.length === 0 ? (
            <p className="text-xs text-[#737686] italic py-4">No matching classes found.</p>
          ) : (
            filteredClasses.map((clsName) => {
              const dotColor = getClassColor(clsName);
              return (
                <div
                  key={clsName}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f3ff] border border-[#eaedff] text-xs font-mono text-[#131b2e] hover:bg-[#eaedff] transition-colors"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className="capitalize">{clsName}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
