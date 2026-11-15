import React, { useState } from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { ElementType } from '../../types/videoStudio';
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
} from 'lucide-react';
import { voiceover } from '../../utils/voiceover';

export const StudioSidebar: React.FC = () => {
  const {
    activeScene,
    addElement,
    updateSceneNarration,
    updateSceneDuration,
    updateSceneCamera,
    updateSceneHUD,
    setElementStatus,
    activeElementId,
  } = useVideoStudio();

  const [activeTab, setActiveTab] = useState<'components' | 'motion' | 'voice'>('components');

  return (
    <aside className="w-80 h-full bg-[#090D16] border-r border-slate-800/80 flex flex-col select-none z-20">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-slate-800/80 p-1.5 gap-1 bg-[#070A12]">
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'components'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Assets</span>
        </button>

        <button
          onClick={() => setActiveTab('motion')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'motion'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Motion FX</span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'voice'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
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
                <span>System Architecture (Visualcoders)</span>
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
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addElement(item.type)}
                    className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex flex-col items-center gap-1.5 text-center transition-all group shadow-sm"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-900 group-hover:scale-110 transition-transform">
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
                <span>Algorithms & CS (ByteMonk)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'binary-tree' as ElementType, label: 'Binary Tree', icon: <GitBranch className="w-4 h-4 text-emerald-400" /> },
                  { type: 'big-o-chart' as ElementType, label: 'Big-O Chart', icon: <BarChart2 className="w-4 h-4 text-indigo-400" /> },
                  { type: 'algorithm-array' as ElementType, label: 'Array Pointers', icon: <Sliders className="w-4 h-4 text-cyan-400" /> },
                  { type: 'callout-card' as ElementType, label: 'Callout Card', icon: <Plus className="w-4 h-4 text-amber-400" /> },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addElement(item.type)}
                    className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex flex-col items-center gap-1.5 text-center transition-all group shadow-sm"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-900 group-hover:scale-110 transition-transform">
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
                <span>Psychology & Story (PsychToons)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'brain-dopamine' as ElementType, label: 'Brain Dopamine', icon: <Brain className="w-4 h-4 text-fuchsia-400" /> },
                  { type: 'character-desk' as ElementType, label: 'Deep Work Desk', icon: <User className="w-4 h-4 text-cyan-400" /> },
                  { type: 'character-phone' as ElementType, label: 'Phone Scroll', icon: <Smartphone className="w-4 h-4 text-pink-400" /> },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addElement(item.type)}
                    className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex flex-col items-center gap-1.5 text-center transition-all group shadow-sm"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-900 group-hover:scale-110 transition-transform">
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

        {/* TAB 2: 1-CLICK MOTION & CAMERA DIRECTING */}
        {activeTab === 'motion' && (
          <div className="space-y-4">
            {/* Cinematic Camera */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cinematic Camera Focus</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { focus: 'overview', zoom: 1.0, label: '1.0x Full' },
                  { focus: 'zoom-in', zoom: 1.25, label: '1.25x Focus' },
                  { focus: 'shake', zoom: 1.3, label: '⚡ Crash Shake' },
                ].map((cam) => (
                  <button
                    key={cam.focus}
                    onClick={() => updateSceneCamera(cam.zoom, cam.focus)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold border transition-colors ${
                      activeScene.camera.focus === cam.focus
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
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
                    RPS ➔ 10,000 • Latency ➔ 1.4s
                  </div>
                </div>
                <span className="text-xs text-amber-400 font-bold">▶</span>
              </button>

              <button
                onClick={() => {
                  updateSceneHUD({
                    rps: 0,
                    latencyMs: 9999,
                    cpuPercent: 100,
                    statusText: 'CRITICAL: 500 CRASH',
                    statusColor: '#EF4444',
                  });
                  updateSceneCamera(1.3, 'shake');
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
                    Overload explosion + screen shake
                  </div>
                </div>
                <span className="text-xs text-red-400 font-bold">▶</span>
              </button>

              <button
                onClick={() => {
                  updateSceneHUD({
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

        {/* TAB 3: NARRATION & AUTO SUBTITLES */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Scene Voiceover Script</span>
                </label>
                <button
                  onClick={() => voiceover.speak(activeScene.narration)}
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
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none shadow-inner"
              />
            </div>

            {/* Scene Duration */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">Scene Duration</span>
                <span className="font-mono font-bold text-cyan-400">{activeScene.duration}s</span>
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
          </div>
        )}
      </div>
    </aside>
  );
};
