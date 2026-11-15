import React, { useRef, useState } from 'react';
import {
  X,
  ImagePlus,
  Upload,
  Film,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Link2,
  Layers,
} from 'lucide-react';
import { useVideoStudio, ImageStoryboardSlide } from '../../store/videoStudioStore';
import { ImageFrameStyle, ImageMotionEffect, SceneTransition } from '../../types/videoStudio';

const MOTION_OPTIONS: Array<{ value: ImageMotionEffect; label: string }> = [
  { value: 'ken-burns-in', label: 'Ken Burns Zoom In' },
  { value: 'ken-burns-out', label: 'Ken Burns Pull Out' },
  { value: 'pan-left', label: 'Cinematic Pan Left' },
  { value: 'pan-right', label: 'Cinematic Pan Right' },
  { value: 'reveal-wipe', label: 'Reveal Wipe' },
  { value: 'float-3d', label: '3D Levitation Float' },
  { value: 'pulse-beat', label: 'Rhythmic Pulse Beat' },
  { value: 'none', label: 'Static' },
];

const FRAME_OPTIONS: Array<{ value: ImageFrameStyle; label: string }> = [
  { value: 'glass-card', label: 'Studio Card' },
  { value: 'full-bleed', label: 'Full-Bleed Backdrop' },
  { value: 'browser', label: 'Browser Window' },
  { value: 'minimal', label: 'Minimal Glow' },
  { value: 'polaroid', label: 'Polaroid Frame' },
];

const TRANSITION_OPTIONS: SceneTransition[] = ['fade', 'zoom', 'slide', 'cut'];

const CYCLE_MOTIONS: ImageMotionEffect[] = [
  'ken-burns-in',
  'pan-right',
  'ken-burns-out',
  'pan-left',
  'reveal-wipe',
];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export const StudioImageAnimatorModal: React.FC = () => {
  const {
    isImageAnimatorOpen,
    setIsImageAnimatorOpen,
    createVideoFromImages,
    addImageElement,
  } = useVideoStudio();

  const [projectTitle, setProjectTitle] = useState('Animated Visual Story');
  const [slides, setSlides] = useState<ImageStoryboardSlide[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isImageAnimatorOpen) return null;

  const appendImageSources = (items: Array<{ src: string; name: string }>) => {
    setSlides((prev) => {
      const next = [...prev];
      items.forEach((item, offset) => {
        const idx = next.length;
        const cleanTitle = item.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
        next.push({
          id: `slide-${Date.now()}-${idx}-${offset}`,
          src: item.src,
          title: cleanTitle || `Scene ${idx + 1}`,
          subtitle: '',
          narration: cleanTitle
            ? `Scene ${idx + 1}: ${cleanTitle}.`
            : `Look closely at this visual highlight in scene ${idx + 1}.`,
          duration: 4.5,
          motionEffect: CYCLE_MOTIONS[idx % CYCLE_MOTIONS.length],
          frameStyle: 'glass-card',
          fitMode: 'cover',
          transition: idx % 2 === 0 ? 'fade' : 'zoom',
          accentColor: idx % 2 === 0 ? '#06B6D4' : '#6366F1',
        });
      });
      return next;
    });
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const imageFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    const loaded = await Promise.all(
      imageFiles.map(async (f) => ({
        src: await readFileAsDataUrl(f),
        name: f.name,
      }))
    );
    appendImageSources(loaded);
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    appendImageSources([{ src: trimmed, name: `Visual Slide ${slides.length + 1}` }]);
    setUrlInput('');
  };

  const updateSlide = (id: string, patch: Partial<ImageStoryboardSlide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeSlide = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const moveSlide = (index: number, delta: -1 | 1) => {
    setSlides((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  const applyBatchPreset = (preset: 'ken-burns' | 'browser-demo' | 'full-bleed' | 'dynamic') => {
    setSlides((prev) =>
      prev.map((s, idx) => {
        if (preset === 'ken-burns') {
          return {
            ...s,
            motionEffect: idx % 2 === 0 ? 'ken-burns-in' : 'ken-burns-out',
            frameStyle: 'minimal',
            transition: 'fade',
          };
        }
        if (preset === 'browser-demo') {
          return {
            ...s,
            motionEffect: 'ken-burns-in',
            frameStyle: 'browser',
            fitMode: 'contain',
            transition: 'slide',
          };
        }
        if (preset === 'full-bleed') {
          return {
            ...s,
            motionEffect: CYCLE_MOTIONS[idx % CYCLE_MOTIONS.length],
            frameStyle: 'full-bleed',
            fitMode: 'cover',
            transition: 'zoom',
          };
        }
        return {
          ...s,
          motionEffect: CYCLE_MOTIONS[idx % CYCLE_MOTIONS.length],
          frameStyle: idx % 2 === 0 ? 'glass-card' : 'browser',
          transition: idx % 2 === 0 ? 'fade' : 'zoom',
        };
      })
    );
  };

  const handleAddToCurrentScene = () => {
    if (slides.length === 0) return;
    slides.forEach((s, idx) => {
      const cols = Math.min(3, slides.length);
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = cols === 1 ? 50 : 25 + col * (50 / Math.max(1, cols - 1));
      const y = slides.length <= 3 ? 52 : 34 + row * 34;
      addImageElement({
        src: s.src,
        title: s.title,
        subtitle: s.subtitle,
        motionEffect: s.motionEffect,
        frameStyle: s.frameStyle,
        fitMode: s.fitMode,
        x,
        y,
        width: slides.length === 1 ? 380 : 250,
        height: slides.length === 1 ? 230 : 160,
        accentColor: s.accentColor,
      });
    });
    setIsImageAnimatorOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none">
      <div className="w-full max-w-4xl bg-[#0B101B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ImagePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Animate Images to Video</h3>
              <p className="text-xs text-slate-400">
                Upload screenshots, photos, or diagrams — apply Ken Burns zoom, pan, wipe, voiceover captions, and export to MP4/WebM.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsImageAnimatorOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close image animator"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Upload Dropzone & URL Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                void handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`lg:col-span-7 p-5 rounded-2xl border-2 border-dashed cursor-pointer flex items-center justify-center gap-4 transition-colors ${
                isDraggingOver
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-slate-700 hover:border-cyan-500/60 bg-slate-900/50 hover:bg-slate-900/80'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Drop images here or click to upload</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Select multiple PNG, JPG, WebP, or SVG files to sequence into scenes
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  void handleFiles(e.target.files);
                  e.target.value = '';
                }}
                className="hidden"
              />
            </div>

            <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-2.5">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Video Project Title
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Link2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddUrl();
                      }
                    }}
                    placeholder="Or paste image URL..."
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 flex items-center gap-1 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Batch Style Bar */}
          {slides.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{slides.length} Image Scene{slides.length > 1 ? 's' : ''} Ready</span>
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  ({slides.reduce((acc, s) => acc + s.duration, 0).toFixed(1)}s total)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-500 mr-1">APPLY ALL:</span>
                {[
                  { id: 'dynamic' as const, label: 'Dynamic Mix' },
                  { id: 'ken-burns' as const, label: 'Ken Burns Doc' },
                  { id: 'browser-demo' as const, label: 'Browser Showcase' },
                  { id: 'full-bleed' as const, label: 'Full-Bleed Cinematic' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyBatchPreset(p.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storyboard Slide List */}
          {slides.length === 0 ? (
            <div className="py-10 text-center rounded-2xl bg-slate-900/30 border border-slate-800/70 text-slate-400 space-y-1.5">
              <div className="text-xs font-semibold text-slate-300">No images queued yet</div>
              <div className="text-[11px] text-slate-500">
                Upload 1 or more images above (or drag images directly onto the Studio Canvas anytime).
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="p-3.5 rounded-2xl bg-slate-900/75 border border-slate-800 flex flex-col md:flex-row gap-3.5 items-start"
                >
                  {/* Thumbnail + Order */}
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveSlide(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSlide(idx, 1)}
                        disabled={idx === slides.length - 1}
                        className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="w-36 h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 relative shrink-0">
                      <img
                        src={slide.src}
                        alt={slide.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/85 text-[9px] font-mono font-bold text-cyan-300 border border-slate-700">
                        #{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Slide Details */}
                  <div className="flex-1 w-full space-y-2.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                        placeholder="On-screen scene headline..."
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        value={slide.narration}
                        onChange={(e) => updateSlide(slide.id, { narration: e.target.value })}
                        placeholder="Voiceover narration & synced subtitle..."
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[9px] font-mono text-slate-500 block mb-0.5">MOTION EFFECT</label>
                        <select
                          value={slide.motionEffect}
                          onChange={(e) =>
                            updateSlide(slide.id, { motionEffect: e.target.value as ImageMotionEffect })
                          }
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 font-mono focus:outline-none"
                        >
                          {MOTION_OPTIONS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono text-slate-500 block mb-0.5">FRAME STYLE</label>
                        <select
                          value={slide.frameStyle}
                          onChange={(e) =>
                            updateSlide(slide.id, { frameStyle: e.target.value as ImageFrameStyle })
                          }
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-200 font-mono focus:outline-none"
                        >
                          {FRAME_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono text-slate-500 block mb-0.5">TRANSITION</label>
                        <select
                          value={slide.transition}
                          onChange={(e) =>
                            updateSlide(slide.id, { transition: e.target.value as SceneTransition })
                          }
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-200 font-mono focus:outline-none"
                        >
                          {TRANSITION_OPTIONS.map((tr) => (
                            <option key={tr} value={tr}>
                              {tr.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono text-slate-500 block mb-0.5">DURATION (SEC)</label>
                        <input
                          type="number"
                          min={2}
                          max={15}
                          step={0.5}
                          value={slide.duration}
                          onChange={(e) =>
                            updateSlide(slide.id, { duration: Math.max(2, Number(e.target.value) || 4) })
                          }
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-white tabular-nums focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSlide(slide.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors shrink-0"
                    title="Remove image slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsImageAnimatorOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={slides.length === 0}
            onClick={handleAddToCurrentScene}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add to Current Scene</span>
          </button>

          <button
            type="button"
            disabled={slides.length === 0}
            onClick={() => createVideoFromImages(slides, projectTitle)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Create Animated Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};
