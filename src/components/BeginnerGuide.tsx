import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Check, 
  Copy, 
  ExternalLink, 
  FolderPlus, 
  PlayCircle, 
  CloudUpload, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export const BeginnerGuide: React.FC = () => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaedff] text-xs font-mono font-medium text-[#004ac6]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Complete Beginner Walkthrough</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] font-['Plus_Jakarta_Sans'] tracking-tight">
          How to Build, Test, and Deploy VisionDetect AI
        </h1>
        <p className="text-sm text-[#434655] max-w-3xl leading-relaxed">
          Welcome to Computer Vision! If you are new to Python or Gradio, don't worry.
          Follow this structured roadmap step by step. We cover local environment setup, running the test pipeline, starting the Gradio UI, and deploying for free to Hugging Face Spaces.
        </p>
      </div>

      {/* Crucial Environment Clarification Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs text-amber-900 leading-relaxed">
          <div className="font-bold text-sm">
            Important Note on Web Preview vs. Python Backend
          </div>
          <p>
            The web preview you are viewing here inside Google AI Studio runs on Node/React to provide an instant interactive visualization of your Google Stitch UI design.
          </p>
          <p>
            To run the genuine <strong>Python + Ultralytics YOLOv8 + Gradio</strong> application, you will execute the Python scripts provided in the <strong>Python & HF Spaces</strong> tab on your own computer or on <strong>Hugging Face Spaces</strong>. Both environments run the exact same logic and model!
          </p>
        </div>
      </div>

      {/* Step 1: Project Setup & Virtual Environment */}
      <div className="bg-white rounded-xl p-6 border border-[#eaedff] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="font-bold text-base text-[#131b2e] font-['Plus_Jakarta_Sans']">
              Step 1: Set Up Your Project Folder & Virtual Environment
            </h2>
            <p className="text-xs text-[#434655]">
              A virtual environment prevents library version conflicts with other Python projects on your machine.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-xs text-[#131b2e] font-medium">Open your Terminal (macOS/Linux) or Command Prompt / PowerShell (Windows) and run:</p>
          
          <div className="relative bg-[#131b2e] rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
            <button
              onClick={() => copyToClipboard(`mkdir visiondetect-ai\ncd visiondetect-ai\npython3 -m venv venv\nsource venv/bin/activate`, 'step1')}
              className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedSnippet === 'step1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSnippet === 'step1' ? 'Copied' : 'Copy'}</span>
            </button>
            <pre>
{`# 1. Create a project directory and enter it
mkdir visiondetect-ai
cd visiondetect-ai

# 2. Create a clean Python virtual environment
python3 -m venv venv

# 3. Activate the virtual environment
# On macOS / Linux:
source venv/bin/activate

# On Windows (PowerShell):
.\\venv\\Scripts\\Activate.ps1`}
            </pre>
          </div>
        </div>
      </div>

      {/* Step 2: Install Required Dependencies */}
      <div className="bg-white rounded-xl p-6 border border-[#eaedff] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="font-bold text-base text-[#131b2e] font-['Plus_Jakarta_Sans']">
              Step 2: Place Code Files and Install Dependencies
            </h2>
            <p className="text-xs text-[#434655]">
              Download the ZIP archive from the <strong>Python & HF Spaces</strong> tab, extract it into your folder, then install packages.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-xs text-[#131b2e] font-medium">Inside your activated virtual environment, run:</p>
          <div className="relative bg-[#131b2e] rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
            <button
              onClick={() => copyToClipboard(`pip install --upgrade pip\npip install -r requirements.txt`, 'step2')}
              className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedSnippet === 'step2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSnippet === 'step2' ? 'Copied' : 'Copy'}</span>
            </button>
            <pre>
{`# Upgrade pip to ensure smooth wheel builds
pip install --upgrade pip

# Install Ultralytics YOLOv8, Gradio, Pillow, NumPy, and Pandas
pip install -r requirements.txt`}
            </pre>
          </div>
          <p className="text-[11px] text-[#434655] italic">
            This installs PyTorch, the Ultralytics computer vision engine, OpenCV, and the Gradio web server.
          </p>
        </div>
      </div>

      {/* Step 3: Run Standalone Test Pipeline */}
      <div className="bg-white rounded-xl p-6 border border-[#eaedff] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="font-bold text-base text-[#131b2e] font-['Plus_Jakarta_Sans']">
              Step 3: Run Pre-Flight Pipeline Test (Crucial Step!)
            </h2>
            <p className="text-xs text-[#434655]">
              Never skip verification. Running <code>test_pipeline.py</code> checks that model weights download properly and predictions produce real coordinates.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="relative bg-[#131b2e] rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
            <button
              onClick={() => copyToClipboard(`python test_pipeline.py`, 'step3')}
              className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedSnippet === 'step3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSnippet === 'step3' ? 'Copied' : 'Copy'}</span>
            </button>
            <pre>
{`python test_pipeline.py`}
            </pre>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="font-semibold flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Expected Output:</span>
            </div>
            <pre className="text-[11px] font-mono text-emerald-800">
{`[Step 1/5] Checking essential dependencies... [+] PASSED
[Step 2/5] Loading YOLOv8 model weights (yolov8n.pt)... [+] Loaded in 38.2 ms
[Step 3/5] Generating synthetic test canvas... [+] PASSED
[Step 4/5] Running forward-pass inference... [+] 28.4 ms
[Step 5/5] Testing visual plotting & coordinates... [+] PASSED
🎉 ALL PRE-FLIGHT TESTS PASSED! Ready to launch: python app.py`}
            </pre>
          </div>
        </div>
      </div>

      {/* Step 4: Launch Gradio App Locally */}
      <div className="bg-white rounded-xl p-6 border border-[#eaedff] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-sm">
            4
          </div>
          <div>
            <h2 className="font-bold text-base text-[#131b2e] font-['Plus_Jakarta_Sans']">
              Step 4: Launch the Local Gradio Web Application
            </h2>
            <p className="text-xs text-[#434655]">
              Run the main app file. Gradio will start a local web server with full hot-reloading.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="relative bg-[#131b2e] rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
            <button
              onClick={() => copyToClipboard(`python app.py`, 'step4')}
              className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedSnippet === 'step4' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSnippet === 'step4' ? 'Copied' : 'Copy'}</span>
            </button>
            <pre>
{`python app.py`}
            </pre>
          </div>
          <p className="text-xs text-[#131b2e]">
            Now navigate to <code className="bg-[#eaedff] px-2 py-0.5 rounded font-mono text-[#004ac6]">http://127.0.0.1:7860</code> in Google Chrome or any browser.
          </p>
        </div>
      </div>

      {/* Step 5: Free Deployment to Hugging Face Spaces */}
      <div className="bg-white rounded-xl p-6 border border-[#eaedff] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#4b41e1] text-white flex items-center justify-center font-bold text-sm">
            5
          </div>
          <div>
            <h2 className="font-bold text-base text-[#131b2e] font-['Plus_Jakarta_Sans']">
              Step 5: Deploy Free to Hugging Face Spaces (Portfolio Presentation)
            </h2>
            <p className="text-xs text-[#434655]">
              Publish your project publicly to share with recruiters and on LinkedIn / GitHub.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2 text-xs text-[#131b2e] leading-relaxed">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Go to <a href="https://huggingface.co/spaces" target="_blank" rel="noreferrer" className="text-[#004ac6] font-semibold underline inline-flex items-center gap-0.5">huggingface.co/spaces <ExternalLink className="w-3 h-3" /></a> and sign in (or create a free account).
            </li>
            <li>
              Click the <strong>Create new Space</strong> button.
            </li>
            <li>
              Set Space Name: <code className="bg-[#eaedff] px-1.5 py-0.5 rounded font-mono">visiondetect-ai</code>.
            </li>
            <li>
              Select Space SDK: <strong>Gradio</strong>.
            </li>
            <li>
              Select Space hardware: <strong>CPU basic • 2 vCPU • 16 GB • Free</strong>.
            </li>
            <li>
              Click <strong>Create Space</strong>.
            </li>
            <li>
              Go to the <strong>Files</strong> tab inside your Space, click <strong>Add file → Upload files</strong>, and upload:
              <ul className="list-disc pl-5 mt-1 font-mono text-[#004ac6]">
                <li>app.py</li>
                <li>requirements.txt</li>
                <li>README.md</li>
              </ul>
            </li>
            <li>
              Hugging Face will instantly trigger an automated container build, download dependencies, and present your live app within ~90 seconds!
            </li>
          </ol>

          <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-[#131b2e]">Download the pre-made ZIP to upload:</div>
              <div className="text-xs text-[#434655]">Contains all 3 required files plus tests ready for drag-and-drop.</div>
            </div>
            <a
              href="#python-hub"
              className="px-4 py-2 rounded-lg bg-[#004ac6] text-white font-semibold text-xs hover:bg-[#2563eb] transition-colors"
            >
              Get ZIP in Python Hub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
