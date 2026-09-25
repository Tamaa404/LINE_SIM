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
    <div className="flex items-center justify-between gap-1.5 p-2 bg-palette-cream dark:bg-slate-900 border-b-2 border-palette-cream-border dark:border-slate-800 backdrop-blur overflow-x-auto no-scrollbar shrink-0 shadow-sm transition-colors duration-300">
      {/* Tool Selection Group */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button
          onClick={() => setActiveTool('draw')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
            activeTool === 'draw'
              ? 'bg-palette-teal text-white shadow-md shadow-palette-teal/30 dark:bg-sky-500 dark:shadow-sky-500/30'
              : 'bg-palette-cream-light text-palette-maroon hover:bg-palette-cream-dark border border-palette-cream-border dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:border-slate-700'
          }`}
          title="Draw Track (Black Line)"
        >
          <Paintbrush className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline text-[11px] sm:text-xs">Draw</span>
        </button>

        <button
          onClick={() => setActiveTool('eraser')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
            activeTool === 'eraser'
              ? 'bg-palette-crimson text-white shadow-md shadow-palette-crimson/30 dark:bg-rose-600 dark:shadow-rose-600/30'
              : 'bg-palette-cream-light text-palette-maroon hover:bg-palette-cream-dark border border-palette-cream-border dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:border-slate-700'
          }`}
          title="Erase Track Lines"
        >
          <Eraser className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline text-[11px] sm:text-xs">Erase</span>
        </button>

        <button
          onClick={() => setActiveTool('reposition')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
            activeTool === 'reposition'
              ? 'bg-palette-teal text-white shadow-md shadow-palette-teal/30 dark:bg-sky-500 dark:shadow-sky-500/30'
              : 'bg-palette-cream-light text-palette-maroon hover:bg-palette-cream-dark border border-palette-cream-border dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:border-slate-700'
          }`}
          title="Click canvas to set robot position"
        >
          <Move className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:inline text-[11px] sm:text-xs">Reposition</span>
        </button>

        <button
          onClick={resetToStart}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 bg-palette-cream-light hover:bg-palette-cream-dark dark:bg-slate-800 dark:hover:bg-slate-700 text-palette-maroon dark:text-slate-200 border border-palette-cream-border dark:border-slate-700 rounded-lg text-xs font-bold transition shrink-0 shadow-sm"
          title="Reset robot to start position"
        >
          <RotateCcw className="w-3.5 h-3.5 text-palette-crimson dark:text-rose-400 shrink-0" />
          <span className="hidden md:inline text-[11px] sm:text-xs">Reset Pos</span>
        </button>

        <button
          onClick={() => setActiveTool('set_destination')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
            activeTool === 'set_destination'
              ? 'bg-palette-teal text-white shadow-md shadow-palette-teal/30 dark:bg-sky-500 dark:shadow-sky-500/30'
              : 'bg-palette-cream-light text-palette-maroon hover:bg-palette-cream-dark border border-palette-cream-border dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:border-slate-700'
          }`}
          title="Click canvas to move target destination marker"
        >
          <Target className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden lg:inline text-[11px] sm:text-xs">Destination</span>
        </button>

        <button
          onClick={clearTrack}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 bg-palette-crimson hover:bg-palette-crimson-dark dark:bg-rose-600 dark:hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shrink-0 shadow-md"
          title="Clear all drawn track lines"
        >
          <Trash2 className="w-3.5 h-3.5 text-white shrink-0" />
          <span className="hidden sm:inline text-[11px] sm:text-xs">Clear Canvas</span>
        </button>
      </div>

      {/* Right Controls: Brush Size Slider */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-palette-cream-light dark:bg-slate-800 px-2 sm:px-3 py-1 rounded-lg border border-palette-cream-border dark:border-slate-700 shrink-0 shadow-sm">
        <div className="flex items-center gap-1 text-xs text-palette-maroon dark:text-slate-300 shrink-0">
          <Sliders className="w-3.5 h-3.5 text-palette-teal dark:text-sky-400 shrink-0" />
          <span className="hidden sm:inline text-xs font-bold">Size:</span>
          <span className="font-mono text-palette-teal dark:text-sky-400 font-black text-xs w-5 sm:w-6">{brushSize}px</span>
        </div>
        <input
          type="range"
          min="8"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-16 sm:w-20 accent-[#31AAA9] dark:accent-sky-400 cursor-pointer h-1.5 bg-palette-cream-border dark:bg-slate-700 rounded-lg"
        />
      </div>
    </div>
  );
}
