import React from 'react';
import { ElementStatus } from '../../types/videoStudio';

interface GraphicProps {
  status: ElementStatus;
  title: string;
  subtitle?: string;
  customProps?: Record<string, any>;
}

// 1. ISOMETRIC SERVER BLADE / RACK (Visualcoders style)
export const ServerBladeGraphic: React.FC<GraphicProps> = ({ status, title, subtitle, customProps }) => {
  const isCrashed = status === 'crashed';
  const isWarning = status === 'warning';
  const isActive = status === 'active';

  const accentColor = isCrashed
    ? '#EF4444'
    : isWarning
    ? '#F59E0B'
    : isActive
    ? '#06B6D4'
    : '#3B82F6';

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-300 ${
        isCrashed
          ? 'bg-red-950/40 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.5)] animate-wiggle'
          : isWarning
          ? 'bg-amber-950/30 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
          : isActive
          ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
          : 'bg-slate-900/80 border-slate-700/80 shadow-xl'
      } backdrop-blur-md select-none`}
    >
      {/* Top Header: Status LED & Unit Model */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Blinking Power LED */}
          <div className="relative flex items-center justify-center">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <div
              className="absolute w-4 h-4 rounded-full animate-ping opacity-75"
              style={{ backgroundColor: accentColor }}
            />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase">
            {title}
          </span>
        </div>

        {/* Status Tag */}
        <span
          className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border"
          style={{
            color: accentColor,
            borderColor: `${accentColor}55`,
            backgroundColor: `${accentColor}18`,
          }}
        >
          {isCrashed ? '500 CRASH' : isWarning ? 'HIGH LOAD' : isActive ? 'PROCESSING' : 'HEALTHY'}
        </span>
      </div>

      {/* Middle: Server Drive Bays & LED meters */}
      <div className="my-2 space-y-1.5">
        <div className="grid grid-cols-4 gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-5 rounded bg-slate-800/80 border border-slate-700/50 flex items-center justify-between px-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isCrashed
                    ? 'bg-red-500 animate-ping'
                    : isActive || isWarning
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-emerald-400'
                }`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            </div>
          ))}
        </div>

        {/* CPU / Memory Load Gauge */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-[9px] font-mono text-slate-400">
            <span>CPU LOAD</span>
            <span style={{ color: accentColor }}>
              {isCrashed ? '100%' : isWarning ? '94%' : isActive ? '68%' : '18%'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: isCrashed ? '100%' : isWarning ? '94%' : isActive ? '68%' : '18%',
                backgroundColor: accentColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Subtitle / Spec Note */}
      {subtitle && (
        <div className="text-[10px] text-slate-400 font-mono truncate border-t border-slate-800 pt-1">
          {subtitle}
        </div>
      )}

      {/* Flames / Alert Overload Effect on Crash */}
      {isCrashed && (
        <div className="absolute -top-3 -right-2 px-2 py-0.5 rounded-md bg-red-600 text-white font-mono font-extrabold text-[10px] shadow-lg animate-bounce">
          OVERLOAD!
        </div>
      )}
    </div>
  );
};

// 2. NVIDIA H100 / BLACKWELL GPU CHIP (KodeKloud style)
export const GpuChipGraphic: React.FC<GraphicProps> = ({ status, title, subtitle }) => {
  const isHighCompute = status === 'active' || status === 'highlight';
  const isOverheating = status === 'crashed' || status === 'warning';

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
        isOverheating
          ? 'bg-[#1a0808] border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.5)]'
          : 'bg-[#0a0f1d] border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
      } backdrop-blur-md select-none`}
    >
      {/* Gold Edge Connector Pins Top & Bottom */}
      <div className="flex gap-1 justify-center w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-1.5 h-2 bg-gradient-to-b from-amber-400 to-amber-600 rounded-sm" />
        ))}
      </div>

      {/* Center Silicon Die & Tensor Cores */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center my-2 p-2 rounded-xl bg-slate-950 border border-emerald-500/30">
        {/* HBM3e Memory stacks on sides */}
        <div className="flex justify-between w-full items-center px-1">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-emerald-400">HBM3e</span>
            <div className="w-4 h-6 rounded bg-emerald-950/80 border border-emerald-500/50 flex flex-col justify-around py-0.5 items-center">
              <div className="w-2.5 h-1 bg-emerald-400/80 rounded-xs" />
              <div className="w-2.5 h-1 bg-emerald-400/80 rounded-xs" />
            </div>
          </div>

          {/* Central Tensor Die */}
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 rounded-lg bg-gradient-to-tr from-slate-900 to-emerald-950 border-2 flex flex-col items-center justify-center p-1 shadow-inner ${
                isOverheating ? 'border-red-400' : 'border-emerald-400'
              }`}
            >
              <span className="text-[9px] font-mono font-extrabold text-emerald-300 tracking-tighter">
                TENSOR
              </span>
              <span className="text-[8px] font-mono text-slate-400">14,592 Cores</span>
              {/* Core grid dots */}
              <div className="grid grid-cols-4 gap-0.5 mt-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full ${
                      isHighCompute ? 'bg-emerald-300 animate-ping' : 'bg-emerald-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-white mt-1">{title}</span>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <span className="text-[8px] font-mono text-emerald-400">HBM3e</span>
            <div className="w-4 h-6 rounded bg-emerald-950/80 border border-emerald-500/50 flex flex-col justify-around py-0.5 items-center">
              <div className="w-2.5 h-1 bg-emerald-400/80 rounded-xs" />
              <div className="w-2.5 h-1 bg-emerald-400/80 rounded-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle / Throughput */}
      <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1">
        <span>{subtitle || 'FP8: 3.9 PFLOPS'}</span>
        <span className="text-emerald-400 font-bold">3.35 TB/s</span>
      </div>
    </div>
  );
};

// 3. LOAD BALANCER / REVERSE PROXY (Visualcoders style)
export const LoadBalancerGraphic: React.FC<GraphicProps> = ({ status, title, subtitle }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3.5 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-900/90 border border-indigo-400/60 shadow-[0_0_25px_rgba(99,102,241,0.35)] backdrop-blur-md select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="text-[11px] font-mono font-bold text-indigo-200 tracking-wider">
            {title}
          </span>
        </div>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          NGINX / ALB
        </span>
      </div>

      {/* Dynamic Hexagon / Distribution Router Visual */}
      <div className="relative my-2 flex items-center justify-center">
        {/* Glowing concentric router rings */}
        <div className="w-16 h-16 rounded-full border border-indigo-400/30 flex items-center justify-center animate-spin" style={{ animationDuration: '10s' }}>
          <div className="w-11 h-11 rounded-full border border-dashed border-indigo-300/50 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-indigo-600/60 flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-white">⇄</span>
            </div>
          </div>
        </div>

        {/* Traffic Ingress / Egress arrows */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-cyan-400 text-xs font-mono font-bold animate-pulse">
          ▶
        </div>
        <div className="absolute -right-3 top-1/4 text-indigo-400 text-xs font-mono font-bold animate-pulse">
          ▶
        </div>
        <div className="absolute -right-3 bottom-1/4 text-indigo-400 text-xs font-mono font-bold animate-pulse">
          ▶
        </div>
      </div>

      {/* Algorithmic mode */}
      <div className="w-full text-center text-[9px] font-mono text-indigo-300 bg-indigo-950/60 py-1 rounded border border-indigo-800/40">
        {subtitle || 'ROUND-ROBIN • HEALTH CHECK OK'}
      </div>
    </div>
  );
};

// 4. DISTRIBUTED DATABASE / STORAGE (Visualcoders style)
export const DatabaseGraphic: React.FC<GraphicProps> = ({ status, title, subtitle }) => {
  const isCrashed = status === 'crashed';

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
        isCrashed
          ? 'bg-red-950/40 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
          : 'bg-slate-900/90 border-sky-400/60 shadow-[0_0_25px_rgba(56,189,248,0.3)]'
      } backdrop-blur-md select-none`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-[11px] font-mono font-bold text-sky-200">{title}</span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
          POSTGRES / RAFT
        </span>
      </div>

      {/* 3-Tier Disk Platters Stack */}
      <div className="relative my-2 flex flex-col gap-1 w-28 items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-full h-4 rounded-full border border-sky-400/50 bg-gradient-to-r from-sky-950 via-sky-800/60 to-slate-900 flex items-center justify-between px-3 shadow-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <div className="w-12 h-1 bg-sky-300/30 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        ))}
      </div>

      <div className="w-full flex justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1">
        <span>{subtitle || 'ACID Compliant'}</span>
        <span className="text-sky-400 font-bold">Replica x3</span>
      </div>
    </div>
  );
};

// 5. CLIENT DEVICES (Users hitting the system)
export const ClientDevicesGraphic: React.FC<GraphicProps> = ({ status, title, subtitle }) => {
  const isHighTraffic = status === 'active' || status === 'warning' || status === 'crashed';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.3)] backdrop-blur-md select-none">
      <div className="flex items-center justify-between w-full">
        <span className="text-[11px] font-mono font-bold text-cyan-200">{title}</span>
        <span
          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
            isHighTraffic
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
          }`}
        >
          {isHighTraffic ? '10,000 CONNS' : '100 CONNS'}
        </span>
      </div>

      {/* Vector Phone & Laptop Visual */}
      <div className="my-2 flex items-center gap-3">
        {/* Phone */}
        <div className="w-6 h-11 rounded-md border-2 border-slate-400 bg-slate-950 p-0.5 flex flex-col justify-between shadow-lg">
          <div className="w-2 h-0.5 bg-slate-600 rounded-full mx-auto" />
          <div className="w-full h-6 rounded-xs bg-cyan-950/80 flex items-center justify-center">
            <span className="text-[7px] text-cyan-300 font-mono font-bold">APP</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full border border-slate-600 mx-auto" />
        </div>

        {/* Laptop */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-9 rounded-t-md border-2 border-slate-400 bg-slate-950 p-1 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-indigo-950/80 rounded-xs flex flex-col justify-center items-center">
              <span className="text-[6px] text-indigo-300 font-mono">GET /api/v1</span>
            </div>
          </div>
          <div className="w-18 h-1 bg-slate-400 rounded-b-md shadow-md" />
        </div>
      </div>

      <div className="w-full text-center text-[9px] font-mono text-cyan-300/80">
        {subtitle || 'Worldwide End Users'}
      </div>
    </div>
  );
};

// 6. SYNTAX HIGHLIGHTED CODE TERMINAL (ByteMonk / Visualcoders style)
export const TerminalWindowGraphic: React.FC<GraphicProps> = ({ status, title, subtitle, customProps }) => {
  const codeLines = customProps?.lines || [
    'async function handleRequest(req) {',
    '  const cacheKey = req.params.id;',
    '  const cached = await redis.get(cacheKey);',
    '  if (cached) return cached;',
    '  return await db.query(cacheKey);',
    '}',
  ];

  return (
    <div className="relative w-full h-full flex flex-col rounded-2xl bg-[#090D16] border border-slate-700 shadow-2xl overflow-hidden font-mono select-none">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <span className="text-[10px] text-slate-400 font-semibold">{title || 'server.ts'}</span>
        <div className="w-8" />
      </div>

      {/* Code Body */}
      <div className="p-3 text-[10px] leading-relaxed flex-1 flex flex-col justify-center overflow-hidden">
        {codeLines.map((line: string, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-slate-600 select-none w-3 text-right">{i + 1}</span>
            <span
              className={
                line.includes('async') || line.includes('return')
                  ? 'text-purple-400'
                  : line.includes('await')
                  ? 'text-cyan-400'
                  : line.includes('redis') || line.includes('db')
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-200'
              }
            >
              {line}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
