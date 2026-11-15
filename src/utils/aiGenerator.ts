import { CanvasElement, ConnectorWire } from '../types/element';

export interface GenerationResult {
  title: string;
  elements: CanvasElement[];
  wires: ConnectorWire[];
  duration: number;
}

export const generateSceneFromPrompt = (prompt: string): GenerationResult => {
  const p = prompt.toLowerCase();
  const elements: CanvasElement[] = [];
  const wires: ConnectorWire[] = [];
  let duration = 12;

  // 1. Detect if it's about a rocket / launch / space
  if (p.includes('rocket') || p.includes('launch') || p.includes('space')) {
    elements.push({
      id: 'rocket',
      name: 'Spaceship / Rocket',
      type: 'card',
      x: 450,
      y: 400,
      width: 140,
      height: 180,
      rotation: 0,
      scale: 1,
      opacity: 1,
      fill: '#0F172A',
      stroke: '#38BDF8',
      strokeWidth: 2,
      borderRadius: 24,
      glowColor: '#38BDF8',
      glowRadius: 15,
      text: '🚀 STARSHIP',
      textColor: '#FFFFFF',
      icon: 'Rocket',
      behavior: 'shake',
      keyframes: [
        { time: 0, y: 400, scale: 1, glowRadius: 10 },
        { time: 2, y: 390, scale: 1.05, glowRadius: 25 },
        { time: 6, y: -250, scale: 0.6, glowRadius: 40, easing: 'easeIn' },
      ],
    });

    elements.push({
      id: 'exhaust-fire',
      name: 'Thruster Plasma',
      type: 'shape',
      shape: 'circle',
      x: 495,
      y: 590,
      width: 50,
      height: 90,
      rotation: 0,
      scale: 1,
      opacity: 0.9,
      fill: '#F97316',
      stroke: '#EF4444',
      strokeWidth: 2,
      borderRadius: 99,
      glowColor: '#F97316',
      glowRadius: 30,
      behavior: 'pulse',
      keyframes: [
        { time: 0, opacity: 0.3, scale: 0.5 },
        { time: 2, opacity: 1, scale: 1.2 },
        { time: 6, opacity: 0, y: 50 },
      ],
    });

    elements.push({
      id: 'space-station',
      name: 'Orbital Gateway',
      type: 'card',
      x: 750,
      y: 100,
      width: 180,
      height: 100,
      rotation: 0,
      scale: 1,
      opacity: 0.85,
      fill: '#1E1B4B',
      stroke: '#818CF8',
      strokeWidth: 2,
      borderRadius: 16,
      glowColor: '#818CF8',
      glowRadius: 15,
      text: '🛰️ SPACE STATION',
      textColor: '#C7D2FE',
      behavior: 'float',
      keyframes: [],
    });

    wires.push({
      id: 'w-rocket-station',
      fromId: 'rocket',
      toId: 'space-station',
      color: '#38BDF8',
      particleShape: 'spark',
      particleColor: '#38BDF8',
      speed: 2,
      particleCount: 6,
      label: 'Telemetry',
    });
  } 
  // 2. Detect if it's about brain / psychology / neuroscience / health
  else if (p.includes('brain') || p.includes('dopamine') || p.includes('mind') || p.includes('psychology')) {
    elements.push({
      id: 'prefrontal',
      name: 'Prefrontal Cortex',
      type: 'card',
      x: 200,
      y: 220,
      width: 200,
      height: 140,
      rotation: 0,
      scale: 1,
      opacity: 1,
      fill: '#18181B',
      stroke: '#EC4899',
      strokeWidth: 2,
      borderRadius: 20,
      glowColor: '#EC4899',
      glowRadius: 18,
      text: '🧠 Focus & Willpower',
      textColor: '#FFFFFF',
      behavior: 'pulse',
      keyframes: [
        { time: 0, glowRadius: 10 },
        { time: 4, glowRadius: 35, fill: '#831843' },
        { time: 8, glowRadius: 15, fill: '#18181B' },
      ],
    });

    elements.push({
      id: 'striatum',
      name: 'Striatum Reward Center',
      type: 'card',
      x: 650,
      y: 220,
      width: 220,
      height: 140,
      rotation: 0,
      scale: 1,
      opacity: 1,
      fill: '#18181B',
      stroke: '#10B981',
      strokeWidth: 2,
      borderRadius: 20,
      glowColor: '#10B981',
      glowRadius: 18,
      text: '⚡ Dopamine Reward',
      textColor: '#FFFFFF',
      behavior: 'float',
      keyframes: [
        { time: 0, scale: 1 },
        { time: 4, scale: 1.15, stroke: '#34D399', glowRadius: 30, easing: 'spring' },
        { time: 8, scale: 1 },
      ],
    });

    wires.push({
      id: 'w-brain-reward',
      fromId: 'prefrontal',
      toId: 'striatum',
      color: '#EC4899',
      particleShape: 'pill',
      particleColor: '#F472B6',
      speed: 2.2,
      particleCount: 5,
      label: 'Anticipation Loop',
    });
  } 
  // 3. Fallback: Generate intelligent generic diagram based on prompt keywords
  else {
    const words = prompt.split(' ').filter((w) => w.length > 2);
    const nodeCount = Math.min(5, Math.max(3, words.length));

    const colors = ['#38BDF8', '#818CF8', '#34D399', '#F59E0B', '#EC4899'];
    const radius = 220;
    const centerX = 550;
    const centerY = 280;

    // Center Core Node
    elements.push({
      id: 'node-core',
      name: 'Core System',
      type: 'card',
      x: centerX - 90,
      y: centerY - 60,
      width: 180,
      height: 120,
      rotation: 0,
      scale: 1,
      opacity: 1,
      fill: '#0F172A',
      stroke: '#6366F1',
      strokeWidth: 2.5,
      borderRadius: 18,
      glowColor: '#6366F1',
      glowRadius: 20,
      text: words[0]?.toUpperCase() || 'CORE NODE',
      textColor: '#FFFFFF',
      behavior: 'pulse',
      keyframes: [
        { time: 0, scale: 1 },
        { time: 3, scale: 1.1, glowRadius: 35, easing: 'spring' },
        { time: 7, scale: 1, glowRadius: 15 },
      ],
    });

    // Orbiting Satellite Nodes
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius - 75;
      const y = centerY + Math.sin(angle) * radius - 45;
      const color = colors[i % colors.length];
      const word = words[i + 1] || `Component ${i + 1}`;

      const nodeId = `satellite-${i}`;
      elements.push({
        id: nodeId,
        name: word,
        type: 'card',
        x,
        y,
        width: 150,
        height: 90,
        rotation: 0,
        scale: 1,
        opacity: 1,
        fill: '#1E293B',
        stroke: color,
        strokeWidth: 2,
        borderRadius: 14,
        glowColor: color,
        glowRadius: 12,
        text: word.toUpperCase(),
        textColor: '#F8FAFC',
        behavior: 'float',
        keyframes: [
          { time: 0, x, y },
          { time: 2 + i, scale: 1.12, glowRadius: 24, easing: 'spring' },
          { time: 5 + i, scale: 1, glowRadius: 12 },
        ],
      });

      wires.push({
        id: `wire-core-${i}`,
        fromId: 'node-core',
        toId: nodeId,
        color: color,
        particleShape: 'pill',
        particleColor: color,
        speed: 1.5 + (i * 0.3),
        particleCount: 4,
        label: `Flow ${i + 1}`,
      });
    }
  }

  return {
    title: prompt.slice(0, 30),
    elements,
    wires,
    duration,
  };
};
