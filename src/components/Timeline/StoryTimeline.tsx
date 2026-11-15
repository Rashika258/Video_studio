import React, { useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import { useStudio } from '../../store/studioStore';

export const StoryTimeline: React.FC = () => {
  const {
    isPlaying,
    togglePlay,
    currentTime,
    seekTime,
    projectSettings,
    currentPreset,
    currentBeat,
    triggerBeatAction,
  } = useStudio();

  const trackRef = useRef<HTMLDivElement>(null);

  const duration = projectSettings.duration;
  const progressPercent = Math.min(100, (currentTime / duration) * 100);

  // Format seconds into MM:SS.mm
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekTime(ratio * duration);
  };

  return (
    <div className="h-28 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 py-2.5 flex flex-col justify-between shrink-0 z-20">
      {/* Top bar: Playback controls, Timecode, and Current Beat narrative banner */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => seekTime(0)}
            className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition-colors"
            title="Reset to 00:00"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Timecode */}
          <div className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-sky-400">
            {formatTime(currentTime)}{' '}
            <span className="text-slate-500">/ {formatTime(duration)}</span>
          </div>
        </div>

        {/* Current Active Story Beat Title Banner */}
        {currentBeat && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 max-w-lg">
            <Bookmark className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-semibold text-white truncate text-xs">
              {currentBeat.title}
            </span>
            <span className="text-slate-500 font-mono text-[10px] shrink-0">
              ({currentBeat.timestamp}s)
            </span>
            <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="text-slate-400 truncate text-[11px]">
              {currentBeat.description}
            </span>
          </div>
        )}

        {/* Audio Track Indicator */}
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-mono text-slate-400">
            Voiceover Sync Track
          </span>
        </div>
      </div>

      {/* Scrubber & Waveform Track */}
      <div className="relative w-full mt-1.5">
        {/* Fake Simulated Audio Waveform bars */}
        <div className="absolute inset-0 flex items-center justify-between opacity-25 pointer-events-none px-1">
          {Array.from({ length: 90 }).map((_, i) => {
            const height = 8 + Math.abs(Math.sin(i * 0.4) * 16) + (i % 3 === 0 ? 6 : 0);
            return (
              <div
                key={i}
                className="w-1 bg-sky-400 rounded-full"
                style={{ height: `${height}px` }}
              />
            );
          })}
        </div>

        {/* Interactive Scrub Track */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative w-full h-8 bg-slate-900/80 border border-slate-800 rounded-lg cursor-pointer overflow-hidden group shadow-inner"
        >
          {/* Progress fill */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-indigo-500/20 border-r-2 border-indigo-400 transition-all duration-75 pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Story Beat Markers */}
          {currentPreset.beats.map((beat) => {
            const beatPercent = (beat.timestamp / duration) * 100;
            const isPassed = currentTime >= beat.timestamp;
            return (
              <div
                key={beat.id}
                onClick={(e) => {
                  e.stopPropagation();
                  seekTime(beat.timestamp);
                  triggerBeatAction(beat);
                }}
                className="absolute top-0 bottom-0 -ml-1.5 flex flex-col items-center justify-between z-10 hover:scale-110 transition-transform"
                style={{ left: `${beatPercent}%` }}
                title={`${beat.title} (${beat.timestamp}s)`}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-colors ${
                    isPassed
                      ? 'bg-indigo-500 border-white shadow-sm shadow-indigo-500'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                />
                <span className="text-[9px] font-mono font-medium text-slate-400 px-1 rounded bg-slate-950/80 mb-0.5 pointer-events-none">
                  {beat.timestamp}s
                </span>
              </div>
            );
          })}

          {/* Red Playhead line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-md shadow-rose-500/50 pointer-events-none z-20"
            style={{ left: `${progressPercent}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-1 -mt-0.5 shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
