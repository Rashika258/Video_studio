import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  StudioProject,
  StudioScene,
  StudioElement,
  StudioPipe,
  ElementType,
  ElementStatus,
} from '../types/videoStudio';
import { SERVER_CRASH_PROJECT, ALL_TEMPLATES } from '../data/studioTemplates';
import { sfx } from '../utils/sfx';
import { voiceover } from '../utils/voiceover';

interface StudioContextType {
  project: StudioProject;
  activeSceneIndex: number;
  activeScene: StudioScene;
  activeElementId: string | null;
  isPlaying: boolean;
  currentSpokenWord: string;
  playbackProgress: number; // 0 to 1 for current scene
  isExporting: boolean;
  exportProgress: number; // 0 to 100

  // Actions
  setActiveSceneIndex: (index: number) => void;
  setActiveElementId: (id: string | null) => void;
  togglePlay: () => void;
  loadTemplate: (templateId: string) => void;
  createBlankProject: () => void;
  
  // Element Actions
  addElement: (type: ElementType) => void;
  updateElement: (id: string, updates: Partial<StudioElement>) => void;
  removeElement: (id: string) => void;
  setElementStatus: (id: string, status: ElementStatus) => void;
  
  // Pipe Actions
  addPipe: (fromId: string, toId: string) => void;
  removePipe: (id: string) => void;

  // Scene Actions
  updateSceneNarration: (narration: string) => void;
  updateSceneDuration: (duration: number) => void;
  updateSceneCamera: (zoom: number, focus: string) => void;
  updateSceneHUD: (hud: Partial<StudioScene['hud']>) => void;
  addScene: () => void;
  duplicateScene: (index: number) => void;
  deleteScene: (index: number) => void;

  // Video Export
  startExport: () => void;
}

const StudioContext = createContext<StudioContextType | null>(null);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<StudioProject>(SERVER_CRASH_PROJECT);
  const [activeSceneIndex, setActiveSceneIndexState] = useState<number>(0);
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSpokenWord, setCurrentSpokenWord] = useState<string>('');
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);

  const activeScene = project.scenes[activeSceneIndex] || project.scenes[0];
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const setActiveSceneIndex = (index: number) => {
    const safeIndex = Math.max(0, Math.min(index, project.scenes.length - 1));
    setActiveSceneIndexState(safeIndex);
    setActiveElementId(null);
    setPlaybackProgress(0);
    setCurrentSpokenWord('');
    sfx.playWhoosh();

    if (isPlaying) {
      playCurrentScene(safeIndex);
    }
  };

  const playCurrentScene = (sceneIdx: number) => {
    const scene = project.scenes[sceneIdx];
    if (!scene) {
      setIsPlaying(false);
      return;
    }

    startTimeRef.current = Date.now();
    const durationMs = scene.duration * 1000;

    // Trigger voice narration
    if (project.audio.voiceEnabled && scene.narration) {
      voiceover.speak(scene.narration, {
        rate: project.audio.voiceRate,
        onWord: (word) => setCurrentSpokenWord(word),
      });
    }

    // Play SFX according to scene elements
    const hasCrash = scene.elements.some((e) => e.status === 'crashed');
    if (hasCrash) {
      setTimeout(() => sfx.playErrorAlarm(), 400);
    } else {
      sfx.playServerBeep();
    }

    // Loop progress
    if (timerRef.current) cancelAnimationFrame(timerRef.current);

    const updateFrame = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const prog = Math.min(1, elapsed / durationMs);
      setPlaybackProgress(prog);

      if (prog < 1) {
        timerRef.current = requestAnimationFrame(updateFrame);
      } else {
        // Move to next scene
        if (sceneIdx < project.scenes.length - 1) {
          setActiveSceneIndex(sceneIdx + 1);
        } else {
          setIsPlaying(false);
          setPlaybackProgress(1);
          voiceover.stop();
        }
      }
    };

    timerRef.current = requestAnimationFrame(updateFrame);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      voiceover.stop();
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    } else {
      setIsPlaying(true);
      playCurrentScene(activeSceneIndex);
    }
  };

  const loadTemplate = (templateId: string) => {
    const found = ALL_TEMPLATES.find((t) => t.id === templateId);
    if (found) {
      setIsPlaying(false);
      voiceover.stop();
      setProject(JSON.parse(JSON.stringify(found.project)));
      setActiveSceneIndexState(0);
      setActiveElementId(null);
      setPlaybackProgress(0);
      sfx.playSuccess();
    }
  };

  const createBlankProject = () => {
    setIsPlaying(false);
    voiceover.stop();
    setProject({
      title: 'Untitled Video Project',
      aspectRatio: '16:9',
      fps: 60,
      audio: {
        voiceEnabled: true,
        voiceRate: 1.05,
        voicePitch: 1.0,
        sfxEnabled: true,
        bgmEnabled: false,
      },
      scenes: [
        {
          id: `scene-${Date.now()}`,
          title: 'Scene 1: Introduction',
          duration: 5.0,
          narration: 'Type your voiceover script here. The studio will speak it aloud and generate subtitles.',
          camera: { focus: 'overview', zoom: 1.0, panX: 0, panY: 0 },
          background: { theme: 'dark-blueprint', grid: true, ambientGlow: '#06B6D4' },
          hud: { show: true, rps: 100, latencyMs: 15, cpuPercent: 20, statusText: 'ONLINE', statusColor: '#10B981' },
          elements: [
            {
              id: `el-${Date.now()}`,
              type: 'server-blade',
              title: 'Primary Server',
              subtitle: 'Ready to animate',
              x: 50,
              y: 50,
              width: 240,
              height: 150,
              status: 'normal',
            },
          ],
          pipes: [],
        },
      ],
    });
    setActiveSceneIndexState(0);
    setActiveElementId(null);
  };

  const addElement = (type: ElementType) => {
    const newEl: StudioElement = {
      id: `el-${Date.now()}`,
      type,
      title: type.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      subtitle: 'Configured component',
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      width: type.includes('tree') || type.includes('chart') || type.includes('brain') || type.includes('desk') ? 280 : 220,
      height: 150,
      status: 'normal',
      animation: 'none',
    };

    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        elements: [...updatedScenes[activeSceneIndex].elements, newEl],
      };
      return { ...prev, scenes: updatedScenes };
    });

    setActiveElementId(newEl.id);
    sfx.playKeyboardType();
  };

  const updateElement = (id: string, updates: Partial<StudioElement>) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      const curScene = updatedScenes[activeSceneIndex];
      updatedScenes[activeSceneIndex] = {
        ...curScene,
        elements: curScene.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
      };
      return { ...prev, scenes: updatedScenes };
    });
  };

  const removeElement = (id: string) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      const curScene = updatedScenes[activeSceneIndex];
      updatedScenes[activeSceneIndex] = {
        ...curScene,
        elements: curScene.elements.filter((el) => el.id !== id),
        pipes: curScene.pipes.filter((p) => p.fromId !== id && p.toId !== id),
      };
      return { ...prev, scenes: updatedScenes };
    });
    if (activeElementId === id) setActiveElementId(null);
  };

  const setElementStatus = (id: string, status: ElementStatus) => {
    updateElement(id, { status });
    if (status === 'crashed') sfx.playErrorAlarm();
    else if (status === 'active') sfx.playServerBeep();
  };

  const addPipe = (fromId: string, toId: string) => {
    const newPipe: StudioPipe = {
      id: `pipe-${Date.now()}`,
      fromId,
      toId,
      packetSpeed: 2.5,
      packetColor: '#06B6D4',
      status: 'normal',
    };
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      const curScene = updatedScenes[activeSceneIndex];
      updatedScenes[activeSceneIndex] = {
        ...curScene,
        pipes: [...curScene.pipes, newPipe],
      };
      return { ...prev, scenes: updatedScenes };
    });
    sfx.playServerBeep(1200);
  };

  const removePipe = (id: string) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      const curScene = updatedScenes[activeSceneIndex];
      updatedScenes[activeSceneIndex] = {
        ...curScene,
        pipes: curScene.pipes.filter((p) => p.id !== id),
      };
      return { ...prev, scenes: updatedScenes };
    });
  };

  const updateSceneNarration = (narration: string) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        narration,
      };
      return { ...prev, scenes: updatedScenes };
    });
  };

  const updateSceneDuration = (duration: number) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        duration: Math.max(1, duration),
      };
      return { ...prev, scenes: updatedScenes };
    });
  };

  const updateSceneCamera = (zoom: number, focus: string) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        camera: {
          ...updatedScenes[activeSceneIndex].camera,
          zoom,
          focus: focus as any,
        },
      };
      return { ...prev, scenes: updatedScenes };
    });
  };

  const updateSceneHUD = (hud: Partial<StudioScene['hud']>) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        hud: { ...updatedScenes[activeSceneIndex].hud, ...hud },
      };
      return { ...prev, scenes: updatedScenes };
    });
  };

  const addScene = () => {
    const newScene: StudioScene = {
      id: `scene-${Date.now()}`,
      title: `Scene ${project.scenes.length + 1}`,
      duration: 4.5,
      narration: 'New scene narration script.',
      camera: { focus: 'overview', zoom: 1.0, panX: 0, panY: 0 },
      background: { theme: 'dark-blueprint', grid: true, ambientGlow: '#06B6D4' },
      hud: { show: true, rps: 500, latencyMs: 15, cpuPercent: 25, statusText: 'STABLE', statusColor: '#10B981' },
      elements: [],
      pipes: [],
    };
    setProject((prev) => ({ ...prev, scenes: [...prev.scenes, newScene] }));
    setActiveSceneIndex(project.scenes.length);
  };

  const duplicateScene = (index: number) => {
    const target = project.scenes[index];
    if (!target) return;
    const cloned = JSON.parse(JSON.stringify(target));
    cloned.id = `scene-${Date.now()}`;
    cloned.title = `${target.title} (Copy)`;

    setProject((prev) => {
      const scenes = [...prev.scenes];
      scenes.splice(index + 1, 0, cloned);
      return { ...prev, scenes };
    });
    setActiveSceneIndex(index + 1);
  };

  const deleteScene = (index: number) => {
    if (project.scenes.length <= 1) return;
    setProject((prev) => {
      const scenes = prev.scenes.filter((_, i) => i !== index);
      return { ...prev, scenes };
    });
    setActiveSceneIndex(Math.max(0, index - 1));
  };

  const startExport = () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress / preparation
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setExportProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsExporting(false);
          sfx.playSuccess();
        }, 500);
      }
    }, 120);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      voiceover.stop();
    };
  }, []);

  return (
    <StudioContext.Provider
      value={{
        project,
        activeSceneIndex,
        activeScene,
        activeElementId,
        isPlaying,
        currentSpokenWord,
        playbackProgress,
        isExporting,
        exportProgress,
        setActiveSceneIndex,
        setActiveElementId,
        togglePlay,
        loadTemplate,
        createBlankProject,
        addElement,
        updateElement,
        removeElement,
        setElementStatus,
        addPipe,
        removePipe,
        updateSceneNarration,
        updateSceneDuration,
        updateSceneCamera,
        updateSceneHUD,
        addScene,
        duplicateScene,
        deleteScene,
        startExport,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useVideoStudio = () => {
  const context = useContext(StudioContext);
  if (!context) throw new Error('useVideoStudio must be used within a StudioProvider');
  return context;
};
