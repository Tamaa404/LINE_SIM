import React from 'react';
import { Play, Square, FastForward, RotateCcw, Radio, RadioReceiver, Navigation, Compass } from 'lucide-react';

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
    <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-10 select-none">
      {/* Simulation Play / Stop Execution Group */}
      <div className="flex items-center gap-2">
        {!isRunning ? (
          <button
            onClick={onRunSimulation}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition transform"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Run Simulation</span>
          </button>
        ) : (
          <button
            onClick={onStopSimulation}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 active:scale-95 text-white text-xs font-bold rounded-lg shadow-lg shadow-rose-600/30 transition transform"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Stop Simulation</span>
          </button>
        )}

        <button
          onClick={onResetWorkspace}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
          title="Reset to default Line Follower block program"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xl:inline">Line Follower Code</span>
        </button>

        <button
          onClick={onLoadManualCode}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-lg border border-slate-700 transition"
          title="Load 100px -> Right 90° -> 50px -> Right 90° -> 50px Manual Navigation Code"
        >
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Manual Task Code</span>
        </button>
      </div>

      {/* Sensor Toggle & Speed Slider Group */}
      <div className="flex items-center gap-3">
        {/* Sensor Toggle Switch */}
        <button
          onClick={onToggleSensors}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition ${
            sensorsEnabled
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 shadow-sm shadow-emerald-900/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
          }`}
          title="Toggle IR Line Sensors ON/OFF for manual navigation"
        >
          <Radio className={`w-3.5 h-3.5 ${sensorsEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span>Sensors: {sensorsEnabled ? 'ON' : 'OFF (Manual)'}</span>
        </button>

        {/* Speed Slider */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-medium">Speed:</span>
            <span className="font-mono font-bold text-cyan-300 w-6">{simSpeed}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={simSpeed}
            onChange={(e) => setSimSpeed(Number(e.target.value))}
            className="w-16 accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
