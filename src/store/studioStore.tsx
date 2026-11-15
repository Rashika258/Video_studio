import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';
import { BaseNodeData, StoryBeat, ProjectSettings } from '../types/studio';
import { PRESETS, PresetScenario } from '../data/presets';
import confetti from 'canvas-confetti';

interface StudioContextType {
  nodes: Node<BaseNodeData>[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node<BaseNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: (changes: NodeChange<Node<BaseNodeData>>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  selectedNode: Node<BaseNodeData> | null;
  setSelectedNode: (node: Node<BaseNodeData> | null) => void;
  
  // Presets & Project
  currentPreset: PresetScenario;
  loadPreset: (presetId: string) => void;
  projectSettings: ProjectSettings;
  updateProjectSettings: (settings: Partial<ProjectSettings>) => void;
  
  // Timeline & Playback
  isPlaying: boolean;
  currentTime: number;
  togglePlay: () => void;
  seekTime: (time: number) => void;
  currentBeat: StoryBeat | null;
  triggerBeatAction: (beat: StoryBeat) => void;
  
  // Camera & View
  isIsometric: boolean;
  toggleIsometric: () => void;
  
  // Add Custom Node
  addNode: (category: BaseNodeData['category'], label: string, variant?: string) => void;

  // Export
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPreset, setCurrentPreset] = useState<PresetScenario>(PRESETS[0]);
  const [nodes, setNodes] = useState<Node<BaseNodeData>[]>(PRESETS[0].initialNodes);
  const [edges, setEdges] = useState<Edge[]>(PRESETS[0].initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<BaseNodeData> | null>(null);

  const [projectSettings, setProjectSettings] = useState<ProjectSettings>({
    title: PRESETS[0].name,
    aspectRatio: '16:9',
    duration: 30,
    fps: 60,
    theme: 'slate',
    isIsometric: false,
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isIsometric, setIsIsometric] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Determine current active beat from currentTime
  const currentBeat = currentPreset.beats
    .slice()
    .reverse()
    .find((b) => currentTime >= b.timestamp) || currentPreset.beats[0];

  const onNodesChange = (changes: NodeChange<Node<BaseNodeData>>[]) => {
    setNodes((nds) => applyNodeChanges(changes as any, nds as any) as Node<BaseNodeData>[]);
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const updateProjectSettings = (settings: Partial<ProjectSettings>) => {
    setProjectSettings((prev) => ({ ...prev, ...settings }));
  };

  const toggleIsometric = () => {
    setIsIsometric((prev) => !prev);
  };

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const loop = (now: number) => {
        const deltaSec = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + deltaSec;
          if (next >= projectSettings.duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, projectSettings.duration]);

  // Handle Beat Trigger Actions dynamically
  const triggerBeatAction = (beat: StoryBeat) => {
    if (beat.isIsometric !== undefined) {
      setIsIsometric(beat.isIsometric);
    }

    // Dynamic state morphing based on beat triggers
    if (beat.triggerAction === 'traffic-surge') {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === 'monolith-db'
            ? {
                ...n,
                data: {
                  ...n.data,
                  status: 'stressed',
                  metricValue: '9,840 iops (MAX)',
                },
              }
            : n
        )
      );
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          data: {
            ...e.data,
            speed: 3.5,
            density: 8,
            particleColor: '#F59E0B',
            packetLabel: '10,000 req/s',
          },
        }))
      );
    } else if (beat.triggerAction === 'database-crash') {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === 'monolith-db' || n.id === 'app-server'
            ? {
                ...n,
                data: {
                  ...n.data,
                  status: 'crashed',
                  metricBadge: 'Status',
                  metricValue: '504 Timeout 🔥',
                },
              }
            : n
        )
      );
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          data: {
            ...e.data,
            isBlocked: true,
            particleColor: '#EF4444',
            packetLabel: 'Connection Refused',
          },
        }))
      );
    } else if (beat.triggerAction === 'cqrs-split') {
      // Add read replica and Kafka if not present
      setNodes([
        {
          id: 'client',
          type: 'systemNode',
          position: { x: 50, y: 220 },
          data: {
            label: 'Client App',
            sublabel: 'Commands & Queries',
            category: 'system',
            variant: 'client',
            status: 'active',
            accentColor: '#38bdf8',
            metricBadge: 'Traffic',
            metricValue: '10,000 req/s',
          },
        },
        {
          id: 'write-db',
          type: 'systemNode',
          position: { x: 420, y: 100 },
          data: {
            label: 'Write DB (Postgres)',
            sublabel: 'Handles Commands & Writes',
            category: 'system',
            variant: 'database',
            status: 'active',
            accentColor: '#38bdf8',
            metricBadge: 'Write Latency',
            metricValue: '3ms',
          },
        },
        {
          id: 'kafka-bus',
          type: 'systemNode',
          position: { x: 740, y: 220 },
          data: {
            label: 'Kafka Event Bus',
            sublabel: 'Realtime Sync Stream',
            category: 'system',
            variant: 'queue',
            status: 'syncing',
            accentColor: '#a855f7',
            metricBadge: 'Queue Lag',
            metricValue: '0.2ms',
          },
        },
        {
          id: 'read-db',
          type: 'systemNode',
          position: { x: 420, y: 340 },
          data: {
            label: 'Read DB (Elasticsearch)',
            sublabel: 'Fast Analytical Queries',
            category: 'system',
            variant: 'database',
            status: 'active',
            accentColor: '#10b981',
            metricBadge: 'Read Latency',
            metricValue: '1.2ms',
          },
        },
      ]);

      setEdges([
        {
          id: 'e-client-write',
          source: 'client',
          target: 'write-db',
          type: 'animatedParticle',
          data: {
            speed: 2.0,
            particleColor: '#38bdf8',
            particleShape: 'pill',
            density: 5,
            packetLabel: 'Write Command',
          },
        },
        {
          id: 'e-client-read',
          source: 'client',
          target: 'read-db',
          type: 'animatedParticle',
          data: {
            speed: 2.0,
            particleColor: '#10b981',
            particleShape: 'pill',
            density: 5,
            packetLabel: 'Read Query',
          },
        },
        {
          id: 'e-write-kafka',
          source: 'write-db',
          target: 'kafka-bus',
          type: 'animatedParticle',
          data: {
            speed: 1.8,
            particleColor: '#a855f7',
            particleShape: 'dot',
            density: 4,
            packetLabel: 'OrderCreated',
          },
        },
        {
          id: 'e-kafka-read',
          source: 'kafka-bus',
          target: 'read-db',
          type: 'animatedParticle',
          data: {
            speed: 1.8,
            particleColor: '#10b981',
            particleShape: 'dot',
            density: 4,
            packetLabel: 'Sync Replicas',
          },
        },
      ]);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else if (beat.triggerAction === 'normal-traffic') {
      loadPreset(currentPreset.id);
    }
  };

  const seekTime = (time: number) => {
    setCurrentTime(time);
    const targetBeat = currentPreset.beats
      .slice()
      .reverse()
      .find((b) => time >= b.timestamp);
    if (targetBeat) {
      triggerBeatAction(targetBeat);
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const loadPreset = (presetId: string) => {
    const found = PRESETS.find((p) => p.id === presetId);
    if (found) {
      setCurrentPreset(found);
      setNodes(found.initialNodes);
      setEdges(found.initialEdges);
      setCurrentTime(0);
      setIsPlaying(false);
      setProjectSettings((prev) => ({
        ...prev,
        title: found.name,
      }));
    }
  };

  const addNode = (category: BaseNodeData['category'], label: string, variant = 'server') => {
    const id = `node-${Date.now()}`;
    const newNode: Node<BaseNodeData> = {
      id,
      type: `${category}Node`,
      position: { x: 300 + Math.random() * 100, y: 200 + Math.random() * 80 },
      data: {
        label,
        sublabel: `${category.toUpperCase()} element`,
        category,
        variant,
        status: 'active',
        accentColor: '#38BDF8',
        metricBadge: 'Activity',
        metricValue: 'Active',
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  return (
    <StudioContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        selectedNode,
        setSelectedNode,
        currentPreset,
        loadPreset,
        projectSettings,
        updateProjectSettings,
        isPlaying,
        currentTime,
        togglePlay,
        seekTime,
        currentBeat,
        triggerBeatAction,
        isIsometric,
        toggleIsometric,
        addNode,
        isExportModalOpen,
        setIsExportModalOpen,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
