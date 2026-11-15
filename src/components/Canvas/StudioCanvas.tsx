import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  addEdge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useStudio } from '../../store/studioStore';
import { SystemNode } from './nodes/SystemNode';
import { HardwareNode } from './nodes/HardwareNode';
import { MathNode } from './nodes/MathNode';
import { CharacterNode } from './nodes/CharacterNode';
import { AnimatedParticleEdge } from './edges/AnimatedParticleEdge';

export const StudioCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setEdges,
    setSelectedNode,
    isIsometric,
  } = useStudio();

  // Register custom node components
  const nodeTypes = useMemo(
    () => ({
      systemNode: SystemNode,
      hardwareNode: HardwareNode,
      mathNode: MathNode,
      characterNode: CharacterNode,
    }),
    []
  );

  // Register custom edge types
  const edgeTypes = useMemo(
    () => ({
      animatedParticle: AnimatedParticleEdge,
    }),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'animatedParticle',
            data: {
              speed: 1.6,
              particleColor: '#38BDF8',
              particleShape: 'pill',
              density: 4,
              packetLabel: 'Data Stream',
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#070A10]">
      {/* 2.5D Isometric Tilt Wrapper */}
      <div
        className={`w-full h-full transition-transform duration-700 ease-out ${
          isIsometric ? 'isometric-view' : 'flat-view'
        }`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2.5}
          onNodeClick={(_, node) => setSelectedNode(node)}
          onPaneClick={() => setSelectedNode(null)}
          defaultEdgeOptions={{
            type: 'animatedParticle',
          }}
          proOptions={{ hideAttribution: true }}
          className="react-flow-custom"
        >
          {/* Subtle glowing dot matrix background */}
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color="#1E293B"
          />

          <Controls
            className="!bg-slate-900/90 !border !border-slate-800 !rounded-xl !overflow-hidden !shadow-2xl [&>button]:!bg-transparent [&>button]:!border-slate-800 [&>button]:!text-slate-300 hover:[&>button]:!text-white hover:[&>button]:!bg-slate-800"
          />

          <MiniMap
            nodeStrokeColor="#334155"
            nodeColor="#1E293B"
            nodeBorderRadius={6}
            maskColor="rgba(8, 11, 17, 0.75)"
            className="!bg-slate-900/80 !border !border-slate-800 !rounded-xl !shadow-2xl"
          />
        </ReactFlow>
      </div>

      {/* Isometric Indicator Badge */}
      {isIsometric && (
        <div className="absolute top-4 right-4 pointer-events-none z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-mono backdrop-blur-md shadow-lg animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            2.5D ISOMETRIC CAMERA ACTIVE
          </div>
        </div>
      )}
    </div>
  );
};
