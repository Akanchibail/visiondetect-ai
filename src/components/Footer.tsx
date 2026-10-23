import React from 'react';

interface FooterProps {
  onSelectTab: (tab: 'detector' | 'python-hub' | 'model-info' | 'guide') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full bg-white border-t border-[#eaedff] py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <p className="text-xs sm:text-sm font-semibold text-[#131b2e]">
            Powered by Ultralytics YOLO and Gradio.
          </p>
          <p className="font-mono text-[11px] text-[#434655]">
            Predictions depend on image quality, resolution, and threshold settings. Deployable to Hugging Face Spaces.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs text-[#434655]">
          <button
            onClick={() => onSelectTab('python-hub')}
            className="hover:text-[#004ac6] transition-colors cursor-pointer"
          >
            Spaces Repository
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className="hover:text-[#004ac6] transition-colors cursor-pointer"
          >
            Documentation & Workflow
          </button>
          <button
            onClick={() => onSelectTab('model-info')}
            className="hover:text-[#004ac6] transition-colors cursor-pointer"
          >
            Model Architecture
          </button>
          <a
            href="https://docs.ultralytics.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#004ac6] transition-colors cursor-pointer"
          >
            Ultralytics Docs ↗
          </a>
        </nav>
      </div>
    </footer>
  );
};
