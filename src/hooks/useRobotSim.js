import { useState, useRef, useEffect, useCallback } from 'react';

// Preset Tracks Generator Functions
export const PRESET_TRACKS = [
  { id: 'oval', name: '🔄 Simple Oval Track' },
  { id: 'figure8', name: '♾️ Figure-8 Loop' },
  { id: 'sharp_turns', name: '⚡ Sharp 90° Corner Track' },
  { id: 'scurve', name: '〰️ S-Curve & Slalom' },
  { id: 'custom_grid', name: '🏁 Maze Grid Course' },
  { id: 'destination_challenge', name: '🎯 Manual Target Challenge' }
];

export function useRobotSim() {
  // Canvas Refs
  const trackCanvasRef = useRef(null);
  const robotCanvasRef = useRef(null);

  // Sensor Control State
  const [sensorsEnabled, setSensorsEnabled] = useState(true);

  // Destination Challenge State
  const [destinationReached, setDestinationReached] = useState(false);
  const targetPosRef = useRef({ x: 200, y: 200, radius: 26, active: false });

  // Robot State
  const [robot, setRobot] = useState({
    x: 350,
    y: 250,
    heading: 0, // degrees (0 = right, 90 = down, 180 = left, 270 = up)
    speed: 5,   // default move speed (px per step)
    sensorOffsetForward: 24, // distance in front of bot center
    sensorOffsetLateral: 10, // lateral distance from center line
    leftSensorOn: false,
    rightSensorOn: false,
    leftSensorPos: { x: 0, y: 0 },
    rightSensorPos: { x: 0, y: 0 }
  });

  const robotRef = useRef(robot);

  // Start position for Reset
  const startPosRef = useRef({ x: 350, y: 250, heading: 0 });

  // Tool State
  const [activeTool, setActiveTool] = useState('draw'); // 'draw', 'eraser', 'reposition'
  const [brushSize, setBrushSize] = useState(24);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastDrawPos = useRef(null);

  // Simulation Control State
  const [isRunning, setIsRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1); // 1x to 5x
  const abortControllerRef = useRef(null);

  // Current Track ID
  const [selectedTrack, setSelectedTrack] = useState('oval');

  // Toggle IR Sensors ON/OFF
  const toggleSensors = useCallback(() => {
    setSensorsEnabled(prev => !prev);
  }, []);

  // --- SENSOR DETECTION LOGIC ---
  const checkSensorAt = useCallback((px, py) => {
    if (!sensorsEnabled) return false;

    const canvas = trackCanvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Bounds check
    if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) {
      return false;
    }

    try {
      // Sample 3x3 pixel area average for robust line detection
      const sampleSize = 3;
      const startX = Math.max(0, Math.floor(px - 1));
      const startY = Math.max(0, Math.floor(py - 1));
      const imgData = ctx.getImageData(startX, startY, sampleSize, sampleSize);
      const data = imgData.data;

      let totalBrightness = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // If transparent, consider as background light
        if (alpha < 50) {
          totalBrightness += 255;
        } else {
          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;
        }
        count++;
      }

      const avgBrightness = count > 0 ? totalBrightness / count : 255;
      // Black line threshold: Average RGB < 120
      return avgBrightness < 120;
    } catch (e) {
      return false;
    }
  }, [sensorsEnabled]);

  // Update Left / Right sensor positions & status based on current bot position & heading
  const updateSensors = useCallback((x, y, heading) => {
    const rad = (heading * Math.PI) / 180;
    const fwd = 24;
    const lat = 10;

    // Left sensor calculation (Left of bot direction vector)
    const lx = x + fwd * Math.cos(rad) + lat * Math.sin(rad);
    const ly = y + fwd * Math.sin(rad) - lat * Math.cos(rad);

    // Right sensor calculation (Right of bot direction vector)
    const rx = x + fwd * Math.cos(rad) - lat * Math.sin(rad);
    const ry = y + fwd * Math.sin(rad) + lat * Math.cos(rad);

    const leftOn = sensorsEnabled ? checkSensorAt(lx, ly) : false;
    const rightOn = sensorsEnabled ? checkSensorAt(rx, ry) : false;

    const updated = {
      ...robotRef.current,
      x,
      y,
      heading,
      leftSensorOn: leftOn,
      rightSensorOn: rightOn,
      leftSensorPos: { x: lx, y: ly },
      rightSensorPos: { x: rx, y: ry }
    };

    robotRef.current = updated;
    setRobot(updated);

    // Check Destination Hit
    if (targetPosRef.current.active) {
      const dist = Math.hypot(x - targetPosRef.current.x, y - targetPosRef.current.y);
      if (dist <= targetPosRef.current.radius) {
        setDestinationReached(true);
      }
    }

    return { leftOn, rightOn };
  }, [checkSensorAt, sensorsEnabled]);

  // --- DRAWING & TRACK MANIPULATION ---
  const clearTrack = useCallback(() => {
    const canvas = trackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background subtle grid
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Refresh sensor state
    setRobot(prev => {
      updateSensors(prev.x, prev.y, prev.heading);
      return prev;
    });
  }, [updateSensors]);

  // Draw Preset Tracks
  const loadPresetTrack = useCallback((trackId) => {
    const canvas = trackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    clearTrack();

    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    switch (trackId) {
      case 'oval':
        ctx.beginPath();
        ctx.ellipse(cx, cy, 260, 160, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Set start position on the top of the oval heading right
        startPosRef.current = { x: cx, y: cy - 160, heading: 0 };
        break;

      case 'figure8':
        ctx.beginPath();
        const r = 120;
        // Left loop
        ctx.arc(cx - r, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        // Right loop
        ctx.beginPath();
        ctx.arc(cx + r, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        startPosRef.current = { x: cx - r, y: cy - r, heading: 0 };
        break;

      case 'sharp_turns':
        ctx.beginPath();
        const padding = 100;
        ctx.moveTo(padding, padding);
        ctx.lineTo(w - padding, padding);
        ctx.lineTo(w - padding, h - padding);
        ctx.lineTo(padding, h - padding);
        ctx.closePath();
        ctx.stroke();
        startPosRef.current = { x: padding + 50, y: padding, heading: 0 };
        break;

      case 'scurve':
        ctx.beginPath();
        ctx.moveTo(80, cy);
        ctx.bezierCurveTo(w * 0.3, cy - 220, w * 0.4, cy + 220, w * 0.7, cy - 100);
        ctx.bezierCurveTo(w * 0.85, cy - 250, w - 80, cy, w - 80, cy + 100);
        ctx.stroke();
        startPosRef.current = { x: 80, y: cy, heading: 0 };
        break;

      case 'custom_grid':
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(w - 100, 100);
        ctx.lineTo(w - 100, 260);
        ctx.lineTo(220, 260);
        ctx.lineTo(220, h - 100);
        ctx.lineTo(w - 100, h - 100);
        ctx.stroke();
        startPosRef.current = { x: 100, y: 100, heading: 0 };
        targetPosRef.current = { x: 200, y: 200, radius: 26, active: false };
        break;

      case 'destination_challenge':
        // Dotted guideline path: start (150, 150) -> forward 100 -> (250, 150) -> turn right -> down 50 -> (250, 200) -> turn right -> left 50 -> destination (200, 200)
        ctx.save();
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.lineTo(250, 150);
        ctx.lineTo(250, 200);
        ctx.lineTo(200, 200);
        ctx.stroke();
        ctx.restore();

        startPosRef.current = { x: 150, y: 150, heading: 0 };
        targetPosRef.current = { x: 200, y: 200, radius: 26, active: true };
        setSensorsEnabled(false); // Disable sensors by default for manual navigation challenge
        break;

      default:
        targetPosRef.current = { x: 200, y: 200, radius: 26, active: false };
        break;
    }

    setDestinationReached(false);
    setSelectedTrack(trackId);
    // Reset robot to start position of track
    const sp = startPosRef.current;
    setRobot(prev => ({
      ...prev,
      x: sp.x,
      y: sp.y,
      heading: sp.heading
    }));
    setTimeout(() => updateSensors(sp.x, sp.y, sp.heading), 50);
  }, [clearTrack, updateSensors]);

  // Initial load
  useEffect(() => {
    if (trackCanvasRef.current) {
      loadPresetTrack('oval');
    }
  }, [loadPresetTrack]);

  // Drawing Handlers
  const handleCanvasMouseDown = (e) => {
    const canvas = trackCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (activeTool === 'reposition') {
      // Reposition bot
      setRobot(prev => {
        startPosRef.current = { x, y, heading: prev.heading };
        updateSensors(x, y, prev.heading);
        return { ...prev, x, y };
      });
      return;
    }

    if (activeTool === 'set_destination') {
      targetPosRef.current = { x, y, radius: 26, active: true };
      setDestinationReached(false);
      setRobot(prev => ({ ...prev }));
      return;
    }

    setIsDrawing(true);
    lastDrawPos.current = { x, y };
    drawStroke(x, y);
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = trackCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (activeTool === 'reposition' && e.buttons === 1) {
      setRobot(prev => {
        updateSensors(x, y, prev.heading);
        return { ...prev, x, y };
      });
      return;
    }

    if (activeTool === 'set_destination' && e.buttons === 1) {
      targetPosRef.current = { x, y, radius: 26, active: true };
      setDestinationReached(false);
      setRobot(prev => ({ ...prev }));
      return;
    }

    if (!isDrawing) return;
    drawStroke(x, y);
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
    lastDrawPos.current = null;
  };

  const drawStroke = (x, y) => {
    const canvas = trackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'draw') {
      ctx.strokeStyle = '#000000';
    } else if (activeTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
    }

    ctx.beginPath();
    if (lastDrawPos.current) {
      ctx.moveTo(lastDrawPos.current.x, lastDrawPos.current.y);
    } else {
      ctx.moveTo(x, y);
    }
    ctx.lineTo(x, y);
    ctx.stroke();

    lastDrawPos.current = { x, y };

    // Update sensors live while drawing
    setRobot(prev => {
      updateSensors(prev.x, prev.y, prev.heading);
      return prev;
    });
  };

  // --- RENDER OVERLAY CANVAS (Robot & Sensor Probes) ---
  useEffect(() => {
    const canvas = robotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { x, y, heading, leftSensorOn, rightSensorOn, leftSensorPos, rightSensorPos } = robot;
    const rad = (heading * Math.PI) / 180;

    // 0. Render Target Destination Marker if Active
    if (targetPosRef.current.active) {
      const tx = targetPosRef.current.x;
      const ty = targetPosRef.current.y;
      const tr = targetPosRef.current.radius;

      ctx.save();
      ctx.translate(tx, ty);

      // Target ring
      ctx.beginPath();
      ctx.arc(0, 0, tr, 0, Math.PI * 2);
      ctx.fillStyle = destinationReached ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.2)';
      ctx.fill();
      ctx.strokeStyle = destinationReached ? '#10B981' : '#38BDF8';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      // Checkered center / Bullseye
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = destinationReached ? '#10B981' : '#F59E0B';
      ctx.fill();

      // Label text
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillStyle = destinationReached ? '#34D399' : '#38BDF8';
      ctx.textAlign = 'center';
      ctx.fillText(destinationReached ? '🎯 GOAL!' : '🎯 DESTINATION', 0, tr + 14);

      ctx.restore();
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rad);

    // 1. Draw Start Flag Marker if at start pos
    const isAtStart = Math.abs(x - startPosRef.current.x) < 2 && Math.abs(y - startPosRef.current.y) < 2;
    if (isAtStart) {
      ctx.save();
      ctx.rotate(-rad); // Keep flag upright
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Robot Chassis Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    // 3. Main Chassis Body (Sleek Rounded Hex/Rectangle)
    ctx.fillStyle = '#1E293B'; // Dark slate chassis
    ctx.strokeStyle = '#38BDF8'; // Cyan border glow
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    const bw = 36; // Bot width
    const bh = 28; // Bot height
    ctx.roundRect(-bw/2, -bh/2, bw, bh, 8);
    ctx.fill();
    ctx.shadowColor = 'transparent'; // Reset shadow for details
    ctx.stroke();

    // 4. Side Wheels
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;
    // Top wheel
    ctx.fillRect(-8, -bh/2 - 4, 16, 5);
    ctx.strokeRect(-8, -bh/2 - 4, 16, 5);
    // Bottom wheel
    ctx.fillRect(-8, bh/2 - 1, 16, 5);
    ctx.strokeRect(-8, bh/2 - 1, 16, 5);

    // 5. Direction Arrow & Center Hub
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(2, -6);
    ctx.lineTo(2, 6);
    ctx.closePath();
    ctx.fill();

    // Center LED Status
    ctx.fillStyle = isRunning ? '#10B981' : '#F59E0B';
    ctx.beginPath();
    ctx.arc(-6, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // 6. Sensor Support Arms (Front Probes Bracket)
    ctx.strokeStyle = sensorsEnabled ? '#475569' : '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Arm to Left Probe
    ctx.moveTo(bw/2, -6);
    ctx.lineTo(24, -10);
    // Arm to Right Probe
    ctx.moveTo(bw/2, 6);
    ctx.lineTo(24, 10);
    ctx.stroke();

    ctx.restore(); // Restore unrotated context for absolute probe rendering

    // 7. Render Sensor Probe LEDs in Absolute Canvas Coordinates
    const drawProbeLED = (pos, isOn, label) => {
      ctx.save();
      ctx.translate(pos.x, pos.y);

      if (!sensorsEnabled) {
        // Disabled Muted Sensors
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      } else {
        // Active IR Sensors
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fillStyle = isOn ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.2)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = isOn ? '#10B981' : '#EF4444';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    };

    drawProbeLED(leftSensorPos, leftSensorOn, 'L');
    drawProbeLED(rightSensorPos, rightSensorOn, 'R');

  }, [robot, isRunning, sensorsEnabled, destinationReached]);

  // Reset Robot to Start Position
  const resetToStart = useCallback(() => {
    const sp = startPosRef.current;
    setDestinationReached(false);
    setRobot(prev => ({
      ...prev,
      x: sp.x,
      y: sp.y,
      heading: sp.heading
    }));
    updateSensors(sp.x, sp.y, sp.heading);
  }, [updateSensors]);

  // --- ASYNC EXECUTION ENGINE CONTROLLER ---
  const stopSimulation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRunning(false);
  }, []);

  const createRobotAPI = useCallback(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    return {
      shouldContinue: () => !controller.signal.aborted,
      
      sleep: (ms) => {
        return new Promise((resolve, reject) => {
          if (controller.signal.aborted) {
            return reject(new Error('STOPPED'));
          }
          const adjustedTime = Math.max(5, ms / simSpeed);
          const timer = setTimeout(() => resolve(), adjustedTime);

          controller.signal.addEventListener('abort', () => {
            clearTimeout(timer);
            reject(new Error('STOPPED'));
          });
        });
      },

      setSpeed: (sp) => {
        const updated = { ...robotRef.current, speed: sp };
        robotRef.current = updated;
        setRobot(updated);
      },

      moveForward: async (steps) => {
        if (controller.signal.aborted) throw new Error('STOPPED');

        const microSteps = Math.max(1, Math.ceil(steps / 2));
        const stepDist = steps / microSteps;

        for (let i = 0; i < microSteps; i++) {
          if (controller.signal.aborted) throw new Error('STOPPED');

          const current = robotRef.current;
          const rad = (current.heading * Math.PI) / 180;
          const nx = current.x + Math.cos(rad) * stepDist;
          const ny = current.y + Math.sin(rad) * stepDist;

          const clampedX = Math.max(20, Math.min(680, nx));
          const clampedY = Math.max(20, Math.min(480, ny));

          updateSensors(clampedX, clampedY, current.heading);

          await new Promise(r => setTimeout(r, Math.max(4, 15 / simSpeed)));
        }
      },

      turnLeft: async (deg) => {
        if (controller.signal.aborted) throw new Error('STOPPED');
        const current = robotRef.current;
        const newHeading = (current.heading - deg + 360) % 360;
        updateSensors(current.x, current.y, newHeading);
        await new Promise(r => setTimeout(r, Math.max(4, 15 / simSpeed)));
      },

      turnRight: async (deg) => {
        if (controller.signal.aborted) throw new Error('STOPPED');
        const current = robotRef.current;
        const newHeading = (current.heading + deg) % 360;
        updateSensors(current.x, current.y, newHeading);
        await new Promise(r => setTimeout(r, Math.max(4, 15 / simSpeed)));
      },

      isSensorOnLine: (type) => {
        if (!sensorsEnabled) return false;

        const currentBot = robotRef.current;
        const rad = (currentBot.heading * Math.PI) / 180;
        const fwd = 24;
        const lat = 10;

        let px, py;
        if (type === 'left') {
          px = currentBot.x + fwd * Math.cos(rad) + lat * Math.sin(rad);
          py = currentBot.y + fwd * Math.sin(rad) - lat * Math.cos(rad);
        } else {
          px = currentBot.x + fwd * Math.cos(rad) - lat * Math.sin(rad);
          py = currentBot.y + fwd * Math.sin(rad) + lat * Math.cos(rad);
        }
        return checkSensorAt(px, py);
      }
    };
  }, [simSpeed, updateSensors, checkSensorAt, sensorsEnabled]);

  return {
    trackCanvasRef,
    robotCanvasRef,
    robot,
    sensorsEnabled,
    setSensorsEnabled,
    toggleSensors,
    destinationReached,
    setDestinationReached,
    activeTool,
    setActiveTool,
    brushSize,
    setBrushSize,
    clearTrack,
    loadPresetTrack,
    selectedTrack,
    PRESET_TRACKS,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    resetToStart,
    isRunning,
    setIsRunning,
    stopSimulation,
    createRobotAPI,
    simSpeed,
    setSimSpeed
  };
}
