import React from 'react';
import { StudioElement, StudioPipe } from '../../types/videoStudio';

interface PipeLayerProps {
  pipes: StudioPipe[];
  elements: StudioElement[];
  aspectRatio?: '16:9' | '9:16';
  playbackProgress?: number;
  isPlaying?: boolean;
}

export const PipeLayer: React.FC<PipeLayerProps> = ({
  pipes,
  elements,
  aspectRatio = '16:9',
  playbackProgress = 1,
  isPlaying = false,
}) => {
  const elementMap = new Map<string, StudioElement>();
  elements.forEach((el) => elementMap.set(el.id, el));

  const vbWidth = aspectRatio === '9:16' ? 562 : 1000;
  const vbHeight = aspectRatio === '9:16' ? 1000 : 562;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-red" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {pipes.map((pipe, idx) => {
        const fromEl = elementMap.get(pipe.fromId);
        const toEl = elementMap.get(pipe.toId);
        if (!fromEl || !toEl) return null;

        const x1 = (fromEl.x / 100) * vbWidth;
        const y1 = (fromEl.y / 100) * vbHeight;
        const x2 = (toEl.x / 100) * vbWidth;
        const y2 = (toEl.y / 100) * vbHeight;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.hypot(dx, dy) || 1;

        const archOffset = Math.min(55, Math.max(24, dist * 0.12));
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - archOffset;

        const isError = pipe.status === 'crashed' || pipe.status === 'error';
        const isHeavy = pipe.status === 'heavy';

        const strokeColor = isError
          ? '#EF4444'
          : isHeavy
          ? '#F59E0B'
          : pipe.packetColor || '#06B6D4';

        const pathD =
          pipe.style === 'straight'
            ? `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`
            : `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;

        // Trim-path progressive draw during playback
        const drawStart = pipe.drawBeat ?? Math.min(0.45, idx * 0.12);
        const drawProg = isPlaying
          ? Math.max(0, Math.min(1, (playbackProgress - drawStart) / 0.18))
          : 1;
        const easedDraw = 1 - Math.pow(1 - drawProg, 3);
        const isDrawn = easedDraw >= 0.92;

        // Exact midpoint of quadratic Bezier at t=0.5
        const labelX = pipe.style === 'straight' ? (x1 + x2) / 2 : 0.25 * x1 + 0.5 * mx + 0.25 * x2;
        const labelY = pipe.style === 'straight' ? (y1 + y2) / 2 - 14 : 0.25 * y1 + 0.5 * my + 0.25 * y2 - 12;

        const durSec = Math.max(0.45, 2.4 / Math.max(0.3, pipe.packetSpeed));

        return (
          <g key={pipe.id} opacity={easedDraw > 0.02 ? 1 : 0}>
            {/* Subtle dark casing under wire (draws with trim path) */}
            <path
              d={pathD}
              fill="none"
              stroke="#0F172A"
              strokeWidth={isHeavy ? 7 : 5.5}
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="100"
              strokeDashoffset={100 * (1 - easedDraw)}
            />

            {/* Trim-path primary solid reveal line */}
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth={isHeavy ? 3.5 : 2.5}
              strokeOpacity={isDrawn ? 0.35 : 0.92}
              filter={isError ? 'url(#glow-red)' : 'url(#glow-cyan)'}
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="100"
              strokeDashoffset={100 * (1 - easedDraw)}
            />

            {/* Flowing dashed conduit once drawn */}
            {isDrawn && (
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isHeavy ? 3.2 : 2.2}
                strokeOpacity="0.9"
                filter={isError ? 'url(#glow-red)' : 'url(#glow-cyan)'}
                strokeDasharray={isError ? '7 7' : '10 6'}
                strokeLinecap="round"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="32"
                  to="0"
                  dur={`${Math.max(0.35, 1.4 / Math.max(0.5, pipe.packetSpeed))}s`}
                  repeatCount="indefinite"
                />
              </path>
            )}

            {/* Moving data packets once line completes drawing */}
            {isDrawn && pipe.packetSpeed > 0 && (
              <circle r={isHeavy ? 6 : 4.5} fill={isError ? '#FCA5A5' : '#FFFFFF'} filter={isError ? 'url(#glow-red)' : 'url(#glow-cyan)'}>
                <animateMotion path={pathD} dur={`${durSec}s`} repeatCount="indefinite" />
              </circle>
            )}

            {isDrawn && pipe.packetSpeed > 0.8 && (
              <circle r={isHeavy ? 4.5 : 3.5} fill={strokeColor}>
                <animateMotion
                  path={pathD}
                  dur={`${durSec}s`}
                  begin={`${(durSec * 0.33).toFixed(2)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {isDrawn && pipe.packetSpeed >= 2.5 && (
              <circle r={3.5} fill="#E2E8F0">
                <animateMotion
                  path={pathD}
                  dur={`${durSec}s`}
                  begin={`${(durSec * 0.66).toFixed(2)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Crisp label with dark backdrop pill */}
            {pipe.label && easedDraw > 0.45 && (
              <g transform={`translate(${labelX.toFixed(1)}, ${labelY.toFixed(1)})`} opacity={Math.min(1, (easedDraw - 0.45) / 0.4)}>
                <rect
                  x={-(pipe.label.length * 3.6 + 10)}
                  y={-11}
                  width={pipe.label.length * 7.2 + 20}
                  height={20}
                  rx={6}
                  fill="#090D16"
                  fillOpacity="0.92"
                  stroke={strokeColor}
                  strokeOpacity="0.55"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3"
                  fill={isError ? '#FCA5A5' : '#E2E8F0'}
                  fontSize="11"
                  fontFamily="Fira Code, monospace"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {pipe.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
