export type ElementType = 
  | 'shape'
  | 'text'
  | 'code'
  | 'icon'
  | 'card'
  | 'custom'
  | 'path';

export type ShapeType = 'rectangle' | 'circle' | 'polygon' | 'star' | 'badge';

export type BehaviorType = 
  | 'none' 
  | 'shake' 
  | 'pulse' 
  | 'float' 
  | 'spin' 
  | 'glitch'
  | 'heartbeat'
  | 'bounce'
  | 'flip3d'
  | 'swing'
  | 'orbit'
  | 'neonFlicker'
  | 'wave';

export type FontFamilyType = 
  | 'Inter'
  | 'Fira Code'
  | 'Poppins'
  | 'Playfair Display'
  | 'Bebas Neue'
  | 'Caveat'
  | 'Space Grotesk'
  | 'Outfit';

export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';

export interface KeyframeData {
  time: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  glowColor?: string;
  glowRadius?: number;
  text?: string;
  easing?: EasingType;
}

export interface CustomComponentTemplate {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  headerTitle: string;
  subTitle: string;
  badgeText?: string;
  badgeColor?: string;
  progressValue?: number; // 0 to 100
  progressColor?: string;
  fill: string;
  stroke: string;
  glowColor: string;
  fontFamily: FontFamilyType;
  behavior: BehaviorType;
}

export interface CanvasElement {
  id: string;
  name: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  opacity: number;
  
  // Visual Styles
  shape?: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius: number;
  glowColor: string;
  glowRadius: number;
  borderStyle?: 'solid' | 'dashed' | 'double';
  glassmorphism?: boolean;
  
  // Custom Component Rich Internal Fields
  icon?: string;
  sublabel?: string;
  badgeText?: string;
  badgeColor?: string;
  progressValue?: number; // 0-100
  progressColor?: string;

  // Typography Specific
  text?: string;
  fontSize?: number;
  fontFamily?: FontFamilyType;
  fontWeight?: 'normal' | 'semibold' | 'bold' | 'extrabold';
  letterSpacing?: number;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  pathData?: string;

  // Motion & Animation
  behavior: BehaviorType;
  keyframes: KeyframeData[];
}

export interface ConnectorWire {
  id: string;
  fromId: string;
  toId: string;
  color: string;
  particleShape: 'pill' | 'dot' | 'spark' | 'icon';
  particleColor: string;
  speed: number;
  particleCount: number;
  label?: string;
  isDashed?: boolean;
}

export interface ProjectState {
  title: string;
  duration: number;
  fps: number;
  width: number;
  height: number;
  backgroundColor: string;
  camera: {
    x: number;
    y: number;
    zoom: number;
    tilt3D: boolean;
  };
}
