import React from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { GitBranch, TrendingUp, CheckCircle } from 'lucide-react';
import { BaseNodeData } from '../../../types/studio';

export const MathNode: React.FC<NodeProps<Node<BaseNodeData>>> = ({ data, selected }) => {
  const {
    label,
    sublabel,
    variant = 'tree-node',
    status = 'active',
    accentColor = '#EC4899',
    metricBadge,
    metricValue,
  } = data;

  const isPlot = variant === 'plot';
  const isOptimal = status === 'success';

  return (
    <div
      className={`relative min-w-[210px] rounded-xl px-4 py-3.5 border transition-all duration-300 shadow-2xl backdrop-blur-xl bg-slate-900/95 ${
        isOptimal
          ? 'border-emerald-500/80 shadow-emerald-500/25'
          : selected
          ? 'border-pink-500 shadow-pink-500/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-pink-400"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-pink-400"
      />

      <div className="flex items-center gap-2.5 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0"
          style={{
            backgroundColor: `${accentColor}18`,
            borderColor: `${accentColor}50`,
          }}
        >
          {isPlot ? (
            <TrendingUp className="w-4 h-4 text-pink-400" />
          ) : isOptimal ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <GitBranch className="w-4 h-4 text-blue-400" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white tracking-tight">{label}</h4>
          {sublabel && (
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-[140px]">
              {sublabel}
            </p>
          )}
        </div>
      </div>

      {isPlot && (
        <div className="my-2.5 p-2 bg-slate-950/80 rounded-lg border border-slate-800">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
            <span>O(1)</span>
            <span className="text-pink-400 font-bold">O(2^N) Exponential</span>
          </div>
          <svg className="w-full h-12 overflow-visible">
            <line x1="0" y1="45" x2="180" y2="45" stroke="#334155" strokeWidth="1" />
            <line x1="10" y1="0" x2="10" y2="45" stroke="#334155" strokeWidth="1" />
            <path d="M 10 45 L 170 25" fill="none" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
            <path
              d="M 10 45 Q 110 44, 160 5"
              fill="none"
              stroke="#F43F5E"
              strokeWidth="2.5"
              className="animate-pulse"
            />
          </svg>
        </div>
      )}

      {metricBadge && (
        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">{metricBadge}</span>
          <span
            className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
              isOptimal
                ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30'
                : 'text-pink-300 bg-pink-950/60 border border-pink-500/30'
            }`}
          >
            {metricValue}
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-pink-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-pink-400"
      />
    </div>
  );
};
