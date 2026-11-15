import React, { useState } from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { BackgroundTheme, ElementType, SceneTransition } from '../../types/videoStudio';
import {
  Layers,
  Zap,
  Mic,
  Camera,
  Server,
  Cpu,
  Database,
  Smartphone,
  Terminal,
  GitBranch,
  BarChart2,
  Brain,
  User,
  Sliders,
  Play,
  Flame,
  Radio,
  Plus,
  ShieldCheck,
  Cloud,
  Sigma,
  Repeat,
  Scale,
  TrendingUp,
  Bot,
  Lock,
  Grid,
  Sparkles,
  KeyRound,
  BadgeCheck,
  UserCheck,
  FileSearch,
} from 'lucide-react';
import { voiceover } from '../../utils/voiceover';

export const StudioSidebar: React.FC = () => {
  const {
    project,
    activeScene,
    addElement,
    updateSceneTitle,
    updateSceneNarration,
    updateSceneDuration,
    updateSceneCamera,
    updateSceneHUD,
    updateSceneBackground,
    updateSceneHeadline,
    updateSceneTransition,
    setElementStatus,
    activeElementId,
    setVoiceRate,
    toggleSfxEnabled,
  } = useVideoStudio();

  const [activeTab, setActiveTab] = useState<'components' | 'motion' | 'voice'>('components');

  return (
    <aside className="w-80 h-full bg-[#090D16] border-r border-slate-800/80 flex flex-col select-none z-20 shrink-0">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-slate-800/80 p-1.5 gap-1 bg-[#070A12]">
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'components'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Assets</span>
        </button>

        <button
          onClick={() => setActiveTab('motion')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'motion'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Scene & FX</span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'voice'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-cyan-400" />
          <span>Narration</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: ASSET PALETTE */}
        {activeTab === 'components' && (
          <div className="space-y-4">
            {/* Tech & Architecture */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                <Server className="w-3 h-3 text-cyan-400" />
                <span>System Architecture</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'server-blade' as ElementType, label: 'Server Blade', icon: <Server className="w-4 h-4 text-cyan-400" /> },
                  { type: 'gpu-chip' as ElementType, label: 'H100 GPU Chip', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
                  { type: 'load-balancer' as ElementType, label: 'Load Balancer', icon: <Radio className="w-4 h-4 text-indigo-400" /> },
                  { type: 'database-sql' as ElementType, label: 'Postgres DB', icon: <Database className="w-4 h-4 text-sky-400" /> },
                  { type: 'client-devices' as ElementType, label: 'Client Devices', icon: <Smartphone className="w-4 h-4 text-cyan-400" /> },
                  { type: 'terminal-window' as ElementType, label: 'Code Terminal', icon: <Terminal className="w-4 h-4 text-purple-400" /> },
                  { type: 'cache-redis' as ElementType, label: 'Redis Cache', icon: <Zap className="w-4 h-4 text-rose-400" /> },
                  { type: 'kafka-stream' as ElementType, label: 'Kafka Queue', icon: <Layers className="w-4 h-4 text-amber-400" /> },
                  { type: 'firewall-shield' as ElementType, label: 'TLS Shield', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
                  { type: 'cloud-pod' as ElementType, label: 'Cloud Pods', icon: <Cloud className="w-4 h-4 text-sky-400" /> },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addElement(item.type)}
                    className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex flex-col items-center gap-1.5 text-center transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-950 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Agents & Silicon */}
            <div className="border-t border-slate-800 pt-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                <Bot className="w-3 h-3 text-cyan-400" />
                <span>AI Agents &amp; Silicon</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'agent-swarm' as ElementType, label: 'Agent Swarm', icon: <Bot className="w-4 h-4 text-cyan-400" /> },
                  { type: 'systolic-array' as ElementType, label: 'Systolic Array', icon: <Grid className="w-4 h-4 text-emerald-400" /> },
                  { type: 'sandbox-container' as ElementType, label: 'Sandbox Vault', icon: <Lock className="w-4 h-4 text-amber-400" /> },
                  { type: 'kinetic-title' as ElementType, label: 'Kinetic Title', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addElement(item.type)}
                    className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex flex-col items-center gap-1.5 text-center transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-950 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Identity & IAM Security */}
            <div className="border-t border-slate-800 pt-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3 h-3 text-sky-400" />
                <span>Identity &amp; IAM Security</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'identity-idp' as ElementType, label: 'Identity IdP', icon: <UserCheck className="w-4 h-4 text-sky-400" /> },
                  { type: 'auth-token' as ElementType, label: 'OIDC / JWT', icon: <KeyRound className="w-4 h-4 text-indigo-400" /> },
                  { type: 'access-policy' as ElementType, label: 'RBAC & JIT', icon: <BadgeCheck className="w-4 h-4 text-emerald-400" /> },
                  { type: 'siem-audit' as ElementType, label: 'SIEM Audit', icon: <FileSearch className="w-4 h-4 text-cyan-400" /> },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addElement(item.type)}
                    className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex flex-col items-center gap-1.5 text-center transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-950 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Algorithms & Computer Science */}
            <div className="border-t border-slate-800 pt-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                <GitBranch className="w-3 h-3 text-emerald-400" />
                <span>Algorithms & Math</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'binary-tree' as ElementType, label: 'Binary Tree', icon: <GitBranch className="w-4 h-4 text-emerald-400" /> },
                  { type: 'big-o-chart' as ElementType, label: 'Big-O Chart', icon: <BarChart2 className="w-4 h-4 text-indigo-400" /> },
                  { type: 'algorithm-array' as ElementType, label: 'Array Pointers', icon: <Sliders className="w-4 h-4 text-cyan-400" /> },
                  { type: 'math-formula' as ElementType, label: 'Math Formula', icon: <Sigma className="w-4 h-4 text-indigo-300" /> },
                  { type: 'metric-badge' as ElementType, label: 'Metric Stat', icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
                  { type: 'callout-card' as ElementType, label: 'Callout Card', icon: <Plus className="w-4 h-4 text-amber-400" /> },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addElement(item.type)}
                    className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex flex-col items-center gap-1.5 text-center transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-950 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Psychology & Characters */}
            <div className="border-t border-slate-800 pt-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                <Brain className="w-3 h-3 text-fuchsia-400" />
                <span>Psychology & Story</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'brain-dopamine' as ElementType, label: 'Brain Dopamine', icon: <Brain className="w-4 h-4 text-fuchsia-400" /> },
                  { type: 'character-desk' as ElementType, label: 'Deep Work Desk', icon: <User className="w-4 h-4 text-cyan-400" /> },
                  { type: 'character-phone' as ElementType, label: 'Phone Scroll', icon: <Smartphone className="w-4 h-4 text-pink-400" /> },
                  { type: 'habit-loop' as ElementType, label: 'Habit Loop', icon: <Repeat className="w-4 h-4 text-amber-400" /> },
                  { type: 'split-comparison' as ElementType, label: 'Before vs After', icon: <Scale className="w-4 h-4 text-cyan-300" /> },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addElement(item.type)}
                    className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex flex-col items-center gap-1.5 text-center transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-950 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCENE HEADLINE, THEME, CAMERA & MOTION FX */}
        {activeTab === 'motion' && (
          <div className="space-y-4">
            {/* Scene Title & Headline */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="text-xs font-bold text-white">Scene Headline & Transition</div>
              <input
                type="text"
                value={activeScene.title}
                onChange={(e) => updateSceneTitle(e.target.value)}
                placeholder="Scene label..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={activeScene.headline?.text || ''}
                onChange={(e) =>
                  updateSceneHeadline({
                    text: e.target.value,
                    subtext: activeScene.headline?.subtext || '',
                    color: activeScene.headline?.color || '#06B6D4',
                  })
                }
                placeholder="On-screen kinetic headline..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={activeScene.headline?.subtext || ''}
                onChange={(e) =>
                  updateSceneHeadline({
                    text: activeScene.headline?.text || '',
                    subtext: e.target.value,
                    color: activeScene.headline?.color || '#06B6D4',
                  })
                }
                placeholder="Headline subtext..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
              />

              <div className="grid grid-cols-4 gap-1 pt-1">
                {(['fade', 'zoom', 'slide', 'cut'] as SceneTransition[]).map((tr) => (
                  <button
                    key={tr}
                    onClick={() => updateSceneTransition(tr)}
                    className={`py-1 rounded text-[10px] font-mono uppercase border ${
                      (activeScene.transition || 'fade') === tr
                        ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {tr}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Theme */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Backdrop & Grid</span>
                <button
                  onClick={() => updateSceneBackground({ grid: !activeScene.background.grid })}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    activeScene.background.grid
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {activeScene.background.grid ? 'Grid On' : 'Grid Off'}
                </button>
              </div>
              <select
                value={activeScene.background.theme}
                onChange={(e) => updateSceneBackground({ theme: e.target.value as BackgroundTheme })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="dark-blueprint">Dark Blueprint</option>
                <option value="cyber-terminal">Cyber Terminal</option>
                <option value="clean-slate">Clean Slate</option>
                <option value="psychology-split">Psychology Split</option>
                <option value="deep-space">Deep Space</option>
              </select>
            </div>

            {/* Live HUD Telemetry Editor */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Top HUD Telemetry</span>
                <button
                  onClick={() => updateSceneHUD({ show: !activeScene.hud.show })}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    activeScene.hud.show
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {activeScene.hud.show ? 'HUD On' : 'Hidden'}
                </button>
              </div>
              {activeScene.hud.show && (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={activeScene.hud.statusText || ''}
                    onChange={(e) => updateSceneHUD({ statusText: e.target.value })}
                    placeholder="HUD status banner..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="grid grid-cols-3 gap-1.5 tabular-nums">
                    <div>
                      <label className="text-[9px] font-mono text-slate-500 block mb-0.5">RPS</label>
                      <input
                        type="number"
                        value={activeScene.hud.rps ?? 0}
                        onChange={(e) => updateSceneHUD({ rps: Math.max(0, Number(e.target.value) || 0) })}
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-slate-500 block mb-0.5">LAT (ms)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={activeScene.hud.latencyMs ?? 0}
                        onChange={(e) => updateSceneHUD({ latencyMs: Math.max(0, Number(e.target.value) || 0) })}
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-slate-500 block mb-0.5">CPU (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={activeScene.hud.cpuPercent ?? 0}
                        onChange={(e) => updateSceneHUD({ cpuPercent: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-300 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cinematic Camera Drift & Focus */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>Camera Motion Path</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { focus: 'overview', zoom: 1.0, panX: 0, panY: 0, startZoom: 1.0, startPanX: 0, startPanY: 0, label: '1.0x Overview' },
                  { focus: 'zoom-in', zoom: 1.14, panX: 0, panY: 0, startZoom: 0.96, startPanX: 0, startPanY: 0, label: 'Slow Push-In' },
                  { focus: 'pan-right', zoom: 1.08, panX: 3.5, panY: 0, startZoom: 1.0, startPanX: -3.5, startPanY: 0, label: 'Pan L ➔ R' },
                  { focus: 'pan-left', zoom: 1.0, panX: -3, panY: 0, startZoom: 1.06, startPanX: 3, startPanY: 0, label: 'Pan R ➔ L' },
                  { focus: 'shake', zoom: 1.18, panX: 0, panY: 0, startZoom: 1.08, startPanX: 0, startPanY: 0, label: 'Crash Shake' },
                ].map((cam) => (
                  <button
                    key={cam.focus}
                    onClick={() =>
                      updateSceneCamera(cam.zoom, cam.focus, cam.panX, cam.panY, cam.startZoom, cam.startPanX, cam.startPanY)
                    }
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold border transition-colors whitespace-nowrap ${
                      activeScene.camera.focus === cam.focus
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Event Triggers */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                1-Click Story Events
              </div>

              <button
                onClick={() => {
                  updateSceneHUD({
                    show: true,
                    rps: 10450,
                    latencyMs: 1480,
                    cpuPercent: 94,
                    statusText: 'WARNING: 10,000 REQ SURGE',
                    statusColor: '#F59E0B',
                  });
                  if (activeElementId) setElementStatus(activeElementId, 'warning');
                }}
                className="w-full p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 hover:bg-amber-900/50 flex items-center justify-between transition-colors text-left"
              >
                <div>
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Trigger Traffic Surge</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    RPS ➔ 10,000 · Latency ➔ 1.4s
                  </div>
                </div>
                <span className="text-xs text-amber-400 font-bold">▶</span>
              </button>

              <button
                onClick={() => {
                  updateSceneHUD({
                    show: true,
                    rps: 0,
                    latencyMs: 9999,
                    cpuPercent: 100,
                    statusText: 'CRITICAL: 500 CRASH',
                    statusColor: '#EF4444',
                  });
                  updateSceneCamera(1.2, 'shake');
                  if (activeElementId) setElementStatus(activeElementId, 'crashed');
                }}
                className="w-full p-2.5 rounded-xl bg-red-950/40 border border-red-500/50 hover:bg-red-900/50 flex items-center justify-between transition-colors text-left"
              >
                <div>
                  <div className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Blow Up Server (500 Error)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Overload alert + screen shake
                  </div>
                </div>
                <span className="text-xs text-red-400 font-bold">▶</span>
              </button>

              <button
                onClick={() => {
                  updateSceneHUD({
                    show: true,
                    rps: 12500,
                    latencyMs: 14,
                    cpuPercent: 28,
                    statusText: 'HEALTHY: AUTO-SCALED',
                    statusColor: '#10B981',
                  });
                  updateSceneCamera(1.0, 'overview');
                  if (activeElementId) setElementStatus(activeElementId, 'active');
                }}
                className="w-full p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 hover:bg-emerald-900/50 flex items-center justify-between transition-colors text-left"
              >
                <div>
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Balance & Stabilize</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Distribute load across nodes
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-bold">▶</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: NARRATION & AUDIO */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Scene Voiceover Script</span>
                </label>
                <button
                  onClick={() => voiceover.speak(activeScene.narration, { rate: project.audio.voiceRate })}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test Voice</span>
                </button>
              </div>

              <textarea
                value={activeScene.narration}
                onChange={(e) => updateSceneNarration(e.target.value)}
                rows={5}
                placeholder="Type your narration here. The app will speak it and create live animated subtitles on screen..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
              />
            </div>

            {/* Scene Duration */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs tabular-nums">
                <span className="font-bold text-slate-300">Scene Duration</span>
                <span className="font-mono font-bold text-cyan-400">{activeScene.duration.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="12.0"
                step="0.5"
                value={activeScene.duration}
                onChange={(e) => updateSceneDuration(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Voice Rate & SFX */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs tabular-nums mb-1">
                  <span className="font-bold text-slate-300">Voiceover Speed</span>
                  <span className="font-mono font-bold text-indigo-300">{project.audio.voiceRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={project.audio.voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300">Studio Sound Effects</span>
                <button
                  onClick={toggleSfxEnabled}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${
                    project.audio.sfxEnabled
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {project.audio.sfxEnabled ? 'SFX On' : 'SFX Off'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
