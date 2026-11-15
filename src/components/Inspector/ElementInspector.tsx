import React from 'react';
import {
  Sliders,
  Trash2,
  Key,
  Palette,
  Type,
  Activity,
  Layers,
  Sparkles,
  Box,
} from 'lucide-react';
import { useCanvas } from '../../store/canvasStore';
import { BehaviorType, ShapeType, FontFamilyType } from '../../types/element';

const FONT_OPTIONS: { id: FontFamilyType; label: string; preview: string }[] = [
  { id: 'Inter', label: 'Inter', preview: 'Clean Modern Tech' },
  { id: 'Fira Code', label: 'Fira Code', preview: 'Developer / Monospace' },
  { id: 'Poppins', label: 'Poppins', preview: 'Bold YouTube Geometric' },
  { id: 'Space Grotesk', label: 'Space Grotesk', preview: 'Futuristic AI / Deep Tech' },
  { id: 'Outfit', label: 'Outfit', preview: 'Clean Minimalist' },
  { id: 'Bebas Neue', label: 'Bebas Neue', preview: 'Punchy Kinetic Headline' },
  { id: 'Playfair Display', label: 'Playfair Display', preview: 'Documentary / Vox Essay' },
  { id: 'Caveat', label: 'Caveat', preview: 'Handwritten / Psych Sketch' },
];

const BEHAVIORS: { id: BehaviorType; label: string }[] = [
  { id: 'none', label: 'Static' },
  { id: 'shake', label: 'Shake / Stress' },
  { id: 'pulse', label: 'Pulse / Breathe' },
  { id: 'heartbeat', label: 'Heartbeat (Dub-Lub)' },
  { id: 'bounce', label: 'Vertical Bounce' },
  { id: 'float', label: 'Levitate / Float' },
  { id: 'swing', label: 'Pendulum Swing' },
  { id: 'spin', label: 'Spin Rotate' },
  { id: 'orbit', label: 'Orbit Circle' },
  { id: 'neonFlicker', label: 'Neon Flicker' },
  { id: 'wave', label: 'Wave Ripple' },
  { id: 'glitch', label: 'Glitch Jitter' },
];

export const ElementInspector: React.FC = () => {
  const {
    selectedElement,
    updateElement,
    deleteElement,
    addKeyframeAtCurrentTime,
    project,
    updateProject,
  } = useCanvas();

  const palette = [
    '#38BDF8',
    '#818CF8',
    '#34D399',
    '#F59E0B',
    '#EF4444',
    '#EC4899',
    '#A855F7',
    '#FFFFFF',
    '#0F172A',
  ];

  return (
    <aside className="w-72 border-l border-slate-800 bg-slate-950/90 backdrop-blur-md p-4 flex flex-col shrink-0 z-10 overflow-y-auto">
      {selectedElement ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Inspector
              </h3>
            </div>
            <button
              onClick={() => deleteElement(selectedElement.id)}
              className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete element"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Label / Name */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Title
            </label>
            <input
              type="text"
              value={selectedElement.name}
              onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Sublabel / Description */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={selectedElement.sublabel || ''}
              onChange={(e) => updateElement(selectedElement.id, { sublabel: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Font Family Picker */}
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono text-slate-400">
              <Type className="w-3.5 h-3.5 text-indigo-400" />
              <span>Font Family</span>
            </div>
            <select
              value={selectedElement.fontFamily || 'Inter'}
              onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value as FontFamilyType })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id} style={{ fontFamily: f.id }}>
                  {f.label} ({f.preview})
                </option>
              ))}
            </select>
          </div>

          {/* Animation Behavior */}
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Motion Animation</span>
            </div>
            <select
              value={selectedElement.behavior}
              onChange={(e) => updateElement(selectedElement.id, { behavior: e.target.value as BehaviorType })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              {BEHAVIORS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* Metric Badge */}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Badge Label
            </label>
            <input
              type="text"
              placeholder="e.g. 10,000 req/s or Healthy"
              value={selectedElement.badgeText || ''}
              onChange={(e) => updateElement(selectedElement.id, { badgeText: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Internal Progress Gauge */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Metric Gauge Bar</span>
              <span>{selectedElement.progressValue !== undefined ? `${selectedElement.progressValue}%` : 'Off'}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={selectedElement.progressValue || 0}
              onChange={(e) => updateElement(selectedElement.id, { progressValue: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Stroke & Glow Palette */}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
              Accent & Glow Palette
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {palette.map((c) => (
                <button
                  key={c}
                  onClick={() => updateElement(selectedElement.id, { stroke: c, glowColor: c })}
                  className="w-5 h-5 rounded-full border border-slate-700 hover:scale-125 transition-transform"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Keyframe Operations */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-slate-400">Keyframe Tracks</span>
              <span className="font-mono text-indigo-400">{selectedElement.keyframes.length} saved</span>
            </div>
            <button
              onClick={() => addKeyframeAtCurrentTime(selectedElement.id)}
              className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              Stamp Keyframe at Playhead
            </button>
          </div>
        </div>
      ) : (
        /* Global Canvas Settings */
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800">
            <Box className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Project Settings
            </h3>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => updateProject({ title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Timeline Duration (Seconds)
            </label>
            <input
              type="number"
              min={5}
              max={120}
              value={project.duration}
              onChange={(e) => updateProject({ duration: Math.max(5, Number(e.target.value)) })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
            <p className="font-semibold text-slate-300 mb-1">Custom Components & Fonts:</p>
            Choose between 8 YouTube font families (Poppins, Inter, Fira Code, Space Grotesk, Bebas Neue, Playfair Display, Caveat) and 12 animation behaviors.
          </div>
        </div>
      )}
    </aside>
  );
};
