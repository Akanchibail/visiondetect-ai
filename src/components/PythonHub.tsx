import React, { useState } from 'react';
import { PYTHON_FILES } from '../data/pythonFiles';
import JSZip from 'jszip';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FolderTree, 
  Terminal, 
  ExternalLink, 
  Sparkles,
  Rocket,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const PythonHub: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<keyof typeof PYTHON_FILES>('app.py');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Copy current code file
  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_FILES[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate and download ready-to-deploy ZIP archive for Hugging Face Spaces
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all project files
      zip.file('app.py', PYTHON_FILES['app.py']);
      zip.file('requirements.txt', PYTHON_FILES['requirements.txt']);
      zip.file('README.md', PYTHON_FILES['README.md']);
      zip.file('test_pipeline.py', PYTHON_FILES['test_pipeline.py']);

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'visiondetect-ai-huggingface-space.zip';
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#004ac6] to-[#4b41e1] rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-mono font-medium backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Production Source Code & Deployment Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] tracking-tight">
            Python, Gradio & Hugging Face Spaces Project
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            All files for your portfolio project are generated and verified below.
            You can copy the code, inspect the architecture, or download a pre-packaged ZIP bundle ready to upload to Hugging Face Spaces.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-5 py-3 rounded-xl bg-white text-[#004ac6] hover:bg-blue-50 font-semibold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 shrink-0 cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Downloaded ZIP!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#004ac6]" />
              <span>{isZipping ? 'Generating ZIP...' : 'Download Hugging Face ZIP'}</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: File Structure & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Proposed File Structure (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-white rounded-xl p-5 border border-[#eaedff] shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#eaedff]">
              <FolderTree className="w-5 h-5 text-[#004ac6]" />
              <h2 className="font-semibold text-sm text-[#131b2e] font-['Plus_Jakarta_Sans']">
                Proposed File Structure
              </h2>
            </div>

            <div className="mt-4 font-mono text-xs text-[#131b2e] space-y-2 bg-[#f2f3ff] p-3 rounded-lg border border-[#eaedff]">
              <div className="font-bold text-[#004ac6]">visiondetect-ai/</div>
              <div className="pl-4 space-y-1.5">
                <div 
                  onClick={() => setSelectedFile('app.py')}
                  className={`cursor-pointer px-2 py-1 rounded transition-colors flex items-center justify-between ${
                    selectedFile === 'app.py' ? 'bg-[#dbe1ff] font-bold text-[#004ac6]' : 'hover:bg-[#eaedff]'
                  }`}
                >
                  <span>├── app.py</span>
                  <span className="text-[10px] text-[#434655]">Gradio + YOLOv8</span>
                </div>

                <div 
                  onClick={() => setSelectedFile('requirements.txt')}
                  className={`cursor-pointer px-2 py-1 rounded transition-colors flex items-center justify-between ${
                    selectedFile === 'requirements.txt' ? 'bg-[#dbe1ff] font-bold text-[#004ac6]' : 'hover:bg-[#eaedff]'
                  }`}
                >
                  <span>├── requirements.txt</span>
                  <span className="text-[10px] text-[#434655]">Dependencies</span>
                </div>

                <div 
                  onClick={() => setSelectedFile('README.md')}
                  className={`cursor-pointer px-2 py-1 rounded transition-colors flex items-center justify-between ${
                    selectedFile === 'README.md' ? 'bg-[#dbe1ff] font-bold text-[#004ac6]' : 'hover:bg-[#eaedff]'
                  }`}
                >
                  <span>├── README.md</span>
                  <span className="text-[10px] text-[#434655]">HF Spaces YAML</span>
                </div>

                <div 
                  onClick={() => setSelectedFile('test_pipeline.py')}
                  className={`cursor-pointer px-2 py-1 rounded transition-colors flex items-center justify-between ${
                    selectedFile === 'test_pipeline.py' ? 'bg-[#dbe1ff] font-bold text-[#004ac6]' : 'hover:bg-[#eaedff]'
                  }`}
                >
                  <span>└── test_pipeline.py</span>
                  <span className="text-[10px] text-[#434655]">Pre-flight Test</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-[#004ac6] space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Zero Hallucination Guarantee</span>
              </div>
              <p className="text-[11px] text-[#434655] leading-relaxed">
                The Python code never fakes predictions or timings. In both local and Space deployments, real Ultralytics forward-passes produce the bounding boxes, scores, and millisecond latencies.
              </p>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-xl p-5 border border-[#eaedff] shadow-xs space-y-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[#434655] font-mono">
              Deployment Specifications
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#eaedff]">
                <span className="text-[#434655]">Target Hosting</span>
                <span className="font-semibold text-[#131b2e]">Hugging Face Spaces</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#eaedff]">
                <span className="text-[#434655]">Hardware Tier</span>
                <span className="font-semibold text-emerald-700">Free Tier (2 vCPU, 16GB RAM)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#eaedff]">
                <span className="text-[#434655]">Default Model</span>
                <span className="font-mono font-semibold text-[#004ac6]">yolov8n.pt (Nano, 6.3MB)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#eaedff]">
                <span className="text-[#434655]">Python Version</span>
                <span className="font-mono font-semibold text-[#131b2e]">3.10 / 3.11</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#434655]">Gradio Version</span>
                <span className="font-mono font-semibold text-[#131b2e]">v4.44+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-[#131b2e] rounded-xl overflow-hidden shadow-lg border border-slate-700 flex flex-col">
          {/* Code Viewer Tabs & Copy */}
          <div className="bg-[#1e293b] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700">
            {/* Tabs */}
            <div className="flex items-center gap-1">
              {(Object.keys(PYTHON_FILES) as Array<keyof typeof PYTHON_FILES>).map((fileName) => {
                const isActive = selectedFile === fileName;
                return (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#2563eb] text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{fileName}</span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>

          {/* Code Body */}
          <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto">
            <pre className="text-xs font-mono text-slate-200 leading-relaxed">
              <code>{PYTHON_FILES[selectedFile]}</code>
            </pre>
          </div>

          {/* Footer note */}
          <div className="bg-[#1e293b]/70 px-4 py-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Encoding: UTF-8</span>
            <span>Lines: {PYTHON_FILES[selectedFile].split('\n').length}</span>
          </div>
        </div>
      </div>

      {/* Beginner Step-by-Step Milestones */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#004ac6]">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-[#131b2e] font-['Plus_Jakarta_Sans']">
              Step-by-Step Beginner Guide: Run & Deploy
            </h2>
            <p className="text-xs text-[#434655]">
              Follow these four structured steps to run locally on your machine and publish your live Hugging Face portfolio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h3 className="font-semibold text-sm text-[#131b2e]">Virtual Environment</h3>
              <p className="text-xs text-[#434655]">
                Create a clean isolated Python 3.10+ sandbox on your machine.
              </p>
            </div>
            <pre className="bg-[#131b2e] text-emerald-400 p-2.5 rounded-lg text-[11px] font-mono overflow-x-auto">
              <code>python3 -m venv venv{"\n"}source venv/bin/activate</code>
            </pre>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="font-semibold text-sm text-[#131b2e]">Install Packages</h3>
              <p className="text-xs text-[#434655]">
                Install Ultralytics YOLOv8, Gradio, Pillow, NumPy, and Pandas.
              </p>
            </div>
            <pre className="bg-[#131b2e] text-emerald-400 p-2.5 rounded-lg text-[11px] font-mono overflow-x-auto">
              <code>pip install -r requirements.txt</code>
            </pre>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h3 className="font-semibold text-sm text-[#131b2e]">Pre-flight Test</h3>
              <p className="text-xs text-[#434655]">
                Verify weight download, coordinates extraction, and speed test.
              </p>
            </div>
            <pre className="bg-[#131b2e] text-emerald-400 p-2.5 rounded-lg text-[11px] font-mono overflow-x-auto">
              <code>python test_pipeline.py</code>
            </pre>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h3 className="font-semibold text-sm text-[#131b2e]">Launch or Deploy</h3>
              <p className="text-xs text-[#434655]">
                Launch on http://localhost:7860 or push to Hugging Face Spaces!
              </p>
            </div>
            <pre className="bg-[#131b2e] text-emerald-400 p-2.5 rounded-lg text-[11px] font-mono overflow-x-auto">
              <code>python app.py</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
