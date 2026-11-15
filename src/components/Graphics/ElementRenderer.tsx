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
import {
  ShieldCheck,
  Cloud,
  Sigma,
  Repeat,
  Scale,
  TrendingUp,
  Bot,
  Lock,
  AlertTriangle,
  Grid,
  KeyRound,
  BadgeCheck,
  UserCheck,
  FileSearch,
} from 'lucide-react';

interface ElementRendererProps {
  element: StudioElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: (e: React.PointerEvent<HTMLDivElement>) => void;
  playbackProgress?: number;
  isPlaying?: boolean;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  onDragStart,
  playbackProgress = 1,
  isPlaying = false,
}) => {
  const { type, status, title, subtitle, customProps, animation, entranceBeat = 0 } = element;

  let animClass = '';
  if (animation === 'float') animClass = 'animate-float';
  if (animation === 'pulse') animClass = 'animate-pulse';
  if (animation === 'overload-shake' || status === 'crashed') animClass = 'animate-wiggle';

  // Smooth beat entrance choreography during playback
  const beatStart = Math.max(0, Math.min(0.8, entranceBeat));
  const beatProgress = isPlaying
    ? Math.max(0, Math.min(1, (playbackProgress - beatStart) / 0.16))
    : 1;
  const eased = 1 - Math.pow(1 - beatProgress, 3);
  const entranceScale = 0.86 + 0.14 * eased;
  const entranceOpacity = eased;

  const isCrashed = status === 'crashed';
  const isWarning = status === 'warning';

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
      case 'agent-swarm': {
        const borderCol = isCrashed ? 'border-red-500/80 from-red-950/80' : isWarning ? 'border-amber-500/80 from-amber-950/70' : 'border-cyan-400/70 from-cyan-950/70';
        const nodeCol = isCrashed ? 'bg-red-500/30 border-red-400 text-red-300' : isWarning ? 'bg-amber-500/30 border-amber-400 text-amber-300' : 'bg-cyan-500/20 border-cyan-400 text-cyan-300';
        return (
          <div className={`w-full h-full p-3.5 rounded-2xl bg-gradient-to-b ${borderCol} to-slate-950 border flex flex-col justify-between shadow-xl`}>
            <div className="flex justify-between items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-white truncate">{title || 'Autonomous Agent Swarm'}</span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${nodeCol}`}>
                {isCrashed ? 'BREACH' : isWarning ? 'SWARMING' : 'ISOLATED'}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1.5 my-1 px-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-5 rounded flex items-center justify-center border ${nodeCol} ${isPlaying ? 'animate-pulse' : ''}`}
                  style={{ animationDelay: `${(i % 4) * 0.15}s` }}
                >
                  <Bot className="w-3 h-3" />
                </div>
              ))}
            </div>
            <div className="text-[9px] font-mono text-slate-300 border-t border-slate-800 pt-1 text-center truncate">
              {subtitle || '700 Agents · Shared Cache Channel'}
            </div>
          </div>
        );
      }
      case 'systolic-array': {
        const waveIdx = isPlaying ? Math.floor(playbackProgress * 12) % 7 : 3;
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-gradient-to-b from-emerald-950/80 to-slate-950 border border-emerald-400/70 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Grid className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-mono font-bold text-emerald-200 truncate">{title || 'TPU Systolic Array'}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                MAC MATRIX
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 my-1 px-3">
              {Array.from({ length: 15 }).map((_, i) => {
                const row = Math.floor(i / 5);
                const col = i % 5;
                const lit = row + col === waveIdx || row + col === waveIdx - 1;
                return (
                  <div
                    key={i}
                    className={`h-4 rounded-sm border text-[7px] font-mono flex items-center justify-center transition-colors duration-150 ${
                      lit
                        ? 'bg-emerald-400 text-slate-950 border-white font-bold'
                        : 'bg-slate-900/90 text-emerald-500/60 border-emerald-500/25'
                    }`}
                  >
                    W
                  </div>
                );
              })}
            </div>
            <div className="text-[9px] font-mono text-slate-300 border-t border-slate-800 pt-1 text-center truncate">
              {subtitle || 'Zero-Fetch Matrix Multiply · SRAM'}
            </div>
          </div>
        );
      }
      case 'sandbox-container': {
        return (
          <div
            className={`w-full h-full p-3.5 rounded-2xl border-2 border-dashed flex flex-col justify-between shadow-xl ${
              isCrashed
                ? 'bg-red-950/50 border-red-500'
                : isWarning
                ? 'bg-amber-950/40 border-amber-400'
                : 'bg-slate-900/85 border-slate-500'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono font-bold text-white truncate">{title || 'Eval Sandbox'}</span>
              {isCrashed ? (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
            </div>
            <div className="flex items-center justify-center gap-2 my-1">
              <div className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-bold ${isCrashed ? 'bg-red-500/20 border-red-400 text-red-200' : 'bg-slate-950 border-slate-700 text-slate-300'}`}>
                {isCrashed ? 'ESCAPED VIA CACHE' : 'NO INTERNET · ISOLATED'}
              </div>
            </div>
            <div className="text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1 text-center truncate">
              {subtitle || 'ExploitGym Container'}
            </div>
          </div>
        );
      }
      case 'kinetic-title':
        return (
          <div className="w-full h-full p-4 rounded-2xl bg-slate-950/90 border border-indigo-400/50 shadow-2xl flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-black tracking-tight text-white leading-none">{title}</div>
            {subtitle && (
              <div className="text-xs font-mono text-cyan-300 mt-2">{subtitle}</div>
            )}
          </div>
        );
      case 'identity-idp':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-gradient-to-b from-sky-950/80 to-slate-950 border border-sky-400/70 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <UserCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="text-[11px] font-mono font-bold text-sky-100 truncate">{title || 'Identity Provider (IdP)'}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 shrink-0">
                SCIM SYNC
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 my-1 text-center">
              {['HR Truth', 'Directory', 'SSO Vault'].map((step, i) => (
                <div
                  key={step}
                  className={`py-1.5 px-1 rounded border text-[9px] font-mono font-bold ${
                    i === 1
                      ? 'bg-sky-500/25 border-sky-400 text-sky-200'
                      : 'bg-slate-900/90 border-slate-700 text-slate-300'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="text-[9px] font-mono text-slate-300 border-t border-slate-800 pt-1 text-center truncate">
              {subtitle || 'Okta / Entra ID · Joiner-Mover-Leaver'}
            </div>
          </div>
        );
      case 'auth-token':
        return (
          <div className={`w-full h-full p-3.5 rounded-2xl bg-gradient-to-b ${isCrashed ? 'from-red-950/80 border-red-500/80' : 'from-indigo-950/80 border-indigo-400/70'} to-slate-950 border flex flex-col justify-between shadow-xl`}>
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-[11px] font-mono font-bold text-white truncate">{title || 'OIDC / JWT Token'}</span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${isCrashed ? 'bg-red-500/20 border-red-400 text-red-300' : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'}`}>
                {isCrashed ? 'PHISHED' : 'FIDO2 SIGNED'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 my-1 font-mono text-[9px] font-bold">
              <span className="px-2 py-1 rounded bg-rose-500/20 border border-rose-400/50 text-rose-200">HDR</span>
              <span className="text-slate-500">.</span>
              <span className="px-2 py-1 rounded bg-purple-500/20 border border-purple-400/50 text-purple-200">CLAIMS</span>
              <span className="text-slate-500">.</span>
              <span className="px-2 py-1 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-200">SIG</span>
            </div>
            <div className="text-[9px] font-mono text-slate-300 border-t border-slate-800 pt-1 text-center truncate">
              {subtitle || 'Passkey + Short-Lived Token'}
            </div>
          </div>
        );
      case 'access-policy':
        return (
          <div className={`w-full h-full p-3.5 rounded-2xl bg-gradient-to-b ${isWarning ? 'from-amber-950/75 border-amber-400/80' : 'from-emerald-950/75 border-emerald-400/70'} to-slate-950 border flex flex-col justify-between shadow-xl`}>
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-mono font-bold text-white truncate">{title || 'RBAC & JIT Policy'}</span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${isWarning ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'}`}>
                {isWarning ? 'CREEP RISK' : 'LEAST PRIV'}
              </span>
            </div>
            <div className="space-y-1 my-1 text-[9px] font-mono">
              <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-slate-300">role: engineer</span>
                <span className="text-emerald-400 font-bold">ALLOW (15m JIT)</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-slate-300">role: payroll_admin</span>
                <span className={isWarning ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>
                  {isWarning ? 'STALE GRANT!' : 'DENY (SoD)'}
                </span>
              </div>
            </div>
            <div className="text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1 text-center truncate">
              {subtitle || 'RBAC + ABAC + Zero Trust Gate'}
            </div>
          </div>
        );
      case 'siem-audit':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/60 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <FileSearch className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-[11px] font-mono font-bold text-cyan-200 truncate">{title || 'SIEM Audit Trail'}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                ACCOUNTING
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 font-mono text-[8.5px] space-y-0.5 leading-tight">
              <div className="text-emerald-400">23:01 passkey_ok user=sarah</div>
              <div className="text-sky-300">23:02 jit_elevate ttl=15m</div>
              <div className="text-amber-300">23:17 scim_deprovision=true</div>
            </div>
            <div className="text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1 text-center truncate">
              {subtitle || 'Immutable Security Telemetry'}
            </div>
          </div>
        );
      case 'cache-redis':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-gradient-to-b from-rose-950/75 to-slate-900 border border-rose-500/60 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-rose-200 truncate">{title || 'Redis Cache'}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">0.2ms RAM</span>
            </div>
            <div className="flex items-center justify-center gap-2 my-1">
              <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500 flex items-center justify-center text-rose-300 font-mono font-bold text-xs">KV</div>
              <div className="text-xs font-mono text-slate-200 tabular-nums">128 GB</div>
            </div>
            <div className="text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1 text-center truncate">{subtitle || 'Key-Value LRU Cache'}</div>
          </div>
        );
      case 'kafka-stream':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-gradient-to-b from-purple-950/75 to-slate-900 border border-purple-500/60 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-purple-200 truncate">{title || 'Kafka Event Stream'}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">Log Bus</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 my-1">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-8 h-7 rounded bg-purple-900/60 border border-purple-400/70 flex items-center justify-center text-[9px] font-mono text-purple-200 tabular-nums">
                  p_{n}
                </div>
              ))}
            </div>
            <div className="text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1 text-center truncate">{subtitle || 'Partitioned Offset Stream'}</div>
          </div>
        );
      case 'firewall-shield':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-gradient-to-b from-emerald-950/70 to-slate-900 border border-emerald-400/60 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono font-bold text-emerald-200 truncate">{title || 'WAF & TLS Shield'}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">TLS 1.3</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 my-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-[10px] font-mono text-slate-300 leading-tight">
                <div>Rate Limit: OK</div>
                <div className="text-emerald-400">Zero Trust Edge</div>
              </div>
            </div>
            <div className="text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1 text-center truncate">{subtitle || 'DDoS & Auth Filter'}</div>
          </div>
        );
      case 'cloud-pod':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-gradient-to-b from-sky-950/75 to-slate-900 border border-sky-400/60 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono font-bold text-sky-200 truncate">{title || 'Kubernetes Pods'}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">3/3 READY</span>
            </div>
            <div className="flex items-center justify-center gap-2 my-1">
              <Cloud className="w-6 h-6 text-sky-400" />
              <div className="flex gap-1">
                {[1, 2, 3].map((p) => (
                  <div key={p} className="px-1.5 py-1 rounded bg-sky-900/70 border border-sky-400/50 text-[9px] font-mono text-sky-200">
                    pod-{p}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1 text-center truncate">{subtitle || 'Auto-Scaling Replicas'}</div>
          </div>
        );
      case 'math-formula':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-950 border border-indigo-400/60 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono font-bold text-indigo-200 truncate">{title || 'Math Transform'}</span>
              <Sigma className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="my-1 px-2.5 py-2 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-center font-mono text-xs font-bold text-cyan-300 tracking-wide">
              {subtitle || 'f(x) = Softmax(QK^T / √d)'}
            </div>
            <div className="text-[9px] font-mono text-slate-400 text-center">Matrix Parallel Computation</div>
          </div>
        );
      case 'habit-loop':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-gradient-to-b from-amber-950/60 to-slate-950 border border-amber-400/60 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-amber-200 truncate">{title || 'Habit Loop'}</span>
              <Repeat className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold my-1">
              <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">Cue</span>
              <span className="text-slate-500">➔</span>
              <span className="px-2 py-1 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40">Crave</span>
              <span className="text-slate-500">➔</span>
              <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Reward</span>
            </div>
            <div className="text-[9px] text-slate-400 border-t border-slate-800 pt-1 text-center truncate">{subtitle || 'Behavioral Feedback Cycle'}</div>
          </div>
        );
      case 'split-comparison':
        return (
          <div className="w-full h-full p-3.5 rounded-2xl bg-slate-950/90 border border-slate-700 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-white truncate">{title || 'Before vs After'}</span>
              <Scale className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="grid grid-cols-2 gap-2 my-1">
              <div className="p-2 rounded-lg bg-rose-950/50 border border-rose-500/40 text-center">
                <div className="text-[9px] font-mono text-rose-300 font-bold">HIGH FRICTION</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Willpower Drain</div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-center">
                <div className="text-[9px] font-mono text-emerald-300 font-bold">2-MIN SYSTEM</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Auto Momentum</div>
              </div>
            </div>
            <div className="text-[9px] text-slate-400 text-center truncate">{subtitle || 'Side-by-Side Comparison'}</div>
          </div>
        );
      case 'metric-badge':
        return (
          <div className="w-full h-full p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-cyan-950/70 border-2 border-emerald-400/70 shadow-2xl flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Verified Metric</span>
            </div>
            <div className="text-xl font-black text-white tracking-tight tabular-nums">{title}</div>
            {subtitle && <div className="text-xs font-mono text-emerald-300 mt-1">{subtitle}</div>}
          </div>
        );
      case 'callout-card':
        return (
          <div className="w-full h-full p-4 rounded-2xl bg-slate-900/95 border-2 border-indigo-500/80 shadow-2xl flex flex-col justify-center text-center">
            <div className="text-sm font-extrabold text-white leading-snug">{title}</div>
            {subtitle && <div className="text-xs text-indigo-300 mt-1.5">{subtitle}</div>}
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
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
        onDragStart?.(e);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`absolute cursor-grab active:cursor-grabbing transition-shadow duration-200 ${animClass} ${
        isSelected ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950' : ''
      }`}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        opacity: entranceOpacity,
        transform: `translate(-50%, -50%) scale(${entranceScale})`,
        zIndex: isSelected ? 30 : 15,
        touchAction: 'none',
      }}
    >
      {renderGraphic()}
    </div>
  );
};
