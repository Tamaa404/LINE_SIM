import React from 'react';
import { Bot, Code2, HelpCircle, RotateCcw, Layers, Radio, Sun, Moon } from 'lucide-react';

export function Header({
  selectedTrack,
  onSelectTrack,
  presetTracks,
  onOpenCodeModal,
  onOpenHelpModal,
  onResetToStart,
  sensorsEnabled,
  onToggleSensors,
  theme,
  onToggleTheme
}) {
  return (
    <header className="h-14 bg-palette-cream dark:bg-slate-900 border-b-2 border-palette-cream-border dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between z-20 shadow-sm select-none shrink-0 transition-colors duration-300">
      {/* Brand Title */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-palette-teal dark:bg-sky-500 flex items-center justify-center shadow-md shadow-palette-teal/20 dark:shadow-sky-500/20 shrink-0">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xs sm:text-base font-black text-palette-maroon dark:text-slate-100 flex items-center gap-1.5">
            RoboTrack
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-palette-crimson dark:bg-rose-600 text-white border border-palette-crimson-dark dark:border-rose-700 font-bold">
              Pro
            </span>
          </h1>
          <p className="text-xs text-palette-maroon/80 dark:text-slate-400 font-medium hidden xl:block">
            Educational Line Follower & Manual Navigation Simulator
          </p>
        </div>
      </div>

      {/* Center Track Preset Selector */}
      <div className="flex items-center gap-1.5 sm:gap-2 mx-2">
        <div className="flex items-center gap-1.5 bg-palette-cream-light dark:bg-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-palette-cream-border dark:border-slate-700 text-xs shadow-sm">
          <Layers className="w-3.5 h-3.5 text-palette-teal dark:text-sky-400 shrink-0" />
          <span className="text-palette-maroon dark:text-slate-300 font-bold hidden sm:inline">Track:</span>
          <select
            value={selectedTrack}
            onChange={(e) => onSelectTrack(e.target.value)}
            className="bg-palette-cream-light dark:bg-slate-800 text-palette-teal dark:text-sky-400 font-extrabold rounded px-1.5 py-0.5 border border-palette-cream-border dark:border-slate-700 focus:outline-none focus:border-palette-teal dark:focus:border-sky-400 cursor-pointer text-xs max-w-[110px] xs:max-w-[140px] sm:max-w-[180px] truncate"
          >
            {presetTracks.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Action Buttons: View Code, Guide & Dark/Light Theme Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onOpenCodeModal}
          title="View Generated JavaScript Code"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-palette-teal hover:bg-palette-teal-dark dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow-md transition shrink-0"
        >
          <Code2 className="w-3.5 h-3.5 text-white shrink-0" />
          <span className="hidden sm:inline text-xs">View Code</span>
          <span className="sm:hidden text-xs">Code</span>
        </button>

        <button
          onClick={onOpenHelpModal}
          title="Open Simulator Guide"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-palette-cream-light hover:bg-palette-cream-dark dark:bg-slate-800 dark:hover:bg-slate-700 text-palette-maroon dark:text-slate-200 text-xs font-bold rounded-lg border border-palette-cream-border dark:border-slate-700 transition shrink-0 shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5 text-palette-crimson dark:text-rose-400 shrink-0" />
          <span className="hidden sm:inline text-xs">Guide</span>
        </button>

        {/* Dual Light/Dark Mode Switcher Button */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode (Warm Vintage)' : 'Switch to Night Mode (Dark Cyan Slate)'}
          className="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1.5 bg-palette-cream-light hover:bg-palette-cream-dark dark:bg-slate-800 dark:hover:bg-slate-700 text-palette-maroon dark:text-yellow-400 border border-palette-cream-border dark:border-slate-700 rounded-lg text-xs font-bold transition shadow-sm shrink-0"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-yellow-400 animate-spin-slow shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-palette-maroon shrink-0" />
          )}
          <span className="hidden md:inline ml-1 text-xs">
            {theme === 'dark' ? 'Day' : 'Night'}
          </span>
        </button>
      </div>
    </header>
  );
}
