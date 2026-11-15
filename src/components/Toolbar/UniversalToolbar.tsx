import React, { useState } from 'react';
import {
  MousePointer,
  Square,
  Type,
  Layers,
  Share2,
  PenTool,
  Sparkles,
  Trash2,
  Send,
  Sliders,
  Palette,
} from 'lucide-react';
import { useCanvas } from '../../store/canvasStore';
import { CustomComponentModal } from '../Builder/CustomComponentModal';

export const UniversalToolbar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    addElement,
    generateFromPrompt,
    clearCanvas,
  } = useCanvas();

  const [aiPrompt, setAiPrompt] = useState('');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    generateFromPrompt(aiPrompt);
    setAiPrompt('');
  };

  return (
    <>
      <div className="h-12 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
        {/* Tool Selection Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTool('select')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'select'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Select & Move (V)"
          >
            <MousePointer className="w-3.5 h-3.5" />
            Select
          </button>

          {/* Custom Component Builder Trigger */}
          <button
            onClick={() => setIsBuilderOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:opacity-90 shadow-sm transition-all"
            title="Open Custom Component Builder"
          >
            <Palette className="w-3.5 h-3.5" />
            + Build Component
          </button>

          <button
            onClick={() => addElement('card', { name: 'Component Card', fill: '#0F172A', stroke: '#38BDF8' })}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all hover:bg-slate-800"
            title="Quick Card"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            Card
          </button>

          <button
            onClick={() => addElement('shape', { shape: 'circle', fill: '#1E293B', stroke: '#10B981' })}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all hover:bg-slate-800"
            title="Vector Shape"
          >
            <Square className="w-3.5 h-3.5 text-emerald-400" />
            Shape
          </button>

          <button
            onClick={() => addElement('text', { text: 'Viral Headline', fontSize: 26, fontFamily: 'Bebas Neue', textColor: '#FFFFFF' })}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all hover:bg-slate-800"
            title="Add Typography"
          >
            <Type className="w-3.5 h-3.5 text-amber-400" />
            Text
          </button>

          <button
            onClick={() => setActiveTool('pen')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'pen'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Freehand Vector Pen (P)"
          >
            <PenTool className="w-3.5 h-3.5 text-cyan-400" />
            Pen
          </button>

          <button
            onClick={() => setActiveTool('wire')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'wire'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Connect Glowing Particle Stream (W)"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            Connect Wire
          </button>
        </div>

        {/* Center AI Natural Language Generator */}
        <form onSubmit={handleAiSubmit} className="flex items-center max-w-md w-full mx-4">
          <div className="relative w-full">
            <Sparkles className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Prompt AI to animate anything... (e.g. 'rocket launching' or 'brain reward loop')"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-20 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              Generate
              <Send className="w-2.5 h-2.5" />
            </button>
          </div>
        </form>

        {/* Clear Canvas */}
        <button
          onClick={clearCanvas}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Clear entire canvas"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      {/* Custom Component Builder Modal */}
      <CustomComponentModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
      />
    </>
  );
};
