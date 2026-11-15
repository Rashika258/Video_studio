import React, { useRef } from 'react';
import { useStory } from '../../store/storyStore';
import { CharacterPuppet } from './CharacterPuppet';
import { BackgroundTheme } from '../../types/story';

const BACKGROUND_STYLES: Record<BackgroundTheme, string> = {
  'dark-studio': 'bg-gradient-to-b from-[#0B0F19] via-[#090D16] to-[#05070B]',
  'server-room': 'bg-gradient-to-b from-[#090E17] via-[#0D1829] to-[#050B14]',
  'terminal-matrix': 'bg-gradient-to-b from-[#02180E] via-[#041F13] to-[#010C07]',
  'ai-neural': 'bg-gradient-to-tr from-[#130722] via-[#1F0A38] to-[#0A0517]',
  'cozy-room': 'bg-gradient-to-tr from-[#1E1B4B] via-[#2E1065] to-[#0F172A]',
  'cyberpunk': 'bg-gradient-to-b from-[#180A2E] via-[#0D1B2A] to-[#050814]',
  'space': 'bg-gradient-to-b from-[#030712] via-[#0B0F19] to-[#1E1B4B]',
  'office': 'bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#334155]',
  'nature': 'bg-gradient-to-b from-[#064E3B] via-[#065F46] to-[#022C22]',
};

export const StoryStage: React.FC = () => {
  const { activeScene, aspectRatio, updateHeadline } = useStory();
  const stageRef = useRef<HTMLDivElement>(null);

  const bgClass = BACKGROUND_STYLES[activeScene.background] || BACKGROUND_STYLES['dark-studio'];
  const isTerminal = activeScene.background === 'terminal-matrix';
  const isServerRoom = activeScene.background === 'server-room';

  return (
    <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden bg-[#05070A] select-none">
      {/* Aspect Ratio Framing Container (16:9 or 9:16) */}
      <div
        ref={stageRef}
        className={`relative overflow-hidden rounded-2xl shadow-2xl border border-slate-800 transition-all duration-500 ${bgClass} ${
          aspectRatio === '16:9'
            ? 'w-full max-w-5xl aspect-video'
            : 'h-full max-h-[82vh] aspect-[9/16]'
        }`}
      >
        {/* Background Tech Grids & Ambient Lights */}
        {isTerminal ? (
          <div className="absolute inset-0 pointer-events-none opacity-20 font-mono text-[9px] text-emerald-400 p-4 leading-none overflow-hidden select-none">
            01011001 01101111 01110101 01010100 01110101 01100010 01100101 00100000 01010011 01111001 01110011 01110100 01100101 01101101 00100000 01000100 01100101 01110011 01101001 01100111 01101110<br />
            &gt; CPU 99.8% • MEM 64.2GB • LATENCY 2.4MS • REVERSE_PROXY_UP • SHARD_KEY_ACTIVE
          </div>
        ) : isServerRoom ? (
          <div className="absolute inset-0 pointer-events-none opacity-15">
            <div className="grid grid-cols-12 h-full gap-4 px-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="col-span-2 border-x border-cyan-500/40 h-full flex flex-col justify-around py-4">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <div key={j} className="h-1 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: `${(i+j)*0.2}s` }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-indigo-500 blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-sky-500 blur-[100px]" />
          </div>
        )}

        {/* HEADLINE / TITLES ON STAGE */}
        <div
          className="absolute z-20 text-center w-full px-6 pointer-events-auto"
          style={{
            top: `${activeScene.headline.y}%`,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <input
            type="text"
            value={activeScene.headline.text}
            onChange={(e) => updateHeadline(e.target.value)}
            style={{
              fontFamily: activeScene.headline.font,
              color: activeScene.headline.color,
              fontSize: `${activeScene.headline.size}px`,
            }}
            className="w-full bg-transparent text-center font-bold tracking-tight outline-none border-b border-transparent hover:border-slate-700/60 focus:border-indigo-500 transition-colors drop-shadow-md"
          />
          {activeScene.headline.subtext && (
            <input
              type="text"
              value={activeScene.headline.subtext}
              onChange={(e) => updateHeadline(activeScene.headline.text, e.target.value)}
              className="w-full bg-transparent text-center text-sm text-slate-300 font-medium mt-1 outline-none border-b border-transparent hover:border-slate-700/60 focus:border-indigo-500 transition-colors drop-shadow"
            />
          )}
        </div>

        {/* CHARACTER PUPPET ON STAGE */}
        {activeScene.character && (
          <div
            className="absolute z-10 transition-all duration-300 pointer-events-auto cursor-pointer hover:scale-105"
            style={{
              left: `${activeScene.character.x}%`,
              top: `${activeScene.character.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            title="Click to customize character & speech"
          >
            <CharacterPuppet
              type={activeScene.character.type}
              pose={activeScene.character.pose}
              speechBubble={activeScene.character.speechBubble}
              scale={activeScene.character.scale}
            />
          </div>
        )}

        {/* VISUAL PROPS / TECH NODES ON STAGE */}
        {activeScene.props.map((prop) => {
          let animClass = 'animate-float';
          if (prop.animation === 'bounce') animClass = 'animate-bounce';
          if (prop.animation === 'pulse') animClass = 'animate-pulse';
          if (prop.animation === 'heartbeat') animClass = 'animate-pulse';
          if (prop.animation === 'shake') animClass = 'animate-wiggle';
          if (prop.animation === 'packet-flow') animClass = 'animate-pulse';

          const isTech = prop.category === 'tech';

          return (
            <div
              key={prop.id}
              className={`absolute z-10 flex flex-col items-center pointer-events-auto transition-transform ${animClass}`}
              style={{
                left: `${prop.x}%`,
                top: `${prop.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Tech Node Card or Emoji */}
              {isTech ? (
                <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border-2 border-cyan-400/80 shadow-2xl backdrop-blur-md flex items-center gap-3 hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-2xl">{prop.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white tracking-tight">{prop.name}</div>
                    {prop.badge && (
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border inline-block mt-0.5"
                        style={{
                          color: prop.badgeColor || '#38BDF8',
                          borderColor: `${prop.badgeColor || '#38BDF8'}50`,
                          backgroundColor: `${prop.badgeColor || '#38BDF8'}15`,
                        }}
                      >
                        {prop.badge}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="text-4xl filter drop-shadow-2xl hover:scale-125 transition-transform cursor-pointer"
                    style={{ fontSize: `${prop.scale * 32}px` }}
                  >
                    {prop.icon}
                  </div>
                  {prop.label && (
                    <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-white text-[10px] font-mono font-semibold shadow-md backdrop-blur-md">
                      {prop.label}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
