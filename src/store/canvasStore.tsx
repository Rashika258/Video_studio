import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CanvasElement, ConnectorWire, ProjectState, KeyframeData, BehaviorType } from '../types/element';
import { generateSceneFromPrompt } from '../utils/aiGenerator';
import confetti from 'canvas-confetti';

interface CanvasContextType {
  elements: CanvasElement[];
  wires: ConnectorWire[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedElement: CanvasElement | null;
  
  // Timeline & Playback
  currentTime: number;
  isPlaying: boolean;
  isRecordingKeyframes: boolean;
  setIsRecordingKeyframes: (val: boolean) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  project: ProjectState;
  updateProject: (updates: Partial<ProjectState>) => void;
  
  // Tool
  activeTool: 'select' | 'shape' | 'text' | 'card' | 'wire' | 'pen';
  setActiveTool: (tool: 'select' | 'shape' | 'text' | 'card' | 'wire' | 'pen') => void;
  
  // CRUD
  addElement: (type: CanvasElement['type'], extra?: Partial<CanvasElement>) => string;
  updateElement: (id: string, updates: Partial<CanvasElement>, record?: boolean) => void;
  deleteElement: (id: string) => void;
  addWire: (fromId: string, toId: string) => void;
  deleteWire: (wireId: string) => void;
  
  // Keyframes
  addKeyframeAtCurrentTime: (elementId: string) => void;
  deleteKeyframe: (elementId: string, time: number) => void;
  
  // Generative & Presets
  loadTemplate: (template: { elements: CanvasElement[]; wires: ConnectorWire[]; duration: number; name: string }) => void;
  generateFromPrompt: (prompt: string) => void;
  clearCanvas: () => void;
  
  // Export modal
  isExportOpen: boolean;
  setIsExportOpen: (open: boolean) => void;
}

const defaultProject: ProjectState = {
  title: 'Untitled Animation',
  duration: 15,
  fps: 60,
  width: 1920,
  height: 1080,
  backgroundColor: '#090D16',
  camera: {
    x: 0,
    y: 0,
    zoom: 1,
    tilt3D: false,
  },
};

const initialSampleElements: CanvasElement[] = [
  {
    id: 'el-1',
    name: 'Server Node',
    type: 'card',
    x: 250,
    y: 200,
    width: 170,
    height: 110,
    rotation: 0,
    scale: 1,
    opacity: 1,
    fill: '#0F172A',
    stroke: '#38BDF8',
    strokeWidth: 2,
    borderRadius: 16,
    glowColor: '#38BDF8',
    glowRadius: 15,
    text: 'API Server',
    textColor: '#FFFFFF',
    behavior: 'none',
    keyframes: [
      { time: 0, x: 250, y: 200, scale: 1 },
      { time: 3, x: 250, y: 160, scale: 1.1, glowRadius: 28 },
      { time: 6, x: 250, y: 200, scale: 1, glowRadius: 15 },
    ],
  },
  {
    id: 'el-2',
    name: 'Database',
    type: 'card',
    x: 650,
    y: 200,
    width: 170,
    height: 110,
    rotation: 0,
    scale: 1,
    opacity: 1,
    fill: '#0F172A',
    stroke: '#10B981',
    strokeWidth: 2,
    borderRadius: 16,
    glowColor: '#10B981',
    glowRadius: 15,
    text: 'Database Engine',
    textColor: '#FFFFFF',
    behavior: 'none',
    keyframes: [
      { time: 0, x: 650, y: 200 },
      { time: 4, stroke: '#EF4444', glowColor: '#EF4444', glowRadius: 30, text: 'CRASH 504' },
      { time: 8, stroke: '#10B981', glowColor: '#10B981', glowRadius: 15, text: 'RECOVERED' },
    ],
  },
];

const initialWires: ConnectorWire[] = [
  {
    id: 'w-1',
    fromId: 'el-1',
    toId: 'el-2',
    color: '#38BDF8',
    particleShape: 'pill',
    particleColor: '#38BDF8',
    speed: 1.8,
    particleCount: 4,
    label: 'Query Stream',
  },
];

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<CanvasElement[]>(initialSampleElements);
  const [wires, setWires] = useState<ConnectorWire[]>(initialWires);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecordingKeyframes, setIsRecordingKeyframes] = useState<boolean>(true);
  const [project, setProject] = useState<ProjectState>(defaultProject);
  const [activeTool, setActiveTool] = useState<'select' | 'shape' | 'text' | 'card' | 'wire' | 'pen'>('select');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // 60 FPS playback loop
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const loop = (now: number) => {
        const deltaSec = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + deltaSec;
          if (next >= project.duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, project.duration]);

  const togglePlay = () => setIsPlaying((p) => !p);

  const seek = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(project.duration, time)));
  };

  const updateProject = (updates: Partial<ProjectState>) => {
    setProject((prev) => ({ ...prev, ...updates }));
  };

  const addElement = (type: CanvasElement['type'], extra: Partial<CanvasElement> = {}): string => {
    const id = `el-${Date.now()}`;
    const newElement: CanvasElement = {
      id,
      name: extra.name || `${type.toUpperCase()} Object`,
      type,
      x: extra.x !== undefined ? extra.x : 400 + Math.random() * 80,
      y: extra.y !== undefined ? extra.y : 250 + Math.random() * 60,
      width: extra.width || (type === 'text' ? 220 : type === 'shape' ? 120 : 180),
      height: extra.height || (type === 'text' ? 50 : type === 'shape' ? 120 : 110),
      rotation: 0,
      scale: 1,
      opacity: 1,
      shape: extra.shape || 'rectangle',
      fill: extra.fill || (type === 'text' ? 'transparent' : '#1E293B'),
      stroke: extra.stroke || '#6366F1',
      strokeWidth: extra.strokeWidth !== undefined ? extra.strokeWidth : 2,
      borderRadius: extra.borderRadius !== undefined ? extra.borderRadius : 16,
      glowColor: extra.glowColor || '#6366F1',
      glowRadius: extra.glowRadius !== undefined ? extra.glowRadius : 15,
      text: extra.text || (type === 'text' ? 'Double click to edit text' : 'New Component'),
      textColor: extra.textColor || '#FFFFFF',
      fontSize: extra.fontSize || 16,
      fontFamily: extra.fontFamily || 'Inter',
      behavior: extra.behavior || 'none',
      keyframes: [],
      ...extra,
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedId(id);
    return id;
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>, record = isRecordingKeyframes) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== id) return el;

        let updatedKeyframes = [...el.keyframes];

        // If recording mode is enabled and current time > 0, automatically record a keyframe
        if (record && currentTime > 0) {
          const existingIndex = updatedKeyframes.findIndex((k) => Math.abs(k.time - currentTime) < 0.1);
          const keyframeUpdate: KeyframeData = {
            time: Math.round(currentTime * 10) / 10,
            x: updates.x !== undefined ? updates.x : el.x,
            y: updates.y !== undefined ? updates.y : el.y,
            width: updates.width !== undefined ? updates.width : el.width,
            height: updates.height !== undefined ? updates.height : el.height,
            rotation: updates.rotation !== undefined ? updates.rotation : el.rotation,
            scale: updates.scale !== undefined ? updates.scale : el.scale,
            opacity: updates.opacity !== undefined ? updates.opacity : el.opacity,
            fill: updates.fill || el.fill,
            stroke: updates.stroke || el.stroke,
            glowColor: updates.glowColor || el.glowColor,
            glowRadius: updates.glowRadius !== undefined ? updates.glowRadius : el.glowRadius,
            text: updates.text || el.text,
          };

          if (existingIndex >= 0) {
            updatedKeyframes[existingIndex] = { ...updatedKeyframes[existingIndex], ...keyframeUpdate };
          } else {
            updatedKeyframes.push(keyframeUpdate);
            updatedKeyframes.sort((a, b) => a.time - b.time);
          }
        }

        return {
          ...el,
          ...updates,
          keyframes: updatedKeyframes,
        };
      })
    );
  };

  const deleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setWires((prev) => prev.filter((w) => w.fromId !== id && w.toId !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const addWire = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const newWire: ConnectorWire = {
      id: `w-${Date.now()}`,
      fromId,
      toId,
      color: '#38BDF8',
      particleShape: 'pill',
      particleColor: '#38BDF8',
      speed: 1.8,
      particleCount: 4,
      label: 'Flow',
    };
    setWires((prev) => [...prev, newWire]);
  };

  const deleteWire = (wireId: string) => {
    setWires((prev) => prev.filter((w) => w.id !== wireId));
  };

  const addKeyframeAtCurrentTime = (elementId: string) => {
    const el = elements.find((e) => e.id === elementId);
    if (!el) return;

    const newKf: KeyframeData = {
      time: Math.round(currentTime * 10) / 10,
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height,
      rotation: el.rotation,
      scale: el.scale,
      opacity: el.opacity,
      fill: el.fill,
      stroke: el.stroke,
      glowColor: el.glowColor,
      glowRadius: el.glowRadius,
      text: el.text,
      easing: 'easeInOut',
    };

    setElements((prev) =>
      prev.map((e) => {
        if (e.id !== elementId) return e;
        const filtered = e.keyframes.filter((k) => Math.abs(k.time - newKf.time) > 0.05);
        return {
          ...e,
          keyframes: [...filtered, newKf].sort((a, b) => a.time - b.time),
        };
      })
    );
  };

  const deleteKeyframe = (elementId: string, time: number) => {
    setElements((prev) =>
      prev.map((e) => {
        if (e.id !== elementId) return e;
        return {
          ...e,
          keyframes: e.keyframes.filter((k) => Math.abs(k.time - time) > 0.05),
        };
      })
    );
  };

  const loadTemplate = (tmpl: { elements: CanvasElement[]; wires: ConnectorWire[]; duration: number; name: string }) => {
    setElements(tmpl.elements);
    setWires(tmpl.wires);
    setProject((prev) => ({ ...prev, title: tmpl.name, duration: tmpl.duration }));
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const generateFromPrompt = (prompt: string) => {
    const res = generateSceneFromPrompt(prompt);
    setElements(res.elements);
    setWires(res.wires);
    setProject((p) => ({ ...p, title: res.title, duration: res.duration }));
    setCurrentTime(0);
    setIsPlaying(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
  };

  const clearCanvas = () => {
    setElements([]);
    setWires([]);
    setSelectedId(null);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <CanvasContext.Provider
      value={{
        elements,
        wires,
        selectedId,
        setSelectedId,
        selectedElement,
        currentTime,
        isPlaying,
        isRecordingKeyframes,
        setIsRecordingKeyframes,
        togglePlay,
        seek,
        project,
        updateProject,
        activeTool,
        setActiveTool,
        addElement,
        updateElement,
        deleteElement,
        addWire,
        deleteWire,
        addKeyframeAtCurrentTime,
        deleteKeyframe,
        loadTemplate,
        generateFromPrompt,
        clearCanvas,
        isExportOpen,
        setIsExportOpen,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) throw new Error('useCanvas must be used within CanvasProvider');
  return context;
};
