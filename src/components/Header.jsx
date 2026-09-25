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
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between z-20 shadow-md select-none shrink-0">
      {/* Brand Title */}
      <div className="flex items-center gap-2 shrink-0">
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
          <p className="text-xs text-slate-400 hidden xl:block">
            Educational Line Follower & Manual Navigation Simulator
          </p>
        </div>
      </div>

      {/* Center Track Preset Selector */}
      <div className="flex items-center gap-1.5 sm:gap-2 mx-2">
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-300 font-medium hidden sm:inline">Track:</span>
          <select
            value={selectedTrack}
            onChange={(e) => onSelectTrack(e.target.value)}
            className="bg-slate-900 text-cyan-300 font-semibold rounded px-1.5 py-0.5 border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer text-xs max-w-[110px] xs:max-w-[140px] sm:max-w-[180px] truncate"
          >
            {presetTracks.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Action Buttons: View Code & Guide */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onOpenCodeModal}
          title="View Generated JavaScript Code"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-lg border border-slate-700/80 transition shrink-0"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden sm:inline text-xs">View Code</span>
          <span className="sm:hidden text-xs">Code</span>
        </button>

        <button
          onClick={onOpenHelpModal}
          title="Open Simulator Guide"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/80 transition shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="hidden sm:inline text-xs">Guide</span>
        </button>
      </div>
    </header>
  );
}
