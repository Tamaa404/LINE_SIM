import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { initCustomBlockly, TOOLBOX_XML, DEFAULT_WORKSPACE_XML } from '../../utils/blocklyConfig';

export function BlocklyWorkspace({ onCodeChange, setWorkspaceRef, theme = 'light' }) {
  const blocklyDivRef = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (!blocklyDivRef.current) return;

    // Register custom blocks and JS generators
    initCustomBlockly(Blockly);

    const initialGridColour = theme === 'dark' ? '#334155' : '#E6CA85';

    // Inject Blockly workspace with Scratch aesthetic options
    const workspace = Blockly.inject(blocklyDivRef.current, {
      toolbox: TOOLBOX_XML,
      grid: {
        spacing: 25,
        length: 3,
        colour: initialGridColour,
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

  // Update grid color dynamically on theme toggle
  useEffect(() => {
    if (workspaceRef.current && workspaceRef.current.options && workspaceRef.current.options.gridOptions) {
      const gridColour = theme === 'dark' ? '#334155' : '#E6CA85';
      workspaceRef.current.options.gridOptions.colour = gridColour;
      if (workspaceRef.current.grid_) {
        workspaceRef.current.grid_.update(workspaceRef.current.scale);
      }
    }
  }, [theme]);

  return (
    <div className={`relative w-full h-full overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-palette-cream-paper'
    }`}>
      <div ref={blocklyDivRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
