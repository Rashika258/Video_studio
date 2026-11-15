import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  StudioProject,
  StudioScene,
  StudioElement,
  StudioPipe,
  ElementType,
  ElementStatus,
  BackgroundTheme,
  SceneTransition,
  SceneHeadline,
  CustomBlockPreset,
  ImageMotionEffect,
  ImageFrameStyle,
} from '../types/videoStudio';
import { IAM_ECOSYSTEM_PROJECT, ALL_TEMPLATES } from '../data/studioTemplates';
import { generateStudioProjectFromScript, VideoStylePreset } from '../utils/studioGenerator';
import { sfx } from '../utils/sfx';
import { voiceover } from '../utils/voiceover';

export interface ImageStoryboardSlide {
  id: string;
  src: string;
  title: string;
  subtitle?: string;
  narration: string;
  duration: number;
  motionEffect: ImageMotionEffect;
  frameStyle: ImageFrameStyle;
  fitMode: 'cover' | 'contain';
  transition: SceneTransition;
  accentColor?: string;
}

interface StudioContextType {
  project: StudioProject;
  activeSceneIndex: number;
  activeScene: StudioScene;
  activeElementId: string | null;
  isPlaying: boolean;
  currentSpokenWord: string;
  playbackProgress: number; // 0 to 1 for current scene
  isExportModalOpen: boolean;
  isScriptModalOpen: boolean;
  isCustomBuilderOpen: boolean;
  isImageAnimatorOpen: boolean;
  isSidebarOpen: boolean;
  snapToGrid: boolean;
  isConnectMode: boolean;
  connectFromId: string | null;
  savedCustomBlocks: CustomBlockPreset[];

  // Project, Workspace & Modals
  setIsExportModalOpen: (open: boolean) => void;
  setIsScriptModalOpen: (open: boolean) => void;
  setIsCustomBuilderOpen: (open: boolean) => void;
  setIsImageAnimatorOpen: (open: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
  setSnapToGrid: (snap: boolean) => void;
  setIsConnectMode: (active: boolean) => void;
  setConnectFromId: (id: string | null) => void;
  updateProjectTitle: (title: string) => void;
  setAspectRatio: (ratio: '16:9' | '9:16') => void;
  toggleVoiceEnabled: () => void;
  toggleSfxEnabled: () => void;
  setVoiceRate: (rate: number) => void;
  generateFromScript: (
    prompt: string,
    style?: VideoStylePreset | 'auto',
    options?: { sceneDurationSec?: number; targetScenes?: number | 'auto' }
  ) => void;
  scrubSceneProgress: (progress: number) => void;
  isScrubbing: boolean;
  setIsScrubbing: (scrubbing: boolean) => void;

  // Playback & Navigation
  setActiveSceneIndex: (index: number) => void;
  setActiveElementId: (id: string | null) => void;
  togglePlay: () => void;
  playFromStart: () => void;
  stopPlayback: () => void;
  loadTemplate: (templateId: string) => void;
  createBlankProject: () => void;
  importProjectJson: (jsonText: string) => boolean;

  // Element, Image & Custom Block Actions
  addElement: (type: ElementType) => void;
  addImageElement: (opts: {
    src: string;
    title?: string;
    subtitle?: string;
    motionEffect?: ImageMotionEffect;
    frameStyle?: ImageFrameStyle;
    fitMode?: 'cover' | 'contain';
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    accentColor?: string;
  }) => void;
  createVideoFromImages: (slides: ImageStoryboardSlide[], projectTitle?: string) => void;
  addCustomElement: (preset: Omit<CustomBlockPreset, 'id'> & { x?: number; y?: number; entranceBeat?: number }) => void;
  saveCustomBlock: (preset: Omit<CustomBlockPreset, 'id'>) => void;
  deleteCustomBlock: (id: string) => void;
  updateElement: (id: string, updates: Partial<StudioElement>) => void;
  removeElement: (id: string) => void;
  setElementStatus: (id: string, status: ElementStatus) => void;

  // Pipe Actions
  addPipe: (fromId: string, toId: string) => void;
  updatePipe: (id: string, updates: Partial<StudioPipe>) => void;
  removePipe: (id: string) => void;

  // Scene Actions
  updateSceneTitle: (title: string) => void;
  updateSceneNarration: (narration: string) => void;
  updateSceneDuration: (duration: number) => void;
  updateSceneCamera: (
    zoom: number,
    focus: string,
    panX?: number,
    panY?: number,
    startZoom?: number,
    startPanX?: number,
    startPanY?: number
  ) => void;
  updateSceneHUD: (hud: Partial<StudioScene['hud']>) => void;
  updateSceneBackground: (bg: Partial<StudioScene['background']>) => void;
  updateSceneHeadline: (headline: SceneHeadline | undefined) => void;
  updateSceneTransition: (transition: SceneTransition) => void;
  addScene: () => void;
  duplicateScene: (index: number) => void;
  deleteScene: (index: number) => void;
  reorderScene: (fromIndex: number, toIndex: number) => void;
}

const StudioContext = createContext<StudioContextType | null>(null);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<StudioProject>(IAM_ECOSYSTEM_PROJECT);
  const [activeSceneIndex, setActiveSceneIndexState] = useState<number>(0);
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSpokenWord, setCurrentSpokenWord] = useState<string>('');
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState<boolean>(false);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState<boolean>(false);
  const [isImageAnimatorOpen, setIsImageAnimatorOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [isConnectMode, setIsConnectMode] = useState<boolean>(false);
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [savedCustomBlocks, setSavedCustomBlocks] = useState<CustomBlockPreset[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem('archmotion_custom_blocks_v1');
      return raw ? (JSON.parse(raw) as CustomBlockPreset[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('archmotion_custom_blocks_v1', JSON.stringify(savedCustomBlocks));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedCustomBlocks]);

  const activeScene = project.scenes[activeSceneIndex] || project.scenes[0];
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const projectRef = useRef<StudioProject>(project);

  useEffect(() => {
    projectRef.current = project;
    sfx.setEnabled(project.audio.sfxEnabled);
  }, [project]);

  const stopPlayback = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    voiceover.stop();
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  };

  const playCurrentScene = (sceneIdx: number) => {
    const currentProj = projectRef.current;
    const scene = currentProj.scenes[sceneIdx];
    if (!scene) {
      stopPlayback();
      return;
    }

    startTimeRef.current = Date.now();
    const durationMs = scene.duration * 1000;

    if (currentProj.audio.voiceEnabled && scene.narration) {
      voiceover.speak(scene.narration, {
        rate: currentProj.audio.voiceRate,
        pitch: currentProj.audio.voicePitch,
        onWord: (word) => setCurrentSpokenWord(word),
      });
    } else {
      setCurrentSpokenWord('');
    }

    const hasCrash = scene.elements.some((e) => e.status === 'crashed');
    if (hasCrash) {
      setTimeout(() => {
        if (isPlayingRef.current) sfx.playErrorAlarm();
      }, 350);
    } else {
      sfx.playServerBeep();
    }

    if (timerRef.current) cancelAnimationFrame(timerRef.current);

    const updateFrame = () => {
      if (!isPlayingRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const prog = Math.min(1, elapsed / durationMs);
      setPlaybackProgress(prog);

      if (prog < 1) {
        timerRef.current = requestAnimationFrame(updateFrame);
      } else {
        const latestProj = projectRef.current;
        if (sceneIdx < latestProj.scenes.length - 1) {
          const nextIdx = sceneIdx + 1;
          setActiveSceneIndexState(nextIdx);
          setActiveElementId(null);
          setPlaybackProgress(0);
          setCurrentSpokenWord('');
          sfx.playWhoosh();
          playCurrentScene(nextIdx);
        } else {
          isPlayingRef.current = false;
          setIsPlaying(false);
          setPlaybackProgress(1);
          voiceover.stop();
        }
      }
    };

    timerRef.current = requestAnimationFrame(updateFrame);
  };

  const setActiveSceneIndex = (index: number) => {
    const safeIndex = Math.max(0, Math.min(index, projectRef.current.scenes.length - 1));
    setIsScrubbing(false);
    setActiveSceneIndexState(safeIndex);
    setActiveElementId(null);
    setPlaybackProgress(0);
    setCurrentSpokenWord('');
    sfx.playWhoosh();

    if (isPlayingRef.current) {
      playCurrentScene(safeIndex);
    }
  };

  const togglePlay = () => {
    if (isPlayingRef.current) {
      stopPlayback();
    } else {
      setIsScrubbing(false);
      isPlayingRef.current = true;
      setIsPlaying(true);
      playCurrentScene(activeSceneIndex);
    }
  };

  const playFromStart = () => {
    setIsScrubbing(false);
    setActiveSceneIndexState(0);
    setActiveElementId(null);
    setPlaybackProgress(0);
    setCurrentSpokenWord('');
    isPlayingRef.current = true;
    setIsPlaying(true);
    sfx.playWhoosh();
    playCurrentScene(0);
  };

  const loadTemplate = (templateId: string) => {
    const found = ALL_TEMPLATES.find((t) => t.id === templateId);
    if (found) {
      stopPlayback();
      setIsScrubbing(false);
      const cloned = JSON.parse(JSON.stringify(found.project)) as StudioProject;
      projectRef.current = cloned;
      setProject(cloned);
      setActiveSceneIndexState(0);
      setActiveElementId(null);
      setPlaybackProgress(0);
      sfx.playSuccess();
    }
  };

  const importProjectJson = (jsonText: string): boolean => {
    try {
      const parsed = JSON.parse(jsonText) as StudioProject;
      if (!parsed || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
        return false;
      }
      stopPlayback();
      setIsScrubbing(false);
      projectRef.current = parsed;
      setProject(parsed);
      setActiveSceneIndexState(0);
      setActiveElementId(null);
      setPlaybackProgress(0);
      sfx.playSuccess();
      return true;
    } catch {
      return false;
    }
  };

  const createBlankProject = () => {
    stopPlayback();
    setIsScrubbing(false);
    const blank: StudioProject = {
      title: 'Untitled Video Project',
      aspectRatio: project.aspectRatio,
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
          narration: 'Type your voiceover script here. The studio will speak it aloud and generate synced subtitles.',
          headline: {
            text: 'YOUR HOOK HEADLINE',
            subtext: 'Edit scene headline & add animated components',
            color: '#06B6D4',
          },
          transition: 'fade',
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
              y: 54,
              width: 240,
              height: 150,
              status: 'normal',
              entranceBeat: 0,
            },
          ],
          pipes: [],
        },
      ],
    };
    projectRef.current = blank;
    setProject(blank);
    setActiveSceneIndexState(0);
    setActiveElementId(null);
    setPlaybackProgress(0);
  };

  const updateProjectTitle = (title: string) => {
    setProject((prev) => ({ ...prev, title }));
  };

  const setAspectRatio = (aspectRatio: '16:9' | '9:16') => {
    setProject((prev) => ({ ...prev, aspectRatio }));
  };

  const toggleVoiceEnabled = () => {
    setProject((prev) => {
      const nextVoice = !prev.audio.voiceEnabled;
      if (!nextVoice) voiceover.stop();
      return { ...prev, audio: { ...prev.audio, voiceEnabled: nextVoice } };
    });
  };

  const toggleSfxEnabled = () => {
    setProject((prev) => ({
      ...prev,
      audio: { ...prev.audio, sfxEnabled: !prev.audio.sfxEnabled },
    }));
  };

  const setVoiceRate = (voiceRate: number) => {
    setProject((prev) => ({
      ...prev,
      audio: { ...prev.audio, voiceRate },
    }));
  };

  const scrubSceneProgress = (progress: number) => {
    if (isPlayingRef.current) stopPlayback();
    setIsScrubbing(true);
    setPlaybackProgress(Math.max(0, Math.min(1, progress)));
  };

  const generateFromScript = (
    prompt: string,
    style: VideoStylePreset | 'auto' = 'auto',
    genOptions?: { sceneDurationSec?: number; targetScenes?: number | 'auto' }
  ) => {
    stopPlayback();
    setIsScrubbing(false);
    const generated = generateStudioProjectFromScript({
      prompt,
      style,
      aspectRatio: project.aspectRatio,
      sceneDurationSec: genOptions?.sceneDurationSec,
      targetScenes: genOptions?.targetScenes,
    });
    projectRef.current = generated;
    setProject(generated);
    setActiveSceneIndexState(0);
    setActiveElementId(null);
    setPlaybackProgress(0);
    setIsScriptModalOpen(false);
    sfx.playSuccess();
    setTimeout(() => {
      isPlayingRef.current = true;
      setIsPlaying(true);
      playCurrentScene(0);
    }, 150);
  };

  const addElement = (type: ElementType) => {
    const newEl: StudioElement = {
      id: `el-${Date.now()}`,
      type,
      title: type
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' '),
      subtitle: 'Configured component',
      x: 32 + Math.random() * 36,
      y: 38 + Math.random() * 28,
      width:
        type === 'image-frame'
          ? 340
          : type.includes('tree') || type.includes('chart') || type.includes('brain') || type.includes('desk')
          ? 280
          : 220,
      height: type === 'image-frame' ? 210 : 150,
      status: 'normal',
      animation: 'none',
      entranceBeat: 0,
      customProps:
        type === 'custom-card'
          ? {
              icon: 'Sparkles',
              accentColor: '#38BDF8',
              badgeText: 'CUSTOM',
              layoutMode: 'gauge',
              gaugeValue: 82,
              gaugeLabel: 'Throughput',
              rows: ['Region: global-edge', 'Latency: 4.2ms'],
            }
          : type === 'image-frame'
          ? {
              src: '',
              motionEffect: 'ken-burns-in',
              frameStyle: 'glass-card',
              fitMode: 'cover',
              intensity: 1.0,
              accentColor: '#38BDF8',
              badgeText: 'IMAGE',
            }
          : undefined,
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

  const addImageElement = (opts: {
    src: string;
    title?: string;
    subtitle?: string;
    motionEffect?: ImageMotionEffect;
    frameStyle?: ImageFrameStyle;
    fitMode?: 'cover' | 'contain';
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    accentColor?: string;
  }) => {
    const newEl: StudioElement = {
      id: `el-img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'image-frame',
      title: opts.title || 'Animated Image',
      subtitle: opts.subtitle || '',
      x: opts.x ?? 50,
      y: opts.y ?? 52,
      width: opts.width ?? 360,
      height: opts.height ?? 225,
      status: 'active',
      animation: opts.motionEffect === 'float-3d' ? 'float' : 'none',
      entranceBeat: 0,
      customProps: {
        src: opts.src,
        motionEffect: opts.motionEffect || 'ken-burns-in',
        frameStyle: opts.frameStyle || 'glass-card',
        fitMode: opts.fitMode || 'cover',
        intensity: 1.0,
        accentColor: opts.accentColor || '#38BDF8',
        badgeText: 'MEDIA',
      },
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
    sfx.playSuccess();
  };

  const createVideoFromImages = (slides: ImageStoryboardSlide[], projectTitle?: string) => {
    if (!slides || slides.length === 0) return;
    stopPlayback();
    setIsScrubbing(false);

    const isVertical = project.aspectRatio === '9:16';
    const stageW = isVertical ? 340 : 660;
    const stageH = isVertical ? 440 : 372;

    const generatedScenes: StudioScene[] = slides.map((slide, idx) => {
      const accent = slide.accentColor || (idx % 2 === 0 ? '#06B6D4' : '#6366F1');
      const isFullBleed = slide.frameStyle === 'full-bleed';
      const camZoomEnd =
        slide.motionEffect === 'ken-burns-in'
          ? 1.08
          : slide.motionEffect === 'ken-burns-out'
          ? 1.0
          : 1.04;
      const camZoomStart =
        slide.motionEffect === 'ken-burns-out' ? 1.08 : 1.0;

      return {
        id: `scene-img-${Date.now()}-${idx}`,
        title: slide.title || `Slide ${idx + 1}`,
        duration: Math.max(2.0, slide.duration || 4.5),
        narration: slide.narration || '',
        headline: slide.title
          ? {
              text: slide.title,
              subtext: slide.subtitle || '',
              color: '#F8FAFC',
            }
          : undefined,
        transition: slide.transition || 'fade',
        camera: {
          focus: slide.motionEffect === 'pan-right' ? 'pan-right' : slide.motionEffect === 'pan-left' ? 'pan-left' : 'zoom-in',
          zoom: camZoomEnd,
          panX: slide.motionEffect === 'pan-right' ? 2 : slide.motionEffect === 'pan-left' ? -2 : 0,
          panY: 0,
          startZoom: camZoomStart,
          startPanX: slide.motionEffect === 'pan-right' ? -2 : slide.motionEffect === 'pan-left' ? 2 : 0,
          startPanY: 0,
        },
        background: {
          theme: 'deep-space',
          grid: !isFullBleed,
          ambientGlow: accent,
        },
        hud: {
          show: false,
        },
        elements: [
          {
            id: `el-slide-${Date.now()}-${idx}`,
            type: 'image-frame',
            title: slide.title || `Image ${idx + 1}`,
            subtitle: slide.subtitle || '',
            x: 50,
            y: isFullBleed ? 50 : slide.title ? 56 : 50,
            width: isFullBleed ? (isVertical ? 410 : 960) : stageW,
            height: isFullBleed ? (isVertical ? 730 : 540) : stageH,
            status: 'active',
            animation: slide.motionEffect === 'float-3d' ? 'float' : 'none',
            entranceBeat: 0,
            customProps: {
              src: slide.src,
              motionEffect: slide.motionEffect,
              frameStyle: slide.frameStyle,
              fitMode: slide.fitMode,
              intensity: 1.15,
              accentColor: accent,
              badgeText: `0${idx + 1}`,
            },
          },
        ],
        pipes: [],
      };
    });

    const nextProj: StudioProject = {
      ...project,
      title: projectTitle?.trim() || 'Animated Image Showcase',
      scenes: generatedScenes,
    };

    projectRef.current = nextProj;
    setProject(nextProj);
    setActiveSceneIndexState(0);
    setActiveElementId(null);
    setPlaybackProgress(0);
    setIsImageAnimatorOpen(false);
    sfx.playSuccess();

    setTimeout(() => {
      isPlayingRef.current = true;
      setIsPlaying(true);
      playCurrentScene(0);
    }, 150);
  };

  const addCustomElement = (preset: Omit<CustomBlockPreset, 'id'> & { x?: number; y?: number; entranceBeat?: number }) => {
    const newEl: StudioElement = {
      id: `el-custom-${Date.now()}`,
      type: 'custom-card',
      title: preset.title,
      subtitle: preset.subtitle,
      x: preset.x ?? Math.round(34 + Math.random() * 32),
      y: preset.y ?? Math.round(38 + Math.random() * 26),
      width: preset.width || 235,
      height: preset.height || 150,
      status: preset.status || 'active',
      animation: preset.animation || 'none',
      entranceBeat: preset.entranceBeat ?? 0,
      customProps: { ...preset.customProps },
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
    sfx.playSuccess();
  };

  const saveCustomBlock = (preset: Omit<CustomBlockPreset, 'id'>) => {
    const entry: CustomBlockPreset = {
      ...preset,
      id: `cb-${Date.now()}`,
    };
    setSavedCustomBlocks((prev) => [entry, ...prev].slice(0, 24));
  };

  const deleteCustomBlock = (id: string) => {
    setSavedCustomBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const updateElement = (id: string, updates: Partial<StudioElement>) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      const curScene = updatedScenes[activeSceneIndex];
      if (!curScene) return prev;
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
      if (!curScene) return prev;
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
      label: 'Data Flow',
      packetSpeed: 2.5,
      packetColor: '#06B6D4',
      status: 'normal',
    };
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      const curScene = updatedScenes[activeSceneIndex];
      if (!curScene) return prev;
      updatedScenes[activeSceneIndex] = {
        ...curScene,
        pipes: [...curScene.pipes, newPipe],
      };
      return { ...prev, scenes: updatedScenes };
    });
    sfx.playServerBeep(1200);
  };

  const updatePipe = (id: string, updates: Partial<StudioPipe>) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      const curScene = updatedScenes[activeSceneIndex];
      if (!curScene) return prev;
      updatedScenes[activeSceneIndex] = {
        ...curScene,
        pipes: curScene.pipes.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      };
      return { ...prev, scenes: updatedScenes };
    });
  };

  const removePipe = (id: string) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      const curScene = updatedScenes[activeSceneIndex];
      if (!curScene) return prev;
      updatedScenes[activeSceneIndex] = {
        ...curScene,
        pipes: curScene.pipes.filter((p) => p.id !== id),
      };
      return { ...prev, scenes: updatedScenes };
    });
  };

  const updateSceneTitle = (title: string) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        title,
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
        duration: Math.max(1.5, duration),
      };
      return { ...prev, scenes: updatedScenes };
    });
  };

  const updateSceneCamera = (
    zoom: number,
    focus: string,
    panX?: number,
    panY?: number,
    startZoom?: number,
    startPanX?: number,
    startPanY?: number
  ) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      const cur = updatedScenes[activeSceneIndex];
      updatedScenes[activeSceneIndex] = {
        ...cur,
        camera: {
          ...cur.camera,
          zoom,
          focus: focus as any,
          panX: panX !== undefined ? panX : cur.camera.panX,
          panY: panY !== undefined ? panY : cur.camera.panY,
          startZoom: startZoom !== undefined ? startZoom : cur.camera.startZoom,
          startPanX: startPanX !== undefined ? startPanX : cur.camera.startPanX,
          startPanY: startPanY !== undefined ? startPanY : cur.camera.startPanY,
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

  const updateSceneBackground = (bg: Partial<StudioScene['background']>) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        background: { ...updatedScenes[activeSceneIndex].background, ...bg },
      };
      return { ...prev, scenes: updatedScenes };
    });
  };

  const updateSceneHeadline = (headline: SceneHeadline | undefined) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        headline,
      };
      return { ...prev, scenes: updatedScenes };
    });
  };

  const updateSceneTransition = (transition: SceneTransition) => {
    setProject((prev) => {
      const updatedScenes = [...prev.scenes];
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        transition,
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
      headline: {
        text: `SCENE ${project.scenes.length + 1} TITLE`,
        subtext: 'Supporting explanation subtitle',
        color: '#06B6D4',
      },
      transition: 'fade',
      camera: { focus: 'overview', zoom: 1.0, panX: 0, panY: 0 },
      background: { theme: 'dark-blueprint', grid: true, ambientGlow: '#06B6D4' },
      hud: { show: true, rps: 500, latencyMs: 15, cpuPercent: 25, statusText: 'STABLE', statusColor: '#10B981' },
      elements: [],
      pipes: [],
    };
    const nextLength = project.scenes.length;
    setProject((prev) => ({ ...prev, scenes: [...prev.scenes, newScene] }));
    setActiveSceneIndexState(nextLength);
  };

  const duplicateScene = (index: number) => {
    const target = project.scenes[index];
    if (!target) return;
    const cloned = JSON.parse(JSON.stringify(target)) as StudioScene;
    cloned.id = `scene-${Date.now()}`;
    cloned.title = `${target.title} (Copy)`;

    setProject((prev) => {
      const scenes = [...prev.scenes];
      scenes.splice(index + 1, 0, cloned);
      return { ...prev, scenes };
    });
    setActiveSceneIndexState(index + 1);
  };

  const deleteScene = (index: number) => {
    if (project.scenes.length <= 1) return;
    setProject((prev) => {
      const scenes = prev.scenes.filter((_, i) => i !== index);
      return { ...prev, scenes };
    });
    setActiveSceneIndexState(Math.max(0, index - 1));
  };

  const reorderScene = (fromIndex: number, toIndex: number) => {
    setProject((prev) => {
      if (toIndex < 0 || toIndex >= prev.scenes.length || fromIndex === toIndex) return prev;
      const scenes = [...prev.scenes];
      const [moved] = scenes.splice(fromIndex, 1);
      scenes.splice(toIndex, 0, moved);
      return { ...prev, scenes };
    });
    if (activeSceneIndex === fromIndex) {
      setActiveSceneIndexState(toIndex);
    } else if (activeSceneIndex === toIndex) {
      setActiveSceneIndexState(fromIndex);
    }
  };

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
        isExportModalOpen,
        isScriptModalOpen,
        isCustomBuilderOpen,
        isImageAnimatorOpen,
        isSidebarOpen,
        snapToGrid,
        isConnectMode,
        connectFromId,
        savedCustomBlocks,
        setIsExportModalOpen,
        setIsScriptModalOpen,
        setIsCustomBuilderOpen,
        setIsImageAnimatorOpen,
        setIsSidebarOpen,
        setSnapToGrid,
        setIsConnectMode,
        setConnectFromId,
        updateProjectTitle,
        setAspectRatio,
        toggleVoiceEnabled,
        toggleSfxEnabled,
        setVoiceRate,
        generateFromScript,
        scrubSceneProgress,
        isScrubbing,
        setIsScrubbing,
        setActiveSceneIndex,
        setActiveElementId,
        togglePlay,
        playFromStart,
        stopPlayback,
        loadTemplate,
        createBlankProject,
        importProjectJson,
        addElement,
        addImageElement,
        createVideoFromImages,
        addCustomElement,
        saveCustomBlock,
        deleteCustomBlock,
        updateElement,
        removeElement,
        setElementStatus,
        addPipe,
        updatePipe,
        removePipe,
        updateSceneTitle,
        updateSceneNarration,
        updateSceneDuration,
        updateSceneCamera,
        updateSceneHUD,
        updateSceneBackground,
        updateSceneHeadline,
        updateSceneTransition,
        addScene,
        duplicateScene,
        deleteScene,
        reorderScene,
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
