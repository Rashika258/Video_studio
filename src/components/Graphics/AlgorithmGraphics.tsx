import React from 'react';
import { ElementStatus } from '../../types/videoStudio';

interface GraphicProps {
  status: ElementStatus;
  title: string;
  subtitle?: string;
  customProps?: Record<string, any>;
}

// 1. BINARY SEARCH TREE (ByteMonk style)
export const BinaryTreeGraphic: React.FC<GraphicProps> = ({ status, title, subtitle, customProps }) => {
  const targetVal = customProps?.target || 42;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 rounded-2xl bg-slate-950/90 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.25)] backdrop-blur-md select-none font-mono">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-emerald-300">{title || 'Binary Search Tree'}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          O(log N)
        </span>
      </div>

      {/* Tree Visualization with SVG connecting lines */}
      <div className="relative my-2 w-full flex-1 flex flex-col items-center justify-around">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Root to Left & Right */}
          <line x1="50%" y1="22%" x2="28%" y2="52%" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="50%" y1="22%" x2="72%" y2="52%" stroke="#334155" strokeWidth="2" />
          {/* Left child to subchildren */}
          <line x1="28%" y1="52%" x2="16%" y2="82%" stroke="#334155" strokeWidth="1.5" />
          <line x1="28%" y1="52%" x2="40%" y2="82%" stroke="#10B981" strokeWidth="2" />
        </svg>

        {/* Level 1: Root Node */}
        <div className="relative z-10 w-9 h-9 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-xs font-bold text-emerald-300 shadow-md">
          50
        </div>

        {/* Level 2: Children */}
        <div className="relative z-10 flex justify-between w-3/4">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-xs font-bold text-emerald-300 shadow-md animate-pulse">
            25
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-400">
            75
          </div>
        </div>

        {/* Level 3: Leaf Nodes */}
        <div className="relative z-10 flex justify-between w-5/6">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
            10
          </div>
          {/* Target Node Found */}
          <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xs font-extrabold text-slate-950 shadow-[0_0_20px_#10B981] animate-bounce">
            {targetVal}
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
            60
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
            90
          </div>
        </div>
      </div>

      {/* Subtitle / Step Note */}
      <div className="text-[9px] text-center text-emerald-400 border-t border-slate-800 pt-1">
        {subtitle || 'Traversed 3 steps: 50 ➔ 25 ➔ 42 (FOUND)'}
      </div>
    </div>
  );
};

// 2. BIG-O COMPLEXITY GRAPH (ByteMonk style)
export const BigOChartGraphic: React.FC<GraphicProps> = ({ status, title, subtitle }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 rounded-2xl bg-slate-950/90 border border-indigo-500/40 shadow-2xl backdrop-blur-md select-none font-mono">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-indigo-300">{title || 'Time Complexity'}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
          N = 1,000,000
        </span>
      </div>

      {/* SVG Chart with Axes & Curves */}
      <div className="relative my-2 w-full flex-1 flex items-center justify-center">
        <svg className="w-full h-28" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Coordinate Axes */}
          <line x1="20" y1="10" x2="20" y2="85" stroke="#475569" strokeWidth="1.5" />
          <line x1="20" y1="85" x2="190" y2="85" stroke="#475569" strokeWidth="1.5" />

          {/* O(1) Constant (Green) */}
          <line x1="20" y1="75" x2="190" y2="75" stroke="#10B981" strokeWidth="2" />
          <text x="145" y="70" fill="#10B981" fontSize="7" fontWeight="bold">O(1)</text>

          {/* O(log n) (Cyan) */}
          <path d="M 20 85 Q 60 70 190 55" stroke="#06B6D4" strokeWidth="2" fill="none" />
          <text x="145" y="50" fill="#06B6D4" fontSize="7" fontWeight="bold">O(log n)</text>

          {/* O(n) Linear (Yellow) */}
          <line x1="20" y1="85" x2="160" y2="25" stroke="#F59E0B" strokeWidth="2" />
          <text x="125" y="22" fill="#F59E0B" fontSize="7" fontWeight="bold">O(n)</text>

          {/* O(n^2) Quadratic (Red) */}
          <path d="M 20 85 Q 50 80 80 15" stroke="#EF4444" strokeWidth="2.5" fill="none" />
          <text x="45" y="14" fill="#EF4444" fontSize="7" fontWeight="bold">O(n²)</text>
        </svg>
      </div>

      <div className="text-[9px] text-center text-slate-400 border-t border-slate-800 pt-1">
        {subtitle || 'Sub-millisecond latency curve vs brute-force'}
      </div>
    </div>
  );
};

// 3. ARRAY VISUALIZATION / POINTERS
export const AlgorithmArrayGraphic: React.FC<GraphicProps> = ({ status, title, subtitle }) => {
  const values = [4, 12, 28, 42, 65, 89];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-xl backdrop-blur-md select-none font-mono">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-cyan-300">{title || 'Sorted Array'}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
          INDEX 0..5
        </span>
      </div>

      {/* Array Boxes with Binary Search Mid Pointer */}
      <div className="my-2 flex flex-col items-center">
        <div className="flex gap-1.5">
          {values.map((v, i) => {
            const isMid = i === 3;
            return (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[8px] text-slate-500 mb-0.5">[{i}]</span>
                <div
                  className={`w-9 h-11 rounded-lg border-2 flex items-center justify-center text-xs font-bold ${
                    isMid
                      ? 'bg-cyan-500 text-slate-950 border-white shadow-[0_0_15px_#06B6D4] animate-pulse'
                      : 'bg-slate-900 text-slate-200 border-slate-700'
                  }`}
                >
                  {v}
                </div>
                {isMid && (
                  <span className="text-[9px] text-cyan-400 font-bold mt-1 animate-bounce">
                    ▲ MID
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-[9px] text-center text-cyan-400 border-t border-slate-800 pt-1">
        {subtitle || 'Target 42 found in single split comparison'}
      </div>
    </div>
  );
};
