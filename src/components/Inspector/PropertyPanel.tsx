import React from 'react';
import {
  Sliders,
  Trash2,
  Activity,
  Layers,
  Sparkles,
  Palette,
  Clock,
  Video,
} from 'lucide-react';
import { useStudio } from '../../store/studioStore';
import { NodeStatus } from '../../types/studio';

export const PropertyPanel: React.FC = () => {
  const {
    selectedNode,
    setSelectedNode,
    setNodes,
    projectSettings,
    updateProjectSettings,
    edges,
    setEdges,
  } = useStudio();

  // If a node is selected, show its properties
  const handleUpdateSelectedNode = (key: string, value: any) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                [key]: value,
              },
            }
          : n
      )
    );
    setSelectedNode({
      ...selectedNode,
      data: {
        ...selectedNode.data,
        [key]: value,
      },
    });
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
    );
    setSelectedNode(null);
  };

  const statuses: { id: NodeStatus; label: string; color: string }[] = [
    { id: 'active', label: 'Active', color: '#10B981' },
    { id: 'stressed', label: 'Stressed (Shake)', color: '#F59E0B' },
    { id: 'crashed', label: 'Crashed (504 🔥)', color: '#EF4444' },
    { id: 'syncing', label: 'Syncing (⏱️)', color: '#06B6D4' },
  ];

  const colors = [
    '#38BDF8',
    '#818CF8',
    '#34D399',
    '#F59E0B',
    '#EF4444',
    '#EC4899',
    '#C084FC',
  ];

  return (
    <aside className="w-64 border-l border-slate-800 bg-slate-950/80 backdrop-blur-md p-3.5 flex flex-col shrink-0 z-10 overflow-y-auto">
      {selectedNode ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Node Properties
              </h3>
            </div>
            <button
              onClick={handleDeleteNode}
              className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete node"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Label */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Title Label
            </label>
            <input
              type="text"
              value={selectedNode.data.label}
              onChange={(e) => handleUpdateSelectedNode('label', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Sublabel */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Description / Tech
            </label>
            <input
              type="text"
              value={selectedNode.data.sublabel || ''}
              onChange={(e) => handleUpdateSelectedNode('sublabel', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status State Trigger */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
              Simulation State
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {statuses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleUpdateSelectedNode('status', s.id)}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold border transition-all text-left ${
                    selectedNode.data.status === s.id
                      ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block mr-1.5"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Badge */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-[11px] font-mono text-slate-400 block">
              Performance Metric
            </label>
            <input
              type="text"
              placeholder="e.g. Latency / IOPS"
              value={selectedNode.data.metricBadge || ''}
              onChange={(e) => handleUpdateSelectedNode('metricBadge', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="e.g. 10,000 req/s"
              value={selectedNode.data.metricValue || ''}
              onChange={(e) => handleUpdateSelectedNode('metricValue', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Accent Color */}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
              Accent Glow Color
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => handleUpdateSelectedNode('accentColor', c)}
                  className="w-6 h-6 rounded-full border border-slate-700 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Global Canvas & Video Settings */
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800">
            <Video className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Video Composition
            </h3>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={projectSettings.title}
              onChange={(e) => updateProjectSettings({ title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block">FPS</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                60 FPS
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block">ASPECT</span>
              <span className="text-sm font-bold font-mono text-sky-400">
                {projectSettings.aspectRatio}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[11px] font-mono text-slate-400">
                Active Wires
              </span>
              <span className="font-mono text-emerald-400">{edges.length} connections</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Connect any two nodes to instantly create glowing particle streams. Select any node to customize metrics and triggers.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
