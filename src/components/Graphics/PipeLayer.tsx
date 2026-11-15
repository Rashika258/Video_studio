import React from 'react';
import { StudioElement, StudioPipe } from '../../types/videoStudio';

interface PipeLayerProps {
  pipes: StudioPipe[];
  elements: StudioElement[];
}

export const PipeLayer: React.FC<PipeLayerProps> = ({ pipes, elements }) => {
  const elementMap = new Map<string, StudioElement>();
  elements.forEach((el) => elementMap.set(el.id, el));

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Glow Filters */}
        <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {pipes.map((pipe) => {
        const fromEl = elementMap.get(pipe.fromId);
        const toEl = elementMap.get(pipe.toId);
        if (!fromEl || !toEl) return null;

        const x1 = `${fromEl.x}%`;
        const y1 = `${fromEl.y}%`;
        const x2 = `${toEl.x}%`;
        const y2 = `${toEl.y}%`;

        // Midpoint for curve control
        const mx = (fromEl.x + toEl.x) / 2;
        const my = (fromEl.y + toEl.y) / 2 - 4; // slight upward arch

        const isError = pipe.status === 'crashed' || pipe.status === 'error';
        const isHeavy = pipe.status === 'heavy';

        const strokeColor = isError
          ? '#EF4444'
          : isHeavy
          ? '#F59E0B'
          : pipe.packetColor || '#06B6D4';

        const pathD = `M ${fromEl.x} ${fromEl.y} Q ${mx} ${my} ${toEl.x} ${toEl.y}`;

        return (
          <g key={pipe.id}>
            {/* Background Cable Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Glowing Active Cable Wire */}
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth={isHeavy ? '3' : '2'}
              strokeOpacity="0.8"
              filter={isError ? 'url(#glow-red)' : 'url(#glow-cyan)'}
              strokeDasharray={isError ? '4 4' : '6 4'}
              className="animate-pulse"
            />

            {/* Moving Data Packets / Pulses along the wire */}
            {pipe.packetSpeed > 0 && (
              <circle r={isHeavy ? 4.5 : 3.5} fill={isError ? '#F87171' : '#FFFFFF'}>
                <animateMotion
                  path={pathD}
                  dur={`${Math.max(0.4, 2.5 / pipe.packetSpeed)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Second packet staggered */}
            {pipe.packetSpeed > 1 && (
              <circle r={isHeavy ? 3.5 : 2.5} fill={strokeColor}>
                <animateMotion
                  path={pathD}
                  dur={`${Math.max(0.4, 2.5 / pipe.packetSpeed)}s`}
                  begin={`${1.2 / pipe.packetSpeed}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Cable Label Badge */}
            {pipe.label && (
              <text
                x={`${mx}%`}
                y={`${my}%`}
                fill="#94A3B8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                dy="-8"
                className="select-none"
              >
                {pipe.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
