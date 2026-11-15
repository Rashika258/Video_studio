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
  // AI Agents, Silicon & ByteMonk Documentary
  | 'agent-swarm'
  | 'systolic-array'
  | 'sandbox-container'
  | 'kinetic-title'
  // IAM & Security Ecosystem (Cloud X Berry)
  | 'identity-idp'
  | 'auth-token'
  | 'access-policy'
  | 'siem-audit'
  // Annotations & Custom Blocks
  | 'callout-card'
  | 'metric-badge'
  | 'custom-card';

export interface CustomBlockConfig {
  icon: string;
  accentColor: string;
  badgeText?: string;
  layoutMode: 'gauge' | 'specs' | 'steps' | 'hero';
  gaugeValue?: number;
  gaugeLabel?: string;
  rows?: string[];
}

export interface CustomBlockPreset {
  id: string;
  title: string;
  subtitle?: string;
  width: number;
  height: number;
  status: ElementStatus;
  animation?: StudioElement['animation'];
  customProps: CustomBlockConfig;
}

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
  entranceBeat?: number; // 0 to 0.8 normalized scene time when element pops in
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
  drawBeat?: number; // 0 to 0.7 normalized scene time when trim-path draws
}

export type CameraFocus = 'overview' | 'left' | 'center' | 'right' | 'zoom-in' | 'shake' | 'pan-right' | 'pan-left';

export type BackgroundTheme =
  | 'dark-blueprint'
  | 'cyber-terminal'
  | 'clean-slate'
  | 'psychology-split'
  | 'deep-space'
  | 'matrix-code';

export type SceneTransition = 'fade' | 'zoom' | 'slide' | 'cut';

export interface SceneHUD {
  show: boolean;
  rps?: number;
  latencyMs?: number;
  cpuPercent?: number;
  statusText?: string;
  statusColor?: string;
}

export interface SceneHeadline {
  text: string;
  subtext?: string;
  color?: string;
}

export interface StudioScene {
  id: string;
  title: string;
  duration: number; // seconds (e.g. 4.0)
  narration: string; // voiceover text & auto subtitles
  headline?: SceneHeadline;
  transition?: SceneTransition;
  camera: {
    focus: CameraFocus;
    zoom: number; // 1.0 = normal, 1.3 = medium zoom, 1.8 = tight focus
    panX: number; // offset percent
    panY: number;
    startZoom?: number;
    startPanX?: number;
    startPanY?: number;
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
