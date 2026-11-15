import React from 'react';
import {
  Play,
  Pause,
  Plus,
  Copy,
  Trash2,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useStory } from '../../store/storyStore';

export const StoryboardStrip: React.FC = () => {
  const {
    scenes,
    activeSceneIndex,
    selectScene,
    addScene,
    duplicateScene,
    deleteScene,
    updateActiveScene,
    isPlaying,
    togglePlay,
    currentTime,
    totalDuration,
    seek,
  } = useStory();

  const progressPercent = Math.min(100, (currentTime / (totalDuration || 1)) * 100);

  return (
    <div className="h-36 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 py-2.5 flex flex-col justify-between shrink-0 z-20 select-none">
      {/* Top Controls: Play/Pause, Duration, Scene counter */}
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all ${
              isPlaying
                ? 'bg-amber-500 shadow-amber-500/25'
                : 'bg-indigo-600 shadow-indigo-500/25 hover:bg-indigo-500'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" /> Play Full Video
              </>
            )}
          </button>

          <div className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-sky-400">
            {currentTime.toFixed(1)}s <span className="text-slate-500">/ {totalDuration}s</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Active scene duration slider */}
          <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Scene {activeSceneIndex + 1} Duration:</span>
            <input
              type="number"
              min={1}
              max={15}
              value={scenes[activeSceneIndex]?.duration || 4}
              onChange={(e) => updateActiveScene({ duration: Math.max(1, Number(e.target.value)) })}
              className="w-12 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-white font-mono text-xs focus:outline-none"
            />
            <span>sec</span>
          </div>
        </div>

        {/* Scene Transition Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg text-xs">
          <span className="text-slate-400">Transition:</span>
          <select
            value={scenes[activeSceneIndex]?.transition || 'slide'}
            onChange={(e) => updateActiveScene({ transition: e.target.value as any })}
            className="bg-transparent text-white font-semibold cursor-pointer focus:outline-none"
          >
            <option value="slide" className="bg-slate-900">Slide</option>
            <option value="zoom" className="bg-slate-900">Zoom</option>
            <option value="fade" className="bg-slate-900">Fade</option>
            <option value="pop" className="bg-slate-900">Pop</option>
          </select>
        </div>
      </div>

      {/* Slide Thumbnails Strip (Canva / CapCut Style) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1">
        {scenes.map((scene, idx) => {
          const isActive = idx === activeSceneIndex;
          return (
            <div
              key={scene.id}
              onClick={() => selectScene(idx)}
              className={`relative min-w-[150px] h-20 rounded-xl p-2.5 border-2 flex flex-col justify-between cursor-pointer transition-all shadow-md group ${
                isActive
                  ? 'border-indigo-500 bg-indigo-950/40 shadow-indigo-500/20 scale-[1.02]'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              {/* Card Header: Scene Number + Delete/Copy icons */}
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                  Scene {idx + 1}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateScene(idx);
                    }}
                    className="p-0.5 hover:text-sky-400 text-slate-500"
                    title="Duplicate scene"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {scenes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteScene(idx);
                      }}
                      className="p-0.5 hover:text-rose-400 text-slate-500"
                      title="Delete scene"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Title Snippet */}
              <div className="text-xs font-semibold text-white truncate my-auto">
                {scene.headline.text || 'Untitled Scene'}
              </div>

              {/* Card Footer: Duration & Character emoji */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>{scene.duration}s</span>
                <span>{scene.props[0]?.icon || '🎬'}</span>
              </div>
            </div>
          );
        })}

        {/* "+ Add Scene" Button */}
        <button
          onClick={addScene}
          className="min-w-[120px] h-20 rounded-xl border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white transition-all group shrink-0"
        >
          <Plus className="w-5 h-5 group-hover:scale-125 transition-transform text-indigo-400" />
          <span className="text-xs font-semibold">+ Add Scene</span>
        </button>
      </div>
    </div>
  );
};
