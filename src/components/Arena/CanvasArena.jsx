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
    <div className="flex flex-col h-full bg-palette-cream-light dark:bg-slate-950 border-r-2 border-palette-cream-border dark:border-slate-800 overflow-hidden select-none transition-colors duration-300">
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
      <div className="flex-1 relative flex items-center justify-center p-2 bg-palette-cream-light dark:bg-slate-950 overflow-hidden transition-colors duration-300">
        <div className="relative rounded-xl overflow-hidden shadow-xl border-2 border-palette-maroon dark:border-slate-700 bg-[#FFFDF5] dark:bg-[#1E293B] max-w-full w-full max-h-full aspect-[7/5]">
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
            <div className="absolute top-3 left-3 bg-palette-maroon dark:bg-slate-900 text-palette-cream dark:text-slate-100 border border-palette-crimson dark:border-sky-500 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-palette-teal dark:bg-sky-400 animate-pulse"></span>
              Click on canvas to place robot at new start position
            </div>
          )}

          {/* Helper Tooltip Overlay when Move Destination tool is selected */}
          {activeTool === 'set_destination' && (
            <div className="absolute top-3 left-3 bg-palette-maroon dark:bg-slate-900 text-palette-cream dark:text-slate-100 border border-palette-teal dark:border-emerald-500 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-palette-teal dark:bg-emerald-400 animate-ping"></span>
              Click anywhere on canvas to move target destination marker
            </div>
          )}

          {/* Destination Reached Banner Overlay */}
          {destinationReached && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-palette-teal dark:bg-emerald-600 text-white border-2 border-white text-xs font-black px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2.5 animate-bounce pointer-events-none">
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
