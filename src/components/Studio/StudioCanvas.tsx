import React, { useRef } from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { PipeLayer } from '../Graphics/PipeLayer';
import { ElementRenderer } from '../Graphics/ElementRenderer';
import { Activity, Cpu, Clock, AlertTriangle } from 'lucide-react';

export const StudioCanvas: React.FC = () => {
  const {
    activeScene,
    activeElementId,
    setActiveElementId,
    currentSpokenWord,
    playbackProgress,
  } = useVideoStudio();

  const canvasRef = useRef<HTMLDivElement>(null);
  const { camera, hud, background, elements, pipes } = activeScene;

  // Camera Zoom & Shake transforms
  const isShake = camera.focus === 'shake';
  const zoomScale = camera.zoom || 1.0;
  const panX = camera.panX || 0;
  const panY = camera.panY || 0;

  return (
    <div
      onClick={() => setActiveElementId(null)}
      className="w-full h-full flex items-center justify-center p-6 overflow-hidden bg-[#05070B] select-none"
    >
      {/* 16:9 1080p Studio Frame Container */}
      <div
        ref={canvasRef}
        className={`relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#070B14] transition-all duration-700 ${
          isShake ? 'animate-wiggle border-red-500/80 shadow-[0_0_50px_rgba(239,68,68,0.3)]' : ''
        }`}
      >
        {/* Background Grid & Ambient Glows */}
        {background.grid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        )}

        {/* Ambient Radial Color Spotlight */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${background.ambientGlow} 0%, transparent 70%)`,
          }}
        />

        {/* TOP HUD METRICS OVERLAY (Visualcoders style) */}
        {hud.show && (
          <div className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
            {/* System Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg">
              <div
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: hud.statusColor || '#10B981' }}
              />
              <span
                className="text-[10px] font-mono font-bold tracking-wider"
                style={{ color: hud.statusColor || '#10B981' }}
              >
                {hud.statusText || 'SYSTEM RUNNING'}
              </span>
            </div>

            {/* Live Metrics: RPS, Latency, CPU */}
            <div className="flex items-center gap-3">
              {hud.rps !== undefined && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[10px] font-mono shadow-md">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-400">RPS:</span>
                  <span className="font-bold text-white">{hud.rps.toLocaleString()}</span>
                </div>
              )}

              {hud.latencyMs !== undefined && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[10px] font-mono shadow-md">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-400">LATENCY:</span>
                  <span
                    className={`font-bold ${
                      hud.latencyMs > 500 ? 'text-red-400 font-extrabold animate-pulse' : 'text-white'
                    }`}
                  >
                    {hud.latencyMs}ms
                  </span>
                </div>
              )}

              {hud.cpuPercent !== undefined && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[10px] font-mono shadow-md">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-400">CPU:</span>
                  <span
                    className={`font-bold ${
                      hud.cpuPercent > 80 ? 'text-red-400 font-extrabold' : 'text-white'
                    }`}
                  >
                    {hud.cpuPercent}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* INNER CAMERA WORLD (Scales & Pans dynamically) */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out origin-center"
          style={{
            transform: `scale(${zoomScale}) translate(${-panX}%, ${-panY}%)`,
          }}
        >
          {/* Active SVG Pipes Layer */}
          <PipeLayer pipes={pipes} elements={elements} />

          {/* Render Elements */}
          {elements.map((el) => (
            <ElementRenderer
              key={el.id}
              element={el}
              isSelected={el.id === activeElementId}
              onSelect={() => setActiveElementId(el.id)}
            />
          ))}
        </div>

        {/* BOTTOM ANIMATED SUBTITLE / NARRATION CAPTION (YouTube Shorts / Explainer style) */}
        {activeScene.narration && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-2xl text-center px-4 pointer-events-none">
            <div className="inline-block px-4 py-2 rounded-xl bg-slate-950/90 border border-slate-800/80 shadow-2xl backdrop-blur-md">
              <span className="text-sm font-bold text-slate-100 tracking-wide leading-relaxed">
                {activeScene.narration.split(' ').map((word, i) => {
                  const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
                  const isCurrent =
                    currentSpokenWord &&
                    cleanWord.toLowerCase() === currentSpokenWord.toLowerCase();
                  return (
                    <span
                      key={i}
                      className={`inline-block mr-1.5 transition-all duration-150 ${
                        isCurrent
                          ? 'text-amber-300 scale-110 font-black drop-shadow-[0_0_8px_#F59E0B]'
                          : 'text-slate-200'
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </span>
            </div>
          </div>
        )}

        {/* Scene Progress Scrub Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 z-30">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-100"
            style={{ width: `${playbackProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
