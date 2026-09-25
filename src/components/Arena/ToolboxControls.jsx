import React from 'react';
import { Paintbrush, Eraser, Trash2, Move, Target, Sliders } from 'lucide-react';

export function ToolboxControls({
  activeTool,
  setActiveTool,
  brushSize,
  setBrushSize,
  clearTrack,
  resetToStart
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur">
      {/* Tool Selection Group */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setActiveTool('draw')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTool === 'draw'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Draw Track (Black Line)"
        >
          <Paintbrush className="w-3.5 h-3.5" />
          <span>Draw Track</span>
        </button>

        <button
          onClick={() => setActiveTool('eraser')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTool === 'eraser'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Erase Track Lines"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Eraser</span>
        </button>

        <button
          onClick={() => setActiveTool('reposition')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTool === 'reposition'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Click canvas to set robot position"
        >
          <Move className="w-3.5 h-3.5" />
          <span>Reposition Bot</span>
        </button>

        <button
          onClick={() => setActiveTool('set_destination')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTool === 'set_destination'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Click canvas to move target destination marker"
        >
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>Move Destination</span>
        </button>

        <button
          onClick={clearTrack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-lg text-xs font-medium transition"
          title="Clear all drawn track lines"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Canvas</span>
        </button>
      </div>

      {/* Right Controls: Brush Size Slider */}
      <div className="flex items-center gap-3 bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700/50">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Size:</span>
          <span className="font-mono text-cyan-300 font-bold w-6">{brushSize}px</span>
        </div>
        <input
          type="range"
          min="8"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-24 accent-cyan-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
        />
      </div>
    </div>
  );
}
