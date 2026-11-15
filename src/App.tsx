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

export const VisualMotionApp: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#05070B] text-slate-100 font-sans">
      {/* 1. Studio Header */}
      <StudioHeader />

      {/* 2. Main Studio Workstation (Sidebar + Canvas + Floating Inspector) */}
      <div className="flex-1 flex overflow-hidden relative">
        <StudioSidebar />
        <main className="flex-1 h-full relative overflow-hidden flex flex-col">
          <StudioCanvas />
          <StudioInspector />
        </main>
      </div>

      {/* 3. Bottom Multi-Scene Timeline */}
      <StudioTimeline />

      {/* 4. Script-to-Video & Real Video Export Modals */}
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
