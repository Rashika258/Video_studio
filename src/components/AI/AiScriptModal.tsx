import React, { useState } from 'react';
import { X, Sparkles, Wand2, Lightbulb, Loader2 } from 'lucide-react';
import { useStory } from '../../store/storyStore';

export const AiScriptModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, generateStory } = useStory();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isAiModalOpen) return null;

  const quickIdeas = [
    'How 10,000 users hit one server and it dies, and how a load balancer fixes it',
    'How NVIDIA GPUs run AI models using tensor cores & memory bandwidth',
    'Why big systems separate reads from writes (CQRS pattern)',
    'Why people procrastinate and how dopamine works',
    'How $100 turns into $1,000,000 with compound interest',
    'Why AI will replace repetitive coding in 5 years',
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      generateStory(prompt);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none">
      <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={() => setIsAiModalOpen(false)}
          className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              AI Script-to-Video Engine
            </h3>
            <p className="text-xs text-slate-400">
              Type any script, tech architecture, or story $\rightarrow$ AI creates the complete animated video
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              What do you want your video to be about? (Tech, Science, Story, Finance...)
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 10,000 requests hit one server and it dies. Explain how load balancers and redis caching fix it..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Quick Ideas Buttons */}
          <div>
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              OR CHOOSE A POPULAR YOUTUBE TOPIC:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickIdeas.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setPrompt(idea)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-all text-left"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Crafting Characters, Servers & Scenes...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Full Animated Video
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
