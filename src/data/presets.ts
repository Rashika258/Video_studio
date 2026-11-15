import { Node, Edge } from '@xyflow/react';
import { StoryBeat, BaseNodeData } from '../types/studio';

export interface PresetScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  initialNodes: Node<BaseNodeData>[];
  initialEdges: Edge[];
  beats: StoryBeat[];
}

export const PRESETS: PresetScenario[] = [
  {
    id: 'cqrs-overload',
    name: 'CQRS & Database Overload',
    category: 'System Design',
    badge: 'Visualcoders Style',
    description: '10,000 requests hit a single database until it dies, then refactored into Command Query Responsibility Segregation with Kafka.',
    initialNodes: [
      {
        id: 'client',
        type: 'systemNode',
        position: { x: 50, y: 220 },
        data: {
          label: 'Client App',
          sublabel: 'Mobile & Web Users',
          category: 'system',
          variant: 'client',
          status: 'active',
          accentColor: '#38bdf8',
          metricBadge: 'Traffic',
          metricValue: '250 req/s'
        }
      },
      {
        id: 'gateway',
        type: 'systemNode',
        position: { x: 320, y: 220 },
        data: {
          label: 'API Gateway',
          sublabel: 'Reverse Proxy & Auth',
          category: 'system',
          variant: 'gateway',
          status: 'active',
          accentColor: '#818cf8',
          metricBadge: 'Latency',
          metricValue: '12ms'
        }
      },
      {
        id: 'app-server',
        type: 'systemNode',
        position: { x: 600, y: 220 },
        data: {
          label: 'Monolith Server',
          sublabel: 'Node.js Express Backend',
          category: 'system',
          variant: 'server',
          status: 'active',
          accentColor: '#34d399',
          metricBadge: 'CPU Usage',
          metricValue: '28%'
        }
      },
      {
        id: 'monolith-db',
        type: 'systemNode',
        position: { x: 920, y: 220 },
        data: {
          label: 'PostgreSQL DB',
          sublabel: 'Single Point of Failure',
          category: 'system',
          variant: 'database',
          status: 'active',
          accentColor: '#60a5fa',
          metricBadge: 'Disk IOPS',
          metricValue: '180 iops'
        }
      }
    ],
    initialEdges: [
      {
        id: 'e-client-gw',
        source: 'client',
        target: 'gateway',
        type: 'animatedParticle',
        data: {
          speed: 1.5,
          particleColor: '#38bdf8',
          particleShape: 'pill',
          density: 4,
          packetLabel: 'HTTP GET/POST'
        }
      },
      {
        id: 'e-gw-server',
        source: 'gateway',
        target: 'app-server',
        type: 'animatedParticle',
        data: {
          speed: 1.8,
          particleColor: '#818cf8',
          particleShape: 'pill',
          density: 4,
          packetLabel: 'JSON Payload'
        }
      },
      {
        id: 'e-server-db',
        source: 'app-server',
        target: 'monolith-db',
        type: 'animatedParticle',
        data: {
          speed: 1.2,
          particleColor: '#60a5fa',
          particleShape: 'pill',
          density: 4,
          packetLabel: 'SQL Query'
        }
      }
    ],
    beats: [
      {
        id: 'b1',
        timestamp: 0,
        title: 'Initial Architecture',
        description: 'Single backend server connected to a monolithic database. Everything is green and healthy.',
        triggerAction: 'normal-traffic',
        activeNodes: ['client', 'gateway', 'app-server', 'monolith-db'],
        isIsometric: false
      },
      {
        id: 'b2',
        timestamp: 5,
        title: 'Traffic Spike (10,000 req/s)',
        description: 'Sudden surge of user queries. Database connection pool exhausts, disk locks occur.',
        triggerAction: 'traffic-surge',
        activeNodes: ['monolith-db'],
        isIsometric: false
      },
      {
        id: 'b3',
        timestamp: 10,
        title: 'Server Overload & 504 Crash 🔥',
        description: 'Database completely locks up. Latency reaches 9,999ms, queries drop with Gateway Timeout.',
        triggerAction: 'database-crash',
        activeNodes: ['monolith-db', 'app-server'],
        isIsometric: true
      },
      {
        id: 'b4',
        timestamp: 16,
        title: 'Architecture Refactor: CQRS Split',
        description: 'Separate Commands (Writes) from Queries (Reads). Write DB handles mutations; Read Replicas handle dashboards.',
        triggerAction: 'cqrs-split',
        activeNodes: [],
        isIsometric: true
      },
      {
        id: 'b5',
        timestamp: 23,
        title: 'Eventual Consistency via Kafka',
        description: 'Events stream smoothly between Write DB and Read Model via message queue. Latency restored to 4ms!',
        triggerAction: 'kafka-sync',
        activeNodes: [],
        isIsometric: false
      }
    ]
  },
  {
    id: 'ai-gpu-inference',
    name: 'AI GPU Infrastructure & vLLM',
    category: 'Hardware & AI',
    badge: 'KodeKloud Style',
    description: 'LLM inference journey: From tokenization through H100 Tensor Cores, KV-Cache memory, and continuous batching.',
    initialNodes: [
      {
        id: 'token-prompt',
        type: 'hardwareNode',
        position: { x: 60, y: 220 },
        data: {
          label: 'Input Prompt',
          sublabel: '"Explain Quantum Entanglement"',
          category: 'hardware',
          variant: 'prompt',
          status: 'active',
          accentColor: '#a855f7',
          metricBadge: 'Tokens',
          metricValue: '48 tokens'
        }
      },
      {
        id: 'vllm-engine',
        type: 'hardwareNode',
        position: { x: 340, y: 220 },
        data: {
          label: 'vLLM Serving Engine',
          sublabel: 'Continuous Batching & PagedAttention',
          category: 'hardware',
          variant: 'batcher',
          status: 'active',
          accentColor: '#06b6d4',
          metricBadge: 'Throughput',
          metricValue: '2,400 tok/s'
        }
      },
      {
        id: 'nvidia-h100',
        type: 'hardwareNode',
        position: { x: 680, y: 150 },
        data: {
          label: 'NVIDIA H100 SXM5',
          sublabel: '80GB HBM3 | 3.35 TB/s Bandwidth',
          category: 'hardware',
          variant: 'gpu',
          status: 'active',
          accentColor: '#22c55e',
          metricBadge: 'Compute',
          metricValue: '989 TFLOPS'
        }
      },
      {
        id: 'kv-cache',
        type: 'hardwareNode',
        position: { x: 680, y: 340 },
        data: {
          label: 'Paged KV-Cache',
          sublabel: 'Virtual Memory Pool for Attention',
          category: 'hardware',
          variant: 'vram',
          status: 'active',
          accentColor: '#eab308',
          metricBadge: 'VRAM Usage',
          metricValue: '62.4 GB'
        }
      }
    ],
    initialEdges: [
      {
        id: 'e-prompt-vllm',
        source: 'token-prompt',
        target: 'vllm-engine',
        type: 'animatedParticle',
        data: {
          speed: 1.6,
          particleColor: '#c084fc',
          particleShape: 'pill',
          density: 5,
          packetLabel: 'Tokens'
        }
      },
      {
        id: 'e-vllm-h100',
        source: 'vllm-engine',
        target: 'nvidia-h100',
        type: 'animatedParticle',
        data: {
          speed: 2.2,
          particleColor: '#22c55e',
          particleShape: 'pill',
          density: 6,
          packetLabel: 'FP8 Matrix Op'
        }
      },
      {
        id: 'e-vllm-kv',
        source: 'vllm-engine',
        target: 'kv-cache',
        type: 'animatedParticle',
        data: {
          speed: 1.4,
          particleColor: '#eab308',
          particleShape: 'dot',
          density: 4,
          packetLabel: 'Key/Value Store'
        }
      }
    ],
    beats: [
      {
        id: 'b1',
        timestamp: 0,
        title: 'Prompt Prefill Phase',
        description: 'Input tokens stream in parallel across high-bandwidth memory.',
        triggerAction: 'prefill',
        isIsometric: true
      },
      {
        id: 'b2',
        timestamp: 6,
        title: 'Autoregressive Decoding Phase',
        description: 'Generating tokens one by one; KV-cache memory bandwidth becomes the main bottleneck.',
        triggerAction: 'decode',
        isIsometric: true
      },
      {
        id: 'b3',
        timestamp: 14,
        title: 'PagedAttention Defragmentation',
        description: 'Zero memory waste by allocating KV-cache into discrete non-contiguous physical pages.',
        triggerAction: 'paged-attention',
        isIsometric: false
      }
    ]
  },
  {
    id: 'tree-complexity',
    name: 'Algorithm Tree Search & Math Curve',
    category: 'Computer Science',
    badge: 'ByteMonk Style',
    description: 'Graph search algorithm traversing branch decisions contrasted against exponential time complexity curves.',
    initialNodes: [
      {
        id: 'root-tree',
        type: 'mathNode',
        position: { x: 100, y: 150 },
        data: {
          label: 'Root Node (S)',
          sublabel: 'Initial State',
          category: 'math',
          variant: 'tree-root',
          status: 'success',
          accentColor: '#10b981',
          metricBadge: 'Visited',
          metricValue: 'True'
        }
      },
      {
        id: 'branch-left',
        type: 'mathNode',
        position: { x: 50, y: 320 },
        data: {
          label: 'Branch A',
          sublabel: 'Depth = 1',
          category: 'math',
          variant: 'tree-node',
          status: 'active',
          accentColor: '#3b82f6',
          metricBadge: 'Cost',
          metricValue: 'g(n)=3'
        }
      },
      {
        id: 'branch-right',
        type: 'mathNode',
        position: { x: 260, y: 320 },
        data: {
          label: 'Branch B (Optimal)',
          sublabel: 'Goal Target Reached',
          category: 'math',
          variant: 'tree-node',
          status: 'success',
          accentColor: '#10b981',
          metricBadge: 'Heuristic',
          metricValue: 'h(n)=0'
        }
      },
      {
        id: 'complexity-plot',
        type: 'mathNode',
        position: { x: 580, y: 180 },
        data: {
          label: 'Time Complexity Growth',
          sublabel: 'P vs NP Exponential Cliff',
          category: 'math',
          variant: 'plot',
          status: 'active',
          accentColor: '#ec4899',
          metricBadge: 'Worst Case',
          metricValue: 'O(2^N)'
        }
      }
    ],
    initialEdges: [
      {
        id: 'e-root-left',
        source: 'root-tree',
        target: 'branch-left',
        type: 'animatedParticle',
        data: {
          speed: 1.2,
          particleColor: '#3b82f6',
          particleShape: 'dot',
          density: 3
        }
      },
      {
        id: 'e-root-right',
        source: 'root-tree',
        target: 'branch-right',
        type: 'animatedParticle',
        data: {
          speed: 1.8,
          particleColor: '#10b981',
          particleShape: 'dot',
          density: 4
        }
      }
    ],
    beats: [
      {
        id: 'b1',
        timestamp: 0,
        title: 'Tree Node Exploration',
        description: 'Depth-first traversal checks left branch first.',
        triggerAction: 'dfs-traverse'
      },
      {
        id: 'b2',
        timestamp: 5,
        title: 'Backtrack on Suboptimal Path',
        description: 'Left branch yields dead end; search algorithm prunes tree branch.',
        triggerAction: 'prune-branch'
      },
      {
        id: 'b3',
        timestamp: 10,
        title: 'Exponential Explosion O(2^N)',
        description: 'As input size grows, total states outnumber the atoms in the universe.',
        triggerAction: 'plot-curve'
      }
    ]
  },
  {
    id: 'psych-discipline',
    name: 'Psychology & Dopamine Habit Loop',
    category: 'Human & Narrative',
    badge: 'PsychToons Style',
    description: 'Illustrated 2D character avatar battling willpower exhaustion, dopamine spikes, and temptation bundling.',
    initialNodes: [
      {
        id: 'avatar-character',
        type: 'characterNode',
        position: { x: 80, y: 200 },
        data: {
          label: 'The Mind at 9:00 PM',
          sublabel: 'Focus vs Distraction Battle',
          category: 'character',
          variant: 'human',
          status: 'stressed',
          accentColor: '#f97316',
          metricBadge: 'Willpower',
          metricValue: '18% remaining'
        }
      },
      {
        id: 'brain-meter',
        type: 'characterNode',
        position: { x: 420, y: 150 },
        data: {
          label: 'Prefrontal Cortex vs Striatum',
          sublabel: 'Dopamine Signal Anticipation',
          category: 'character',
          variant: 'brain',
          status: 'active',
          accentColor: '#ec4899',
          metricBadge: 'Dopamine Delta',
          metricValue: '+340%'
        }
      },
      {
        id: 'habit-reward',
        type: 'characterNode',
        position: { x: 760, y: 200 },
        data: {
          label: 'Learned Industriousness',
          sublabel: 'Effort itself conditioned as reward',
          category: 'character',
          variant: 'reward',
          status: 'success',
          accentColor: '#10b981',
          metricBadge: 'Automaticity',
          metricValue: '66 Days'
        }
      }
    ],
    initialEdges: [
      {
        id: 'e-char-brain',
        source: 'avatar-character',
        target: 'brain-meter',
        type: 'animatedParticle',
        data: {
          speed: 1.5,
          particleColor: '#ec4899',
          particleShape: 'pill',
          density: 4,
          packetLabel: 'Cravings'
        }
      },
      {
        id: 'e-brain-habit',
        source: 'brain-meter',
        target: 'habit-reward',
        type: 'animatedParticle',
        data: {
          speed: 1.2,
          particleColor: '#10b981',
          particleShape: 'dot',
          density: 3,
          packetLabel: 'Neuroplasticity'
        }
      }
    ],
    beats: [
      {
        id: 'b1',
        timestamp: 0,
        title: 'Temptation Impulse',
        description: 'Instant gratification cue floods dopamine receptors.',
        triggerAction: 'impulse'
      },
      {
        id: 'b2',
        timestamp: 6,
        title: 'The Effort Paradox',
        description: 'Humans find genuine satisfaction in deliberate friction when framed properly.',
        triggerAction: 'effort-paradox'
      },
      {
        id: 'b3',
        timestamp: 12,
        title: 'Automatic Habit Formation',
        description: 'Action shifts from energy-costly prefrontal control into basal ganglia automaticity.',
        triggerAction: 'habit-lock'
      }
    ]
  }
];
