import React, { useRef, useState } from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { PipeLayer } from '../Graphics/PipeLayer';
import { ElementRenderer } from '../Graphics/ElementRenderer';
import {
  Activity,
  Cpu,
  Clock,
  PanelLeftOpen,
  PanelLeftClose,
  Plus,
  Zap,
  Grid,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export const StudioCanvas: React.FC = () => {
  const {
    project,
    activeScene,
    activeElementId,
    setActiveElementId,
    updateElement,
    addPipe,
    currentSpokenWord,
    playbackProgress,
    isPlaying,
    isScrubbing,
    setIsScrubbing,
    scrubSceneProgress,
    isSidebarOpen,
    setIsSidebarOpen,
    setIsCustomBuilderOpen,
    snapToGrid,
    setSnapToGrid,
    isConnectMode,
    setIsConnectMode,
    connectFromId,
    setConnectFromId,
  } = useVideoStudio();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const { camera, hud, background, elements, pipes, headline } = activeScene;
  const isAnimating = isPlaying || isScrubbing;
  const isStageExpanded = !isSidebarOpen && !activeElementId;

  const isShake = camera.focus === 'shake';
  const endZoom = camera.zoom || 1.0;
  const startZoom = camera.startZoom ?? endZoom;
  const endPanX = camera.panX || 0;
  const startPanX = camera.startPanX ?? endPanX;
  const endPanY = camera.panY || 0;
  const startPanY = camera.startPanY ?? endPanY;

  // Smooth ease-in-out 2.5D camera drift across scene playback
  const easeInOut = playbackProgress < 0.5
    ? 2 * playbackProgress * playbackProgress
    : 1 - Math.pow(-2 * playbackProgress + 2, 2) / 2;

  const zoomScale = isAnimating ? startZoom + (endZoom - startZoom) * easeInOut : endZoom;
  const panX = isAnimating ? startPanX + (endPanX - startPanX) * easeInOut : endPanX;
  const panY = isAnimating ? startPanY + (endPanY - startPanY) * easeInOut : endPanY;

  // Scene entry transition during playback/scrub
  const transProg = isAnimating ? Math.min(1, playbackProgress / 0.14) : 1;
  const transEase = 1 - Math.pow(1 - transProg, 3);
  const transitionType = activeScene.transition || 'fade';
  const worldOpacity = transitionType === 'cut' ? 1 : transEase;
  const transZoomMul = transitionType === 'zoom' ? 0.92 + 0.08 * transEase : 1;
  const transSlideX = transitionType === 'slide' ? (1 - transEase) * 6 : 0;

  const isVertical = project.aspectRatio === '9:16';

  const handleElementDragStart = (elementId: string, startX: number, startY: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (isConnectMode) return;
    const container = canvasRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const originClientX = e.clientX;
    const originClientY = e.clientY;
    setDraggingId(elementId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dxPct = (((moveEvent.clientX - originClientX) / rect.width) * 100) / zoomScale;
      const dyPct = (((moveEvent.clientY - originClientY) / rect.height) * 100) / zoomScale;
      let nextX = Math.max(8, Math.min(92, startX + dxPct));
      let nextY = Math.max(14, Math.min(86, startY + dyPct));
      if (snapToGrid) {
        nextX = Math.round(nextX / 2) * 2;
        nextY = Math.round(nextY / 2) * 2;
      }
      updateElement(elementId, { x: nextX, y: nextY });
    };

    const onPointerUp = () => {
      setDraggingId(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleElementSelect = (elementId: string) => {
    if (isConnectMode) {
      if (!connectFromId) {
        setConnectFromId(elementId);
        return;
      }
      if (connectFromId !== elementId) {
        addPipe(connectFromId, elementId);
        setConnectFromId(null);
        setIsConnectMode(false);
        setActiveElementId(elementId);
      }
      return;
    }
    setActiveElementId(elementId);
  };

  const connectSourceEl = connectFromId ? elements.find((el) => el.id === connectFromId) : null;

  // Subtitle word sync: prefer live TTS boundary word, fallback to smooth progress index when playing
  const words = activeScene.narration ? activeScene.narration.trim().split(/\s+/) : [];
  const timeWordIndex = isPlaying && words.length > 0 ? Math.min(words.length - 1, Math.floor(playbackProgress * words.length)) : -1;

  // Background theme classes
  const bgGradient =
    background.theme === 'cyber-terminal' || background.theme === 'matrix-code'
      ? 'bg-gradient-to-b from-[#04120E] to-[#05080F]'
      : background.theme === 'clean-slate' || background.theme === 'psychology-split'
      ? 'bg-gradient-to-b from-[#0F1123] to-[#070913]'
      : background.theme === 'deep-space'
      ? 'bg-gradient-to-b from-[#050714] to-[#090B1A]'
      : 'bg-[#070B14]';

  // Kinetic headline reveal
  const headlineOpacity = isAnimating ? Math.min(1, playbackProgress / 0.16) : 1;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#05070B] select-none">
      {/* Canvas Workspace Bar */}
      <div className="h-10 px-3 border-b border-slate-800/70 bg-[#080C15] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              isSidebarOpen
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                : 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 hover:bg-indigo-600/30'
            }`}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
            <span>{isSidebarOpen ? 'Hide Assets' : 'Assets & FX'}</span>
          </button>

          <button
            onClick={() => setIsCustomBuilderOpen(true)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Custom Block</span>
          </button>

          <button
            onClick={() => {
              const next = !isConnectMode;
              setIsConnectMode(next);
              if (!next) setConnectFromId(null);
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              isConnectMode
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>
              {isConnectMode
                ? connectSourceEl
                  ? `From "${connectSourceEl.title}" ➔ Click Target`
                  : 'Click Source Node...'
                : 'Connect Pipe'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border flex items-center gap-1 transition-colors whitespace-nowrap ${
              snapToGrid
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Snap dragged elements to 2% grid"
          >
            <Grid className="w-3 h-3" />
            <span>Snap {snapToGrid ? 'On' : 'Off'}</span>
          </button>

          <button
            onClick={() => {
              if (isStageExpanded) {
                setIsSidebarOpen(true);
              } else {
                setIsSidebarOpen(false);
                setActiveElementId(null);
              }
            }}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors whitespace-nowrap"
            title={isStageExpanded ? 'Restore workspace panels' : 'Expand stage for full editing room'}
          >
            {isStageExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            <span>{isStageExpanded ? 'Restore Panels' : 'Expand Stage'}</span>
          </button>
        </div>
      </div>

      {/* Stage Area */}
      <div
        onClick={() => {
          if (isConnectMode) {
            setConnectFromId(null);
            setIsConnectMode(false);
          } else {
            setActiveElementId(null);
          }
        }}
        className="flex-1 flex items-center justify-center p-3 overflow-hidden"
      >
        {/* 16:9 or 9:16 Studio Frame Container */}
        <div
          ref={canvasRef}
          className={`relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ${bgGradient} transition-all duration-300 ${
            isVertical ? 'h-full max-h-full aspect-[9/16]' : 'w-full max-w-6xl aspect-video'
          } ${isShake && isPlaying ? 'animate-wiggle border-red-500/80 shadow-[0_0_50px_rgba(239,68,68,0.3)]' : ''}`}
        >
        {/* Background Grid */}
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

        {/* TOP HUD METRICS OVERLAY */}
        {hud.show && (
          <div className="absolute top-3.5 left-5 right-5 z-20 flex items-center justify-between gap-2 pointer-events-none">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-md">
              <span
                className="text-[10px] font-mono font-bold tracking-wider whitespace-nowrap"
                style={{ color: hud.statusColor || '#10B981' }}
              >
                {hud.statusText || 'SYSTEM RUNNING'}
              </span>
            </div>

            <div className="flex items-center gap-2 tabular-nums">
              {hud.rps !== undefined && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[10px] font-mono">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span className="text-slate-400">RPS:</span>
                  <span className="font-bold text-white">{hud.rps.toLocaleString()}</span>
                </div>
              )}

              {hud.latencyMs !== undefined && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[10px] font-mono">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span className="text-slate-400">LAT:</span>
                  <span className={`font-bold ${hud.latencyMs > 500 ? 'text-red-400' : 'text-white'}`}>
                    {hud.latencyMs}ms
                  </span>
                </div>
              )}

              {hud.cpuPercent !== undefined && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[10px] font-mono">
                  <Cpu className="w-3 h-3 text-indigo-400" />
                  <span className="text-slate-400">CPU:</span>
                  <span className={`font-bold ${hud.cpuPercent > 80 ? 'text-red-400' : 'text-white'}`}>
                    {hud.cpuPercent}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* KINETIC SCENE HEADLINE */}
        {headline?.text && (
          <div
            className="absolute left-6 right-6 z-20 text-center pointer-events-none transition-opacity duration-300"
            style={{
              top: hud.show ? '56px' : '24px',
              opacity: headlineOpacity,
            }}
          >
            <h2
              className="text-lg sm:text-2xl font-extrabold tracking-tight drop-shadow-md leading-tight"
              style={{ color: headline.color || '#FFFFFF' }}
            >
              {headline.text}
            </h2>
            {headline.subtext && (
              <p className="text-xs text-slate-300 font-medium mt-0.5 drop-shadow">
                {headline.subtext}
              </p>
            )}
          </div>
        )}

        {/* INNER CAMERA WORLD (Scales & Pans dynamically with 2.5D drift) */}
        <div
          className={`absolute inset-0 origin-center ${draggingId || isAnimating ? '' : 'transition-transform duration-500 ease-out'}`}
          style={{
            opacity: worldOpacity,
            transform: `scale(${zoomScale * transZoomMul}) translate(${-panX + transSlideX}%, ${-panY}%)`,
          }}
        >
          <PipeLayer
            pipes={pipes}
            elements={elements}
            aspectRatio={project.aspectRatio}
            playbackProgress={playbackProgress}
            isPlaying={isAnimating}
          />

          {elements.map((el) => (
            <ElementRenderer
              key={el.id}
              element={el}
              isSelected={el.id === activeElementId}
              isConnectSource={isConnectMode && el.id === connectFromId}
              onSelect={() => handleElementSelect(el.id)}
              onDragStart={(e) => handleElementDragStart(el.id, el.x, el.y, e)}
              playbackProgress={playbackProgress}
              isPlaying={isAnimating}
            />
          ))}
        </div>

        {/* BOTTOM ANIMATED SUBTITLE / NARRATION CAPTION */}
        {words.length > 0 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[85%] max-w-2xl text-center pointer-events-none">
            <div className="inline-block px-4 py-2 rounded-xl bg-slate-950/90 border border-slate-800/90 shadow-2xl backdrop-blur-md">
              <span className="text-xs sm:text-sm font-bold text-slate-100 tracking-wide leading-relaxed">
                {words.map((word, i) => {
                  const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                  const isSpokenBoundary =
                    Boolean(currentSpokenWord) &&
                    cleanWord === currentSpokenWord.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                  const isCurrent = isSpokenBoundary || (!currentSpokenWord && i === timeWordIndex);
                  const isPast = !currentSpokenWord && timeWordIndex >= 0 && i < timeWordIndex;

                  return (
                    <span
                      key={i}
                      className={`inline-block mr-1.5 transition-transform duration-100 ${
                        isCurrent
                          ? 'text-amber-300 scale-105 font-extrabold'
                          : isPast
                          ? 'text-white'
                          : 'text-slate-300'
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

        {/* Interactive Scene Progress Scrubber */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2.5 bg-slate-900/90 z-30 cursor-ew-resize group flex items-end"
          title="Drag to scrub scene animation"
          onPointerDown={(e) => {
            e.stopPropagation();
            const bar = e.currentTarget;
            const updateScrub = (clientX: number) => {
              const rect = bar.getBoundingClientRect();
              const ratio = (clientX - rect.left) / Math.max(1, rect.width);
              scrubSceneProgress(ratio);
            };
            updateScrub(e.clientX);
            const onMove = (mv: PointerEvent) => updateScrub(mv.clientX);
            const onUp = () => {
              window.removeEventListener('pointermove', onMove);
              window.removeEventListener('pointerup', onUp);
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsScrubbing(false);
          }}
        >
          <div
            className="h-1 group-hover:h-2 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-75"
            style={{ width: `${playbackProgress * 100}%` }}
          />
        </div>
        </div>
      </div>
    </div>
  );
};
