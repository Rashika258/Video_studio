import React, { useState } from 'react';
import {
  Smile,
  Image,
  Sparkles,
  Type,
  Plus,
  Trash2,
  MessageSquare,
  Cpu,
  Check,
} from 'lucide-react';
import { useStory } from '../../store/storyStore';
import { BackgroundTheme, CharacterPose } from '../../types/story';

export const StoryAssetSidebar: React.FC = () => {
  const {
    activeScene,
    setBackground,
    setCharacterPose,
    setCharacterSpeech,
    addProp,
    deleteProp,
    updateHeadline,
  } = useStory();

  const [activeTab, setActiveTab] = useState<'tech' | 'poses' | 'backgrounds' | 'props' | 'text'>('tech');

  const POSES: { id: CharacterPose; label: string; icon: string }[] = [
    { id: 'coding', label: 'Coding / Hacking', icon: '💻' },
    { id: 'server-fire', label: 'Server Overload 🔥', icon: '🚨' },
    { id: 'deploying', label: 'Deploying System', icon: '🚀' },
    { id: 'talking', label: 'Talking / Explaining', icon: '💬' },
    { id: 'laptop', label: 'At Laptop', icon: '🖥️' },
    { id: 'mind-blown', label: 'Mind Blown', icon: '🤯' },
    { id: 'stressed', label: 'Stressed / Bug', icon: '😫' },
    { id: 'celebrating', label: 'Celebrating 200 OK', icon: '🎉' },
    { id: 'pointing', label: 'Pointing at Diagram', icon: '👉' },
  ];

  const TECH_NODES = [
    { name: 'API Server', icon: '🖥️', badge: '10,000 req/s', color: '#38BDF8', anim: 'pulse' },
    { name: 'PostgreSQL DB', icon: '🗄️', badge: 'Write Master', color: '#60A5FA', anim: 'float' },
    { name: 'NVIDIA H100 GPU', icon: '🧠', badge: '80GB HBM3', color: '#22C55E', anim: 'heartbeat' },
    { name: 'Kafka Event Bus', icon: '📡', badge: 'Real-time Stream', color: '#C084FC', anim: 'pulse' },
    { name: 'Load Balancer', icon: '⚖️', badge: 'Round Robin', color: '#F59E0B', anim: 'bounce' },
    { name: 'Redis Cache', icon: '⚡', badge: '0.2ms Hit', color: '#EF4444', anim: 'bounce' },
    { name: 'Docker Container', icon: '📦', badge: 'Microservice', color: '#06B6D4', anim: 'float' },
    { name: 'Binary Tree', icon: '🌲', badge: 'O(log N)', color: '#10B981', anim: 'float' },
    { name: 'Complexity Graph', icon: '📈', badge: 'O(2^N) Cliff', color: '#EC4899', anim: 'pulse' },
    { name: 'Linux Terminal', icon: '⌨️', badge: 'Root Bash', color: '#A855F7', anim: 'pulse' },
    { name: 'API Gateway', icon: '🛡️', badge: 'Rate Limiter', color: '#818CF8', anim: 'float' },
    { name: 'Data Packet', icon: '📦', badge: 'HTTP POST', color: '#38BDF8', anim: 'shake' },
  ];

  const BACKGROUNDS: { id: BackgroundTheme; label: string; preview: string }[] = [
    { id: 'server-room', label: 'Server Datacenter', preview: 'bg-cyan-950' },
    { id: 'terminal-matrix', label: 'Matrix Terminal', preview: 'bg-emerald-950' },
    { id: 'ai-neural', label: 'AI Neural Grid', preview: 'bg-purple-950' },
    { id: 'dark-studio', label: 'Dark Studio (YouTube Standard)', preview: 'bg-slate-950' },
    { id: 'cozy-room', label: 'Cozy Room', preview: 'bg-indigo-950' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', preview: 'bg-purple-900' },
    { id: 'office', label: 'Modern Office', preview: 'bg-slate-900' },
    { id: 'space', label: 'Deep Space', preview: 'bg-gray-950' },
    { id: 'nature', label: 'Nature & Forest', preview: 'bg-emerald-900' },
  ];

  const GENERAL_STICKERS = [
    { icon: '💡', name: 'Lightbulb Idea', anim: 'float' },
    { icon: '🧠', name: 'Brain Focus', anim: 'pulse' },
    { icon: '📱', name: 'Smartphone', anim: 'shake' },
    { icon: '💵', name: 'Money Stash', anim: 'bounce' },
    { icon: '🚀', name: 'Launch Rocket', anim: 'bounce' },
    { icon: '🏆', name: 'Winner Trophy', anim: 'bounce' },
    { icon: '🔥', name: 'Fire Energy', anim: 'pulse' },
    { icon: '🎯', name: 'Goal Target', anim: 'pulse' },
    { icon: '❤️', name: 'Heart Passion', anim: 'heartbeat' },
    { icon: '⏰', name: 'Deadline Clock', anim: 'shake' },
  ];

  const FONTS = [
    { id: 'Space Grotesk', label: 'Space Grotesk (Tech, Code & AI)' },
    { id: 'Fira Code', label: 'Fira Code (Terminal & Monospace)' },
    { id: 'Bebas Neue', label: 'Bebas Neue (Punchy Viral Shorts)' },
    { id: 'Poppins', label: 'Poppins (Clean Bold)' },
    { id: 'Playfair Display', label: 'Playfair (Video Essay)' },
    { id: 'Caveat', label: 'Caveat (Doodle & Sketch)' },
    { id: 'Inter', label: 'Inter (Modern Minimal)' },
  ];

  const handleAddTechNode = (item: typeof TECH_NODES[0]) => {
    addProp(item.icon, item.name, item.anim as any);
  };

  return (
    <aside className="w-80 border-r border-slate-800 bg-slate-950/95 backdrop-blur-md flex flex-col shrink-0 z-10 select-none">
      {/* 5 Clean Tabs */}
      <div className="p-3 border-b border-slate-800">
        <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
          {[
            { id: 'tech', label: 'Tech', icon: Cpu },
            { id: 'poses', label: 'Puppet', icon: Smile },
            { id: 'backgrounds', label: 'Scene', icon: Image },
            { id: 'props', label: 'Stickers', icon: Sparkles },
            { id: 'text', label: 'Text', icon: Type },
          ].map((t) => {
            const IconC = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all ${
                  activeTab === t.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <IconC className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* TECH & SYSTEMS TAB */}
        {activeTab === 'tech' && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 block mb-2 font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                TECH ARCHITECTURE NODES:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {TECH_NODES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => handleAddTechNode(t)}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-cyan-500/50 transition-all text-left group shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xl group-hover:scale-125 transition-transform">{t.icon}</span>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight truncate">
                        {t.name}
                      </span>
                    </div>
                    <span
                      className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border self-start"
                      style={{
                        color: t.color,
                        borderColor: `${t.color}40`,
                        backgroundColor: `${t.color}15`,
                      }}
                    >
                      {t.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Currently Active Props on Scene */}
            {activeScene.props.length > 0 && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-mono text-slate-500 block mb-1.5 font-bold">
                  ELEMENTS IN THIS SCENE:
                </span>
                <div className="space-y-1.5">
                  {activeScene.props.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span>{p.icon}</span>
                        <span className="text-slate-200 font-medium truncate max-w-[170px]">{p.name}</span>
                      </div>
                      <button
                        onClick={() => deleteProp(p.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHARACTER PUPPET TAB */}
        {activeTab === 'poses' && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-mono text-slate-500 block mb-2 font-bold">
                CHARACTER POSES & ACTIONS:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {POSES.map((p) => {
                  const isCurrent = activeScene.character?.pose === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setCharacterPose(p.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all text-left ${
                        isCurrent
                          ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xl">{p.icon}</span>
                      <span className="text-xs font-semibold">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Speech Bubble text input */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Character Speech Bubble:
              </label>
              <textarea
                rows={3}
                value={activeScene.character?.speechBubble || ''}
                onChange={(e) => setCharacterSpeech(e.target.value)}
                placeholder="What does the character say or explain?"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* BACKGROUNDS TAB */}
        {activeTab === 'backgrounds' && (
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-500 block mb-2 font-bold">
              PICK SCENE ENVIRONMENT:
            </span>
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setBackground(bg.id)}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                  activeScene.background === bg.id
                    ? 'border-cyan-500 bg-cyan-500/15 text-white shadow-sm'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg border border-slate-700 ${bg.preview}`} />
                  <span className="text-xs font-semibold">{bg.label}</span>
                </div>
                {activeScene.background === bg.id && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            ))}
          </div>
        )}

        {/* GENERAL STICKERS TAB */}
        {activeTab === 'props' && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-mono text-slate-500 block mb-2 font-bold">
                EVERYDAY VISUAL PROPS:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {GENERAL_STICKERS.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => addProp(s.icon, s.name, s.anim as any)}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800 hover:scale-105 flex flex-col items-center justify-center gap-1 transition-all"
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-full">
                      {s.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEXT & HEADLINES TAB */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Main Headline Text
              </label>
              <input
                type="text"
                value={activeScene.headline.text}
                onChange={(e) => updateHeadline(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={activeScene.headline.subtext || ''}
                onChange={(e) => updateHeadline(activeScene.headline.text, e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Font Family
              </label>
              <select
                value={activeScene.headline.font}
                onChange={(e) => updateHeadline(activeScene.headline.text, undefined, e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                {FONTS.map((f) => (
                  <option key={f.id} value={f.id} style={{ fontFamily: f.id }}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Headline Color
              </label>
              <div className="flex items-center gap-2">
                {['#38BDF8', '#10B981', '#F43F5E', '#FBBF24', '#A855F7', '#FFFFFF'].map((c) => (
                  <button
                    key={c}
                    onClick={() => updateHeadline(activeScene.headline.text, undefined, undefined, c)}
                    className="w-6 h-6 rounded-full border border-slate-700 hover:scale-125 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
