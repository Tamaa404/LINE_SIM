import React from 'react';
import { Play, Square, FastForward, RotateCcw, Radio, Navigation } from 'lucide-react';

export function TopControlBar({
  onRunSimulation,
  onStopSimulation,
  isRunning,
  simSpeed,
  setSimSpeed,
  onResetWorkspace,
  sensorsEnabled,
  onToggleSensors,
  onLoadManualCode
}) {
  return (
    <div className="h-12 bg-palette-cream dark:bg-slate-900 border-b-2 border-palette-cream-border dark:border-slate-800 px-2 sm:px-4 flex items-center justify-between z-10 select-none shrink-0 shadow-sm transition-colors duration-300">
      {/* Simulation Play / Stop Execution Group */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {!isRunning ? (
          <button
            onClick={onRunSimulation}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-palette-teal hover:bg-palette-teal-dark dark:bg-sky-500 dark:hover:bg-sky-600 active:scale-95 text-white text-xs font-black rounded-lg shadow-md transition transform shrink-0"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            <span className="text-[11px] sm:text-xs">Run</span>
            <span className="hidden xs:inline text-[11px] sm:text-xs">Sim</span>
          </button>
        ) : (
          <button
            onClick={onStopSimulation}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-palette-crimson hover:bg-palette-crimson-dark dark:bg-rose-600 dark:hover:bg-rose-700 active:scale-95 text-white text-xs font-black rounded-lg shadow-md transition transform shrink-0"
          >
            <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            <span className="text-[11px] sm:text-xs">Stop</span>
          </button>
        )}

        <button
          onClick={onResetWorkspace}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 bg-palette-cream-light hover:bg-palette-cream-dark dark:bg-slate-800 dark:hover:bg-slate-700 text-palette-maroon dark:text-slate-200 text-xs font-bold rounded-lg border border-palette-cream-border dark:border-slate-700 transition shadow-sm"
          title="Reset to default Line Follower block program"
        >
          <RotateCcw className="w-3.5 h-3.5 text-palette-crimson dark:text-rose-400" />
          <span className="hidden xl:inline">Line Follower Code</span>
        </button>

        <button
          onClick={onLoadManualCode}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 bg-palette-cream-light hover:bg-palette-cream-dark dark:bg-slate-800 dark:hover:bg-slate-700 text-palette-teal dark:text-sky-400 text-xs font-extrabold rounded-lg border border-palette-cream-border dark:border-slate-700 transition shadow-sm"
          title="Load 100px -> Right 90° -> 50px -> Right 90° -> 50px Manual Navigation Code"
        >
          <Navigation className="w-3.5 h-3.5 text-palette-teal dark:text-sky-400" />
          <span className="hidden md:inline">Manual Task</span>
        </button>
      </div>

      {/* Sensor Toggle & Speed Slider Group */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sensor Toggle Switch */}
        <button
          onClick={onToggleSensors}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg border text-xs font-bold transition shadow-sm ${
            sensorsEnabled
              ? 'bg-palette-teal text-white border-palette-teal-dark dark:bg-emerald-600 dark:border-emerald-500'
              : 'bg-palette-cream-light text-palette-maroon border-palette-cream-border hover:bg-palette-cream-dark dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
          }`}
          title="Toggle IR Line Sensors ON/OFF for manual navigation"
        >
          <Radio className={`w-3.5 h-3.5 ${sensorsEnabled ? 'text-white animate-pulse' : 'text-palette-crimson dark:text-rose-400'}`} />
          <span className="hidden sm:inline">Sensors:</span>
          <span className="text-[11px] sm:text-xs">{sensorsEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Speed Slider */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-palette-cream-light dark:bg-slate-800 px-2 sm:px-3 py-1 rounded-lg border border-palette-cream-border dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-1 text-xs text-palette-maroon dark:text-slate-300">
            <FastForward className="w-3.5 h-3.5 text-palette-teal dark:text-sky-400" />
            <span className="text-palette-maroon dark:text-slate-300 font-bold hidden md:inline">Speed:</span>
            <span className="font-mono font-black text-palette-teal dark:text-sky-400 text-xs">{simSpeed}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={simSpeed}
            onChange={(e) => setSimSpeed(Number(e.target.value))}
            className="w-12 sm:w-16 accent-[#31AAA9] dark:accent-sky-400 cursor-pointer h-1.5 bg-palette-cream-border dark:bg-slate-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
