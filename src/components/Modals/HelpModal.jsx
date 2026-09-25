import React from 'react';
import { X, HelpCircle, Radio, Compass, Cpu, Sparkles } from 'lucide-react';

export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#6C1A1A]/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-palette-cream-light dark:bg-slate-900 border-2 border-palette-maroon dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors duration-300">
        {/* Header */}
        <div className="h-12 border-b-2 border-palette-cream-border dark:border-slate-800 px-4 flex items-center justify-between bg-palette-cream dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-palette-crimson dark:text-rose-400" />
            <h2 className="text-sm font-black text-palette-maroon dark:text-slate-100">Line Follower Robot Simulator - Learning Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-palette-maroon/70 dark:text-slate-400 hover:text-palette-maroon dark:hover:text-slate-100 hover:bg-palette-cream-dark dark:hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-palette-maroon dark:text-slate-200 leading-relaxed bg-palette-cream-paper dark:bg-slate-950">
          {/* Section 1: Concept */}
          <div className="p-3 bg-palette-cream dark:bg-slate-900 rounded-xl border border-palette-cream-border dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-palette-teal dark:text-sky-400 font-black text-sm">
              <Radio className="w-4 h-4 text-palette-teal dark:text-sky-400" />
              <span>1. How Dual IR Line Sensors Work</span>
            </div>
            <p className="font-medium">
              The robot features <strong>two infrared (IR) light probes</strong> mounted at the front bumper:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-palette-maroon/80 dark:text-slate-300 font-medium">
              <li><strong className="text-palette-crimson dark:text-rose-400">Deep Maroon Line (Track):</strong> Absorbs light, returning low brightness (&lt;100 RGB). The sensor reports <code>ON LINE</code> (true).</li>
              <li><strong className="text-palette-maroon dark:text-slate-200">Warm Background:</strong> Reflects light. The sensor reports <code>OFF LINE</code> (false).</li>
            </ul>
          </div>

          {/* Section 2: Algorithm */}
          <div className="p-3 bg-palette-cream dark:bg-slate-900 rounded-xl border border-palette-cream-border dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-palette-maroon dark:text-slate-100 font-black text-sm">
              <Cpu className="w-4 h-4 text-palette-crimson dark:text-rose-400" />
              <span>2. Classic Line Following Algorithm</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-palette-cream-light dark:bg-slate-800 rounded border border-palette-cream-border dark:border-slate-700">
                <span className="font-bold text-palette-teal dark:text-sky-400">Both Sensors ON Line:</span>
                <p className="text-palette-maroon/80 dark:text-slate-300 font-medium">Robot is centered. Move straight forward.</p>
              </div>
              <div className="p-2 bg-palette-cream-light dark:bg-slate-800 rounded border border-palette-cream-border dark:border-slate-700">
                <span className="font-bold text-palette-teal dark:text-sky-400">Left Sensor ON Line:</span>
                <p className="text-palette-maroon/80 dark:text-slate-300 font-medium">Bot drifted right. Turn Left to correct path.</p>
              </div>
              <div className="p-2 bg-palette-cream-light dark:bg-slate-800 rounded border border-palette-cream-border dark:border-slate-700">
                <span className="font-bold text-palette-teal dark:text-sky-400">Right Sensor ON Line:</span>
                <p className="text-palette-maroon/80 dark:text-slate-300 font-medium">Bot drifted left. Turn Right to correct path.</p>
              </div>
              <div className="p-2 bg-palette-cream-light dark:bg-slate-800 rounded border border-palette-cream-border dark:border-slate-700">
                <span className="font-bold text-palette-crimson dark:text-rose-400">Neither Sensor ON Line:</span>
                <p className="text-palette-maroon/80 dark:text-slate-300 font-medium">Bot lost the line. Slow down or search for line.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Arena Tools */}
          <div className="p-3 bg-palette-cream dark:bg-slate-900 rounded-xl border border-palette-cream-border dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-palette-teal dark:text-sky-400 font-black text-sm">
              <Sparkles className="w-4 h-4 text-palette-teal dark:text-sky-400" />
              <span>3. Arena & Drawing Tools</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-palette-maroon/80 dark:text-slate-300 font-medium">
              <li><strong className="text-palette-maroon dark:text-slate-200 font-bold">Draw Track:</strong> Click & drag on canvas to paint lines of custom brush size.</li>
              <li><strong className="text-palette-maroon dark:text-slate-200 font-bold">Eraser:</strong> Clean up or edit track lines.</li>
              <li><strong className="text-palette-maroon dark:text-slate-200 font-bold">Reposition Bot:</strong> Click anywhere on canvas to move robot to a custom starting location.</li>
              <li><strong className="text-palette-maroon dark:text-slate-200 font-bold">Track Presets:</strong> Test your code on Oval, Figure-8, Sharp Corners, and S-Curves!</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="h-10 border-t border-palette-cream-border dark:border-slate-800 px-4 flex items-center justify-end bg-palette-cream dark:bg-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-palette-teal dark:bg-sky-500 hover:bg-palette-teal-dark dark:hover:bg-sky-600 text-white rounded text-xs font-bold transition shadow-md"
          >
            Got It! Let's Code
          </button>
        </div>
      </div>
    </div>
  );
}
