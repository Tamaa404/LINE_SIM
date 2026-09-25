import React from 'react';
import { Bot, Code2, HelpCircle, RotateCcw, Layers, Radio } from 'lucide-react';

export function Header({
  selectedTrack,
  onSelectTrack,
  presetTracks,
  onOpenCodeModal,
  onOpenHelpModal,
  onResetToStart,
  sensorsEnabled,
  onToggleSensors
}) {
  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-2 sm:px-4 flex items-center justify-between z-20 shadow-md select-none shrink-0">
      {/* Brand Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xs sm:text-base font-bold bg-gradient-to-r from-cyan-400 via-sky-200 to-white bg-clip-text text-transparent flex items-center gap-1.5">
            RoboTrack
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold">
              Pro
            </span>
          </h1>
          <p className="text-xs text-slate-400 hidden lg:block">
            Educational Line Follower & Manual Navigation Simulator
          </p>
        </div>
      </div>

      {/* Center Track Preset Selector & Sensor Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1 sm:gap-2 bg-slate-800/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-300 font-medium hidden md:inline">Preset:</span>
          <select
            value={selectedTrack}
            onChange={(e) => onSelectTrack(e.target.value)}
            className="bg-slate-900 text-cyan-300 font-semibold rounded px-1.5 py-0.5 border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer text-xs max-w-[100px] sm:max-w-[170px] truncate"
          >
            {presetTracks.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onToggleSensors}
          className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs font-semibold transition ${
            sensorsEnabled
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
              : 'bg-purple-950/80 text-purple-300 border-purple-700/80'
          }`}
          title="Turn IR Line Sensors ON or OFF for Manual Step Programming"
        >
          <Radio className={`w-3.5 h-3.5 ${sensorsEnabled ? 'text-emerald-400 animate-pulse' : 'text-purple-400'}`} />
          <span className="hidden md:inline">Sensors:</span>
          <span className="text-[11px] sm:text-xs">{sensorsEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={onResetToStart}
          title="Reset Robot to Start Position"
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Reset Position</span>
        </button>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onOpenCodeModal}
          title="View Generated JavaScript Code"
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-lg border border-slate-700/80 transition"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Code</span>
        </button>

        <button
          onClick={onOpenHelpModal}
          title="Open Simulator Guide"
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/80 transition"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Guide</span>
        </button>
      </div>
    </header>
  );
}
