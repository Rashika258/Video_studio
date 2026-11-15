import React, { useState } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Server,
  Database,
  Cpu,
  Layers,
  Zap,
  Flame,
  ShieldCheck,
  Brain,
  Rocket,
  Code2,
  Activity,
  Smile,
  Terminal,
} from 'lucide-react';
import { useCanvas } from '../../store/canvasStore';
import { BehaviorType, FontFamilyType } from '../../types/element';
import confetti from 'canvas-confetti';

interface CustomComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  { name: 'Server', icon: Server },
  { name: 'Database', icon: Database },
  { name: 'Cpu', icon: Cpu },
  { name: 'Brain', icon: Brain },
  { name: 'Rocket', icon: Rocket },
  { name: 'Zap', icon: Zap },
  { name: 'Flame', icon: Flame },
  { name: 'Shield', icon: ShieldCheck },
  { name: 'Terminal', icon: Terminal },
  { name: 'Code', icon: Code2 },
  { name: 'Layers', icon: Layers },
  { name: 'Smile', icon: Smile },
];

const FONT_FAMILIES: FontFamilyType[] = [
  'Inter',
  'Fira Code',
  'Poppins',
  'Space Grotesk',
  'Outfit',
  'Bebas Neue',
  'Playfair Display',
  'Caveat',
];

const BEHAVIORS: { id: BehaviorType; label: string }[] = [
  { id: 'none', label: 'Static' },
  { id: 'pulse', label: 'Pulse / Breathe' },
  { id: 'heartbeat', label: 'Heartbeat (Dub-Lub)' },
  { id: 'bounce', label: 'Vertical Bounce' },
  { id: 'shake', label: 'Shake / Stress' },
  { id: 'float', label: 'Levitate / Float' },
  { id: 'swing', label: 'Pendulum Swing' },
  { id: 'orbit', label: 'Orbit Circle' },
  { id: 'neonFlicker', label: 'Neon Flicker' },
];

export const CustomComponentModal: React.FC<CustomComponentModalProps> = ({ isOpen, onClose }) => {
  const { addElement } = useCanvas();

  const [name, setName] = useState('Payment Gateway');
  const [sublabel, setSublabel] = useState('Stripe & PayPal Webhook');
  const [selectedIcon, setSelectedIcon] = useState('Zap');
  const [badgeText, setBadgeText] = useState('99.9% Uptime');
  const [badgeColor, setBadgeColor] = useState('#10B981');
  const [progressValue, setProgressValue] = useState<number>(75);
  const [progressColor, setProgressColor] = useState('#38BDF8');
  const [fontFamily, setFontFamily] = useState<FontFamilyType>('Space Grotesk');
  const [behavior, setBehavior] = useState<BehaviorType>('pulse');
  const [fillColor, setFillColor] = useState('#0B0F19');
  const [strokeColor, setStrokeColor] = useState('#38BDF8');
  const [glassmorphism, setGlassmorphism] = useState(true);

  if (!isOpen) return null;

  const handleCreate = () => {
    addElement('custom', {
      name,
      text: name,
      sublabel,
      icon: selectedIcon,
      badgeText,
      badgeColor,
      progressValue,
      progressColor,
      fontFamily,
      behavior,
      fill: fillColor,
      stroke: strokeColor,
      glowColor: strokeColor,
      glowRadius: 18,
      glassmorphism,
      width: 240,
      height: 140,
    });

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  const IconComp = AVAILABLE_ICONS.find((i) => i.name === selectedIcon)?.icon || Server;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Custom Component Builder
              </h3>
              <p className="text-[11px] text-slate-400">
                Design custom building blocks for your YouTube videos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Form & Live Preview */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls Column */}
          <div className="space-y-4 text-xs">
            {/* Title & Subtitle */}
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Component Title
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={sublabel}
                onChange={(e) => setSublabel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
                Icon
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {AVAILABLE_ICONS.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setSelectedIcon(item.name)}
                      className={`h-8 rounded-lg border flex items-center justify-center transition-all ${
                        selectedIcon === item.name
                          ? 'border-indigo-500 bg-indigo-500/25 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                      title={item.name}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Family Picker */}
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Typography Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as FontFamilyType)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none cursor-pointer"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Animation Behavior */}
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Animation Motion
              </label>
              <select
                value={behavior}
                onChange={(e) => setBehavior(e.target.value as BehaviorType)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none cursor-pointer"
              >
                {BEHAVIORS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Metric Badge */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Badge Color
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {['#10B981', '#38BDF8', '#F59E0B', '#EF4444', '#EC4899'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setBadgeColor(c)}
                      className={`w-5 h-5 rounded-full border ${badgeColor === c ? 'ring-2 ring-white' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Gauge Slider */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Internal Metric Gauge</span>
                <span>{progressValue}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={progressValue}
                onChange={(e) => setProgressValue(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="flex flex-col items-center justify-center p-6 bg-[#070A10] border border-slate-800 rounded-2xl relative overflow-hidden">
            <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500">
              LIVE PREVIEW
            </span>

            {/* Simulated Live Component Card */}
            <div
              className={`w-64 rounded-2xl p-4 border transition-all duration-300 shadow-2xl relative ${
                glassmorphism ? 'backdrop-blur-xl bg-slate-900/90' : 'bg-slate-950'
              }`}
              style={{
                borderColor: strokeColor,
                boxShadow: `0 0 20px -3px ${strokeColor}45, 0 10px 30px rgba(0,0,0,0.5)`,
                fontFamily: fontFamily,
              }}
            >
              {/* Header: Icon + Title + Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner shrink-0"
                    style={{
                      backgroundColor: `${strokeColor}20`,
                      borderColor: `${strokeColor}60`,
                    }}
                  >
                    <IconComp className="w-5 h-5" style={{ color: strokeColor }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight leading-tight">
                      {name || 'Component'}
                    </h4>
                    {sublabel && (
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[130px] font-normal">
                        {sublabel}
                      </p>
                    )}
                  </div>
                </div>

                {badgeText && (
                  <span
                    className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0"
                    style={{
                      color: badgeColor,
                      backgroundColor: `${badgeColor}18`,
                      borderColor: `${badgeColor}40`,
                    }}
                  >
                    {badgeText}
                  </span>
                )}
              </div>

              {/* Progress Gauge */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progressValue}%`,
                      backgroundColor: progressColor,
                    }}
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-slate-500 mt-4 text-center">
              Font: <span className="text-indigo-400">{fontFamily}</span> • Animation: <span className="text-emerald-400">{behavior}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Save & Stamp on Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
