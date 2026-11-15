import React, { useState } from 'react';
import {
  Server,
  Database,
  ShieldCheck,
  Smartphone,
  Zap,
  Layers,
  Cpu,
  Microchip,
  GitBranch,
  TrendingUp,
  User,
  Sparkles,
  Flame,
  Plus,
  Radio,
  FileCode,
} from 'lucide-react';
import { useStudio } from '../../store/studioStore';
import { NodeTypeCategory } from '../../types/studio';

export const ComponentDrawer: React.FC = () => {
  const { addNode, currentPreset, triggerBeatAction } = useStudio();
  const [activeTab, setActiveTab] = useState<NodeTypeCategory>('system');

  const categories: { id: NodeTypeCategory; label: string }[] = [
    { id: 'system', label: 'Systems' },
    { id: 'hardware', label: 'Hardware' },
    { id: 'math', label: 'Algorithms' },
    { id: 'character', label: 'Characters' },
  ];

  const itemsMap: Record<NodeTypeCategory, Array<{ label: string; variant: string; icon: any; color: string }>> = {
    system: [
      { label: 'API Gateway', variant: 'gateway', icon: ShieldCheck, color: '#818CF8' },
      { label: 'Microservice', variant: 'server', icon: Server, color: '#34D399' },
      { label: 'PostgreSQL DB', variant: 'database', icon: Database, color: '#60A5FA' },
      { label: 'Kafka Event Pipe', variant: 'queue', icon: Layers, color: '#C084FC' },
      { label: 'Redis Cache', variant: 'cache', icon: Zap, color: '#FBBF24' },
      { label: 'Client App', variant: 'client', icon: Smartphone, color: '#38BDF8' },
    ],
    hardware: [
      { label: 'NVIDIA H100 GPU', variant: 'gpu', icon: Cpu, color: '#22C55E' },
      { label: 'HBM3 Memory', variant: 'vram', icon: Microchip, color: '#EAB308' },
      { label: 'vLLM Batcher', variant: 'batcher', icon: Radio, color: '#06B6D4' },
    ],
    math: [
      { label: 'Tree Node', variant: 'tree-node', icon: GitBranch, color: '#3B82F6' },
      { label: 'Complexity Plot', variant: 'plot', icon: TrendingUp, color: '#EC4899' },
      { label: 'Formula Card', variant: 'tree-root', icon: FileCode, color: '#10B981' },
    ],
    character: [
      { label: '2D Human Avatar', variant: 'human', icon: User, color: '#F97316' },
      { label: 'Brain Dopamine', variant: 'brain', icon: Sparkles, color: '#EC4899' },
    ],
    document: []
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-col shrink-0 z-10">
      <div className="p-3 border-b border-slate-800/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Component Library
        </h3>
        {/* Category Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`py-1 rounded font-medium transition-all ${
                activeTab === c.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Component Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-[11px] font-mono text-slate-500 mb-1">
          CLICK TO SPAWN ON CANVAS
        </div>
        {itemsMap[activeTab].map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => addNode(activeTab, item.label, item.variant)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700 transition-all group text-left shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center border"
                  style={{
                    backgroundColor: `${item.color}15`,
                    borderColor: `${item.color}40`,
                  }}
                >
                  <IconComponent className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span className="text-xs font-medium text-slate-200 group-hover:text-white">
                  {item.label}
                </span>
              </div>
              <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </button>
          );
        })}
      </div>

      {/* Quick Action Simulation Triggers */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/40">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          Story Beat Triggers
        </h4>
        <div className="space-y-1.5">
          {currentPreset.beats.map((beat) => (
            <button
              key={beat.id}
              onClick={() => triggerBeatAction(beat)}
              className="w-full text-left px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white transition-all flex items-center justify-between"
            >
              <span className="truncate pr-1">{beat.title}</span>
              <span className="text-[9px] font-mono text-slate-500 shrink-0">
                {beat.timestamp}s
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
