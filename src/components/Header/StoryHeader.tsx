import React from 'react';
import {
  Sparkles,
  Download,
  Monitor,
  Ratio,
  Wand2,
} from 'lucide-react';
import { useStory } from '../../store/storyStore';

export const StoryHeader: React.FC = () => {
  const {
    aspectRatio,
    setAspectRatio,
    setIsExportOpen,
    setIsAiModalOpen,
  } = useStory();

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-indigo-600 to-sky-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          </div>
        </div>
        <div>
          <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            StoryMotion
          </span>
          <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            For Everyone
          </span>
        </div>
      </div>

      {/* Prominent AI Generator Button */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Wand2 className="w-4 h-4 text-pink-300 animate-bounce" />
        <span>✨ AI Script-to-Video</span>
      </button>

      {/* Right Controls: Aspect Ratio & Export */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs">
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              aspectRatio === '16:9' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            16:9 YouTube
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              aspectRatio === '9:16' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ratio className="w-3.5 h-3.5 rotate-90" />
            9:16 Shorts
          </button>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export MP4 (60fps)
        </button>
      </div>
    </header>
  );
};
