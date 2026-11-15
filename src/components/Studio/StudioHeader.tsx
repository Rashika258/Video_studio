import React, { useRef, useState } from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { ALL_TEMPLATES } from '../../data/studioTemplates';
import {
  Play,
  Pause,
  Download,
  Sparkles,
  FilePlus,
  Volume2,
  VolumeX,
  Monitor,
  Smartphone,
  ChevronDown,
  Wand2,
  RotateCcw,
  Upload,
  ImagePlus,
} from 'lucide-react';

export const StudioHeader: React.FC = () => {
  const {
    project,
    isPlaying,
    togglePlay,
    playFromStart,
    loadTemplate,
    createBlankProject,
    importProjectJson,
    updateProjectTitle,
    setAspectRatio,
    toggleVoiceEnabled,
    setIsExportModalOpen,
    setIsScriptModalOpen,
    setIsImageAnimatorOpen,
  } = useVideoStudio();

  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    importProjectJson(text);
    setShowTemplateMenu(false);
    e.target.value = '';
  };

  return (
    <header className="h-14 bg-[#090D16] border-b border-slate-800/80 px-4 flex items-center justify-between gap-4 select-none z-30 shrink-0">
      {/* Left: Brand, Editable Title, Templates & Script Builder */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-mono font-black text-white text-sm">
            VM
          </div>
          <span className="font-extrabold text-sm text-white tracking-tight whitespace-nowrap">
            VisualMotion
          </span>
        </div>

        <input
          type="text"
          value={project.title}
          onChange={(e) => updateProjectTitle(e.target.value)}
          aria-label="Project title"
          className="hidden lg:block w-52 px-2.5 py-1 rounded-md bg-slate-900/70 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none text-xs text-slate-200 font-medium truncate"
        />

        {/* Templates Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowTemplateMenu(!showTemplateMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Templates</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showTemplateMenu && (
            <div className="absolute top-full left-0 mt-1.5 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 font-bold border-b border-slate-800">
                Sample Reference Videos
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

              <div className="p-2 border-t border-slate-800 mt-1 grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    createBlankProject();
                    setShowTemplateMenu(false);
                  }}
                  className="text-center py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Blank Project</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-center py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import JSON</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Script-to-Video & Images-to-Video Buttons */}
        <button
          onClick={() => setIsScriptModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/35 text-xs font-semibold text-indigo-300 border border-indigo-500/40 transition-colors whitespace-nowrap shrink-0"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Script to Video</span>
        </button>

        <button
          onClick={() => setIsImageAnimatorOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/35 text-xs font-semibold text-cyan-300 border border-cyan-500/40 transition-colors whitespace-nowrap shrink-0"
        >
          <ImagePlus className="w-3.5 h-3.5" />
          <span>Images to Video</span>
        </button>
      </div>

      {/* Center: Playback Controls & Voice Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={playFromStart}
          title="Play full video from Scene 1"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-xs transition-colors whitespace-nowrap ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isPlaying ? 'Pause' : 'Play Video'}</span>
        </button>

        <button
          onClick={toggleVoiceEnabled}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors whitespace-nowrap ${
            project.audio.voiceEnabled
              ? 'bg-slate-800/80 border-slate-700 text-cyan-300 hover:bg-slate-800'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle voiceover narration during preview"
        >
          {project.audio.voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{project.audio.voiceEnabled ? 'Voice On' : 'Muted'}</span>
        </button>
      </div>

      {/* Right: Aspect Ratio Switcher & Real Video Export */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors whitespace-nowrap ${
              project.aspectRatio === '16:9' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="16:9 YouTube Landscape"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9</span>
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors whitespace-nowrap ${
              project.aspectRatio === '9:16' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="9:16 YouTube Shorts / Reels"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16</span>
          </button>
        </div>

        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Video</span>
        </button>
      </div>
    </header>
  );
};
