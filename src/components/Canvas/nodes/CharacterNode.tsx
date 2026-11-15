import React from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Sparkles, BatteryCharging, Smile, Frown } from 'lucide-react';
import { BaseNodeData } from '../../../types/studio';

export const CharacterNode: React.FC<NodeProps<Node<BaseNodeData>>> = ({ data, selected }) => {
  const {
    label,
    sublabel,
    variant = 'human',
    status = 'active',
    accentColor = '#F97316',
    metricBadge,
    metricValue,
  } = data;

  const isBrain = variant === 'brain';
  const isReward = variant === 'reward';
  const isStressed = status === 'stressed';

  return (
    <div
      className={`relative min-w-[220px] rounded-2xl px-4 py-3.5 border transition-all duration-300 shadow-2xl backdrop-blur-xl bg-slate-900/95 ${
        isStressed
          ? 'border-orange-500/80 shadow-orange-500/30 animate-pulse'
          : selected
          ? 'border-amber-400 shadow-amber-400/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-amber-400"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-amber-400"
      />

      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 transition-transform ${
            isStressed ? 'rotate-[-6deg]' : ''
          }`}
          style={{
            backgroundColor: `${accentColor}20`,
            borderColor: `${accentColor}60`,
          }}
        >
          {isBrain ? (
            <Sparkles className="w-6 h-6 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
          ) : isReward ? (
            <BatteryCharging className="w-6 h-6 text-emerald-400" />
          ) : isStressed ? (
            <Frown className="w-6 h-6 text-orange-400" />
          ) : (
            <Smile className="w-6 h-6 text-amber-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white tracking-tight truncate">
              {label}
            </h4>
          </div>
          {sublabel && (
            <p className="text-[11px] text-slate-400 mt-0.5 truncate font-sans">
              {sublabel}
            </p>
          )}

          <div className="mt-2.5 w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isStressed ? 'bg-orange-500 w-[22%]' : isBrain ? 'bg-pink-500 w-[84%]' : 'bg-emerald-400 w-[65%]'
              }`}
            />
          </div>
        </div>
      </div>

      {metricBadge && (
        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px] font-medium">{metricBadge}</span>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded font-mono"
            style={{
              color: accentColor,
              backgroundColor: `${accentColor}18`,
              border: `1px solid ${accentColor}44`,
            }}
          >
            {metricValue}
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-amber-400"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-amber-400"
      />
    </div>
  );
};
