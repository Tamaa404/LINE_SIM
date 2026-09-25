import React from 'react';
import { X, HelpCircle, Radio, Compass, Cpu, Sparkles } from 'lucide-react';

export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="h-12 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-100">Line Follower Robot Simulator - Learning Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed bg-slate-950">
          {/* Section 1: Concept */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Radio className="w-4 h-4" />
              <span>1. How Dual IR Line Sensors Work</span>
            </div>
            <p>
              The robot features <strong>two infrared (IR) light probes</strong> mounted at the front bumper:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><strong className="text-emerald-400">Black Line (Track):</strong> Absorbs light, returning low brightness (&lt;100 RGB). The sensor reports <code>ON LINE</code> (true).</li>
              <li><strong className="text-slate-400">White Background:</strong> Reflects light. The sensor reports <code>OFF LINE</code> (false).</li>
            </ul>
          </div>

          {/* Section 2: Algorithm */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>2. Classic Line Following Algorithm</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="font-semibold text-emerald-300">Both Sensors ON Line:</span>
                <p className="text-slate-400">Robot is centered. Move straight forward.</p>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="font-semibold text-cyan-300">Left Sensor ON Line:</span>
                <p className="text-slate-400">Bot drifted right. Turn Left to correct path.</p>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="font-semibold text-cyan-300">Right Sensor ON Line:</span>
                <p className="text-slate-400">Bot drifted left. Turn Right to correct path.</p>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="font-semibold text-rose-300">Neither Sensor ON Line:</span>
                <p className="text-slate-400">Bot lost the line. Slow down or search for line.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Arena Tools */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>3. Arena & Drawing Tools</span>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Draw Track:</strong> Click & drag on canvas to paint black lines of custom brush size.</li>
              <li><strong>Eraser:</strong> Clean up or edit track lines.</li>
              <li><strong>Reposition Bot:</strong> Click anywhere on canvas to move robot to a custom starting location.</li>
              <li><strong>Track Presets:</strong> Test your code on Oval, Figure-8, Sharp Corners, and S-Curves!</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="h-10 border-t border-slate-800 px-4 flex items-center justify-end bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold transition"
          >
            Got It! Let's Code
          </button>
        </div>
      </div>
    </div>
  );
}
