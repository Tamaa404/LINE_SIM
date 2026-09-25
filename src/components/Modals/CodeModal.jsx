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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#6C1A1A]/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-palette-cream-light dark:bg-slate-900 border-2 border-palette-maroon dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors duration-300">
        {/* Modal Header */}
        <div className="h-12 border-b-2 border-palette-cream-border dark:border-slate-800 px-4 flex items-center justify-between bg-palette-cream dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-palette-teal dark:text-sky-400" />
            <h2 className="text-sm font-black text-palette-maroon dark:text-slate-100">Generated Async JavaScript</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-palette-teal hover:bg-palette-teal-dark dark:bg-sky-500 dark:hover:bg-sky-600 text-xs font-bold text-white rounded-lg transition shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-palette-maroon/70 dark:text-slate-400 hover:text-palette-maroon dark:hover:text-slate-100 hover:bg-palette-cream-dark dark:hover:bg-slate-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content Viewport */}
        <div className="p-4 overflow-y-auto bg-palette-cream-paper dark:bg-slate-950 font-mono text-xs text-palette-maroon dark:text-sky-300 leading-relaxed border-b border-palette-cream-border dark:border-slate-800 font-semibold">
          <pre className="whitespace-pre-wrap select-text">
            {code || '// Add blocks in workspace to generate code...'}
          </pre>
        </div>

        {/* Footer */}
        <div className="h-10 border-t border-palette-cream-border dark:border-slate-800 px-4 flex items-center justify-between text-[11px] text-palette-maroon/70 dark:text-slate-400 bg-palette-cream dark:bg-slate-800 font-medium">
          <span>Non-blocking async execution engine with auto-yield sleep ticks</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-palette-cream-light hover:bg-palette-cream-dark dark:bg-slate-700 dark:hover:bg-slate-600 text-palette-maroon dark:text-slate-200 font-bold rounded text-xs transition border border-palette-cream-border dark:border-slate-600 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
