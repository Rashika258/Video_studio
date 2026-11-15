import React from 'react';
import { StudioElement } from '../../types/videoStudio';
import {
  ServerBladeGraphic,
  GpuChipGraphic,
  LoadBalancerGraphic,
  DatabaseGraphic,
  ClientDevicesGraphic,
  TerminalWindowGraphic,
} from './TechGraphics';
import {
  BinaryTreeGraphic,
  BigOChartGraphic,
  AlgorithmArrayGraphic,
} from './AlgorithmGraphics';
import {
  BrainDopamineGraphic,
  CharacterDeskGraphic,
  CharacterPhoneGraphic,
} from './StoryGraphics';

interface ElementRendererProps {
  element: StudioElement;
  isSelected: boolean;
  onSelect: () => void;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
}) => {
  const { type, status, title, subtitle, customProps, animation } = element;

  let animClass = '';
  if (animation === 'float') animClass = 'animate-float';
  if (animation === 'pulse') animClass = 'animate-pulse';
  if (animation === 'overload-shake' || status === 'crashed') animClass = 'animate-wiggle';

  const renderGraphic = () => {
    switch (type) {
      case 'server-blade':
        return <ServerBladeGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'gpu-chip':
        return <GpuChipGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'load-balancer':
        return <LoadBalancerGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'database-sql':
        return <DatabaseGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'client-devices':
        return <ClientDevicesGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'terminal-window':
        return <TerminalWindowGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'binary-tree':
        return <BinaryTreeGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'big-o-chart':
        return <BigOChartGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'algorithm-array':
        return <AlgorithmArrayGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'brain-dopamine':
        return <BrainDopamineGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'character-desk':
        return <CharacterDeskGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'character-phone':
        return <CharacterPhoneGraphic status={status} title={title} subtitle={subtitle} customProps={customProps} />;
      case 'cache-redis':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-gradient-to-b from-rose-950/70 to-slate-900 border border-rose-500/50 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono font-bold text-rose-300">{title || 'Redis Cache'}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">0.2ms In-Memory</span>
            </div>
            <div className="flex items-center justify-center gap-2 my-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500 flex items-center justify-center text-rose-300 font-bold">⚡</div>
              <div className="text-xs font-mono text-slate-300">RAM: 128 GB</div>
            </div>
            <div className="text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1 text-center">{subtitle || 'Key-Value LRU Cache'}</div>
          </div>
        );
      case 'kafka-stream':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-gradient-to-b from-purple-950/70 to-slate-900 border border-purple-500/50 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono font-bold text-purple-300">{title || 'Kafka Event Stream'}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Log Buffer</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 my-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-6 h-7 rounded bg-purple-900/60 border border-purple-400 flex items-center justify-center text-[9px] font-mono text-purple-200">
                  msg_{n}
                </div>
              ))}
            </div>
            <div className="text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1 text-center">{subtitle || 'Partitioned Offset Stream'}</div>
          </div>
        );
      case 'callout-card':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-slate-900/90 border-2 border-indigo-500/80 shadow-2xl flex flex-col justify-center text-center">
            <div className="text-sm font-bold text-white">{title}</div>
            {subtitle && <div className="text-xs text-indigo-300 mt-1">{subtitle}</div>}
          </div>
        );
      default:
        return (
          <div className="w-full h-full p-3 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col justify-center items-center">
            <div className="text-xs font-bold text-white">{title}</div>
            {subtitle && <div className="text-[10px] text-slate-400 mt-0.5">{subtitle}</div>}
          </div>
        );
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`absolute cursor-pointer transition-all duration-300 ${animClass} ${
        isSelected ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 scale-[1.02]' : ''
      }`}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 30 : 15,
      }}
    >
      {renderGraphic()}
    </div>
  );
};
