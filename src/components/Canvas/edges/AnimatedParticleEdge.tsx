import React, { useMemo } from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';

export const AnimatedParticleEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const speed = (data.speed as number) || 1.5;
  const particleColor = (data.particleColor as string) || '#38BDF8';
  const particleShape = (data.particleShape as string) || 'pill';
  const density = (data.density as number) || 4;
  const packetLabel = (data.packetLabel as string) || '';
  const isReversed = (data.isReversed as boolean) || false;
  const isBlocked = (data.isBlocked as boolean) || false;

  // Generate particle timing offsets
  const particles = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => ({
      id: `${id}-p-${i}`,
      begin: `${(i * (speed / density)).toFixed(2)}s`,
    }));
  }, [id, density, speed]);

  const durationStr = `${(3 / speed).toFixed(2)}s`;

  return (
    <>
      <defs>
        {/* Glow filter for edge & particles */}
        <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background thicker glow path */}
      <path
        d={edgePath}
        fill="none"
        stroke={isBlocked ? '#EF4444' : particleColor}
        strokeWidth={isBlocked ? 4 : 3}
        strokeOpacity={0.25}
        filter={`url(#glow-${id})`}
      />

      {/* Crisp Main Wire */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isBlocked ? '#DC2626' : '#1E293B',
          strokeWidth: 2.5,
          strokeDasharray: isBlocked ? '6 6' : undefined,
          ...style,
        }}
      />

      {/* Moving Particles */}
      {!isBlocked &&
        particles.map((p) => (
          <g key={p.id}>
            {particleShape === 'pill' ? (
              <rect
                width="16"
                height="7"
                rx="3.5"
                fill={particleColor}
                filter={`url(#glow-${id})`}
                opacity="0.9"
              >
                <animateMotion
                  path={edgePath}
                  dur={durationStr}
                  begin={p.begin}
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints={isReversed ? '1;0' : '0;1'}
                  keyTimes="0;1"
                />
              </rect>
            ) : (
              <circle
                r="4.5"
                fill={particleColor}
                filter={`url(#glow-${id})`}
                opacity="0.95"
              >
                <animateMotion
                  path={edgePath}
                  dur={durationStr}
                  begin={p.begin}
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints={isReversed ? '1;0' : '0;1'}
                  keyTimes="0;1"
                />
              </circle>
            )}
          </g>
        ))}

      {/* Packet Label pill if provided */}
      {packetLabel && (
        <foreignObject
          width={130}
          height={26}
          x={labelX - 65}
          y={labelY - 13}
          className="pointer-events-none"
        >
          <div className="flex items-center justify-center h-full">
            <span
              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border shadow-sm backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderColor: `${particleColor}55`,
                color: particleColor,
              }}
            >
              {packetLabel}
            </span>
          </div>
        </foreignObject>
      )}
    </>
  );
};
