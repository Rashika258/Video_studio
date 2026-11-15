import {
  BackgroundTheme,
  CameraFocus,
  ElementStatus,
  ElementType,
  SceneTransition,
  StudioElement,
  StudioPipe,
  StudioProject,
  StudioScene,
} from '../types/videoStudio';

export type VideoStylePreset =
  | 'tech-architecture'
  | 'iam-security'
  | 'algorithms-cs'
  | 'ai-hardware'
  | 'ai-agents'
  | 'psychology-story';

export interface GeneratorOptions {
  prompt: string;
  style?: VideoStylePreset | 'auto';
  aspectRatio?: '16:9' | '9:16';
  sceneDurationSec?: number;
  targetScenes?: number | 'auto';
}

interface ComponentMatch {
  type: ElementType;
  defaultTitle: string;
  defaultSubtitle: string;
}

const ENTITY_RULES: Array<{ keywords: string[]; match: ComponentMatch }> = [
  { keywords: ['tpu', 'systolic', 'mac matrix', 'sram', 'weight grid'], match: { type: 'systolic-array', defaultTitle: 'Systolic Array', defaultSubtitle: 'On-Chip SRAM Matrix' } },
  { keywords: ['gpu', 'h100', 'cuda', 'tensor core', 'vram', 'hbm'], match: { type: 'gpu-chip', defaultTitle: 'GPU Accelerator', defaultSubtitle: 'Parallel Tensor Cores' } },
  { keywords: ['swarm', 'agents', 'multi-agent', 'botnet', 'bots'], match: { type: 'agent-swarm', defaultTitle: 'AI Agent Swarm', defaultSubtitle: 'Autonomous Agent Cluster' } },
  { keywords: ['sandbox', 'container', 'docker', 'enclave', 'jail', 'isolated'], match: { type: 'sandbox-container', defaultTitle: 'Isolated Sandbox', defaultSubtitle: 'Contained Execution' } },
  { keywords: ['idp', 'okta', 'entra', 'active directory', 'directory', 'scim', 'sso', 'identity provider'], match: { type: 'identity-idp', defaultTitle: 'Identity Provider', defaultSubtitle: 'Directory & SCIM Sync' } },
  { keywords: ['jwt', 'oidc', 'oauth', 'saml', 'token', 'passkey', 'fido2', 'mfa', 'session', 'pkce', 'credential'], match: { type: 'auth-token', defaultTitle: 'Signed Auth Token', defaultSubtitle: 'Passkey · OIDC / JWT' } },
  { keywords: ['rbac', 'abac', 'policy', 'jit', 'pam', 'least privilege', 'permission', 'privilege', 'acl'], match: { type: 'access-policy', defaultTitle: 'Access Policy Gate', defaultSubtitle: 'RBAC & JIT Controls' } },
  { keywords: ['siem', 'audit', 'telemetry', 'monitoring', 'observability', 'datadog', 'splunk'], match: { type: 'siem-audit', defaultTitle: 'SIEM Audit Trail', defaultSubtitle: 'Immutable Security Log' } },
  { keywords: ['firewall', 'waf', 'zero trust', 'tls', 'https', 'shield', 'ddos', 'rate limit', 'guard'], match: { type: 'firewall-shield', defaultTitle: 'Zero Trust Shield', defaultSubtitle: 'Edge Verification' } },
  { keywords: ['load balancer', 'nginx', 'alb', 'gateway', 'proxy', 'cdn', 'cloudflare', 'dns', 'router', 'ingress'], match: { type: 'load-balancer', defaultTitle: 'Edge Gateway / LB', defaultSubtitle: 'Traffic Routing' } },
  { keywords: ['redis', 'cache', 'memcache', 'kv', 'idempotency', 'lru', 'artifactory'], match: { type: 'cache-redis', defaultTitle: 'In-Memory Cache', defaultSubtitle: '0.2ms Key-Value Store' } },
  { keywords: ['kafka', 'queue', 'stream', 'event', 'sqs', 'pubsub', 'rabbitmq', 'webhook', 'broker'], match: { type: 'kafka-stream', defaultTitle: 'Event Stream Bus', defaultSubtitle: 'Async Ordered Queue' } },
  { keywords: ['postgres', 'mysql', 'sql', 'database', 'db', 'ledger', 'hr', 'workday', 'warehouse', 'storage'], match: { type: 'database-sql', defaultTitle: 'Primary Database', defaultSubtitle: 'ACID Persistent Store' } },
  { keywords: ['kubernetes', 'k8s', 'pod', 'pods', 'replica', 'worker', 'autoscal', 'microservice', 'cluster'], match: { type: 'cloud-pod', defaultTitle: 'Compute Pods', defaultSubtitle: 'Auto-Scaled Replicas' } },
  { keywords: ['tree', 'bst', 'trie', 'heap', 'b-tree', 'avl'], match: { type: 'binary-tree', defaultTitle: 'Balanced Tree', defaultSubtitle: 'O(log N) Traversal' } },
  { keywords: ['array', 'pointer', 'window', 'binary search', 'sort', 'hash map', 'index'], match: { type: 'algorithm-array', defaultTitle: 'Indexed Array', defaultSubtitle: 'Pointer Traversal' } },
  { keywords: ['big-o', 'complexity', 'curve', 'benchmark', 'latency chart', 'throughput'], match: { type: 'big-o-chart', defaultTitle: 'Scaling Curve', defaultSubtitle: 'Time vs Input Size' } },
  { keywords: ['formula', 'attention', 'softmax', 'equation', 'gradient', 'matrix', 'math'], match: { type: 'math-formula', defaultTitle: 'Core Transform', defaultSubtitle: 'f(x) = Softmax(QK^T/√d)' } },
  { keywords: ['brain', 'dopamine', 'cortex', 'neuron', 'amygdala', 'reward'], match: { type: 'brain-dopamine', defaultTitle: 'Reward Circuit', defaultSubtitle: 'Dopamine Loop' } },
  { keywords: ['habit', 'cue', 'craving', 'loop', 'routine', 'cycle'], match: { type: 'habit-loop', defaultTitle: 'Behavior Loop', defaultSubtitle: 'Cue ➔ Crave ➔ Reward' } },
  { keywords: ['compare', 'vs', 'versus', 'before', 'after', 'tradeoff'], match: { type: 'split-comparison', defaultTitle: 'Before vs After', defaultSubtitle: 'Side-by-Side Tradeoff' } },
  { keywords: ['phone', 'scroll', 'notification', 'distract', 'mobile app', 'app'], match: { type: 'character-phone', defaultTitle: 'Mobile Client', defaultSubtitle: 'User Trigger' } },
  { keywords: ['sarah', 'employee', 'hire', 'developer', 'engineer', 'person', 'staff', 'team'], match: { type: 'character-desk', defaultTitle: 'Team Engineer', defaultSubtitle: 'Human Actor' } },
  { keywords: ['user', 'client', 'browser', 'customer', 'traffic', 'device', 'request'], match: { type: 'client-devices', defaultTitle: 'Client Traffic', defaultSubtitle: 'Incoming Requests' } },
  { keywords: ['code', 'script', 'terminal', 'cli', 'function', 'handler', 'payload', 'json', 'log'], match: { type: 'terminal-window', defaultTitle: 'Service Handler', defaultSubtitle: 'Execution Logic' } },
  { keywords: ['server', 'api', 'backend', 'monolith', 'service', 'stripe', 'node', 'engine'], match: { type: 'server-blade', defaultTitle: 'Core Service', defaultSubtitle: 'Application Node' } },
];

const CONFLICT_WORDS = [
  'crash', 'fail', 'failure', 'attack', 'breach', 'overload', 'bottleneck', 'lock', 'deadlock',
  'spike', 'flood', 'slow', 'timeout', 'leak', 'phish', 'creep', 'escape', 'compromise',
  'double charge', 'duplicate', 'corrupt', 'error', '500', '504', 'wall', 'stall', 'exhaust',
];

const SUCCESS_WORDS = [
  'solve', 'fix', 'prevent', 'scale', 'verify', 'verified', 'safe', 'zero trust', 'fast', 'sub-',
  'optimal', '100%', '99.9', 'clean', 'instant', 'protect', 'contain', 'offboard', 'complete',
];

function detectStyle(prompt: string, requested?: VideoStylePreset | 'auto'): VideoStylePreset {
  if (requested && requested !== 'auto') return requested;
  const p = prompt.toLowerCase();
  if (
    p.includes('iam') || p.includes('identity') || p.includes('oauth') || p.includes('oidc') ||
    p.includes('jwt') || p.includes('sso') || p.includes('saml') || p.includes('passkey') ||
    p.includes('rbac') || p.includes('scim') || p.includes('zero trust') || p.includes('privilege')
  ) {
    return 'iam-security';
  }
  if (p.includes('agent') || p.includes('sandbox') || p.includes('swarm') || p.includes('exploit') || p.includes('breach')) {
    return 'ai-agents';
  }
  if (p.includes('tpu') || p.includes('systolic') || p.includes('sram') || p.includes('gpu') || p.includes('llm') || p.includes('transformer') || p.includes('neural')) {
    return 'ai-hardware';
  }
  if (p.includes('tree') || p.includes('algorithm') || p.includes('sort') || p.includes('big-o') || p.includes('binary search') || p.includes('complexity') || p.includes('consensus') || p.includes('raft')) {
    return 'algorithms-cs';
  }
  if (p.includes('brain') || p.includes('dopamine') || p.includes('habit') || p.includes('procrastin') || p.includes('focus') || p.includes('psychology')) {
    return 'psychology-story';
  }
  return 'tech-architecture';
}

function layoutPositions(count: number, aspectRatio: '16:9' | '9:16'): Array<{ x: number; y: number }> {
  if (aspectRatio === '9:16') {
    if (count === 1) return [{ x: 50, y: 50 }];
    if (count === 2) return [{ x: 50, y: 36 }, { x: 50, y: 66 }];
    if (count === 3) return [{ x: 50, y: 30 }, { x: 50, y: 52 }, { x: 50, y: 74 }];
    return [{ x: 50, y: 26 }, { x: 28, y: 51 }, { x: 72, y: 51 }, { x: 50, y: 74 }];
  }
  if (count === 1) return [{ x: 50, y: 54 }];
  if (count === 2) return [{ x: 28, y: 54 }, { x: 72, y: 54 }];
  if (count === 3) return [{ x: 19, y: 54 }, { x: 50, y: 54 }, { x: 81, y: 54 }];
  return [{ x: 16, y: 54 }, { x: 40, y: 54 }, { x: 64, y: 54 }, { x: 86, y: 54 }];
}

function resolveComponentForPhrase(phrase: string, fallbackType: ElementType = 'server-blade'): ComponentMatch {
  const lower = phrase.toLowerCase();
  for (const rule of ENTITY_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.match;
    }
  }
  return {
    type: fallbackType,
    defaultTitle: phrase.trim().slice(0, 26) || 'System Node',
    defaultSubtitle: 'Active Component',
  };
}

function extractMetricsFromText(text: string): string[] {
  const matches = text.match(/\b\d[\d.,]*\s*(?:ms|s|m|k|m|b|x|%|req\/s|rps|tb\/s|gb|mb|pflops|ops|users|agents|nodes|items|steps|minutes|sec)\b/gi);
  return matches ? matches.map((m) => m.trim()) : [];
}

function extractNamedConcepts(prompt: string): string[] {
  const stopWords = new Set([
    'how', 'why', 'what', 'when', 'where', 'with', 'without', 'using', 'from', 'into', 'that',
    'this', 'then', 'next', 'finally', 'under', 'over', 'high', 'single', 'million', 'billion',
    'every', 'system', 'systems', 'works', 'work', 'handles', 'handle', 'prevents', 'prevent',
    'explains', 'explained', 'step', 'across', 'between', 'before', 'after', 'inside',
  ]);

  // Prefer capitalized multi-word or domain phrases first
  const capPhrases = prompt.match(/\b[A-Z][a-zA-Z0-9.+-]*(?:\s+[A-Z0-9][a-zA-Z0-9.+-]*){0,2}\b/g) || [];
  const filteredCaps = capPhrases
    .map((s) => s.trim())
    .filter((s) => s.length > 2 && !stopWords.has(s.toLowerCase()));

  if (filteredCaps.length >= 2) {
    return Array.from(new Set(filteredCaps)).slice(0, 5);
  }

  // Fallback to meaningful nouns/words
  const words = prompt
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 3 && !stopWords.has(w.toLowerCase()));

  return Array.from(new Set(words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)))).slice(0, 5);
}

function extractActionLabel(text: string, fallback: string): string {
  const verbPatterns: Array<[RegExp, string]> = [
    [/\b(sync|provision|create|onboard)\w*/i, 'Provision / Sync'],
    [/\b(verify|check|validate|inspect|auth)\w*/i, 'Verify & Check'],
    [/\b(mint|issue|sign|encrypt|hash)\w*/i, 'Sign & Issue'],
    [/\b(cache|lookup|read|hit)\w*/i, 'Fast Lookup'],
    [/\b(write|persist|commit|store|save|record)\w*/i, 'Persist State'],
    [/\b(route|balance|forward|dispatch|resolve)\w*/i, 'Route Request'],
    [/\b(queue|buffer|stream|publish|emit)\w*/i, 'Async Stream'],
    [/\b(retry|fallback|recover|scale)\w*/i, 'Scale & Recover'],
    [/\b(block|deny|revoke|reject|drop)\w*/i, 'Block / Revoke'],
    [/\b(attack|flood|leak|bypass|exploit|overload)\w*/i, 'Surge / Exploit'],
  ];
  for (const [rx, lbl] of verbPatterns) {
    if (rx.test(text)) return lbl;
  }
  return fallback;
}

function inferSceneTone(text: string, idx: number, total: number): {
  status: ElementStatus;
  ambientGlow: string;
  headlineColor: string;
  isConflict: boolean;
  isSuccess: boolean;
} {
  const lower = text.toLowerCase();
  const isConflict = CONFLICT_WORDS.some((w) => lower.includes(w));
  const isSuccess = !isConflict && (SUCCESS_WORDS.some((w) => lower.includes(w)) || idx === total - 1);

  if (isConflict) {
    const isCritical = lower.includes('crash') || lower.includes('breach') || lower.includes('500') || lower.includes('deadlock') || lower.includes('fail');
    return {
      status: isCritical ? 'crashed' : 'warning',
      ambientGlow: isCritical ? '#EF4444' : '#F59E0B',
      headlineColor: isCritical ? '#F87171' : '#FBBF24',
      isConflict: true,
      isSuccess: false,
    };
  }
  if (isSuccess) {
    return {
      status: 'highlight',
      ambientGlow: '#10B981',
      headlineColor: '#34D399',
      isConflict: false,
      isSuccess: true,
    };
  }
  return {
    status: 'active',
    ambientGlow: '#06B6D4',
    headlineColor: '#38BDF8',
    isConflict: false,
    isSuccess: false,
  };
}

function buildBeatHeadline(text: string, idx: number, total: number, isConflict: boolean, isSuccess: boolean): { text: string; subtext: string } {
  // Strip filler prefixes for crisp documentary headline
  const cleaned = text
    .replace(/^(first|initially|next|then|meanwhile|finally|however|now|when|once|after that|step\s*\d+[:.]?)\s*,?\s*/i, '')
    .replace(/[.!?]+$/, '')
    .trim();

  const words = cleaned.split(/\s+/);
  const titleWords = words.slice(0, 6).join(' ').toUpperCase();
  const actTag =
    idx === 0
      ? 'ACT 1'
      : isConflict
      ? 'BOTTLENECK'
      : isSuccess && idx === total - 1
      ? 'VERIFIED RESULT'
      : `STEP ${idx + 1}`;

  return {
    text: titleWords.length > 36 ? titleWords.slice(0, 35) + '…' : `${actTag}: ${titleWords}`.slice(0, 44),
    subtext: cleaned.slice(0, 66),
  };
}

function splitInputIntoBeats(cleanPrompt: string, desiredCount?: number | 'auto'): Array<{ narration: string; arrowChain?: string[] }> {
  // Check if the user provided line breaks or multiple sentences
  const rawSegments = cleanPrompt
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.replace(/^\d+[.)]\s*|^[-*•]\s*/, '').trim())
    .filter((s) => s.length > 3);

  const count = desiredCount && desiredCount !== 'auto' ? desiredCount : 4;

  if (rawSegments.length >= 2) {
    const capped = rawSegments.slice(0, 6);
    return capped.map((seg) => {
      if (seg.includes('->') || seg.includes('➔') || seg.includes('=>')) {
        const parts = seg
          .split(/\s*(?:->|➔|=>)\s*/)
          .map((p) => p.trim())
          .filter(Boolean);
        return {
          narration: parts.join(' flows into ') + '.',
          arrowChain: parts.slice(0, 4),
        };
      }
      return { narration: seg };
    });
  }

  // Single-line topic OR single arrow chain -> decompose into a rich multi-act story!
  const single = rawSegments[0] || cleanPrompt;
  if (single.includes('->') || single.includes('➔') || single.includes('=>')) {
    const chain = single.split(/\s*(?:->|➔|=>)\s*/).map((p) => p.trim()).filter(Boolean);
    const acts: Array<{ narration: string; arrowChain?: string[] }> = [
      {
        narration: `Every request starts at ${chain[0] || 'the client'}, passing cleanly toward ${chain[1] || 'the gateway'}.`,
        arrowChain: chain.slice(0, Math.min(3, chain.length)),
      },
      {
        narration: `Under heavy scale or edge cases, naive traffic between ${chain[1] || chain[0]} and ${chain[chain.length - 1] || 'storage'} hits a bottleneck.`,
        arrowChain: chain.slice(Math.max(0, chain.length - 3)),
      },
      {
        narration: `Through coordinated ${chain.join(' -> ')}, each hop validates, buffers, and transforms payloads cleanly.`,
        arrowChain: chain.slice(0, 4),
      },
    ];
    if (count >= 4) {
      acts.push({
        narration: `As a result, the full ${chain[0]} to ${chain[chain.length - 1]} pipeline stays fast, resilient, and observable end-to-end.`,
        arrowChain: [chain[0], chain[chain.length - 1]],
      });
    }
    return acts.slice(0, count);
  }

  const cleanTopic = single.replace(/^(how|why|explain|what is)\s+/i, '').replace(/[?.!]+$/, '').trim();
  const concepts = extractNamedConcepts(cleanTopic);
  const c1 = concepts[0] || cleanTopic.slice(0, 22);
  const c2 = concepts[1] || 'Core Engine';
  const c3 = concepts[2] || 'State Layer';

  const generatedActs: string[] = [
    `To understand ${cleanTopic}, start with how ${c1} initiates the baseline flow into ${c2}.`,
    `The challenge appears when scale, concurrency, or attack pressure hits ${c2} and stalls ${c3} with contention.`,
    `To break the bottleneck, ${c1} and ${c2} introduce structured coordination before touching ${c3}.`,
    `Finally, verified telemetry confirms ${cleanTopic} stays fast, reliable, and fault-tolerant under real-world load.`,
    `Even better, continuous monitoring ensures zero silent failures as ${c1} scales across production.`,
  ];

  return generatedActs.slice(0, count).map((narration) => ({ narration }));
}

function buildElementsForBeat(
  beat: { narration: string; arrowChain?: string[] },
  style: VideoStylePreset,
  aspectRatio: '16:9' | '9:16',
  tone: ReturnType<typeof inferSceneTone>,
  sceneIdx: number,
  totalScenes: number,
  topicConcepts: string[]
): { elements: StudioElement[]; pipes: StudioPipe[] } {
  const { narration, arrowChain } = beat;
  const lower = narration.toLowerCase();
  const metrics = extractMetricsFromText(narration);

  const specs: Array<{ type: ElementType; title: string; subtitle: string; status: ElementStatus }> = [];

  if (arrowChain && arrowChain.length >= 2) {
    arrowChain.slice(0, 4).forEach((nodeName, i) => {
      const matched = resolveComponentForPhrase(nodeName, i === 0 ? 'client-devices' : 'server-blade');
      const nodeStatus: ElementStatus =
        tone.isConflict && i >= arrowChain.length - 2
          ? tone.status
          : tone.isSuccess && i === arrowChain.length - 1
          ? 'highlight'
          : 'active';
      specs.push({
        type: matched.type,
        title: nodeName.slice(0, 26),
        subtitle: matched.defaultSubtitle,
        status: nodeStatus,
      });
    });
  } else {
    // Scan beat text for all matching ENTITY_RULES in order of appearance!
    const found: Array<{ index: number; keyword: string; match: ComponentMatch }> = [];
    const seenTypes = new Set<ElementType>();

    for (const rule of ENTITY_RULES) {
      let bestPos = Infinity;
      let bestKw = '';
      for (const kw of rule.keywords) {
        const pos = lower.indexOf(kw);
        if (pos !== -1 && pos < bestPos) {
          bestPos = pos;
          bestKw = kw;
        }
      }
      if (bestPos !== Infinity && !seenTypes.has(rule.match.type)) {
        seenTypes.add(rule.match.type);
        found.push({ index: bestPos, keyword: bestKw, match: rule.match });
      }
    }

    found.sort((a, b) => a.index - b.index);

    const styleDefaults: Record<VideoStylePreset, ComponentMatch[]> = {
      'iam-security': [
        { type: 'character-desk', defaultTitle: 'Actor / Identity', defaultSubtitle: 'Workforce or Client' },
        { type: 'identity-idp', defaultTitle: 'Identity Provider', defaultSubtitle: 'Directory & SSO' },
        { type: 'access-policy', defaultTitle: 'Policy Engine', defaultSubtitle: 'RBAC / JIT Rules' },
      ],
      'ai-agents': [
        { type: 'agent-swarm', defaultTitle: 'Agent Fleet', defaultSubtitle: 'Autonomous Tasks' },
        { type: 'sandbox-container', defaultTitle: 'Execution Sandbox', defaultSubtitle: 'Boundary Control' },
        { type: 'firewall-shield', defaultTitle: 'Policy Guardrail', defaultSubtitle: 'Zero-Trust Audit' },
      ],
      'ai-hardware': [
        { type: 'client-devices', defaultTitle: 'Token Batch', defaultSubtitle: 'Model Input' },
        { type: 'systolic-array', defaultTitle: 'Compute Matrix', defaultSubtitle: 'Parallel MAC Array' },
        { type: 'cache-redis', defaultTitle: 'High-Speed Memory', defaultSubtitle: 'SRAM / HBM Cache' },
      ],
      'algorithms-cs': [
        { type: 'algorithm-array', defaultTitle: 'Input Structure', defaultSubtitle: 'Indexed Elements' },
        { type: 'binary-tree', defaultTitle: 'Search Structure', defaultSubtitle: 'Logarithmic Path' },
        { type: 'big-o-chart', defaultTitle: 'Time Complexity', defaultSubtitle: 'Asymptotic Proof' },
      ],
      'psychology-story': [
        { type: 'character-desk', defaultTitle: 'Focus State', defaultSubtitle: 'Initial Intention' },
        { type: 'habit-loop', defaultTitle: 'Behavioral Loop', defaultSubtitle: 'Cue ➔ Crave ➔ Reward' },
        { type: 'brain-dopamine', defaultTitle: 'Neural Circuit', defaultSubtitle: 'Dopamine Response' },
      ],
      'tech-architecture': [
        { type: 'client-devices', defaultTitle: topicConcepts[0] || 'Client Ingress', defaultSubtitle: 'Incoming Requests' },
        { type: 'server-blade', defaultTitle: topicConcepts[1] || 'Core Service', defaultSubtitle: 'Processing Tier' },
        { type: 'database-sql', defaultTitle: topicConcepts[2] || 'State Storage', defaultSubtitle: 'Persistent Layer' },
      ],
    };

    const chosen = found.slice(0, 3).map((f) => f.match);
    const fallbacks = styleDefaults[style];
    let fbIdx = 0;
    while (chosen.length < (sceneIdx === totalScenes - 1 ? 2 : 3) && fbIdx < fallbacks.length) {
      if (!chosen.some((c) => c.type === fallbacks[fbIdx].type)) {
        chosen.push(fallbacks[fbIdx]);
      }
      fbIdx++;
    }

    chosen.forEach((m, i) => {
      const customConcept = topicConcepts[i];
      const title =
        found[i]
          ? m.defaultTitle
          : customConcept && customConcept.length <= 22 && i < chosen.length - 1
          ? customConcept
          : m.defaultTitle;
      const st: ElementStatus =
        tone.isConflict && i >= chosen.length - 1
          ? tone.status
          : tone.isSuccess && i === chosen.length - 1
          ? 'highlight'
          : 'active';
      specs.push({
        type: m.type,
        title,
        subtitle: m.defaultSubtitle,
        status: st,
      });
    });

    // Add a live metric badge if numeric metrics were detected OR on the final payoff scene
    if (metrics.length > 0 && specs.length < 3) {
      specs.push({
        type: 'metric-badge',
        title: metrics[0].toUpperCase(),
        subtitle: tone.isConflict ? 'Bottleneck Measured' : 'Verified Benchmark',
        status: tone.isConflict ? 'warning' : 'highlight',
      });
    } else if (sceneIdx === totalScenes - 1 && !specs.some((s) => s.type === 'metric-badge')) {
      specs.push({
        type: 'metric-badge',
        title: metrics[0]?.toUpperCase() || '99.99% SLA',
        subtitle: topicConcepts[0] ? `${topicConcepts[0]} Verified` : 'Production Ready',
        status: 'highlight',
      });
    }
  }

  const finalSpecs = specs.slice(0, 4);
  const positions = layoutPositions(finalSpecs.length, aspectRatio);
  const widthBase = finalSpecs.length >= 4 ? 190 : finalSpecs.length === 3 ? 210 : 240;

  const elements: StudioElement[] = finalSpecs.map((spec, idx) => ({
    id: `el-${sceneIdx}-${idx}-${Date.now()}`,
    type: spec.type,
    title: spec.title,
    subtitle: spec.subtitle,
    x: positions[idx]?.x ?? 50,
    y: positions[idx]?.y ?? 54,
    width: aspectRatio === '9:16' ? Math.min(245, widthBase + 15) : widthBase,
    height: 145,
    status: spec.status,
    animation: spec.status === 'crashed' ? 'overload-shake' : spec.status === 'warning' ? 'pulse' : 'none',
    entranceBeat: Number(Math.min(0.55, idx * 0.16).toFixed(2)),
    customProps:
      spec.type === 'terminal-window'
        ? {
            lines: [
              `> step_${sceneIdx + 1}: "${spec.title}"`,
              `> action: ${extractActionLabel(narration, 'execute')}`,
              `> status: ${spec.status.toUpperCase()}`,
            ],
          }
        : undefined,
  }));

  const pipes: StudioPipe[] = [];
  const pipeLabel = extractActionLabel(narration, tone.isConflict ? 'High Load' : 'Data Flow');
  const pipeStatus = tone.status === 'crashed' ? 'crashed' : tone.status === 'warning' ? 'heavy' : 'normal';
  const pipeColor =
    pipeStatus === 'crashed' ? '#EF4444' : pipeStatus === 'heavy' ? '#F59E0B' : tone.isSuccess ? '#10B981' : '#06B6D4';

  for (let i = 0; i < elements.length - 1; i++) {
    pipes.push({
      id: `pipe-${sceneIdx}-${i}-${Date.now()}`,
      fromId: elements[i].id,
      toId: elements[i + 1].id,
      label: i === 0 ? pipeLabel : i === 1 && metrics[0] ? metrics[0] : 'Next Hop',
      packetSpeed: pipeStatus === 'heavy' || pipeStatus === 'crashed' ? 4.2 : 2.6,
      packetColor: pipeColor,
      status: pipeStatus,
      style: 'curved',
      drawBeat: Number(Math.min(0.55, 0.12 + i * 0.16).toFixed(2)),
    });
  }

  return { elements, pipes };
}

export function generateStudioProjectFromScript(options: GeneratorOptions): StudioProject {
  const {
    prompt,
    aspectRatio = '16:9',
    sceneDurationSec = 5.0,
    targetScenes = 'auto',
  } = options;

  const cleanPrompt = prompt.trim() || 'How Distributed Systems Scale Safely Under Load';
  const style = detectStyle(cleanPrompt, options.style);
  const beats = splitInputIntoBeats(cleanPrompt, targetScenes);
  const topicConcepts = extractNamedConcepts(cleanPrompt);
  const shortTitle = cleanPrompt.split('\n')[0].replace(/->/g, '➔').slice(0, 56);

  const themeByStyle: Record<VideoStylePreset, BackgroundTheme> = {
    'tech-architecture': 'dark-blueprint',
    'iam-security': 'deep-space',
    'ai-hardware': 'cyber-terminal',
    'ai-agents': 'dark-blueprint',
    'algorithms-cs': 'dark-blueprint',
    'psychology-story': 'clean-slate',
  };

  const cameraSequence: Array<{
    focus: CameraFocus;
    startZoom: number;
    zoom: number;
    startPanX: number;
    panX: number;
    transition: SceneTransition;
  }> = [
    { focus: 'pan-right', startZoom: 1.0, zoom: 1.07, startPanX: -2.5, panX: 2.5, transition: 'fade' },
    { focus: 'zoom-in', startZoom: 0.97, zoom: 1.12, startPanX: 0, panX: 0, transition: 'zoom' },
    { focus: 'pan-left', startZoom: 1.06, zoom: 1.0, startPanX: 2.5, panX: -2, transition: 'slide' },
    { focus: 'overview', startZoom: 1.05, zoom: 1.0, startPanX: 0, panX: 0, transition: 'fade' },
  ];

  const scenes: StudioScene[] = beats.map((beat, idx) => {
    const tone = inferSceneTone(beat.narration, idx, beats.length);
    const headline = buildBeatHeadline(beat.narration, idx, beats.length, tone.isConflict, tone.isSuccess);
    const { elements, pipes } = buildElementsForBeat(
      beat,
      style,
      aspectRatio,
      tone,
      idx,
      beats.length,
      topicConcepts
    );

    const cam = cameraSequence[idx % cameraSequence.length];
    const focus: CameraFocus = tone.status === 'crashed' ? 'shake' : cam.focus;

    const showHud = style !== 'psychology-story';
    const rpsVal = tone.status === 'crashed' ? 0 : tone.isConflict ? 14800 : tone.isSuccess ? 32000 : 1200 + idx * 900;
    const latVal = tone.status === 'crashed' ? 2400 : tone.isConflict ? 840 : tone.isSuccess ? 7 : 14;
    const cpuVal = tone.status === 'crashed' ? 99 : tone.isConflict ? 91 : tone.isSuccess ? 26 : 34;

    // Auto-scale duration slightly if narration is longer
    const wordCount = beat.narration.split(/\s+/).length;
    const computedDuration = Math.max(3.5, Math.min(9.0, Math.max(sceneDurationSec, Number((wordCount / 2.6).toFixed(1)))));

    return {
      id: `gen-scene-${idx}-${Date.now()}`,
      title: `Scene ${idx + 1}: ${headline.text.replace(/^ACT \d+:\s*|^STEP \d+:\s*/, '').slice(0, 28)}`,
      duration: computedDuration,
      narration: beat.narration,
      headline: {
        text: headline.text,
        subtext: headline.subtext,
        color: tone.headlineColor,
      },
      transition: cam.transition,
      camera: {
        focus,
        startZoom: cam.startZoom,
        startPanX: cam.startPanX,
        startPanY: 0,
        zoom: cam.zoom,
        panX: cam.panX,
        panY: 0,
      },
      background: {
        theme: themeByStyle[style],
        grid: style !== 'psychology-story',
        ambientGlow: tone.ambientGlow,
      },
      hud: showHud
        ? {
            show: true,
            rps: rpsVal,
            latencyMs: latVal,
            cpuPercent: cpuVal,
            statusText:
              tone.status === 'crashed'
                ? 'CRITICAL BOTTLENECK DETECTED'
                : tone.isConflict
                ? 'WARNING: HIGH CONTENTION'
                : tone.isSuccess
                ? 'VERIFIED OPTIMAL FLOW'
                : `STAGE ${idx + 1} ACTIVE`,
            statusColor: tone.headlineColor,
          }
        : { show: false },
      elements,
      pipes,
    };
  });

  return {
    title: shortTitle,
    aspectRatio,
    fps: 60,
    audio: {
      voiceEnabled: true,
      voiceRate: 1.05,
      voicePitch: 1.0,
      sfxEnabled: true,
      bgmEnabled: false,
    },
    scenes,
  };
}
