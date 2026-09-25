import React from 'react';
import { Compass, Gauge, Radio, Play, Square, Crosshair, Target, CheckCircle2 } from 'lucide-react';

export function TelemetryBar({ robot, isRunning, sensorsEnabled, destinationReached }) {
  const headingNorm = Math.round((robot.heading % 360 + 360) % 360);

  return (
    <div className="h-12 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-xs select-none">
      {/* IR Sensors Status Badges */}
      <div className="flex items-center gap-3">
        {sensorsEnabled ? (
          <>
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
              <Radio className={`w-3.5 h-3.5 ${robot.leftSensorOn ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-slate-400 text-[11px] font-medium">LEFT IR:</span>
              {robot.leftSensorOn ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow-sm shadow-emerald-900/50">
                  ON LINE
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  OFF LINE
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
              <Radio className={`w-3.5 h-3.5 ${robot.rightSensorOn ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-slate-400 text-[11px] font-medium">RIGHT IR:</span>
              {robot.rightSensorOn ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow-sm shadow-emerald-900/50">
                  ON LINE
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  OFF LINE
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1.5 bg-purple-950/70 px-2.5 py-1 rounded-md border border-purple-800/60 text-purple-300 font-semibold text-[11px]">
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span>SENSORS: OFF (Manual Program Mode)</span>
          </div>
        )}
      </div>

      {/* Heading & Speed Metrics */}
      <div className="hidden sm:flex items-center gap-4 text-slate-300">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Heading:</span>
          <span className="font-mono font-semibold text-cyan-300 w-10">{headingNorm}°</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Speed:</span>
          <span className="font-mono font-semibold text-amber-300">{robot.speed} px/step</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-400">Pos:</span>
          <span className="font-mono font-medium text-slate-300 text-[11px]">
            ({Math.round(robot.x)}, {Math.round(robot.y)})
          </span>
        </div>
      </div>

      {/* Sim Status Badge & Goal Badge */}
      <div className="flex items-center gap-2">
        {destinationReached && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-500 text-amber-300 font-bold text-[11px] animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>🎯 DESTINATION REACHED!</span>
          </div>
        )}

        {isRunning ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Running</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-medium text-[11px]">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            <span>Stopped</span>
          </div>
        )}
      </div>
    </div>
  );
}
