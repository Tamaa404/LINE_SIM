import React from 'react';
import { X, Code2, Copy, Check } from 'lucide-react';

export function CodeModal({ isOpen, onClose, code }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="h-12 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100">Generated Async JavaScript</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-300 rounded-lg border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content Viewport */}
        <div className="p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-cyan-300 leading-relaxed">
          <pre className="whitespace-pre-wrap select-text">
            {code || '// Add blocks in workspace to generate code...'}
          </pre>
        </div>

        {/* Footer */}
        <div className="h-10 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900">
          <span>Non-blocking async execution engine with auto-yield sleep ticks</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
