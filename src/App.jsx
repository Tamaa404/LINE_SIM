import React, { useState, useRef, useCallback } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
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

      {/* Main 50/50 Rigid Split Pane Viewport */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-56px)] overflow-hidden">
        {/* LEFT PANEL: HTML5 Canvas Robot Arena */}
        <section className="h-full relative overflow-hidden border-r border-slate-800">
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
        <section className="h-full flex flex-col relative overflow-hidden bg-slate-900">
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
