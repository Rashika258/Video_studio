import React, { useState } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Server,
  Database,
  Cpu,
  Brain,
  Rocket,
  Zap,
  ShieldCheck,
  Terminal,
  Code2,
  Layers,
  Lock,
  Globe,
  Activity,
  Box,
  Workflow,
  BookmarkPlus,
} from 'lucide-react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { CustomBlockConfig, ElementStatus, StudioElement } from '../../types/videoStudio';

const ICON_OPTIONS = [
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Server', icon: Server },
  { name: 'Database', icon: Database },
  { name: 'Cpu', icon: Cpu },
  { name: 'Brain', icon: Brain },
  { name: 'Rocket', icon: Rocket },
  { name: 'Zap', icon: Zap },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Terminal', icon: Terminal },
  { name: 'Code2', icon: Code2 },
  { name: 'Layers', icon: Layers },
  { name: 'Lock', icon: Lock },
  { name: 'Globe', icon: Globe },
  { name: 'Activity', icon: Activity },
  { name: 'Box', icon: Box },
  { name: 'Workflow', icon: Workflow },
];

const ACCENT_SWATCHES = ['#06B6D4', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#F8FAFC'];

const LAYOUT_MODES: Array<{ id: CustomBlockConfig['layoutMode']; label: string; desc: string }> = [
  { id: 'gauge', label: 'Metric Gauge', desc: 'Progress bar + stat' },
  { id: 'specs', label: 'Key/Value Specs', desc: 'Clean metric rows' },
  { id: 'steps', label: 'Pipeline Steps', desc: 'Ordered checkpoints' },
  { id: 'hero', label: 'Hero Callout', desc: 'Big focal stat' },
];

export const StudioCustomBuilderModal: React.FC = () => {
  const { isCustomBuilderOpen, setIsCustomBuilderOpen, addCustomElement, saveCustomBlock } =
    useVideoStudio();

  const [title, setTitle] = useState('Edge Rate Limiter');
  const [subtitle, setSubtitle] = useState('Token Bucket · 10k req/s');
  const [selectedIcon, setSelectedIcon] = useState('ShieldCheck');
  const [accentColor, setAccentColor] = useState('#06B6D4');
  const [badgeText, setBadgeText] = useState('ACTIVE');
  const [layoutMode, setLayoutMode] = useState<CustomBlockConfig['layoutMode']>('gauge');
  const [gaugeValue, setGaugeValue] = useState(78);
  const [gaugeLabel, setGaugeLabel] = useState('Capacity');
  const [rowsText, setRowsText] = useState('Region: global-edge\nLatency: 3.4ms\nBurst: 2,500/s');
  const [width, setWidth] = useState(235);
  const [height, setHeight] = useState(150);
  const [status, setStatus] = useState<ElementStatus>('active');
  const [animation, setAnimation] = useState<StudioElement['animation']>('none');

  if (!isCustomBuilderOpen) return null;

  const parsedRows = rowsText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);

  const buildPayload = () => ({
    title: title.trim() || 'Custom Block',
    subtitle: subtitle.trim(),
    width,
    height,
    status,
    animation,
    customProps: {
      icon: selectedIcon,
      accentColor,
      badgeText: badgeText.trim(),
      layoutMode,
      gaugeValue,
      gaugeLabel: gaugeLabel.trim() || 'Load',
      rows: parsedRows,
    },
  });

  const handleAddOnce = () => {
    addCustomElement(buildPayload());
    setIsCustomBuilderOpen(false);
  };

  const handleSaveAndAdd = () => {
    const payload = buildPayload();
    saveCustomBlock(payload);
    addCustomElement(payload);
    setIsCustomBuilderOpen(false);
  };

  const PreviewIcon = ICON_OPTIONS.find((item) => item.name === selectedIcon)?.icon || Sparkles;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none">
      <div className="w-full max-w-4xl bg-[#0B101B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Custom Block Studio</h3>
              <p className="text-xs text-slate-400">
                Design reusable cards, metrics, pipelines, and callouts — rendered identically in MP4/WebM export.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomBuilderOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close custom builder"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Block Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Footer Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Layout Mode */}
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                Card Body Layout
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LAYOUT_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setLayoutMode(mode.id)}
                    className={`p-2 rounded-xl border text-left transition-colors ${
                      layoutMode === mode.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{mode.label}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                Icon
              </label>
              <div className="grid grid-cols-8 gap-1.5">
                {ICON_OPTIONS.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setSelectedIcon(item.name)}
                      title={item.name}
                      className={`h-8 rounded-lg border flex items-center justify-center transition-colors ${
                        selectedIcon === item.name
                          ? 'border-cyan-400 bg-cyan-500/20 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {ACCENT_SWATCHES.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setAccentColor(hex)}
                      aria-label={`Select accent color ${hex}`}
                      className={`w-6 h-6 rounded-full border transition-transform ${
                        accentColor === hex ? 'border-white scale-110 ring-2 ring-white/40' : 'border-slate-700'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Top-Right Tag Badge
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="e.g. 99.9% SLA"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Layout-specific configuration */}
            {layoutMode === 'gauge' && (
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1 tabular-nums">
                    <span>GAUGE PERCENT</span>
                    <span className="text-cyan-300 font-bold">{gaugeValue}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={gaugeValue}
                    onChange={(e) => setGaugeValue(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">GAUGE LABEL</label>
                  <input
                    type="text"
                    value={gaugeLabel}
                    onChange={(e) => setGaugeLabel(e.target.value)}
                    className="w-full px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {(layoutMode === 'specs' || layoutMode === 'steps' || layoutMode === 'hero') && (
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  {layoutMode === 'hero'
                    ? 'Hero Metric Line (First line shown large)'
                    : layoutMode === 'steps'
                    ? 'Pipeline Steps (1 per line, up to 3)'
                    : 'Spec Rows (key: value, 1 per line, up to 3)'}
                </label>
                <textarea
                  rows={3}
                  value={rowsText}
                  onChange={(e) => setRowsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            )}

            {/* Dimensions & Motion */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 tabular-nums">
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>WIDTH</span>
                  <span>{width}px</span>
                </div>
                <input
                  type="range"
                  min={180}
                  max={340}
                  step={5}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>HEIGHT</span>
                  <span>{height}px</span>
                </div>
                <input
                  type="range"
                  min={120}
                  max={220}
                  step={5}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">STATUS</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ElementStatus)}
                  className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 focus:outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="active">Active</option>
                  <option value="warning">Warning</option>
                  <option value="crashed">Crashed</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">MOTION</label>
                <select
                  value={animation || 'none'}
                  onChange={(e) => setAnimation(e.target.value as StudioElement['animation'])}
                  className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 focus:outline-none"
                >
                  <option value="none">Static</option>
                  <option value="pulse">Pulse</option>
                  <option value="float">Float</option>
                  <option value="overload-shake">Shake</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#060911] border border-slate-800 rounded-2xl relative overflow-hidden min-h-[260px]">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500">
              STAGE PREVIEW ({width}×{height}px)
            </span>

            {/* Card Preview matching ElementRenderer custom-card */}
            <div
              className="rounded-2xl p-3.5 border flex flex-col justify-between shadow-2xl relative z-10 bg-slate-950/95"
              style={{
                width: `${Math.min(280, width)}px`,
                height: `${Math.min(185, height)}px`,
                borderColor: status === 'crashed' ? '#EF4444' : status === 'warning' ? '#F59E0B' : accentColor,
                boxShadow: `0 0 26px -4px ${accentColor}55`,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center border shrink-0"
                    style={{ backgroundColor: `${accentColor}20`, borderColor: `${accentColor}55` }}
                  >
                    <PreviewIcon className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-white truncate">
                    {title || 'Custom Block'}
                  </span>
                </div>
                {badgeText && (
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0"
                    style={{
                      color: accentColor,
                      backgroundColor: `${accentColor}1E`,
                      borderColor: `${accentColor}55`,
                    }}
                  >
                    {badgeText}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="my-1 flex-1 flex flex-col justify-center">
                {layoutMode === 'gauge' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono tabular-nums">
                      <span className="text-slate-400">{gaugeLabel || 'Load'}</span>
                      <span className="font-bold" style={{ color: accentColor }}>
                        {gaugeValue}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{ width: `${gaugeValue}%`, backgroundColor: accentColor }}
                      />
                    </div>
                  </div>
                )}

                {layoutMode === 'specs' && (
                  <div className="space-y-1">
                    {(parsedRows.length > 0 ? parsedRows.slice(0, 3) : ['Key: Value']).map((row, idx) => {
                      const [k, ...rest] = row.split(':');
                      const val = rest.join(':').trim();
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9.5px] font-mono"
                        >
                          <span className="text-slate-400 truncate">{k}</span>
                          {val && (
                            <span className="font-bold shrink-0 ml-2" style={{ color: accentColor }}>
                              {val}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {layoutMode === 'steps' && (
                  <div className="space-y-1">
                    {(parsedRows.length > 0 ? parsedRows.slice(0, 3) : ['Step 1']).map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[9.5px] font-mono text-slate-200">
                        <span
                          className="w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center shrink-0 text-slate-950"
                          style={{ backgroundColor: accentColor }}
                        >
                          {idx + 1}
                        </span>
                        <span className="truncate">{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {layoutMode === 'hero' && (
                  <div className="text-center">
                    <div className="text-xl font-black tracking-tight tabular-nums" style={{ color: accentColor }}>
                      {parsedRows[0] || badgeText || '99.99%'}
                    </div>
                    {parsedRows[1] && (
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">{parsedRows[1]}</div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1 text-center truncate">
                {subtitle || 'Custom Component'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsCustomBuilderOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddOnce}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add to Scene</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAndAdd}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Save to My Library &amp; Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
