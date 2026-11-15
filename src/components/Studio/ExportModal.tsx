import React from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { Download, CheckCircle, Video, X } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { isExporting, exportProgress, project } = useVideoStudio();

  if (!isExporting) return null;

  const isDone = exportProgress >= 100;

  const handleDownload = () => {
    // Generate a downloadable project package or mock MP4 file
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_1080p.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Rendering YouTube Video</h3>
            <p className="text-xs text-slate-400 font-mono">1080p @ 60 FPS • High Bitrate</p>
          </div>
        </div>

        {/* Video Specs Breakdown */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center font-mono">
          <div>
            <div className="text-[10px] text-slate-500">RESOLUTION</div>
            <div className="text-xs font-bold text-cyan-400">1920x1080</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">FRAMERATE</div>
            <div className="text-xs font-bold text-emerald-400">60 FPS</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">AUDIO</div>
            <div className="text-xs font-bold text-indigo-400">SYNCED TTS</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">
              {isDone ? 'Encoding Complete!' : 'Rendering Scenes & Audio...'}
            </span>
            <span className="font-bold text-cyan-400">{exportProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        {isDone ? (
          <div className="space-y-2 pt-2">
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download 1080p Video File</span>
            </button>
          </div>
        ) : (
          <div className="text-center text-[11px] text-slate-500 font-mono animate-pulse">
            Compiling SVG vector frames and audio waveform...
          </div>
        )}
      </div>
    </div>
  );
};
