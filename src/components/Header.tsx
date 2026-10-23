import React from 'react';
import { Cpu, BookOpen, Github, Code, Sparkles, User } from 'lucide-react';

interface HeaderProps {
  activeTab: 'detector' | 'python-hub' | 'model-info' | 'guide';
  setActiveTab: (tab: 'detector' | 'python-hub' | 'model-info' | 'guide') => void;
  onOpenZipDownload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff] border-b border-[#c3c6d7]/50 shadow-xs">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand & Tabs */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div 
            onClick={() => setActiveTab('detector')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#004ac6] to-[#2563eb] flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px] font-bold">radar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[18px] text-[#131b2e] tracking-tight font-['Plus_Jakarta_Sans']">
                VisionDetect AI
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#eaedff] text-[11px] font-mono text-[#004ac6] font-semibold">
                v2.4
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('detector')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'detector'
                  ? 'bg-[#2563eb] text-white shadow-sm font-semibold'
                  : 'text-[#434655] hover:text-[#131b2e] hover:bg-[#eaedff]/60'
              }`}
            >
              Detector
            </button>
            <button
              onClick={() => setActiveTab('python-hub')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'python-hub'
                  ? 'bg-[#2563eb] text-white shadow-sm font-semibold'
                  : 'text-[#434655] hover:text-[#131b2e] hover:bg-[#eaedff]/60'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Python & HF Spaces</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-mono font-semibold">
                Code
              </span>
            </button>
            <button
              onClick={() => setActiveTab('model-info')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'model-info'
                  ? 'bg-[#2563eb] text-white shadow-sm font-semibold'
                  : 'text-[#434655] hover:text-[#131b2e] hover:bg-[#eaedff]/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Model Specs</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-[#2563eb] text-white shadow-sm font-semibold'
                  : 'text-[#434655] hover:text-[#131b2e] hover:bg-[#eaedff]/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Beginner Guide</span>
            </button>
          </nav>
        </div>

        {/* Right Status & Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f3ff] border border-[#c3c6d7]/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007b71]"></span>
            </span>
            <span className="font-mono text-[11px] text-[#434655] font-medium">
              Model Ready (YOLOv8x / GPU CUDA:0)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('guide')}
              className="hidden sm:flex items-center gap-1 text-xs text-[#434655] hover:text-[#004ac6] font-medium transition-colors px-2 py-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Workflow</span>
            </button>
            <button
              onClick={() => setActiveTab('python-hub')}
              className="text-xs text-[#434655] hover:text-[#004ac6] font-medium transition-colors px-2 py-1 flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Spaces Repo</span>
            </button>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#004ac6] flex items-center justify-center text-white shadow-xs">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
