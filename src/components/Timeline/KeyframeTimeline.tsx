import React, { useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Key,
  Radio,
  Trash2,
  Sliders,
  Volume2,
} from 'lucide-react';
import { useCanvas } from '../../store/canvasStore';

export const KeyframeTimeline: React.FC = () => {
  const {
    elements,
    selectedId,
    setSelectedId,
    currentTime,
    isPlaying,
    togglePlay,
    seek,
    isRecordingKeyframes,
    setIsRecordingKeyframes,
    addKeyframeAtCurrentTime,
    deleteKeyframe,
    project,
  } = useCanvas();

  const trackRef = useRef<HTMLDivElement>(null);
  const duration = project.duration;
  const progressPercent = Math.min(100, (currentTime / duration) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${ms}`;
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio * duration);
  };

  return (
    <div className="h-44 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md flex flex-col z-20 shrink-0">
      {/* Top Playback Toolbar */}
      <div className="h-10 px-4 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all shadow-md ${
              isPlaying ? 'bg-amber-500 shadow-amber-500/25' : 'bg-indigo-600 shadow-indigo-500/25'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          {/* Reset */}
          <button
            onClick={() => seek(0)}
            className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            title="Reset to 00:00"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Time Display */}
          <div className="font-mono text-xs font-bold text-sky-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
            {formatTime(currentTime)} <span className="text-slate-500">/ {formatTime(duration)}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Auto-Keyframe REC toggle */}
          <button
            onClick={() => setIsRecordingKeyframes(!isRecordingKeyframes)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-bold border transition-all ${
              isRecordingKeyframes
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-400 shadow-sm shadow-rose-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="When active, any modification on the canvas creates a keyframe at the current timestamp"
          >
            <Radio className={`w-3 h-3 ${isRecordingKeyframes ? 'animate-pulse text-rose-500' : ''}`} />
            AUTO-KEYFRAME (REC)
          </button>

          {/* Add Keyframe Button */}
          {selectedId && (
            <button
              onClick={() => addKeyframeAtCurrentTime(selectedId)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all text-xs font-semibold"
            >
              <Key className="w-3 h-3" />
              + Add Keyframe
            </button>
          )}
        </div>

        {/* Audio Waveform Track Indicator */}
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] font-mono">60 FPS Precision Keyframes</span>
        </div>
      </div>

      {/* Multi-Track Keyframe View */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Scrubber Ruler */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative h-6 bg-slate-900/60 border-b border-slate-800 cursor-pointer overflow-hidden"
        >
          {/* Seconds markers */}
          <div className="absolute inset-0 flex justify-between px-2 text-[9px] font-mono text-slate-500 pointer-events-none items-center">
            {Array.from({ length: Math.floor(duration) + 1 }).map((_, i) => (
              <span key={i} style={{ left: `${(i / duration) * 100}%` }} className="absolute">
                {i}s
              </span>
            ))}
          </div>

          {/* Playhead Marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-lg shadow-rose-500/50 pointer-events-none z-30"
            style={{ left: `${progressPercent}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-1 shadow-md" />
          </div>
        </div>

        {/* Tracks for each element */}
        <div className="divide-y divide-slate-800/40">
          {elements.map((el) => {
            const isSelected = el.id === selectedId;
            return (
              <div
                key={el.id}
                onClick={() => setSelectedId(el.id)}
                className={`flex items-center h-8 text-xs cursor-pointer transition-colors ${
                  isSelected ? 'bg-indigo-950/20' : 'hover:bg-slate-900/40'
                }`}
              >
                {/* Track Label */}
                <div className="w-48 px-3 flex items-center justify-between border-r border-slate-800/80 shrink-0">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: el.stroke }}
                    />
                    <span className="text-slate-300 font-medium truncate text-[11px]">
                      {el.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {el.keyframes.length} kf
                  </span>
                </div>

                {/* Keyframe Track Line */}
                <div className="flex-1 h-full relative" onClick={handleTrackClick}>
                  {/* Subtle track center line */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-800/60" />

                  {/* Keyframe Diamonds */}
                  {el.keyframes.map((kf, i) => {
                    const posPercent = (kf.time / duration) * 100;
                    return (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          seek(kf.time);
                          setSelectedId(el.id);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          deleteKeyframe(el.id, kf.time);
                        }}
                        style={{ left: `${posPercent}%` }}
                        className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3 h-3 rotate-45 bg-indigo-400 hover:bg-white border border-indigo-200 rounded-[2px] shadow-sm cursor-pointer z-10 transition-transform hover:scale-125"
                        title={`Keyframe at ${kf.time}s (Right-click to delete)`}
                      />
                    );
                  })}

                  {/* Playhead indicator on track */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-rose-500/40 pointer-events-none"
                    style={{ left: `${progressPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
