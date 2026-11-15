export type ElementType =
  // Tech & Architecture
  | 'server-blade'
  | 'gpu-chip'
  | 'load-balancer'
  | 'database-sql'
  | 'cache-redis'
  | 'kafka-stream'
  | 'client-devices'
  | 'firewall-shield'
  | 'cloud-pod'
  | 'terminal-window'
  // CS & Algorithms
  | 'binary-tree'
  | 'algorithm-array'
  | 'big-o-chart'
  | 'math-formula'
  // Psychology & Story (PsychToons)
  | 'character-desk'
  | 'character-phone'
  | 'brain-dopamine'
  | 'habit-loop'
  | 'split-comparison'
  // Annotations
  | 'callout-card'
  | 'metric-badge';

export type ElementStatus = 'normal' | 'active' | 'warning' | 'crashed' | 'highlight';

export interface StudioElement {
  id: string;
  type: ElementType;
  title: string;
  subtitle?: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number;
  height: number;
  status: ElementStatus;
  animation?: 'none' | 'pulse' | 'glow' | 'float' | 'overload-shake' | 'sparkle';
  customProps?: Record<string, any>;
}

export interface StudioPipe {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
  packetSpeed: number; // 0 (stopped) to 5 (fast)
  packetColor?: string;
  status: 'normal' | 'heavy' | 'crashed' | 'error';
  style?: 'curved' | 'orthogonal' | 'straight';
}

export type CameraFocus = 'overview' | 'left' | 'center' | 'right' | 'zoom-in' | 'shake';

export type BackgroundTheme =
  | 'dark-blueprint'
  | 'cyber-terminal'
  | 'clean-slate'
  | 'psychology-split'
  | 'deep-space'
  | 'matrix-code';

export interface SceneHUD {
  show: boolean;
  rps?: number;
  latencyMs?: number;
  cpuPercent?: number;
  statusText?: string;
  statusColor?: string;
}

export interface StudioScene {
  id: string;
  title: string;
  duration: number; // seconds (e.g. 4.0)
  narration: string; // voiceover text & auto subtitles
  camera: {
    focus: CameraFocus;
    zoom: number; // 1.0 = normal, 1.3 = medium zoom, 1.8 = tight focus
    panX: number; // offset percent
    panY: number;
  };
  background: {
    theme: BackgroundTheme;
    grid: boolean;
    ambientGlow: string;
  };
  elements: StudioElement[];
  pipes: StudioPipe[];
  hud: SceneHUD;
}

export interface StudioProject {
  title: string;
  aspectRatio: '16:9' | '9:16';
  fps: number;
  scenes: StudioScene[];
  audio: {
    voiceEnabled: boolean;
    voiceRate: number; // 0.8 - 1.4
    voicePitch: number;
    sfxEnabled: boolean;
    bgmEnabled: boolean;
  };
}
