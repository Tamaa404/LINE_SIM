import React from 'react';
import { Paintbrush, Eraser, Trash2, Move, Target, Sliders, RotateCcw } from 'lucide-react';

export function ToolboxControls({
  activeTool,
  setActiveTool,
  brushSize,
  setBrushSize,
  clearTrack,
  resetToStart
}) {
  return (
    <div className="flex items-center justify-between gap-1.5 p-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur overflow-x-auto no-scrollbar shrink-0">
      {/* Tool Selection Group */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button
          onClick={() => setActiveTool('draw')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
            activeTool === 'draw'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-semibold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Draw Track (Black Line)"
        >
          <Paintbrush className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
          <span className="hidden sm:inline text-[11px] sm:text-xs">Draw</span>
        </button>

        <button
          onClick={() => setActiveTool('eraser')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
            activeTool === 'eraser'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-semibold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Erase Track Lines"
        >
          <Eraser className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="hidden sm:inline text-[11px] sm:text-xs">Erase</span>
        </button>

        <button
          onClick={() => setActiveTool('reposition')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
            activeTool === 'reposition'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Click canvas to set robot position"
        >
          <Move className="w-3.5 h-3.5 text-purple-300 shrink-0" />
          <span className="hidden md:inline text-[11px] sm:text-xs">Reposition</span>
        </button>

        <button
          onClick={resetToStart}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium transition shrink-0"
          title="Reset robot to start position"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="hidden md:inline text-[11px] sm:text-xs">Reset Pos</span>
        </button>

        <button
          onClick={() => setActiveTool('set_destination')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
            activeTool === 'set_destination'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Click canvas to move target destination marker"
        >
          <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="hidden lg:inline text-[11px] sm:text-xs">Destination</span>
        </button>

        <button
          onClick={clearTrack}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-lg text-xs font-medium transition shrink-0"
          title="Clear all drawn track lines"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="hidden sm:inline text-[11px] sm:text-xs">Clear Canvas</span>
        </button>
      </div>

      {/* Right Controls: Brush Size Slider */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/60 px-2 sm:px-3 py-1 rounded-lg border border-slate-700/50 shrink-0">
        <div className="flex items-center gap-1 text-xs text-slate-300 shrink-0">
          <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden sm:inline text-xs">Size:</span>
          <span className="font-mono text-cyan-300 font-bold text-xs w-5 sm:w-6">{brushSize}px</span>
        </div>
        <input
          type="range"
          min="8"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-16 sm:w-20 accent-cyan-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
        />
      </div>
    </div>
  );
}
