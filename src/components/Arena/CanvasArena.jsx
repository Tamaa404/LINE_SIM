import React from 'react';
import { ToolboxControls } from './ToolboxControls';
import { TelemetryBar } from './TelemetryBar';

export function CanvasArena({
  trackCanvasRef,
  robotCanvasRef,
  robot,
  sensorsEnabled,
  destinationReached,
  activeTool,
  setActiveTool,
  brushSize,
  setBrushSize,
  clearTrack,
  resetToStart,
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  isRunning
}) {
  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/80 overflow-hidden select-none">
      {/* Top Drawing & Preset Toolbox */}
      <ToolboxControls
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        clearTrack={clearTrack}
        resetToStart={resetToStart}
      />

      {/* Dual Layer Canvas Container */}
      <div className="flex-1 relative flex items-center justify-center p-2 bg-slate-950 overflow-hidden">
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-white max-w-full w-full max-h-full aspect-[7/5]">
          {/* Layer 1: Persistent Track Canvas */}
          <canvas
            ref={trackCanvasRef}
            width={700}
            height={500}
            className="w-full h-full block cursor-crosshair touch-none select-none"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onTouchStart={handleCanvasMouseDown}
            onTouchMove={handleCanvasMouseMove}
            onTouchEnd={handleCanvasMouseUp}
          />

          {/* Layer 2: Animated Robot & Sensor Overlay Canvas */}
          <canvas
            ref={robotCanvasRef}
            width={700}
            height={500}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

          {/* Helper Tooltip Overlay when Reposition tool is selected */}
          {activeTool === 'reposition' && (
            <div className="absolute top-3 left-3 bg-purple-950/90 text-purple-200 border border-purple-700/80 text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              Click on canvas to place robot at new start position
            </div>
          )}

          {/* Helper Tooltip Overlay when Move Destination tool is selected */}
          {activeTool === 'set_destination' && (
            <div className="absolute top-3 left-3 bg-amber-950/90 text-amber-200 border border-amber-700/80 text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Click anywhere on canvas to move target destination marker
            </div>
          )}

          {/* Destination Reached Banner Overlay */}
          {destinationReached && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 text-emerald-300 border-2 border-emerald-500 text-xs font-bold px-4 py-2 rounded-xl shadow-2xl shadow-emerald-500/30 flex items-center gap-2.5 animate-bounce pointer-events-none">
              <span className="text-base">🎉</span>
              <span>DESTINATION REACHED! Manual Navigation Task Completed!</span>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Telemetry Bar */}
      <TelemetryBar
        robot={robot}
        isRunning={isRunning}
        sensorsEnabled={sensorsEnabled}
        destinationReached={destinationReached}
      />
    </div>
  );
}
