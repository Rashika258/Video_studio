import React from 'react';
import { useVideoStudio } from '../../store/videoStudioStore';
import { ElementStatus } from '../../types/videoStudio';
import { Sliders, Trash2, ArrowRight, Zap, X } from 'lucide-react';

export const StudioInspector: React.FC = () => {
  const {
    activeScene,
    activeElementId,
    setActiveElementId,
    updateElement,
    removeElement,
    setElementStatus,
    addPipe,
  } = useVideoStudio();

  if (!activeElementId) return null;

  const element = activeScene.elements.find((el) => el.id === activeElementId);
  if (!element) return null;

  const otherElements = activeScene.elements.filter((el) => el.id !== activeElementId);

  return (
    <div className="absolute right-6 top-16 w-72 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl p-4 backdrop-blur-xl z-40 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Element Inspector
          </span>
        </div>
        <button
          onClick={() => setActiveElementId(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Title & Subtitle Form */}
      <div className="py-3 space-y-2.5">
        <div>
          <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1">
            TITLE
          </label>
          <input
            type="text"
            value={element.title}
            onChange={(e) => updateElement(element.id, { title: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1">
            SUBTITLE / METRIC
          </label>
          <input
            type="text"
            value={element.subtitle || ''}
            onChange={(e) => updateElement(element.id, { subtitle: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* State Status Buttons */}
        <div>
          <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1">
            STATUS STATE
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { status: 'normal' as ElementStatus, label: 'Normal', color: 'border-slate-600 text-slate-300' },
              { status: 'active' as ElementStatus, label: 'Active', color: 'border-cyan-500 text-cyan-400' },
              { status: 'warning' as ElementStatus, label: 'High Load', color: 'border-amber-500 text-amber-400' },
              { status: 'crashed' as ElementStatus, label: '500 Crash', color: 'border-red-500 text-red-400 font-bold' },
            ].map((st) => (
              <button
                key={st.status}
                onClick={() => setElementStatus(element.id, st.status)}
                className={`py-1 px-2 rounded-lg text-[10px] font-mono border transition-all ${
                  element.status === st.status
                    ? `${st.color} bg-slate-800 shadow-md font-bold`
                    : 'border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Position X / Y */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
              <span>X POS</span>
              <span>{Math.round(element.x)}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={element.x}
              onChange={(e) => updateElement(element.id, { x: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
              <span>Y POS</span>
              <span>{Math.round(element.y)}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="85"
              value={element.y}
              onChange={(e) => updateElement(element.id, { y: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Connect to Another Node via Pipe */}
        {otherElements.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>CONNECT PIPE TO:</span>
            </label>
            <div className="flex flex-wrap gap-1">
              {otherElements.map((target) => (
                <button
                  key={target.id}
                  onClick={() => addPipe(element.id, target.id)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[10px] font-mono text-cyan-300 border border-slate-700 flex items-center gap-1"
                >
                  <span>➔</span>
                  <span className="truncate max-w-[80px]">{target.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Button */}
      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <button
          onClick={() => removeElement(element.id)}
          className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove Element</span>
        </button>
      </div>
    </div>
  );
};
