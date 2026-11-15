import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { StoryScene, SceneProp, BackgroundTheme, CharacterPose } from '../types/story';
import { DEFAULT_STORY_SCENES, generateAIStory } from '../data/storyPresets';
import confetti from 'canvas-confetti';

interface StoryContextType {
  scenes: StoryScene[];
  activeSceneIndex: number;
  activeScene: StoryScene;
  selectScene: (index: number) => void;
  addScene: () => void;
  duplicateScene: (index: number) => void;
  deleteScene: (index: number) => void;
  reorderScenes: (from: number, to: number) => void;
  
  // Active Scene Editing
  updateActiveScene: (updates: Partial<StoryScene>) => void;
  setBackground: (bg: BackgroundTheme) => void;
  setCharacterPose: (pose: CharacterPose) => void;
  setCharacterSpeech: (speech: string) => void;
  addProp: (icon: string, name: string, animation?: SceneProp['animation']) => void;
  deleteProp: (id: string) => void;
  updateHeadline: (text: string, subtext?: string, font?: string, color?: string) => void;
  
  // Playback & Animation Loop
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  togglePlay: () => void;
  seek: (time: number) => void;
  
  // Aspect Ratio & Export
  aspectRatio: '16:9' | '9:16';
  setAspectRatio: (ratio: '16:9' | '9:16') => void;
  isExportOpen: boolean;
  setIsExportOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  
  // AI Generator
  generateStory: (prompt: string) => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scenes, setScenes] = useState<StoryScene[]>(DEFAULT_STORY_SCENES);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  const activeScene = scenes[activeSceneIndex] || scenes[0];
  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Seamless Multi-Scene Playback Loop
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const loop = (now: number) => {
        const deltaSec = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + deltaSec;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }

          // Compute which scene is active based on time
          let accumulated = 0;
          for (let i = 0; i < scenes.length; i++) {
            accumulated += scenes[i].duration;
            if (next <= accumulated) {
              setActiveSceneIndex(i);
              break;
            }
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
  }, [isPlaying, totalDuration, scenes]);

  const togglePlay = () => setIsPlaying((p) => !p);

  const seek = (time: number) => {
    const clamped = Math.max(0, Math.min(totalDuration, time));
    setCurrentTime(clamped);

    let accumulated = 0;
    for (let i = 0; i < scenes.length; i++) {
      accumulated += scenes[i].duration;
      if (clamped <= accumulated) {
        setActiveSceneIndex(i);
        break;
      }
    }
  };

  const selectScene = (index: number) => {
    setActiveSceneIndex(index);
    // Snap playhead to start of selected scene
    let startTime = 0;
    for (let i = 0; i < index; i++) {
      startTime += scenes[i].duration;
    }
    setCurrentTime(startTime);
  };

  const addScene = () => {
    const newScene: StoryScene = {
      id: `scene-${Date.now()}`,
      title: `Scene ${scenes.length + 1}`,
      duration: 4,
      background: 'cozy-room',
      character: {
        type: 'creator',
        name: 'Narrator',
        pose: 'talking',
        x: 35,
        y: 45,
        scale: 1,
        speechBubble: 'Here is what happens next!',
      },
      props: [
        { id: `p-${Date.now()}`, name: 'Idea', icon: '💡', x: 70, y: 40, scale: 1.5, animation: 'float' },
      ],
      headline: {
        text: 'NEW SCENE MOMENT',
        subtext: 'Explain your core point simply',
        font: 'Poppins',
        color: '#FFFFFF',
        size: 34,
        x: 50,
        y: 12,
      },
      transition: 'slide',
    };

    setScenes((prev) => [...prev, newScene]);
    setActiveSceneIndex(scenes.length);
  };

  const duplicateScene = (index: number) => {
    const original = scenes[index];
    const copy: StoryScene = {
      ...JSON.parse(JSON.stringify(original)),
      id: `scene-${Date.now()}`,
      title: `${original.title} (Copy)`,
    };
    const next = [...scenes];
    next.splice(index + 1, 0, copy);
    setScenes(next);
    setActiveSceneIndex(index + 1);
  };

  const deleteScene = (index: number) => {
    if (scenes.length <= 1) return; // Keep at least 1 scene
    const next = scenes.filter((_, i) => i !== index);
    setScenes(next);
    setActiveSceneIndex(Math.max(0, index - 1));
  };

  const reorderScenes = (from: number, to: number) => {
    const next = [...scenes];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setScenes(next);
    setActiveSceneIndex(to);
  };

  const updateActiveScene = (updates: Partial<StoryScene>) => {
    setScenes((prev) =>
      prev.map((s, i) => (i === activeSceneIndex ? { ...s, ...updates } : s))
    );
  };

  const setBackground = (bg: BackgroundTheme) => {
    updateActiveScene({ background: bg });
  };

  const setCharacterPose = (pose: CharacterPose) => {
    if (!activeScene.character) return;
    updateActiveScene({
      character: {
        ...activeScene.character,
        pose,
      },
    });
  };

  const setCharacterSpeech = (speechBubble: string) => {
    if (!activeScene.character) return;
    updateActiveScene({
      character: {
        ...activeScene.character,
        speechBubble,
      },
    });
  };

  const addProp = (icon: string, name: string, animation: SceneProp['animation'] = 'float') => {
    const newProp: SceneProp = {
      id: `prop-${Date.now()}`,
      name,
      icon,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 30,
      scale: 1.4,
      animation,
    };
    updateActiveScene({
      props: [...activeScene.props, newProp],
    });
  };

  const deleteProp = (id: string) => {
    updateActiveScene({
      props: activeScene.props.filter((p) => p.id !== id),
    });
  };

  const updateHeadline = (text: string, subtext?: string, font?: string, color?: string) => {
    updateActiveScene({
      headline: {
        ...activeScene.headline,
        text,
        subtext: subtext !== undefined ? subtext : activeScene.headline.subtext,
        font: font || activeScene.headline.font,
        color: color || activeScene.headline.color,
      },
    });
  };

  const generateStory = (prompt: string) => {
    const generated = generateAIStory(prompt);
    setScenes(generated);
    setActiveSceneIndex(0);
    setCurrentTime(0);
    setIsPlaying(true);
    setIsAiModalOpen(false);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  };

  return (
    <StoryContext.Provider
      value={{
        scenes,
        activeSceneIndex,
        activeScene,
        selectScene,
        addScene,
        duplicateScene,
        deleteScene,
        reorderScenes,
        updateActiveScene,
        setBackground,
        setCharacterPose,
        setCharacterSpeech,
        addProp,
        deleteProp,
        updateHeadline,
        isPlaying,
        currentTime,
        totalDuration,
        togglePlay,
        seek,
        aspectRatio,
        setAspectRatio,
        isExportOpen,
        setIsExportOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        generateStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) throw new Error('useStory must be used within StoryProvider');
  return context;
};
