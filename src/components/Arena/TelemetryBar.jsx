import React from 'react';
import { Compass, Gauge, Radio, Crosshair, CheckCircle2 } from 'lucide-react';

export function TelemetryBar({ robot, isRunning, sensorsEnabled, destinationReached }) {
  const headingNorm = Math.round((robot.heading % 360 + 360) % 360);

  return (
    <div className="h-12 bg-palette-cream dark:bg-slate-900 border-t-2 border-palette-cream-border dark:border-slate-800 px-4 flex items-center justify-between text-xs select-none shrink-0 shadow-sm transition-colors duration-300">
      {/* IR Sensors Status Badges */}
      <div className="flex items-center gap-3">
        {sensorsEnabled ? (
          <>
            <div className="flex items-center gap-1.5 bg-palette-cream-light dark:bg-slate-800 px-2.5 py-1 rounded-md border border-palette-cream-border dark:border-slate-700 shadow-sm">
              <Radio className={`w-3.5 h-3.5 ${robot.leftSensorOn ? 'text-palette-teal dark:text-sky-400 animate-pulse' : 'text-palette-maroon/50 dark:text-slate-500'}`} />
              <span className="text-palette-maroon dark:text-slate-300 text-[11px] font-bold">LEFT IR:</span>
              {robot.leftSensorOn ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-palette-teal dark:bg-emerald-600 text-white shadow-sm">
                  ON LINE
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-palette-cream-dark dark:bg-slate-700 text-palette-maroon dark:text-slate-300 border border-palette-cream-border dark:border-slate-600">
                  OFF LINE
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-palette-cream-light dark:bg-slate-800 px-2.5 py-1 rounded-md border border-palette-cream-border dark:border-slate-700 shadow-sm">
              <Radio className={`w-3.5 h-3.5 ${robot.rightSensorOn ? 'text-palette-teal dark:text-sky-400 animate-pulse' : 'text-palette-maroon/50 dark:text-slate-500'}`} />
              <span className="text-palette-maroon dark:text-slate-300 text-[11px] font-bold">RIGHT IR:</span>
              {robot.rightSensorOn ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-palette-teal dark:bg-emerald-600 text-white shadow-sm">
                  ON LINE
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-palette-cream-dark dark:bg-slate-700 text-palette-maroon dark:text-slate-300 border border-palette-cream-border dark:border-slate-600">
                  OFF LINE
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1.5 bg-palette-crimson/10 dark:bg-rose-500/10 px-2.5 py-1 rounded-md border border-palette-crimson/40 dark:border-rose-500/40 text-palette-crimson dark:text-rose-400 font-bold text-[11px]">
            <Radio className="w-3.5 h-3.5 text-palette-crimson dark:text-rose-400" />
            <span>SENSORS: OFF (Manual Mode)</span>
          </div>
        )}
      </div>

      {/* Heading & Speed Metrics */}
      <div className="hidden sm:flex items-center gap-4 text-palette-maroon dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-palette-teal dark:text-sky-400" />
          <span className="text-palette-maroon/80 dark:text-slate-400 font-semibold">Heading:</span>
          <span className="font-mono font-black text-palette-teal dark:text-sky-400 w-10">{headingNorm}°</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-palette-crimson dark:text-rose-400" />
          <span className="text-palette-maroon/80 dark:text-slate-400 font-semibold">Speed:</span>
          <span className="font-mono font-black text-palette-maroon dark:text-slate-200">{robot.speed} px/step</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-palette-teal dark:text-sky-400" />
          <span className="text-palette-maroon/80 dark:text-slate-400 font-semibold">Pos:</span>
          <span className="font-mono font-bold text-palette-maroon dark:text-slate-200 text-[11px]">
            ({Math.round(robot.x)}, {Math.round(robot.y)})
          </span>
        </div>
      </div>

      {/* Sim Status Badge & Goal Badge */}
      <div className="flex items-center gap-2">
        {destinationReached && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-palette-teal dark:bg-emerald-600 text-white font-black text-[11px] animate-pulse shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>🎯 DESTINATION REACHED!</span>
          </div>
        )}

        {isRunning ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-palette-teal/15 dark:bg-emerald-500/15 border border-palette-teal dark:border-emerald-500 text-palette-teal dark:text-emerald-400 font-extrabold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-palette-teal dark:bg-emerald-400 animate-ping"></span>
            <span>Running</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-palette-cream-light dark:bg-slate-800 border border-palette-cream-border dark:border-slate-700 text-palette-maroon/70 dark:text-slate-400 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-palette-maroon/40 dark:bg-slate-500"></span>
            <span>Stopped</span>
          </div>
        )}
      </div>
    </div>
  );
}
