import React, { useState } from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { VideoStylePreset } from '../../utils/studioGenerator';
import { X, Wand2, Film, Cpu, GitBranch, Brain, Server, Bot, KeyRound } from 'lucide-react';

const TOPIC_EXAMPLES = [
  'How Stripe prevents double payments: Mobile App -> API Gateway -> Redis Idempotency Key -> Payment Ledger',
  'How DNS resolves a URL in milliseconds: Browser -> Recursive Resolver -> Root & TLD Server -> Authoritative NS',
  'How Kubernetes autoscaling survives 50,000 req/s Black Friday traffic without crashing Postgres',
  'How OAuth 2.0 + PKCE protects mobile logins with short-lived JWT tokens and Zero Trust scopes',
  'Why distributed consensus (Raft) prevents split-brain when a leader node crashes',
];

const STYLE_OPTIONS: Array<{ id: VideoStylePreset | 'auto'; label: string; icon: React.ReactNode }> = [
  { id: 'auto', label: 'Auto Detect', icon: <Wand2 className="w-3.5 h-3.5 text-cyan-400" /> },
  { id: 'tech-architecture', label: 'System Design', icon: <Server className="w-3.5 h-3.5 text-indigo-400" /> },
  { id: 'iam-security', label: 'IAM & Security', icon: <KeyRound className="w-3.5 h-3.5 text-sky-400" /> },
  { id: 'ai-hardware', label: 'AI & Silicon', icon: <Cpu className="w-3.5 h-3.5 text-emerald-400" /> },
  { id: 'ai-agents', label: 'AI Agents', icon: <Bot className="w-3.5 h-3.5 text-rose-400" /> },
  { id: 'algorithms-cs', label: 'Algorithms', icon: <GitBranch className="w-3.5 h-3.5 text-cyan-300" /> },
  { id: 'psychology-story', label: 'Psychology', icon: <Brain className="w-3.5 h-3.5 text-fuchsia-400" /> },
];

export const ScriptToVideoModal: React.FC = () => {
  const { isScriptModalOpen, setIsScriptModalOpen, generateFromScript } = useVideoStudio();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<VideoStylePreset | 'auto'>('auto');
  const [targetScenes, setTargetScenes] = useState<number | 'auto'>('auto');
  const [sceneDurationSec, setSceneDurationSec] = useState<number>(5.0);

  if (!isScriptModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    generateFromScript(prompt, style, { targetScenes, sceneDurationSec });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none">
      <div className="w-full max-w-2xl bg-[#0B101B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Build Video from Any Topic or Script</h3>
              <p className="text-xs text-slate-400">
                Synthesizes custom animated scenes, entities, trim-path pipes, camera drift, and subtitles from your exact script.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsScriptModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Visual Style Preset
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStyle(opt.id)}
                  className={`px-2.5 py-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${
                    style === opt.id
                      ? 'bg-indigo-600/25 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <label className="text-[11px] font-mono text-slate-400 block mb-1.5">SCENE COUNT (FOR TOPIC)</label>
              <div className="grid grid-cols-4 gap-1">
                {(['auto', 3, 4, 5] as const).map((cnt) => (
                  <button
                    key={String(cnt)}
                    type="button"
                    onClick={() => setTargetScenes(cnt)}
                    className={`py-1 rounded text-[11px] font-mono font-semibold border transition-colors ${
                      targetScenes === cnt
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cnt === 'auto' ? 'Auto' : `${cnt}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <label className="text-[11px] font-mono text-slate-400 block mb-1.5">PACING PER SCENE</label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { val: 3.5, label: 'Fast 3.5s' },
                  { val: 5.0, label: 'Std 5.0s' },
                  { val: 6.5, label: 'Deep 6.5s' },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setSceneDurationSec(p.val)}
                    className={`py-1 rounded text-[11px] font-mono font-semibold border transition-colors whitespace-nowrap ${
                      sceneDurationSec === p.val
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Topic, Pipeline (`A -&gt; B -&gt; C`), or Scene-by-Scene Script
              </label>
              <span className="text-[10px] font-mono text-cyan-400">1 line/sentence = 1 scene</span>
            </div>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Write either a single topic OR one sentence per scene:\n1. Mobile Client -> API Gateway -> Payment Service handles checkout.\n2. Under retry storms, duplicate requests crash the Ledger with double charges.\n3. Redis Idempotency Keys cache the first response in 0.2ms.\n4. Result: 100% safe payments at 25,000 req/s.`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
            />
          </div>

          <div>
            <div className="text-[11px] font-mono text-slate-400 mb-2">
              Try Building Any Topic
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TOPIC_EXAMPLES.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setPrompt(idea)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors text-left"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setIsScriptModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors disabled:opacity-40"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Build Custom Video</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
