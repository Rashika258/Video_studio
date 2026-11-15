export type NodeTypeCategory = 
  | 'system'
  | 'hardware'
  | 'math'
  | 'character'
  | 'document';

export type NodeStatus = 
  | 'idle'
  | 'active'
  | 'stressed'
  | 'overloaded'
  | 'crashed'
  | 'syncing'
  | 'success';

export interface BaseNodeData extends Record<string, unknown> {
  label: string;
  sublabel?: string;
  category: NodeTypeCategory;
  variant?: string;
  status: NodeStatus;
  accentColor?: string;
  metricBadge?: string;
  metricValue?: string;
  customProps?: Record<string, any>;
}

export interface StoryBeat {
  id: string;
  timestamp: number; // in seconds (0 to 30)
  title: string;
  description: string;
  triggerAction: string;
  activeNodes?: string[];
  cameraFocus?: { x: number; y: number; zoom: number };
  isIsometric?: boolean;
}

export interface WireFlowConfig {
  speed: number;
  particleColor: string;
  particleShape: 'dot' | 'pill' | 'packet' | 'coin';
  packetLabel?: string;
  density: number;
  isReversed?: boolean;
  isBlocked?: boolean;
}

export interface ProjectSettings {
  title: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  duration: number;
  fps: 60 | 30;
  theme: 'slate' | 'cyberpunk' | 'oled' | 'paper';
  isIsometric: boolean;
}
