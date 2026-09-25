import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { initCustomBlockly, TOOLBOX_XML, DEFAULT_WORKSPACE_XML } from '../../utils/blocklyConfig';

export function BlocklyWorkspace({ onCodeChange, setWorkspaceRef }) {
  const blocklyDivRef = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (!blocklyDivRef.current) return;

    // Register custom blocks and JS generators
    initCustomBlockly(Blockly);

    // Inject Blockly workspace with Scratch aesthetic options
    const workspace = Blockly.inject(blocklyDivRef.current, {
      toolbox: TOOLBOX_XML,
      grid: {
        spacing: 25,
        length: 3,
        colour: '#334155',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
        maxScale: 2.0,
        minScale: 0.5,
        scaleSpeed: 1.2,
      },
      trashcan: true,
      move: {
        scrollbars: false,
        drag: true,
        wheel: true,
      },
      renderer: 'geras', // Scratch-style block renderer
    });

    workspaceRef.current = workspace;
    if (setWorkspaceRef) {
      setWorkspaceRef(workspace);
    }

    // Load default starter workspace
    try {
      const dom = Blockly.utils.xml.textToDom(DEFAULT_WORKSPACE_XML);
      Blockly.Xml.domToWorkspace(dom, workspace);
    } catch (e) {
      console.error('Failed to parse default workspace XML', e);
    }

    // Change listener to export generated code
    const handleWorkspaceChange = () => {
      if (onCodeChange && workspaceRef.current) {
        try {
          const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
          onCodeChange(code);
        } catch (err) {
          console.warn('Blockly JS generation warning', err);
        }
      }
    };

    workspace.addChangeListener(handleWorkspaceChange);
    handleWorkspaceChange(); // Initial code trigger

    // Handle Window & Container Resize
    const handleResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };
    window.addEventListener('resize', handleResize);

    // Observer for div size changes (e.g. when mobile tabs toggle)
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (blocklyDivRef.current) {
      resizeObserver.observe(blocklyDivRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      workspace.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      <div ref={blocklyDivRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
