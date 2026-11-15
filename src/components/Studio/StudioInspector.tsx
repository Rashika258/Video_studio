import React, { useRef } from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { ElementStatus, ElementType, StudioElement, StudioPipe } from '../../types/videoStudio';
import { Sliders, Trash2, Zap, X, Upload, Maximize2 } from 'lucide-react';

const ELEMENT_TYPE_OPTIONS: Array<{ value: ElementType; label: string }> = [
  { value: 'server-blade', label: 'Server Blade' },
  { value: 'gpu-chip', label: 'GPU Accelerator' },
  { value: 'systolic-array', label: 'Systolic Array' },
  { value: 'load-balancer', label: 'Load Balancer / Gateway' },
  { value: 'database-sql', label: 'Database / Ledger' },
  { value: 'cache-redis', label: 'Redis / Cache' },
  { value: 'kafka-stream', label: 'Kafka / Event Stream' },
  { value: 'cloud-pod', label: 'Cloud / K8s Pods' },
  { value: 'firewall-shield', label: 'Firewall / Zero Trust' },
  { value: 'client-devices', label: 'Client Devices' },
  { value: 'terminal-window', label: 'Code Terminal' },
  { value: 'agent-swarm', label: 'AI Agent Swarm' },
  { value: 'sandbox-container', label: 'Sandbox Vault' },
  { value: 'identity-idp', label: 'Identity Provider (IdP)' },
  { value: 'auth-token', label: 'OIDC / JWT Token' },
  { value: 'access-policy', label: 'RBAC & JIT Policy' },
  { value: 'siem-audit', label: 'SIEM Audit Trail' },
  { value: 'binary-tree', label: 'Binary Tree' },
  { value: 'big-o-chart', label: 'Big-O Chart' },
  { value: 'algorithm-array', label: 'Array Pointers' },
  { value: 'math-formula', label: 'Math Formula' },
  { value: 'character-desk', label: 'Person / Engineer Desk' },
  { value: 'character-phone', label: 'Mobile Phone Cue' },
  { value: 'brain-dopamine', label: 'Brain Dopamine' },
  { value: 'habit-loop', label: 'Habit Loop' },
  { value: 'split-comparison', label: 'Before vs After' },
  { value: 'metric-badge', label: 'Metric Stat Badge' },
  { value: 'callout-card', label: 'Callout Card' },
  { value: 'kinetic-title', label: 'Kinetic Title Card' },
  { value: 'custom-card', label: 'Custom Block' },
  { value: 'image-frame', label: 'Animated Image Frame' },
];

const PIPE_COLOR_SWATCHES = ['#06B6D4', '#10B981', '#818CF8', '#F59E0B', '#EF4444'];
const CUSTOM_ACCENT_SWATCHES = ['#06B6D4', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#F8FAFC'];

export const StudioInspector: React.FC = () => {
  const {
    project,
    activeScene,
    activeElementId,
    setActiveElementId,
    updateElement,
    removeElement,
    setElementStatus,
    addPipe,
    updatePipe,
    removePipe,
  } = useVideoStudio();

  const imgUploadRef = useRef<HTMLInputElement>(null);

  if (!activeElementId) return null;

  const element = activeScene.elements.find((el) => el.id === activeElementId);
  if (!element) return null;

  const otherElements = activeScene.elements.filter((el) => el.id !== activeElementId);
  const connectedPipes = activeScene.pipes.filter(
    (p) => p.fromId === element.id || p.toId === element.id
  );

  const terminalLines: string[] = Array.isArray(element.customProps?.lines)
    ? element.customProps.lines
    : ['> step_1: init()', '> status: READY'];

  const customCfg = element.customProps || {};
  const customRows: string[] = Array.isArray(customCfg.rows) ? customCfg.rows : [];

  return (
    <aside className="w-72 h-full bg-[#090D16] border-l border-slate-800/80 overflow-y-auto p-4 shrink-0 select-none z-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Node Inspector
          </span>
        </div>
        <button
          onClick={() => setActiveElementId(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          aria-label="Close inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <div className="py-3 space-y-3">
        <div>
          <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1">VISUAL TYPE</label>
          <select
            value={element.type}
            onChange={(e) => updateElement(element.id, { type: e.target.value as ElementType })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {ELEMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1">TITLE</label>
          <input
            type="text"
            value={element.title}
            onChange={(e) => updateElement(element.id, { title: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1">
            SUBTITLE / METRIC
          </label>
          <input
            type="text"
            value={element.subtitle || ''}
            onChange={(e) => updateElement(element.id, { subtitle: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {element.type === 'terminal-window' && (
          <div>
            <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1">
              TERMINAL LINES (1 PER LINE)
            </label>
            <textarea
              rows={3}
              value={terminalLines.join('\n')}
              onChange={(e) =>
                updateElement(element.id, {
                  customProps: {
                    ...(element.customProps || {}),
                    lines: e.target.value.split('\n').slice(0, 5),
                  },
                })
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-emerald-300 font-mono focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        )}

        {element.type === 'custom-card' && (
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
            <div className="text-[10px] font-mono text-cyan-400 font-bold">CUSTOM BLOCK DESIGN</div>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">LAYOUT</label>
                <select
                  value={customCfg.layoutMode || 'gauge'}
                  onChange={(e) =>
                    updateElement(element.id, {
                      customProps: { ...customCfg, layoutMode: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-200 focus:outline-none"
                >
                  <option value="gauge">Gauge</option>
                  <option value="specs">Specs</option>
                  <option value="steps">Steps</option>
                  <option value="hero">Hero</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">TAG BADGE</label>
                <input
                  type="text"
                  value={customCfg.badgeText || ''}
                  onChange={(e) =>
                    updateElement(element.id, {
                      customProps: { ...customCfg, badgeText: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-slate-400">ACCENT</span>
              <div className="flex items-center gap-1.5">
                {CUSTOM_ACCENT_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    onClick={() =>
                      updateElement(element.id, {
                        customProps: { ...customCfg, accentColor: hex },
                      })
                    }
                    aria-label={`Set block accent ${hex}`}
                    className={`w-3.5 h-3.5 rounded-full border ${
                      (customCfg.accentColor || '#38BDF8') === hex ? 'border-white scale-110' : 'border-slate-700'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {(customCfg.layoutMode || 'gauge') === 'gauge' ? (
              <div className="space-y-1.5 tabular-nums">
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span>GAUGE VALUE</span>
                  <span className="text-cyan-300 font-bold">{customCfg.gaugeValue ?? 80}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={customCfg.gaugeValue ?? 80}
                  onChange={(e) =>
                    updateElement(element.id, {
                      customProps: { ...customCfg, gaugeValue: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <input
                  type="text"
                  value={customCfg.gaugeLabel || ''}
                  placeholder="Gauge label..."
                  onChange={(e) =>
                    updateElement(element.id, {
                      customProps: { ...customCfg, gaugeLabel: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-200 focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">ROWS / STEPS (1 PER LINE)</label>
                <textarea
                  rows={3}
                  value={customRows.join('\n')}
                  onChange={(e) =>
                    updateElement(element.id, {
                      customProps: { ...customCfg, rows: e.target.value.split('\n').slice(0, 4) },
                    })
                  }
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-200 focus:outline-none resize-none"
                />
              </div>
            )}
          </div>
        )}

        {element.type === 'image-frame' && (
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">IMAGE ANIMATOR</span>
              <button
                type="button"
                onClick={() => imgUploadRef.current?.click()}
                className="px-2 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Image</span>
              </button>
              <input
                ref={imgUploadRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    updateElement(element.id, {
                      customProps: { ...customCfg, src: String(reader.result || '') },
                    });
                  };
                  reader.readAsDataURL(file);
                  e.target.value = '';
                }}
                className="hidden"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1">IMAGE URL</label>
              <input
                type="text"
                value={customCfg.src?.startsWith('data:') ? '(Uploaded Local Image)' : customCfg.src || ''}
                onChange={(e) => {
                  if (e.target.value === '(Uploaded Local Image)') return;
                  updateElement(element.id, {
                    customProps: { ...customCfg, src: e.target.value },
                  });
                }}
                placeholder="https://... or click Upload Image"
                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">MOTION</label>
                <select
                  value={customCfg.motionEffect || 'ken-burns-in'}
                  onChange={(e) =>
                    updateElement(element.id, {
                      customProps: { ...customCfg, motionEffect: e.target.value },
                    })
                  }
                  className="w-full px-1.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300 focus:outline-none"
                >
                  <option value="ken-burns-in">Ken Burns In</option>
                  <option value="ken-burns-out">Ken Burns Out</option>
                  <option value="pan-left">Pan Left</option>
                  <option value="pan-right">Pan Right</option>
                  <option value="reveal-wipe">Reveal Wipe</option>
                  <option value="float-3d">3D Float</option>
                  <option value="pulse-beat">Pulse Beat</option>
                  <option value="none">Static</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">FRAME STYLE</label>
                <select
                  value={customCfg.frameStyle || 'glass-card'}
                  onChange={(e) =>
                    updateElement(element.id, {
                      customProps: { ...customCfg, frameStyle: e.target.value },
                    })
                  }
                  className="w-full px-1.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-200 focus:outline-none"
                >
                  <option value="glass-card">Studio Card</option>
                  <option value="full-bleed">Full-Bleed</option>
                  <option value="browser">Browser</option>
                  <option value="minimal">Minimal</option>
                  <option value="polaroid">Polaroid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 items-end">
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">FIT MODE</label>
                <select
                  value={customCfg.fitMode || 'cover'}
                  onChange={(e) =>
                    updateElement(element.id, {
                      customProps: { ...customCfg, fitMode: e.target.value },
                    })
                  }
                  className="w-full px-1.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-200 focus:outline-none"
                >
                  <option value="cover">Cover Fill</option>
                  <option value="contain">Contain Fit</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  const isVert = project.aspectRatio === '9:16';
                  updateElement(element.id, {
                    x: 50,
                    y: 50,
                    width: isVert ? 410 : 960,
                    height: isVert ? 730 : 540,
                    customProps: { ...customCfg, frameStyle: 'full-bleed' },
                  });
                }}
                className="py-1 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-200 flex items-center justify-center gap-1 whitespace-nowrap"
              >
                <Maximize2 className="w-3 h-3 text-cyan-400" />
                <span>Full Stage</span>
              </button>
            </div>

            <div className="tabular-nums">
              <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
                <span>MOTION INTENSITY</span>
                <span className="text-cyan-300 font-bold">{(customCfg.intensity ?? 1.0).toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={2.0}
                step={0.1}
                value={customCfg.intensity ?? 1.0}
                onChange={(e) =>
                  updateElement(element.id, {
                    customProps: { ...customCfg, intensity: parseFloat(e.target.value) },
                  })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Status State */}
        <div>
          <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1">
            STATUS STATE
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { status: 'normal' as ElementStatus, label: 'Normal', color: 'border-slate-500 text-slate-200' },
              { status: 'active' as ElementStatus, label: 'Active', color: 'border-cyan-500 text-cyan-300' },
              { status: 'warning' as ElementStatus, label: 'High Load', color: 'border-amber-500 text-amber-300' },
              { status: 'crashed' as ElementStatus, label: '500 Crash', color: 'border-red-500 text-red-300 font-bold' },
            ].map((st) => (
              <button
                key={st.status}
                onClick={() => setElementStatus(element.id, st.status)}
                className={`py-1 px-2 rounded-lg text-[10px] font-mono border transition-colors ${
                  element.status === st.status
                    ? `${st.color} bg-slate-800 font-bold`
                    : 'border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Motion Behavior & Entrance Beat */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1">MOTION FX</label>
            <select
              value={element.animation || 'none'}
              onChange={(e) =>
                updateElement(element.id, { animation: e.target.value as StudioElement['animation'] })
              }
              className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-slate-200 focus:outline-none"
            >
              <option value="none">Static</option>
              <option value="pulse">Pulse</option>
              <option value="float">Float</option>
              <option value="overload-shake">Shake</option>
            </select>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold mb-1">
              <span>BEAT IN</span>
              <span className="tabular-nums">{Math.round((element.entranceBeat || 0) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.7"
              step="0.05"
              value={element.entranceBeat || 0}
              onChange={(e) => updateElement(element.id, { entranceBeat: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer mt-1.5"
            />
          </div>
        </div>

        {/* Position X / Y and Width / Height */}
        <div className="grid grid-cols-2 gap-2 tabular-nums">
          <div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
              <span>X POS</span>
              <span>{Math.round(element.x)}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={element.x}
              onChange={(e) => updateElement(element.id, { x: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
              <span>Y POS</span>
              <span>{Math.round(element.y)}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="85"
              value={element.y}
              onChange={(e) => updateElement(element.id, { y: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
              <span>WIDTH</span>
              <span>{Math.round(element.width)}px</span>
            </div>
            <input
              type="range"
              min="150"
              max={element.type === 'image-frame' ? 960 : 380}
              step="5"
              value={element.width}
              onChange={(e) => updateElement(element.id, { width: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
              <span>HEIGHT</span>
              <span>{Math.round(element.height)}px</span>
            </div>
            <input
              type="range"
              min="110"
              max={element.type === 'image-frame' ? 740 : 240}
              step="5"
              value={element.height}
              onChange={(e) => updateElement(element.id, { height: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Connect Pipe */}
        {otherElements.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>CONNECT PIPE TO:</span>
            </label>
            <div className="flex flex-wrap gap-1">
              {otherElements.map((target) => (
                <button
                  key={target.id}
                  onClick={() => addPipe(element.id, target.id)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-cyan-300 border border-slate-700 flex items-center gap-1"
                >
                  <span>➔</span>
                  <span className="truncate max-w-[90px]">{target.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Connected Pipes Controls */}
        {connectedPipes.length > 0 && (
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="text-[10px] font-mono text-slate-400 font-bold block">
              CONNECTED PIPES ({connectedPipes.length})
            </label>
            {connectedPipes.map((pipe) => (
              <div key={pipe.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={pipe.label || ''}
                    placeholder="Pipe label..."
                    onChange={(e) => updatePipe(pipe.id, { label: e.target.value })}
                    className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => removePipe(pipe.id)}
                    className="p-1 rounded text-rose-400 hover:bg-rose-950/40"
                    title="Delete pipe"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={pipe.status}
                    onChange={(e) => updatePipe(pipe.id, { status: e.target.value as StudioPipe['status'] })}
                    className="px-1.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 focus:outline-none"
                  >
                    <option value="normal">Normal Flow</option>
                    <option value="heavy">Heavy Load</option>
                    <option value="crashed">Error / Breach</option>
                  </select>
                  <select
                    value={pipe.style || 'curved'}
                    onChange={(e) => updatePipe(pipe.id, { style: e.target.value as StudioPipe['style'] })}
                    className="px-1.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 focus:outline-none"
                  >
                    <option value="curved">Curved</option>
                    <option value="straight">Straight</option>
                  </select>
                </div>

                <div className="flex items-center justify-between gap-2 text-[9px] font-mono text-slate-400 tabular-nums">
                  <span>SPEED: {pipe.packetSpeed.toFixed(1)}x</span>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={pipe.packetSpeed}
                    onChange={(e) => updatePipe(pipe.id, { packetSpeed: parseFloat(e.target.value) })}
                    className="w-24 accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 text-[9px] font-mono text-slate-400 tabular-nums">
                  <span>DRAW: {Math.round((pipe.drawBeat ?? 0.15) * 100)}%</span>
                  <input
                    type="range"
                    min="0"
                    max="0.7"
                    step="0.05"
                    value={pipe.drawBeat ?? 0.15}
                    onChange={(e) => updatePipe(pipe.id, { drawBeat: parseFloat(e.target.value) })}
                    className="w-24 accent-indigo-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[9px] font-mono text-slate-500">COLOR</span>
                  <div className="flex items-center gap-1.5">
                    {PIPE_COLOR_SWATCHES.map((hex) => (
                      <button
                        key={hex}
                        onClick={() => updatePipe(pipe.id, { packetColor: hex })}
                        aria-label={`Set pipe color ${hex}`}
                        className={`w-3.5 h-3.5 rounded-full border ${
                          pipe.packetColor === hex ? 'border-white scale-110' : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Element */}
      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <button
          onClick={() => removeElement(element.id)}
          className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove Element</span>
        </button>
      </div>
    </aside>
  );
};
