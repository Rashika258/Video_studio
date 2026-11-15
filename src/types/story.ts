export type BackgroundTheme = 
  | 'dark-studio'
  | 'server-room'
  | 'terminal-matrix'
  | 'ai-neural'
  | 'cozy-room'
  | 'cyberpunk'
  | 'space'
  | 'office'
  | 'nature';

export type CharacterType = 'creator' | 'engineer' | 'thinker' | 'robot';

export type CharacterPose = 
  | 'talking'
  | 'coding'
  | 'laptop'
  | 'mind-blown'
  | 'server-fire'
  | 'stressed'
  | 'deploying'
  | 'celebrating'
  | 'pointing'
  | 'walking';

export type PropAnimation = 'float' | 'bounce' | 'pulse' | 'heartbeat' | 'spin' | 'shake' | 'orbit' | 'packet-flow';

export interface SceneProp {
  id: string;
  name: string;
  icon: string; // emoji or tech icon
  category?: 'tech' | 'general';
  x: number;
  y: number;
  scale: number;
  animation: PropAnimation;
  label?: string;
  badge?: string;
  badgeColor?: string;
}

export interface StoryScene {
  id: string;
  title: string;
  duration: number; // in seconds (e.g. 4s)
  background: BackgroundTheme;
  
  // Character & Puppet Layer
  character?: {
    type: CharacterType;
    name: string;
    pose: CharacterPose;
    x: number;
    y: number;
    scale: number;
    speechBubble?: string;
  };
  
  // Visual Props / Stickers / Tech Nodes
  props: SceneProp[];
  
  // Headline / Narrative Text
  headline: {
    text: string;
    subtext?: string;
    font: string;
    color: string;
    size: number;
    x: number;
    y: number;
  };
  
  // Scene Transition
  transition: 'fade' | 'slide' | 'zoom' | 'pop';
}

export interface StoryProject {
  title: string;
  aspectRatio: '16:9' | '9:16';
  fps: number;
  scenes: StoryScene[];
}
