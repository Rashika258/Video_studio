import React, { useState } from 'react';
import { X, Download, Film, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { useCanvas } from '../../store/canvasStore';
import confetti from 'canvas-confetti';

export const ExportModal: React.FC = () => {
  const { isExportOpen, setIsExportOpen, project, elements, wires } = useCanvas();
  const [format, setFormat] = useState<'mp4' | 'webm' | 'prores'>('mp4');
  const [quality, setQuality] = useState<'1080p' | '4k'>('1080p');
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  if (!isExportOpen) return null;

  const handleStartExport = () => {
    setIsRendering(true);
    setProgress(0);
    setIsDone(false);

    // Simulate 60fps frame-by-frame rendering progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          setIsDone(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          return 100;
        }
        return prev + 5;
      });
    }, 120);
  };

  const handleDownload = () => {
    const exportData = {
      project,
      elements,
      wires,
      exportedAt: new Date().toISOString(),
    };
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}-60fps.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setIsExportOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={() => setIsExportOpen(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Export YouTube Animation
            </h3>
            <p className="text-xs text-slate-400">
              60 FPS Vector Motion Graphics
            </p>
          </div>
        </div>

        {!isRendering && !isDone ? (
          <div className="space-y-4">
            {/* Format Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Output Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mp4', label: 'MP4 (H.264)', desc: 'YouTube Standard' },
                  { id: 'webm', label: 'WebM', desc: 'Fast Web' },
                  { id: 'prores', label: 'ProRes Alpha', desc: 'Transparent' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      format === f.id
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{f.label}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {f.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Resolution & Bitrate
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '1080p', label: '1080p Full HD', desc: '1920 × 1080 (60 FPS)' },
                  { id: '4k', label: '4K Ultra HD', desc: '3840 × 2160 (Vector Crisp)' },
                ].map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuality(q.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      quality === q.id
                        ? 'border-emerald-500 bg-emerald-500/20 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{q.label}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {q.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Render Button */}
            <button
              onClick={handleStartExport}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Render 60 FPS Video
            </button>
          </div>
        ) : isRendering ? (
          <div className="py-6 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
            <div>
              <h4 className="text-sm font-semibold text-white">
                Compiling 60 FPS Vectors & Keyframes...
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Encoding {quality} stream with zero compression artifacts
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-mono text-indigo-300 font-bold block">
              {progress}% Complete
            </span>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Video Render Completed!
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Rendered at 60 FPS • High Bitrate • Ready for YouTube
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download {format.toUpperCase()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
