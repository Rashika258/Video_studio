import React from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Cpu, Microchip, HardDrive, Terminal } from 'lucide-react';
import { BaseNodeData } from '../../../types/studio';

export const HardwareNode: React.FC<NodeProps<Node<BaseNodeData>>> = ({ data, selected }) => {
  const {
    label,
    sublabel,
    variant = 'gpu',
    accentColor = '#22c55e',
    metricBadge,
    metricValue,
  } = data;

  const renderIcon = () => {
    switch (variant) {
      case 'gpu':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'vram':
        return <HardDrive className="w-5 h-5 text-yellow-400" />;
      case 'batcher':
        return <Microchip className="w-5 h-5 text-cyan-400" />;
      default:
        return <Terminal className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div
      className={`relative min-w-[220px] rounded-xl px-4 py-3.5 border transition-all duration-300 shadow-2xl backdrop-blur-xl bg-slate-900/95 ${
        selected ? 'border-emerald-400 shadow-emerald-500/30' : 'border-slate-800 hover:border-slate-700'
      }`}
      style={{
        boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4), 0 0 15px -3px ${accentColor}25`,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-emerald-500"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-emerald-500"
      />

      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center border shadow-inner shrink-0"
          style={{
            backgroundColor: `${accentColor}15`,
            borderColor: `${accentColor}50`,
          }}
        >
          {renderIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white tracking-tight truncate">
              {label}
            </h4>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              HARDWARE
            </span>
          </div>
          {sublabel && (
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
              {sublabel}
            </p>
          )}
        </div>
      </div>

      {metricBadge && (
        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">{metricBadge}</span>
          <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            {metricValue}
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-emerald-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-emerald-500"
      />
    </div>
  );
};
