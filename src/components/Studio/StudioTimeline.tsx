import React from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { Plus, Copy, Trash2, Clock, Film, ChevronLeft, ChevronRight } from 'lucide-react';

export const StudioTimeline: React.FC = () => {
  const {
    project,
    activeSceneIndex,
    setActiveSceneIndex,
    addScene,
    duplicateScene,
    deleteScene,
    reorderScene,
    playbackProgress,
    isPlaying,
  } = useVideoStudio();

  const totalDuration = project.scenes.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="h-32 bg-[#090D16] border-t border-slate-800/80 px-4 py-2.5 flex flex-col justify-between select-none z-20 shrink-0">
      {/* Timeline Header Info */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Film className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Storyboard Timeline
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 tabular-nums">
            {project.scenes.length} {project.scenes.length === 1 ? 'Scene' : 'Scenes'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] tabular-nums">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>Total Runtime:</span>
          <span className="font-bold text-white">{totalDuration.toFixed(1)}s</span>
        </div>
      </div>

      {/* Horizontal Scene Cards Scroll */}
      <div className="flex items-center gap-3 overflow-x-auto py-1">
        {project.scenes.map((scene, idx) => {
          const isActive = idx === activeSceneIndex;

          return (
            <div
              key={scene.id}
              onClick={() => setActiveSceneIndex(idx)}
              className={`relative flex-shrink-0 w-56 h-20 rounded-xl p-2.5 border transition-colors cursor-pointer flex flex-col justify-between group overflow-hidden ${
                isActive
                  ? 'bg-slate-800/90 border-indigo-500 ring-1 ring-indigo-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Active playhead bar at bottom of active scene card */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-75"
                  style={{ width: `${(isPlaying ? playbackProgress : 0) * 100}%` }}
                />
              )}

              {/* Scene Number & Duration */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`w-4 h-4 rounded text-[9px] font-mono font-bold flex items-center justify-center shrink-0 tabular-nums ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-bold text-white truncate">
                    {scene.title}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-cyan-400 font-semibold tabular-nums shrink-0 ml-1">
                  {scene.duration.toFixed(1)}s
                </span>
              </div>

              {/* Narration Script Snippet */}
              <div className="text-[10px] text-slate-400 truncate leading-snug">
                {scene.narration || 'No narration...'}
              </div>

              {/* Elements & Pipes Count */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500 tabular-nums">
                  <span>{scene.elements.length} nodes</span>
                  <span>·</span>
                  <span>{scene.pipes.length} pipes</span>
                </div>

                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                  {idx > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderScene(idx, idx - 1);
                      }}
                      title="Move Scene Left"
                      className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  )}

                  {idx < project.scenes.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderScene(idx, idx + 1);
                      }}
                      title="Move Scene Right"
                      className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateScene(idx);
                    }}
                    title="Duplicate Scene"
                    className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  {project.scenes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteScene(idx);
                      }}
                      title="Delete Scene"
                      className="p-0.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Scene Button */}
        <button
          onClick={addScene}
          className="flex-shrink-0 w-24 h-20 rounded-xl border-2 border-dashed border-slate-800 hover:border-indigo-500/60 hover:bg-indigo-950/20 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-bold font-mono">Add Scene</span>
        </button>
      </div>
    </div>
  );
};
