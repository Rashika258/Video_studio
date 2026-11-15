import { StoryScene } from '../types/story';

export const DEFAULT_STORY_SCENES: StoryScene[] = [
  {
    id: 'scene-1',
    title: 'Act 1: Single Server Overload',
    duration: 4,
    background: 'server-room',
    character: {
      type: 'engineer',
      name: 'Backend Dev',
      pose: 'server-fire',
      x: 28,
      y: 45,
      scale: 1,
      speechBubble: '10,000 users just hit our single server. Disk locked, CPU at 100%! 🔥',
    },
    props: [
      { id: 'p1', name: 'Monolith Server', icon: '🖥️', category: 'tech', x: 68, y: 48, scale: 1.4, animation: 'shake', badge: '504 GATEWAY TIMEOUT', badgeColor: '#EF4444' },
      { id: 'p2', name: 'Postgres DB', icon: '🗄️', category: 'tech', x: 84, y: 32, scale: 1.2, animation: 'shake', badge: 'Deadlock 9999ms', badgeColor: '#EF4444' },
    ],
    headline: {
      text: 'WHEN ONE SERVER DIES',
      subtext: 'Why scaling backend infrastructure is hard',
      font: 'Space Grotesk',
      color: '#EF4444',
      size: 36,
      x: 50,
      y: 12,
    },
    transition: 'slide',
  },
  {
    id: 'scene-2',
    title: 'Act 2: The Load Balancer Fix',
    duration: 4,
    background: 'dark-studio',
    character: {
      type: 'engineer',
      name: 'Architect',
      pose: 'coding',
      x: 25,
      y: 45,
      scale: 1,
      speechBubble: 'Add a Reverse Proxy & Load Balancer to distribute traffic evenly.',
    },
    props: [
      { id: 'p3', name: 'Load Balancer', icon: '⚖️', category: 'tech', x: 55, y: 45, scale: 1.5, animation: 'pulse', badge: 'Round Robin 0.4ms', badgeColor: '#38BDF8' },
      { id: 'p4', name: 'Server 1', icon: '🖥️', category: 'tech', x: 80, y: 28, scale: 1.2, animation: 'float', badge: 'Healthy 22% CPU', badgeColor: '#10B981' },
      { id: 'p5', name: 'Server 2', icon: '🖥️', category: 'tech', x: 80, y: 62, scale: 1.2, animation: 'float', badge: 'Healthy 24% CPU', badgeColor: '#10B981' },
    ],
    headline: {
      text: 'LOAD BALANCING IN ACTION',
      subtext: 'Traffic split 50/50 across horizontal server replicas',
      font: 'Space Grotesk',
      color: '#38BDF8',
      size: 34,
      x: 50,
      y: 12,
    },
    transition: 'zoom',
  },
  {
    id: 'scene-3',
    title: 'Act 3: High Availability & 200 OK',
    duration: 4,
    background: 'terminal-matrix',
    character: {
      type: 'engineer',
      name: 'Backend Dev',
      pose: 'celebrating',
      x: 32,
      y: 48,
      scale: 1,
      speechBubble: 'Zero downtime achieved! Redis cache handles 95% of reads! ⚡',
    },
    props: [
      { id: 'p6', name: 'Redis Cache', icon: '⚡', category: 'tech', x: 72, y: 35, scale: 1.4, animation: 'bounce', badge: 'Cache Hit 98%', badgeColor: '#10B981' },
      { id: 'p7', name: 'Kafka Queue', icon: '📡', category: 'tech', x: 72, y: 65, scale: 1.3, animation: 'pulse', badge: 'Event Bus', badgeColor: '#C084FC' },
    ],
    headline: {
      text: 'HIGH AVAILABILITY UNLOCKED',
      subtext: 'Sub-millisecond latency at massive scale',
      font: 'Space Grotesk',
      color: '#10B981',
      size: 34,
      x: 50,
      y: 12,
    },
    transition: 'pop',
  },
];

export const generateAIStory = (prompt: string): StoryScene[] => {
  const p = prompt.toLowerCase();

  // 1. Tech, Architecture, Server, Database, Code, AI, GPU
  if (
    p.includes('server') ||
    p.includes('system') ||
    p.includes('load balancer') ||
    p.includes('database') ||
    p.includes('api') ||
    p.includes('gpu') ||
    p.includes('code') ||
    p.includes('cloud') ||
    p.includes('tech')
  ) {
    return [
      {
        id: `s-${Date.now()}-1`,
        title: 'Step 1: The Bottleneck Problem',
        duration: 4,
        background: 'server-room',
        character: {
          type: 'engineer',
          name: 'Tech Lead',
          pose: 'server-fire',
          x: 28,
          y: 45,
          scale: 1,
          speechBubble: 'Traffic just spiked 100x! Latency through the roof! 🚨',
        },
        props: [
          { id: 'p1', name: 'Monolith API', icon: '🖥️', category: 'tech', x: 70, y: 45, scale: 1.4, animation: 'shake', badge: '10k req/s • 504 Timeout', badgeColor: '#EF4444' },
        ],
        headline: {
          text: 'THE ARCHITECTURAL BOTTLENECK',
          subtext: 'Why monolithic servers fail under heavy loads',
          font: 'Space Grotesk',
          color: '#EF4444',
          size: 36,
          x: 50,
          y: 12,
        },
        transition: 'slide',
      },
      {
        id: `s-${Date.now()}-2`,
        title: 'Step 2: The Infrastructure Fix',
        duration: 4,
        background: 'terminal-matrix',
        character: {
          type: 'engineer',
          name: 'Tech Lead',
          pose: 'coding',
          x: 30,
          y: 45,
          scale: 1,
          speechBubble: 'Decouple into Microservices + Redis Cache + Load Balancer.',
        },
        props: [
          { id: 'p2', name: 'Load Balancer', icon: '⚖️', category: 'tech', x: 55, y: 45, scale: 1.4, animation: 'pulse', badge: 'Health Checks OK', badgeColor: '#38BDF8' },
          { id: 'p3', name: 'Redis Cache', icon: '⚡', category: 'tech', x: 80, y: 40, scale: 1.3, animation: 'bounce', badge: '0.2ms Cache Hit', badgeColor: '#10B981' },
        ],
        headline: {
          text: 'SEPARATING READS & WRITES',
          subtext: 'High-throughput architecture designed for scale',
          font: 'Space Grotesk',
          color: '#38BDF8',
          size: 34,
          x: 50,
          y: 12,
        },
        transition: 'zoom',
      },
      {
        id: `s-${Date.now()}-3`,
        title: 'Step 3: Flawless Execution',
        duration: 4,
        background: 'dark-studio',
        character: {
          type: 'engineer',
          name: 'Tech Lead',
          pose: 'deploying',
          x: 50,
          y: 45,
          scale: 1.1,
          speechBubble: 'System handles millions of requests with sub-10ms latency! 🚀',
        },
        props: [
          { id: 'p4', name: 'Postgres Cluster', icon: '🗄️', category: 'tech', x: 25, y: 40, scale: 1.4, animation: 'float', badge: 'Auto-Replication', badgeColor: '#10B981' },
          { id: 'p5', name: 'Kafka Queue', icon: '📡', category: 'tech', x: 75, y: 40, scale: 1.4, animation: 'pulse', badge: 'Realtime Stream', badgeColor: '#C084FC' },
        ],
        headline: {
          text: 'SCALE ACHIEVED: 99.99% UPTIME',
          subtext: 'Battle-tested distributed system',
          font: 'Space Grotesk',
          color: '#10B981',
          size: 36,
          x: 50,
          y: 12,
        },
        transition: 'pop',
      },
    ];
  }

  // 2. Money, Wealth, Finance
  if (p.includes('money') || p.includes('rich') || p.includes('invest') || p.includes('wealth') || p.includes('crypto')) {
    return [
      {
        id: `s-${Date.now()}-1`,
        title: 'Step 1: The Trap of Trading Time',
        duration: 4,
        background: 'cozy-room',
        character: {
          type: 'creator',
          name: 'You',
          pose: 'stressed',
          x: 28,
          y: 45,
          scale: 1,
          speechBubble: 'Trading hours for dollars will never make you free!',
        },
        props: [
          { id: 'p1', name: 'Hourglass', icon: '⏳', x: 70, y: 45, scale: 1.4, animation: 'shake', label: 'Time is Finite' },
        ],
        headline: {
          text: 'THE TRAP OF TRADING TIME',
          subtext: 'Why a 9-5 salary has a mathematical ceiling',
          font: 'Bebas Neue',
          color: '#F43F5E',
          size: 36,
          x: 50,
          y: 12,
        },
        transition: 'slide',
      },
      {
        id: `s-${Date.now()}-2`,
        title: 'Step 2: The Magic of Compounding',
        duration: 4,
        background: 'dark-studio',
        character: {
          type: 'thinker',
          name: 'The Strategist',
          pose: 'pointing',
          x: 30,
          y: 45,
          scale: 1,
          speechBubble: 'When your money works 24/7, freedom is inevitable.',
        },
        props: [
          { id: 'p2', name: 'Money Stack', icon: '💵', x: 70, y: 45, scale: 1.6, animation: 'bounce', label: '$500/mo Auto-Invest' },
          { id: 'p3', name: 'Growth', icon: '📈', x: 82, y: 30, scale: 1.3, animation: 'float' },
        ],
        headline: {
          text: 'THE COMPOUNDING ENGINE',
          subtext: 'Exponential returns start slow, then explode',
          font: 'Poppins',
          color: '#10B981',
          size: 34,
          x: 50,
          y: 12,
        },
        transition: 'zoom',
      },
      {
        id: `s-${Date.now()}-3`,
        title: 'Step 3: Total Financial Freedom',
        duration: 4,
        background: 'nature',
        character: {
          type: 'creator',
          name: 'You',
          pose: 'celebrating',
          x: 50,
          y: 45,
          scale: 1.1,
          speechBubble: 'Assets cover living expenses. You own your time! 🌴',
        },
        props: [
          { id: 'p4', name: 'Palm Tree', icon: '🌴', x: 20, y: 40, scale: 1.4, animation: 'float' },
          { id: 'p5', name: 'Rocket', icon: '🚀', x: 80, y: 40, scale: 1.5, animation: 'bounce', label: 'Passive Cashflow' },
        ],
        headline: {
          text: 'FINANCIAL INDEPENDENCE',
          subtext: 'Live on your own terms',
          font: 'Bebas Neue',
          color: '#38BDF8',
          size: 38,
          x: 50,
          y: 12,
        },
        transition: 'pop',
      },
    ];
  }

  // 3. Fallback General Story
  return [
    {
      id: `s-${Date.now()}-1`,
      title: 'Act 1: The Problem',
      duration: 4,
      background: 'dark-studio',
      character: {
        type: 'creator',
        name: 'Narrator',
        pose: 'talking',
        x: 30,
        y: 45,
        scale: 1,
        speechBubble: `Have you ever wondered about ${prompt.slice(0, 35)}?`,
      },
      props: [
        { id: 'p1', name: 'Question', icon: '❓', x: 70, y: 45, scale: 1.6, animation: 'pulse', label: 'The Big Question' },
      ],
      headline: {
        text: prompt.slice(0, 28).toUpperCase(),
        subtext: 'The untold truth you need to know',
        font: 'Poppins',
        color: '#FBBF24',
        size: 34,
        x: 50,
        y: 12,
      },
      transition: 'slide',
    },
    {
      id: `s-${Date.now()}-2`,
      title: 'Act 2: The Breakthrough',
      duration: 4,
      background: 'cyberpunk',
      character: {
        type: 'thinker',
        name: 'The Expert',
        pose: 'mind-blown',
        x: 30,
        y: 45,
        scale: 1,
        speechBubble: 'Here is what changes everything!',
      },
      props: [
        { id: 'p2', name: 'Idea Spark', icon: '💡', x: 72, y: 40, scale: 1.8, animation: 'heartbeat', label: 'Aha Moment' },
      ],
      headline: {
        text: 'THE CORE INSIGHT',
        subtext: 'How the pieces fit together',
        font: 'Space Grotesk',
        color: '#38BDF8',
        size: 34,
        x: 50,
        y: 12,
      },
      transition: 'zoom',
    },
    {
      id: `s-${Date.now()}-3`,
      title: 'Act 3: The Result',
      duration: 4,
      background: 'cozy-room',
      character: {
        type: 'creator',
        name: 'Narrator',
        pose: 'celebrating',
        x: 50,
        y: 45,
        scale: 1.1,
        speechBubble: 'Apply this today and watch what happens! 🎉',
      },
      props: [
        { id: 'p3', name: 'Trophy', icon: '🏆', x: 25, y: 40, scale: 1.5, animation: 'bounce' },
        { id: 'p4', name: 'Star', icon: '⭐', x: 75, y: 40, scale: 1.4, animation: 'float', label: 'Success' },
      ],
      headline: {
        text: 'TAKE ACTION TODAY',
        subtext: 'Small steps create massive results',
        font: 'Bebas Neue',
        color: '#10B981',
        size: 38,
        x: 50,
        y: 12,
      },
      transition: 'pop',
    },
  ];
};
