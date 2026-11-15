import React, { useState } from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { ALL_TEMPLATES } from '../../data/studioTemplates';
import {
  Play,
  Pause,
  Download,
  Sparkles,
  Layers,
  FilePlus,
  Volume2,
  Monitor,
  Smartphone,
  ChevronDown,
} from 'lucide-react';

export const StudioHeader: React.FC = () => {
  const {
    project,
    isPlaying,
    togglePlay,
    loadTemplate,
    createBlankProject,
    startExport,
    isExporting,
    exportProgress,
  } = useVideoStudio();

  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  return (
    <header className="h-14 bg-[#090D16] border-b border-slate-800/80 px-4 flex items-center justify-between select-none z-30">
      {/* Brand & Project Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 font-mono font-black text-white text-base">
            VM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-wide">VisualMotion</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                STUDIO 60FPS
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[220px]">
              {project.title}
            </div>
          </div>
        </div>

        {/* Templates Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowTemplateMenu(!showTemplateMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Templates</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showTemplateMenu && (
            <div className="absolute top-full left-0 mt-1.5 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 font-bold border-b border-slate-800">
                YouTube Explainer Presets
              </div>
              {ALL_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    loadTemplate(tmpl.id);
                    setShowTemplateMenu(false);
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-slate-800 flex flex-col transition-colors border-b border-slate-800/50 last:border-none"
                >
                  <span className="text-xs font-bold text-white">{tmpl.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono mt-0.5">{tmpl.category}</span>
                </button>
              ))}

              <div className="p-2 border-t border-slate-800 mt-1">
                <button
                  onClick={() => {
                    createBlankProject();
                    setShowTemplateMenu(false);
                  }}
                  className="w-full text-center py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Start Blank Project</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Controls: Play / Pause */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs shadow-lg transition-all ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY PREVIEW'}</span>
        </button>

        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-mono">
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>TTS Voice On</span>
        </div>
      </div>

      {/* Right Controls: Aspect Ratio & Video Export */}
      <div className="flex items-center gap-3">
        <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs font-mono">
          <button
            className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 text-white font-bold"
            title="16:9 Standard YouTube Landscape"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9</span>
          </button>
        </div>

        <button
          onClick={startExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? `RENDERING ${exportProgress}%` : 'EXPORT 1080p MP4'}</span>
        </button>
      </div>
    </header>
  );
};
