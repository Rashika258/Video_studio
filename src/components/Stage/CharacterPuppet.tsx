import React from 'react';
import { CharacterType, CharacterPose } from '../../types/story';

interface CharacterPuppetProps {
  type?: CharacterType;
  pose: CharacterPose;
  speechBubble?: string;
  scale?: number;
}

export const CharacterPuppet: React.FC<CharacterPuppetProps> = ({
  type = 'engineer',
  pose = 'talking',
  speechBubble,
  scale = 1,
}) => {
  const isEngineer = type === 'engineer';
  const isRobot = type === 'robot';

  return (
    <div
      className="relative flex flex-col items-center select-none"
      style={{ transform: `scale(${scale})` }}
    >
      {/* Dynamic Animated Speech Bubble */}
      {speechBubble && (
        <div className="mb-4 relative max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
          <div className="bg-slate-900/95 border-2 border-indigo-400/80 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md text-white text-xs font-semibold leading-relaxed tracking-wide text-center">
            {speechBubble}
          </div>
          {/* Bubble tail */}
          <div className="w-3 h-3 bg-slate-900 border-r-2 border-b-2 border-indigo-400 rotate-45 mx-auto -mt-1.5 shadow-sm" />
        </div>
      )}

      {/* 2D Animated Puppet Character */}
      <div className="relative w-36 h-48 flex items-center justify-center">
        {/* CHARACTER HEAD & FACE */}
        <div
          className={`absolute top-2 w-20 h-20 rounded-full border-4 shadow-xl flex items-center justify-center transition-transform duration-300 ${
            pose === 'server-fire' || pose === 'stressed'
              ? 'animate-wiggle border-rose-500 bg-rose-950/70'
              : pose === 'mind-blown'
              ? 'animate-pulse scale-110 border-amber-400 bg-amber-950/60'
              : pose === 'coding'
              ? 'border-cyan-400 bg-slate-900 shadow-cyan-500/30'
              : pose === 'deploying' || pose === 'celebrating'
              ? '-translate-y-2 border-emerald-400 bg-emerald-950/60'
              : 'border-indigo-400 bg-slate-900'
          }`}
          style={{
            boxShadow:
              pose === 'server-fire'
                ? '0 0 25px rgba(239, 68, 68, 0.6)'
                : pose === 'coding'
                ? '0 0 25px rgba(6, 182, 212, 0.5)'
                : '0 0 20px rgba(99, 102, 241, 0.4)',
          }}
        >
          {/* Tech Headset / Glasses */}
          {isEngineer && (
            <div className="absolute -top-1 w-16 h-3 bg-slate-800 border-t-2 border-cyan-400 rounded-t-full shadow-sm" />
          )}

          {/* Eyes */}
          <div className="flex gap-4">
            {pose === 'server-fire' || pose === 'stressed' ? (
              <>
                <span className="text-sm font-bold text-rose-400 font-mono">&gt;</span>
                <span className="text-sm font-bold text-rose-400 font-mono">&lt;</span>
              </>
            ) : pose === 'coding' ? (
              <>
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-300 font-mono text-[9px] flex items-center justify-center text-black font-bold animate-pulse">0</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-300 font-mono text-[9px] flex items-center justify-center text-black font-bold animate-pulse">1</span>
              </>
            ) : pose === 'mind-blown' ? (
              <>
                <span className="w-3 h-3 rounded-full bg-amber-300 animate-ping" />
                <span className="w-3 h-3 rounded-full bg-amber-300 animate-ping" />
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-300 animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-sky-300 animate-pulse" />
              </>
            )}
          </div>

          {/* Animated Mouth */}
          <div className="absolute bottom-3">
            {pose === 'talking' ? (
              <div className="w-4 h-3 bg-rose-400 rounded-full animate-bounce" style={{ animationDuration: '0.4s' }} />
            ) : pose === 'celebrating' || pose === 'deploying' ? (
              <div className="w-5 h-2.5 border-b-2 border-emerald-300 rounded-full" />
            ) : pose === 'server-fire' ? (
              <div className="w-5 h-3 bg-rose-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">O</div>
            ) : (
              <div className="w-3 h-1 bg-slate-400 rounded-full" />
            )}
          </div>
        </div>

        {/* CHARACTER BODY & CLOTHING */}
        <div
          className={`absolute top-22 w-24 h-24 rounded-2xl border-2 flex items-center justify-center transition-all ${
            pose === 'coding'
              ? 'bg-slate-900 border-cyan-400 shadow-cyan-500/20'
              : pose === 'server-fire'
              ? 'bg-red-950/80 border-rose-500'
              : 'bg-gradient-to-b from-indigo-900 to-slate-900 border-indigo-500/60'
          }`}
        >
          {/* Coding Screen Prop */}
          {pose === 'coding' && (
            <div className="absolute -bottom-2 w-24 h-11 bg-slate-950 border border-cyan-400 rounded-lg flex flex-col justify-center px-1.5 shadow-xl">
              <span className="text-[8px] font-mono text-cyan-300 truncate">&gt; git commit -m &quot;fix&quot;</span>
              <span className="text-[8px] font-mono text-emerald-400 truncate">&gt; status: 200 OK</span>
            </div>
          )}

          {/* Server Fire Alert Prop */}
          {pose === 'server-fire' && (
            <div className="absolute -top-4 text-xl animate-bounce">
              🔥
            </div>
          )}

          {/* Deploying Prop */}
          {pose === 'deploying' && (
            <div className="absolute -top-4 -right-4 text-xl animate-pulse">
              🚀
            </div>
          )}

          {pose === 'pointing' && (
            <div className="absolute -right-5 top-4 text-xl animate-pulse">👉</div>
          )}
        </div>
      </div>
    </div>
  );
};
