import React from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import {
  Server,
  Database,
  ShieldCheck,
  Smartphone,
  Zap,
  Layers,
  Flame,
  Skull,
  RefreshCw,
  Activity,
} from 'lucide-react';
import { BaseNodeData } from '../../../types/studio';

export const SystemNode: React.FC<NodeProps<Node<BaseNodeData>>> = ({ data, selected }) => {
  const {
    label,
    sublabel,
    variant = 'server',
    status = 'active',
    accentColor = '#60A5FA',
    metricBadge,
    metricValue,
  } = data;

  const renderIcon = () => {
    switch (variant) {
      case 'client':
        return <Smartphone className="w-5 h-5 text-sky-400" />;
      case 'gateway':
        return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-blue-400" />;
      case 'cache':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'queue':
        return <Layers className="w-5 h-5 text-purple-400" />;
      default:
        return <Server className="w-5 h-5 text-emerald-400" />;
    }
  };

  const isCrashed = status === 'crashed';
  const isStressed = status === 'stressed' || status === 'overloaded';
  const isSyncing = status === 'syncing';

  return (
    <div
      className={`relative min-w-[210px] rounded-xl px-4 py-3.5 border transition-all duration-300 shadow-2xl backdrop-blur-xl ${
        isCrashed
          ? 'bg-red-950/40 border-red-500/80 shadow-red-500/20'
          : isStressed
          ? 'bg-amber-950/40 border-amber-500/80 animate-wiggle shadow-amber-500/20'
          : selected
          ? 'border-indigo-400 shadow-indigo-500/30'
          : 'border-slate-800 hover:border-slate-700 bg-slate-900/90'
      }`}
      style={{
        boxShadow: isCrashed
          ? '0 0 25px -4px rgba(239, 68, 68, 0.4)'
          : isStressed
          ? '0 0 25px -4px rgba(245, 158, 11, 0.35)'
          : `0 8px 32px 0 rgba(0, 0, 0, 0.37)`,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-slate-400 hover:!bg-indigo-400 transition-colors"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-slate-400 hover:!bg-indigo-400 transition-colors"
      />

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border shadow-inner"
            style={{
              backgroundColor: `${accentColor}18`,
              borderColor: `${accentColor}44`,
            }}
          >
            {renderIcon()}
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-white leading-tight">
              {label}
            </h4>
            {sublabel && (
              <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-[140px]">
                {sublabel}
              </p>
            )}
          </div>
        </div>

        {isCrashed ? (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <Skull className="w-3 h-3" /> CRASH
          </span>
        ) : isStressed ? (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
            <Flame className="w-3 h-3 text-amber-400" /> SPIKE
          </span>
        ) : isSyncing ? (
          <span className="flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <RefreshCw className="w-3 h-3 animate-spin" /> SYNC
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
        )}
      </div>

      {metricBadge && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3 h-3 text-slate-500" />
            <span className="text-[11px]">{metricBadge}</span>
          </div>
          <span
            className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
              isCrashed
                ? 'text-red-400 bg-red-950/60'
                : isStressed
                ? 'text-amber-300 bg-amber-950/60'
                : 'text-sky-300 bg-slate-800/80'
            }`}
          >
            {metricValue || '0'}
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-slate-400 hover:!bg-indigo-400 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-slate-400 hover:!bg-indigo-400 transition-colors"
      />
    </div>
  );
};
