import React, { useState, useRef, useEffect } from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { renderProjectToVideo, RenderProgress, RenderResult } from '../../utils/videoRenderer';
import { sfx } from '../../utils/sfx';
import { Download, CheckCircle, Video, X, Play, FileJson, Loader2, AlertCircle } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, project, stopPlayback } = useVideoStudio();

  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [fps, setFps] = useState<30 | 60>(30);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState<RenderProgress | null>(null);
  const [result, setResult] = useState<RenderResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  if (!isExportModalOpen) return null;

  const totalDuration = project.scenes.reduce((acc, s) => acc + s.duration, 0);

  const handleClose = () => {
    abortRef.current?.abort();
    setIsRendering(false);
    setProgress(null);
    setErrorMsg(null);
    setIsExportModalOpen(false);
  };

  const handleStartRender = async () => {
    stopPlayback();
    if (result?.url) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }
    setErrorMsg(null);
    setIsRendering(true);
    setProgress({
      percent: 0,
      currentSceneIndex: 0,
      totalScenes: project.scenes.length,
      sceneTitle: project.scenes[0]?.title || 'Scene 1',
      frame: 0,
      totalFrames: Math.round(totalDuration * fps),
    });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const rendered = await renderProjectToVideo(project, {
        resolution,
        fps,
        includeAudio: project.audio.sfxEnabled,
        signal: controller.signal,
        onProgress: (p) => setProgress(p),
      });
      setResult(rendered);
      setIsRendering(false);
      sfx.playSuccess();
    } catch (err: any) {
      if (err?.message !== 'Render cancelled') {
        setErrorMsg(err?.message || 'Video encoding failed in this browser.');
      }
      setIsRendering(false);
    }
  };

  const handleDownloadVideo = () => {
    if (!result) return;
    const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'video';
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `${slug}_${resolution}_${fps}fps.${result.extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadProjectJson = () => {
    const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'project';
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${slug}_storyboard.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const pct = progress?.percent ?? 0;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none">
      <div className="w-full max-w-lg bg-[#0B101B] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Rendered Video</h3>
              <p className="text-xs text-slate-400 font-mono tabular-nums">
                {project.aspectRatio} · {project.scenes.length} Scenes · {totalDuration.toFixed(1)}s runtime
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close export modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isRendering && !result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1.5">RESOLUTION</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['720p', '1080p'] as const).map((res) => (
                    <button
                      key={res}
                      onClick={() => setResolution(res)}
                      className={`py-2 px-3 rounded-lg border text-xs font-mono font-semibold transition-colors ${
                        resolution === res
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1.5">FRAME RATE</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {([30, 60] as const).map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setFps(rate)}
                      className={`py-2 px-3 rounded-lg border text-xs font-mono font-semibold transition-colors ${
                        fps === rate
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {rate} FPS
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              Renders all {project.scenes.length} scenes directly in your browser using Canvas 2D vector frames and Web Audio SFX ({totalDuration.toFixed(1)}s real-time encoding).
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={handleStartRender}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Render Real Video File</span>
              </button>
              <button
                onClick={handleDownloadProjectJson}
                className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
                title="Download editable storyboard JSON"
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        )}

        {isRendering && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>
                  Scene {(progress?.currentSceneIndex ?? 0) + 1}/{progress?.totalScenes ?? project.scenes.length}: {progress?.sceneTitle}
                </span>
              </span>
              <span className="font-bold text-cyan-400 tabular-nums">{pct}%</span>
            </div>

            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-150"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 tabular-nums">
              <span>Frame {progress?.frame ?? 0} / {progress?.totalFrames ?? 0}</span>
              <span>{resolution} · {fps} FPS</span>
            </div>
          </div>
        )}

        {result && !isRendering && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Video rendered ({result.extension.toUpperCase()} · {(result.blob.size / (1024 * 1024)).toFixed(2)} MB)</span>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-black flex justify-center">
              <video
                src={result.url}
                controls
                autoPlay
                className={project.aspectRatio === '9:16' ? 'h-64 w-auto' : 'w-full aspect-video'}
              />
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleDownloadVideo}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download .{result.extension.toUpperCase()} Video</span>
              </button>
              <button
                onClick={() => {
                  URL.revokeObjectURL(result.url);
                  setResult(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-medium text-xs transition-colors"
              >
                Re-Render
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
