import React, { useState, useRef, useCallback } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { Play, Square, Code2, Bot, Gamepad2 } from 'lucide-react';
import { Header } from './components/Header';
import { CanvasArena } from './components/Arena/CanvasArena';
import { TopControlBar } from './components/BlocklyEditor/TopControlBar';
import { BlocklyWorkspace } from './components/BlocklyEditor/BlocklyWorkspace';
import { CodeModal } from './components/Modals/CodeModal';
import { HelpModal } from './components/Modals/HelpModal';
import { useRobotSim } from './hooks/useRobotSim';
import { DEFAULT_WORKSPACE_XML, MANUAL_WORKSPACE_XML } from './utils/blocklyConfig';

export default function App() {
  const sim = useRobotSim();
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('arena'); // 'arena' | 'code'

  const workspaceRef = useRef(null);

  // Set reference to Blockly workspace for resetting or code generation
  const handleSetWorkspaceRef = useCallback((ws) => {
    workspaceRef.current = ws;
  }, []);

  // Run Simulation Handler
  const handleRunSimulation = async () => {
    if (sim.isRunning) return;

    // Get current code from workspace if needed
    let codeToRun = generatedCode;
    if (workspaceRef.current) {
      try {
        codeToRun = javascriptGenerator.workspaceToCode(workspaceRef.current);
        setGeneratedCode(codeToRun);
      } catch (err) {
        console.error('Failed to extract code:', err);
      }
    }

    if (!codeToRun.trim()) {
      alert('Please add blocks to your workspace first!');
      return;
    }

    sim.setIsRunning(true);
    const robotAPI = sim.createRobotAPI();

    try {
      // Wrap generated code inside an async execution scope with robot API context
      const asyncFn = new Function('robot', `
        return (async () => {
          try {
            ${codeToRun}
          } catch (err) {
            if (err.message !== 'STOPPED') {
              console.error('Simulation Runtime Error:', err);
            }
          }
        })();
      `);

      await asyncFn(robotAPI);
    } catch (err) {
      if (err.message !== 'STOPPED') {
        console.error('Execution Failed:', err);
      }
    } finally {
      sim.setIsRunning(false);
    }
  };

  // Reset to default Line Follower Workspace
  const handleResetWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      try {
        const dom = Blockly.utils.xml.textToDom(DEFAULT_WORKSPACE_XML);
        Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
      } catch (e) {
        console.error('Failed to reload starter workspace XML', e);
      }
    }
  };

  // Load Manual Task Workspace (100px -> Right 90° -> 50px -> Right 90° -> 50px)
  const handleLoadManualCode = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      try {
        const dom = Blockly.utils.xml.textToDom(MANUAL_WORKSPACE_XML);
        Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
        sim.loadPresetTrack('destination_challenge');
      } catch (e) {
        console.error('Failed to load manual navigation XML', e);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Application Navigation Header */}
      <Header
        selectedTrack={sim.selectedTrack}
        onSelectTrack={sim.loadPresetTrack}
        presetTracks={sim.PRESET_TRACKS}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
        onResetToStart={sim.resetToStart}
        sensorsEnabled={sim.sensorsEnabled}
        onToggleSensors={sim.toggleSensors}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-2 h-[calc(100vh-56px)] overflow-hidden relative">
        {/* LEFT PANEL: HTML5 Canvas Robot Arena */}
        <section
          className={`h-full relative overflow-hidden border-r border-slate-800 ${
            mobileTab === 'arena' ? 'flex flex-col flex-1 pb-16 lg:pb-0' : 'hidden lg:flex lg:flex-col'
          }`}
        >
          <CanvasArena
            trackCanvasRef={sim.trackCanvasRef}
            robotCanvasRef={sim.robotCanvasRef}
            robot={sim.robot}
            sensorsEnabled={sim.sensorsEnabled}
            destinationReached={sim.destinationReached}
            activeTool={sim.activeTool}
            setActiveTool={sim.setActiveTool}
            brushSize={sim.brushSize}
            setBrushSize={sim.setBrushSize}
            clearTrack={sim.clearTrack}
            resetToStart={sim.resetToStart}
            handleCanvasMouseDown={sim.handleCanvasMouseDown}
            handleCanvasMouseMove={sim.handleCanvasMouseMove}
            handleCanvasMouseUp={sim.handleCanvasMouseUp}
            isRunning={sim.isRunning}
          />
        </section>

        {/* RIGHT PANEL: Blockly Workspace & Simulation Controls */}
        <section
          className={`h-full flex flex-col relative overflow-hidden bg-slate-900 ${
            mobileTab === 'code' ? 'flex flex-col flex-1 pb-16 lg:pb-0' : 'hidden lg:flex lg:flex-col'
          }`}
        >
          <TopControlBar
            onRunSimulation={handleRunSimulation}
            onStopSimulation={sim.stopSimulation}
            isRunning={sim.isRunning}
            simSpeed={sim.simSpeed}
            setSimSpeed={sim.setSimSpeed}
            onResetWorkspace={handleResetWorkspace}
            sensorsEnabled={sim.sensorsEnabled}
            onToggleSensors={sim.toggleSensors}
            onLoadManualCode={handleLoadManualCode}
          />

          <div className="flex-1 relative overflow-hidden">
            <BlocklyWorkspace
              onCodeChange={setGeneratedCode}
              setWorkspaceRef={handleSetWorkspaceRef}
            />
          </div>
        </section>
      </main>

      {/* Mobile Floating Bottom Dock View Switcher (< lg screens) */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl">
        <button
          onClick={() => setMobileTab('arena')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            mobileTab === 'arena'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Arena</span>
        </button>

        <button
          onClick={() => setMobileTab('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            mobileTab === 'code'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Blockly Code</span>
        </button>

        {/* Floating Quick Run/Stop on Mobile Arena View */}
        {mobileTab === 'arena' && (
          <div className="pl-1 border-l border-slate-700/60 flex items-center">
            {!sim.isRunning ? (
              <button
                onClick={handleRunSimulation}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run</span>
              </button>
            ) : (
              <button
                onClick={sim.stopSimulation}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-rose-600 to-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Code View Modal */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        code={generatedCode}
      />

      {/* Learning Guide Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
