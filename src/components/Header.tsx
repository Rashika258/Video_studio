import React from 'react';
import {
  Play,
  Pause,
  Box,
  Sparkles,
  Download,
  Ratio,
  Monitor,
  Flame,
} from 'lucide-react';
import { useCanvas } from '../store/canvasStore';

export const Header: React.FC = () => {
  const {
    project,
    updateProject,
    isPlaying,
    togglePlay,
    setIsExportOpen,
  } = useCanvas();

  const toggle3D = () => {
    updateProject({
      camera: {
        ...project.camera,
        tilt3D: !project.camera.tilt3D,
      },
    });
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
        </div>
        <div>
          <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            ArchMotion Studio
          </span>
          <span className="ml-2 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Infinite Creator
          </span>
        </div>
      </div>

      {/* Center Controls: Playback & 3D Tilt */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-lg transition-all ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" /> Pause Preview
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" /> Play 60 FPS
            </>
          )}
        </button>

        <button
          onClick={toggle3D}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            project.camera.tilt3D
              ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300 shadow-sm shadow-indigo-500/20'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400'
          }`}
          title="Toggle 2.5D Isometric 3D Camera tilt"
        >
          <Box className={`w-3.5 h-3.5 ${project.camera.tilt3D ? 'text-indigo-400' : 'text-slate-400'}`} />
          <span>2.5D Isometric Tilt</span>
        </button>
      </div>

      {/* Right Controls: Aspect Ratio & Export */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => updateProject({ width: 1920, height: 1080 })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              project.width === 1920 ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
            }`}
          >
            <Monitor className="w-3 h-3" />
            16:9
          </button>
          <button
            onClick={() => updateProject({ width: 1080, height: 1920 })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              project.width === 1080 ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
            }`}
          >
            <Ratio className="w-3 h-3 rotate-90" />
            9:16 (Shorts)
          </button>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Export MP4 / 60fps
        </button>
      </div>
    </header>
  );
};
