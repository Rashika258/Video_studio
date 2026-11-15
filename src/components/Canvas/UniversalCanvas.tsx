import React, { useRef, useState } from 'react';
import { useCanvas } from '../../store/canvasStore';
import { evaluateElementAtTime } from '../../utils/interpolation';
import { CanvasElement } from '../../types/element';
import {
  Server,
  Database,
  Cpu,
  Brain,
  Rocket,
  Zap,
  Flame,
  ShieldCheck,
  Terminal,
  Code2,
  Layers,
  Smile,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Server,
  Database,
  Cpu,
  Brain,
  Rocket,
  Zap,
  Flame,
  Shield: ShieldCheck,
  Terminal,
  Code: Code2,
  Layers,
  Smile,
};

export const UniversalCanvas: React.FC = () => {
  const {
    elements,
    wires,
    selectedId,
    setSelectedId,
    currentTime,
    updateElement,
    activeTool,
    setActiveTool,
    addWire,
    addElement,
    project,
  } = useCanvas();

  const containerRef = useRef<HTMLDivElement>(null);
  const [wireStartId, setWireStartId] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [initialSize, setInitialSize] = useState<{ w: number; h: number; x: number; y: number }>({ w: 0, h: 0, x: 0, y: 0 });
  const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isDrawingPath, setIsDrawingPath] = useState(false);
  const [currentPathPoints, setCurrentPathPoints] = useState<{ x: number; y: number }[]>([]);

  const renderedElements = elements.map((el) => evaluateElementAtTime(el, currentTime));
  const elementsById = new Map<string, CanvasElement>(renderedElements.map((el) => [el.id, el]));

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      if (activeTool === 'pen') {
        const rect = containerRef.current!.getBoundingClientRect();
        const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        setIsDrawingPath(true);
        setCurrentPathPoints([pt]);
      } else if (activeTool === 'shape' || activeTool === 'card' || activeTool === 'text') {
        const rect = containerRef.current!.getBoundingClientRect();
        addElement(activeTool, {
          x: e.clientX - rect.left - 60,
          y: e.clientY - rect.top - 40,
        });
        setActiveTool('select');
      } else {
        setSelectedId(null);
        setWireStartId(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    if (isDragging && selectedId) {
      updateElement(selectedId, {
        x: curX - dragOffset.x,
        y: curY - dragOffset.y,
      });
    } else if (isResizing && selectedId && resizeHandle) {
      const dx = curX - resizeStartPos.x;
      const dy = curY - resizeStartPos.y;
      updateElement(selectedId, {
        width: Math.max(50, initialSize.w + dx),
        height: Math.max(35, initialSize.h + dy),
      });
    } else if (isDrawingPath) {
      setCurrentPathPoints((pts) => [...pts, { x: curX, y: curY }]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);

    if (isDrawingPath && currentPathPoints.length > 2) {
      const d = currentPathPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
      addElement('path', {
        pathData: d,
        x: currentPathPoints[0].x,
        y: currentPathPoints[0].y,
        stroke: '#06B6D4',
        strokeWidth: 3,
        fill: 'transparent',
      });
      setIsDrawingPath(false);
      setCurrentPathPoints([]);
      setActiveTool('select');
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation();
    if (activeTool === 'wire') {
      if (!wireStartId) {
        setWireStartId(el.id);
      } else {
        addWire(wireStartId, el.id);
        setWireStartId(null);
        setActiveTool('select');
      }
      return;
    }

    setSelectedId(el.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - containerRef.current!.getBoundingClientRect().left - el.x,
      y: e.clientY - containerRef.current!.getBoundingClientRect().top - el.y,
    });
  };

  const handleResizeHandleMouseDown = (e: React.MouseEvent, handle: string, el: CanvasElement) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setInitialSize({ w: el.width, h: el.height, x: el.x, y: el.y });
    setResizeStartPos({
      x: e.clientX - containerRef.current!.getBoundingClientRect().left,
      y: e.clientY - containerRef.current!.getBoundingClientRect().top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative w-full h-full overflow-hidden select-none bg-[#07090E] transition-all duration-500 ${
        project.camera.tilt3D ? 'isometric-view' : 'flat-view'
      }`}
    >
      {/* Background Dot Matrix */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="grid-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#64748B" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-dots)" />
      </svg>

      {/* SVG Connecting Wires & Particle Animations */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {wires.map((wire) => {
          const fromEl = elementsById.get(wire.fromId);
          const toEl = elementsById.get(wire.toId);
          if (!fromEl || !toEl) return null;

          const sx = fromEl.x + fromEl.width / 2;
          const sy = fromEl.y + fromEl.height / 2;
          const tx = toEl.x + toEl.width / 2;
          const ty = toEl.y + toEl.height / 2;

          const dx = tx - sx;
          const cp1x = sx + dx * 0.5;
          const cp1y = sy;
          const cp2x = sx + dx * 0.5;
          const cp2y = ty;
          const pathD = `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`;
          const duration = Math.max(0.8, 3 / (wire.speed || 1.8));

          return (
            <g key={wire.id}>
              <path
                d={pathD}
                fill="none"
                stroke={wire.color}
                strokeWidth={5}
                opacity={0.3}
                filter="url(#wire-glow)"
              />
              <path
                d={pathD}
                fill="none"
                stroke="#1E293B"
                strokeWidth={2.5}
                strokeDasharray={wire.isDashed ? '6 6' : undefined}
              />
              {Array.from({ length: wire.particleCount || 4 }).map((_, i) => (
                <rect
                  key={i}
                  width="14"
                  height="7"
                  rx="3.5"
                  fill={wire.particleColor}
                  filter="url(#wire-glow)"
                >
                  <animateMotion
                    path={pathD}
                    dur={`${duration}s`}
                    begin={`${(i * (duration / (wire.particleCount || 4))).toFixed(2)}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                  />
                </rect>
              ))}
            </g>
          );
        })}

        {isDrawingPath && currentPathPoints.length > 1 && (
          <path
            d={currentPathPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')}
            fill="none"
            stroke="#06B6D4"
            strokeWidth={3}
            strokeDasharray="4 4"
          />
        )}
      </svg>

      {/* Rendered Elements on Canvas */}
      {renderedElements.map((el) => {
        const isSelected = el.id === selectedId;
        const isWireTarget = wireStartId === el.id;
        const IconComponent = el.icon ? ICON_MAP[el.icon] || Server : null;

        return (
          <div
            key={el.id}
            onMouseDown={(e) => handleElementMouseDown(e, el)}
            style={{
              position: 'absolute',
              left: `${el.x}px`,
              top: `${el.y}px`,
              width: `${el.width}px`,
              height: `${el.height}px`,
              transform: `rotate(${el.rotation}deg) scale(${el.scale})`,
              transformOrigin: 'center center',
              opacity: el.opacity,
              backgroundColor: el.fill,
              borderColor: isSelected ? '#6366F1' : el.stroke,
              borderWidth: `${el.strokeWidth}px`,
              borderRadius: el.shape === 'circle' ? '9999px' : `${el.borderRadius}px`,
              boxShadow: `0 0 ${el.glowRadius}px ${el.glowColor}50, 0 10px 30px rgba(0,0,0,0.5)`,
              zIndex: isSelected ? 20 : 10,
              fontFamily: el.fontFamily || 'Inter',
            }}
            className={`group cursor-move transition-shadow duration-150 backdrop-blur-md flex flex-col justify-between p-3 select-none ${
              isWireTarget ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-black animate-pulse' : ''
            }`}
          >
            {/* Custom Component or Rich Card Content */}
            {(el.type === 'custom' || el.type === 'card') && (
              <div className="w-full h-full flex flex-col justify-between overflow-hidden">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {IconComponent && (
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center border shrink-0"
                        style={{
                          backgroundColor: `${el.stroke}20`,
                          borderColor: `${el.stroke}50`,
                        }}
                      >
                        <IconComponent className="w-4 h-4" style={{ color: el.stroke }} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white tracking-tight leading-tight truncate">
                        {el.name}
                      </div>
                      {el.sublabel && (
                        <div className="text-[10px] text-slate-400 truncate font-normal">
                          {el.sublabel}
                        </div>
                      )}
                    </div>
                  </div>

                  {el.badgeText && (
                    <span
                      className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0"
                      style={{
                        color: el.badgeColor || '#10B981',
                        backgroundColor: `${el.badgeColor || '#10B981'}15`,
                        borderColor: `${el.badgeColor || '#10B981'}40`,
                      }}
                    >
                      {el.badgeText}
                    </span>
                  )}
                </div>

                {/* Optional Progress Gauge */}
                {el.progressValue !== undefined && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80">
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${el.progressValue}%`,
                          backgroundColor: el.progressColor || el.stroke,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Typography / Text Element */}
            {el.type === 'text' && (
              <div
                className="w-full h-full flex items-center justify-center font-bold tracking-tight text-center"
                style={{
                  fontSize: `${el.fontSize || 22}px`,
                  color: el.textColor || '#FFFFFF',
                  fontFamily: el.fontFamily || 'Inter',
                }}
              >
                {el.text}
              </div>
            )}

            {/* Basic Shape */}
            {el.type === 'shape' && (
              <div className="w-full h-full flex items-center justify-center font-semibold text-xs text-white text-center">
                {el.text}
              </div>
            )}

            {/* Selection Outline & Resize Handles */}
            {isSelected && (
              <>
                <div className="absolute inset-0 border-2 border-indigo-500 rounded-[inherit] pointer-events-none" />
                <div
                  onMouseDown={(e) => handleResizeHandleMouseDown(e, 'se', el)}
                  className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-500 border-2 border-white rounded-full cursor-se-resize shadow-md z-30"
                />
              </>
            )}
          </div>
        );
      })}

      {wireStartId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-cyan-950/90 border border-cyan-500 text-cyan-300 px-4 py-2 rounded-xl text-xs font-mono shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Click target component to connect particle stream
        </div>
      )}
    </div>
  );
};
