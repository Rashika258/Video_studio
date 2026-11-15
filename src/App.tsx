'use client';

import React from 'react';
import { StudioProvider } from './store/videoStudioStore';
import { StudioHeader } from './components/Studio/StudioHeader';
import { StudioSidebar } from './components/Studio/StudioSidebar';
import { StudioCanvas } from './components/Studio/StudioCanvas';
import { StudioInspector } from './components/Studio/StudioInspector';
import { StudioTimeline } from './components/Studio/StudioTimeline';
import { ExportModal } from './components/Studio/ExportModal';
import { ScriptToVideoModal } from './components/Studio/ScriptToVideoModal';
import { StudioCustomBuilderModal } from './components/Studio/StudioCustomBuilderModal';
import { StudioImageAnimatorModal } from './components/Studio/StudioImageAnimatorModal';

export const VisualMotionApp: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#05070B] text-slate-100 font-sans">
      {/* 1. Studio Header */}
      <StudioHeader />

      {/* 2. Main Studio Workstation (Collapsible Sidebar + Full Canvas + Docked Inspector) */}
      <div className="flex-1 flex overflow-hidden relative">
        <StudioSidebar />
        <main className="flex-1 h-full min-w-0 relative overflow-hidden flex flex-col">
          <StudioCanvas />
        </main>
        <StudioInspector />
      </div>

      {/* 3. Bottom Multi-Scene Timeline */}
      <StudioTimeline />

      {/* 4. Image Animator, Custom Block Builder, Script-to-Video & Real Video Export Modals */}
      <StudioImageAnimatorModal />
      <StudioCustomBuilderModal />
      <ScriptToVideoModal />
      <ExportModal />
    </div>
  );
};

export function App() {
  return (
    <StudioProvider>
      <VisualMotionApp />
    </StudioProvider>
  );
}

export default App;
