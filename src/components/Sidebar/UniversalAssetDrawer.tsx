import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Smile,
  Brain,
  Rocket,
  Flame,
  ShieldCheck,
  Smartphone,
  Layers,
  Heart,
  TrendingUp,
  DollarSign,
  Award,
  Bell,
  MessageSquare,
  Globe,
  Sun,
  Battery,
  Lightbulb,
  Plus,
  BookOpen,
} from 'lucide-react';
import { useCanvas } from '../../store/canvasStore';
import { UNIVERSAL_TEMPLATES } from '../../data/universalPresets';
import confetti from 'canvas-confetti';

interface AssetCategory {
  id: string;
  label: string;
  icon: any;
}

const CATEGORIES: AssetCategory[] = [
  { id: 'templates', label: 'Story Templates', icon: BookOpen },
  { id: 'characters', label: 'Characters & Mind', icon: Smile },
  { id: 'money', label: 'Money & Goals', icon: DollarSign },
  { id: 'social', label: 'Social & Media', icon: Smartphone },
  { id: 'metaphors', label: 'Metaphors & Ideas', icon: Lightbulb },
];

export const UniversalAssetDrawer: React.FC = () => {
  const { addElement, loadTemplate } = useCanvas();
  const [activeCat, setActiveCat] = useState('templates');

  const handleApplyTemplate = (tmpl: any) => {
    loadTemplate(tmpl);
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
  };

  const handleAddSticker = (name: string, icon: string, stroke: string, behavior: any = 'float') => {
    addElement('custom', {
      name,
      sublabel: 'Animation Element',
      icon,
      stroke,
      fill: '#0F172A',
      glowColor: stroke,
      glowRadius: 16,
      badgeText: 'Active',
      badgeColor: stroke,
      behavior,
      width: 220,
      height: 125,
      fontFamily: 'Poppins',
    });
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/90 backdrop-blur-md flex flex-col shrink-0 z-10 select-none">
      {/* Category Tabs */}
      <div className="p-3 border-b border-slate-800">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Stickers & Story Library
        </h3>
        <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
          {CATEGORIES.slice(0, 4).map((c) => {
            const IconComp = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeCat === c.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span className="truncate">{c.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Asset Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {activeCat === 'templates' && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">
              CLICK TO LOAD FULL ANIMATION STORY
            </span>
            {UNIVERSAL_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleApplyTemplate(tmpl)}
                className="w-full p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-indigo-500/50 transition-all text-left group shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{tmpl.emoji}</span>
                  <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {tmpl.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 font-normal">
                  {tmpl.description}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="text-indigo-400 font-semibold">{tmpl.category}</span>
                  <span>{tmpl.duration}s 60fps</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeCat === 'characters' && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">
              PEOPLE & MIND METAPHORS
            </span>
            {[
              { name: 'Happy Character', icon: 'Smile', color: '#10B981', behavior: 'bounce' },
              { name: 'Focused Mind', icon: 'Brain', color: '#EC4899', behavior: 'pulse' },
              { name: 'Burnout / Stress', icon: 'Flame', color: '#EF4444', behavior: 'shake' },
              { name: 'Heart & Emotion', icon: 'Heart', color: '#F43F5E', behavior: 'heartbeat' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleAddSticker(item.name, item.icon, item.color, item.behavior)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800 text-left transition-all"
              >
                <span className="text-xs font-medium text-slate-200">{item.name}</span>
                <Plus className="w-4 h-4 text-slate-500 hover:text-indigo-400" />
              </button>
            ))}
          </div>
        )}

        {activeCat === 'money' && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">
              FINANCE, GOALS & WEALTH
            </span>
            {[
              { name: 'Money Stash', icon: 'Zap', color: '#10B981', behavior: 'float' },
              { name: 'Growth Rocket', icon: 'Rocket', color: '#38BDF8', behavior: 'bounce' },
              { name: 'Winner Trophy', icon: 'Flame', color: '#F59E0B', behavior: 'pulse' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleAddSticker(item.name, item.icon, item.color, item.behavior)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800 text-left transition-all"
              >
                <span className="text-xs font-medium text-slate-200">{item.name}</span>
                <Plus className="w-4 h-4 text-slate-500 hover:text-indigo-400" />
              </button>
            ))}
          </div>
        )}

        {activeCat === 'social' && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">
              VIRAL & DIGITAL MEDIA
            </span>
            {[
              { name: 'Smartphone Frame', icon: 'Smartphone', color: '#818CF8', behavior: 'float' },
              { name: 'Notification Bell', icon: 'Zap', color: '#FBBF24', behavior: 'swing' },
              { name: 'Chat Conversation', icon: 'Smile', color: '#38BDF8', behavior: 'pulse' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleAddSticker(item.name, item.icon, item.color, item.behavior)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800 text-left transition-all"
              >
                <span className="text-xs font-medium text-slate-200">{item.name}</span>
                <Plus className="w-4 h-4 text-slate-500 hover:text-indigo-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
