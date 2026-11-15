import React from 'react';
import { ElementStatus } from '../../types/videoStudio';

interface GraphicProps {
  status: ElementStatus;
  title: string;
  subtitle?: string;
  customProps?: Record<string, any>;
}

// 1. BRAIN DOPAMINE PATHWAY (PsychToons style)
export const BrainDopamineGraphic: React.FC<GraphicProps> = ({ status, title, subtitle, customProps }) => {
  const isHighDopamine = status === 'active' || status === 'highlight';

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3.5 rounded-2xl bg-gradient-to-b from-[#180A2E] to-slate-950 border border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.3)] backdrop-blur-md select-none font-sans">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-fuchsia-200">{title || 'The Brain Reward Circuit'}</span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
          NEUROLOGY
        </span>
      </div>

      {/* SVG Stylized Brain Silhouette & Pathways */}
      <div className="relative my-2 w-full flex-1 flex items-center justify-center">
        <svg className="w-44 h-28" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Brain Contour Outer Shell */}
          <path
            d="M 35 60 C 25 50, 25 35, 40 25 C 55 15, 75 10, 95 12 C 115 14, 135 25, 140 45 C 145 60, 135 75, 120 80 C 105 85, 90 78, 80 82 C 70 85, 55 85, 45 75 Z"
            stroke="#D946EF"
            strokeWidth="2"
            fill="#3B0764"
            fillOpacity="0.4"
          />

          {/* Prefrontal Cortex (Rational Decision Making) */}
          <circle cx="45" cy="40" r="10" fill="#06B6D4" fillOpacity="0.7" />
          <text x="45" y="42" fill="#FFFFFF" fontSize="5" fontWeight="bold" textAnchor="middle">PFC</text>

          {/* Nucleus Accumbens / Reward Center */}
          <circle cx="85" cy="50" r="9" fill={isHighDopamine ? '#F43F5E' : '#A855F7'} fillOpacity="0.8" className="animate-pulse" />
          <text x="85" y="52" fill="#FFFFFF" fontSize="4.5" fontWeight="bold" textAnchor="middle">DOPAMINE</text>

          {/* VTA Dopamine Highway Beam */}
          <path
            d="M 105 75 Q 90 60 48 44"
            stroke="#F43F5E"
            strokeWidth="3"
            strokeDasharray="4 2"
            className="animate-pulse"
          />
        </svg>

        {/* Floating Neurotransmitter Molecule indicator */}
        <div className="absolute right-4 top-6 flex flex-col items-center">
          <div className="px-1.5 py-0.5 rounded-full bg-fuchsia-950 border border-fuchsia-400 text-[8px] font-mono text-fuchsia-300 animate-bounce">
            +DOPAMINE SPIKE
          </div>
        </div>
      </div>

      <div className="w-full text-center text-[9px] font-medium text-fuchsia-300/80 border-t border-purple-900/50 pt-1">
        {subtitle || 'Instant Gratification suppresses the Prefrontal Cortex'}
      </div>
    </div>
  );
};

// 2. CHARACTER AT DESK (PsychToons style)
export const CharacterDeskGraphic: React.FC<GraphicProps> = ({ status, title, subtitle, customProps }) => {
  const isBurnout = status === 'crashed' || status === 'warning';

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950/70 border border-indigo-400/50 shadow-xl backdrop-blur-md select-none">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-indigo-200">{title || 'Deep Work Mode'}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
          {isBurnout ? 'BURNOUT' : 'FOCUSED'}
        </span>
      </div>

      {/* 2D Vector Character Scene */}
      <div className="relative my-2 w-full flex-1 flex items-center justify-center">
        <svg className="w-48 h-28" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Desk Surface */}
          <rect x="20" y="65" width="120" height="6" rx="2" fill="#475569" />
          <line x1="30" y1="71" x2="30" y2="88" stroke="#334155" strokeWidth="4" />
          <line x1="130" y1="71" x2="130" y2="88" stroke="#334155" strokeWidth="4" />

          {/* Steaming Coffee Mug */}
          <rect x="35" y="55" width="8" height="10" rx="1.5" fill="#E2E8F0" />
          <path d="M 43 57 C 46 57 46 62 43 62" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
          <path d="M 38 52 Q 39 48 37 45" stroke="#94A3B8" strokeWidth="1" fill="none" />

          {/* Laptop on desk */}
          <path d="M 55 65 L 68 45 L 85 45 L 80 65 Z" fill="#0EA5E9" fillOpacity="0.8" />
          <rect x="52" y="64" width="32" height="2" fill="#CBD5E1" />

          {/* Character Head & Body */}
          {isBurnout ? (
            // Head on desk burnout pose
            <g>
              <ellipse cx="85" cy="58" rx="9" ry="7" fill="#FBBF24" />
              {/* Tired eyes */}
              <text x="82" y="60" fontSize="6" fill="#1E293B">x x</text>
              <path d="M 100 68 Q 95 60 88 60" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
            </g>
          ) : (
            // Laser focused working upright pose
            <g>
              <circle cx="105" cy="38" r="9" fill="#FBBF24" />
              {/* Focused eye looking at screen */}
              <circle cx="101" cy="37" r="1.5" fill="#1E293B" />
              {/* Torso & arms reaching keyboard */}
              <path d="M 105 47 L 105 65" stroke="#38BDF8" strokeWidth="12" strokeLinecap="round" />
              <path d="M 105 52 L 78 63" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}
        </svg>

        {/* Thought Bubble */}
        <div className="absolute top-1 right-2 px-2 py-0.5 rounded-xl bg-slate-950/90 border border-cyan-400 text-[8px] font-medium text-cyan-300 shadow-md">
          {isBurnout ? 'Brain is fried...' : 'Just 25 mins of flow state.'}
        </div>
      </div>

      <div className="w-full text-center text-[9px] text-slate-400 border-t border-slate-800 pt-1">
        {subtitle || 'Discipline = Systems, not Motivation'}
      </div>
    </div>
  );
};

// 3. CHARACTER WITH SMARTPHONE (PsychToons style)
export const CharacterPhoneGraphic: React.FC<GraphicProps> = ({ status, title, subtitle }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3.5 rounded-2xl bg-gradient-to-b from-[#1E112A] to-slate-950 border border-pink-500/50 shadow-xl backdrop-blur-md select-none">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-pink-200">{title || 'The Infinite Scroll'}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300">
          DISTRACTION
        </span>
      </div>

      {/* Character with phone and floating notifications */}
      <div className="relative my-2 w-full flex-1 flex items-center justify-center">
        <svg className="w-48 h-28" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Character sitting */}
          <circle cx="70" cy="32" r="11" fill="#FBBF24" />
          <path d="M 70 43 L 70 68" stroke="#F43F5E" strokeWidth="14" strokeLinecap="round" />
          {/* Arms holding phone */}
          <path d="M 70 48 L 95 55" stroke="#FBBF24" strokeWidth="4.5" strokeLinecap="round" />
          {/* Glowing Phone */}
          <rect x="94" y="46" width="10" height="18" rx="2" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
          <circle cx="99" cy="55" r="12" fill="#38BDF8" fillOpacity="0.2" className="animate-ping" />
        </svg>

        {/* Floating Social Icons */}
        <div className="absolute top-2 left-6 px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[7px] font-bold shadow animate-bounce">
          1 New Like
        </div>
        <div className="absolute bottom-4 right-6 px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[7px] font-bold shadow animate-pulse">
          ▶ Watch Next
        </div>
      </div>

      <div className="w-full text-center text-[9px] text-pink-300/80 border-t border-slate-800 pt-1">
        {subtitle || 'Attention hijacked by variable rewards'}
      </div>
    </div>
  );
};
