import { StudioProject, StudioScene, StudioElement, StudioPipe } from '../types/videoStudio';

export interface RenderProgress {
  percent: number;
  currentSceneIndex: number;
  totalScenes: number;
  sceneTitle: string;
  frame: number;
  totalFrames: number;
}

export interface RenderResult {
  blob: Blob;
  url: string;
  mimeType: string;
  extension: 'mp4' | 'webm';
  durationSec: number;
}

export interface RenderOptions {
  resolution?: '720p' | '1080p';
  fps?: 30 | 60;
  includeAudio?: boolean;
  signal?: AbortSignal;
  onProgress?: (p: RenderProgress) => void;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function getStatusColor(status: StudioElement['status']): string {
  switch (status) {
    case 'crashed':
      return '#EF4444';
    case 'warning':
      return '#F59E0B';
    case 'active':
      return '#06B6D4';
    case 'highlight':
      return '#10B981';
    default:
      return '#3B82F6';
  }
}

function getStatusLabel(status: StudioElement['status']): string {
  switch (status) {
    case 'crashed':
      return '500 CRASH';
    case 'warning':
      return 'HIGH LOAD';
    case 'active':
      return 'PROCESSING';
    case 'highlight':
      return 'VERIFIED';
    default:
      return 'HEALTHY';
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  scene: StudioScene,
  width: number,
  height: number,
  timeSec: number
) {
  const theme = scene.background.theme;
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  if (theme === 'cyber-terminal' || theme === 'matrix-code') {
    grad.addColorStop(0, '#04120E');
    grad.addColorStop(1, '#05080F');
  } else if (theme === 'clean-slate' || theme === 'psychology-split') {
    grad.addColorStop(0, '#0F1123');
    grad.addColorStop(1, '#070913');
  } else if (theme === 'deep-space') {
    grad.addColorStop(0, '#050714');
    grad.addColorStop(1, '#090B1A');
  } else {
    grad.addColorStop(0, '#070B14');
    grad.addColorStop(1, '#04070D');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  if (scene.background.grid) {
    ctx.save();
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.42)';
    ctx.lineWidth = 1;
    const step = Math.round(width / 32);
    const drift = (timeSec * 8) % step;
    for (let x = drift; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Ambient radial glow
  const glowColor = scene.background.ambientGlow || '#06B6D4';
  const radial = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    width * 0.04,
    width * 0.5,
    height * 0.5,
    width * 0.55
  );
  radial.addColorStop(0, `${glowColor}38`);
  radial.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);
}

function drawPipe(
  ctx: CanvasRenderingContext2D,
  pipe: StudioPipe,
  pipeIdx: number,
  fromEl: StudioElement,
  toEl: StudioElement,
  width: number,
  height: number,
  sceneProgress: number,
  timeSec: number,
  scaleFactor: number
) {
  const x1 = (fromEl.x / 100) * width;
  const y1 = (fromEl.y / 100) * height;
  const x2 = (toEl.x / 100) * width;
  const y2 = (toEl.y / 100) * height;

  const dist = Math.hypot(x2 - x1, y2 - y1) || 1;
  const arch = Math.min(80 * scaleFactor, Math.max(30 * scaleFactor, dist * 0.12));
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - arch;

  // Trim-path progressive draw synced to drawBeat (matches PipeLayer.tsx)
  const drawStart = pipe.drawBeat ?? Math.min(0.45, pipeIdx * 0.12);
  const drawProg = Math.max(0, Math.min(1, (sceneProgress - drawStart) / 0.18));
  const easedDraw = 1 - Math.pow(1 - drawProg, 3);
  if (easedDraw <= 0.02) return;
  const isDrawn = easedDraw >= 0.92;

  const isError = pipe.status === 'crashed' || pipe.status === 'error';
  const isHeavy = pipe.status === 'heavy';
  const strokeColor = isError ? '#EF4444' : isHeavy ? '#F59E0B' : pipe.packetColor || '#06B6D4';

  const evalQuad = (t: number) => {
    if (pipe.style === 'straight') {
      return { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t };
    }
    const mt = 1 - t;
    return {
      x: mt * mt * x1 + 2 * mt * t * mx + t * t * x2,
      y: mt * mt * y1 + 2 * mt * t * my + t * t * y2,
    };
  };

  // De Casteljau sub-curve helper for smooth progressive trim-path drawing from 0 to easedDraw
  const traceTrimPath = (tMax: number) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    if (pipe.style === 'straight') {
      const end = evalQuad(tMax);
      ctx.lineTo(end.x, end.y);
    } else {
      const subCtrlX = x1 + (mx - x1) * tMax;
      const subCtrlY = y1 + (my - y1) * tMax;
      const end = evalQuad(tMax);
      ctx.quadraticCurveTo(subCtrlX, subCtrlY, end.x, end.y);
    }
  };

  ctx.save();
  // Dark casing under wire (draws progressively)
  traceTrimPath(easedDraw);
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = (isHeavy ? 8 : 6) * scaleFactor;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Primary solid trim-path reveal stroke
  traceTrimPath(easedDraw);
  ctx.strokeStyle = strokeColor;
  ctx.globalAlpha = isDrawn ? 0.35 : 0.92;
  ctx.lineWidth = (isHeavy ? 3.8 : 2.8) * scaleFactor;
  ctx.shadowColor = strokeColor;
  ctx.shadowBlur = 10 * scaleFactor;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;

  // Flowing dashed conduit once drawn
  if (isDrawn) {
    traceTrimPath(1);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = (isHeavy ? 4 : 2.8) * scaleFactor;
    ctx.setLineDash([12 * scaleFactor, 8 * scaleFactor]);
    ctx.lineDashOffset = -(timeSec * 60 * Math.max(0.5, pipe.packetSpeed)) * scaleFactor;
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = 12 * scaleFactor;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  }

  // Moving data packets once trim-path completes
  if (isDrawn && pipe.packetSpeed > 0) {
    const dur = Math.max(0.45, 2.4 / Math.max(0.3, pipe.packetSpeed));
    const count = pipe.packetSpeed >= 2.5 ? 3 : pipe.packetSpeed > 0.8 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const t = ((timeSec / dur) + i / count) % 1;
      const pt = evalQuad(t);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, (i === 0 ? (isHeavy ? 6.5 : 5) : 3.8) * scaleFactor, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? (isError ? '#FCA5A5' : '#FFFFFF') : strokeColor;
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 10 * scaleFactor;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Label pill fades in halfway through trim-path
  if (pipe.label && easedDraw > 0.45) {
    const labelAlpha = Math.min(1, (easedDraw - 0.45) / 0.4);
    ctx.globalAlpha = labelAlpha;
    const mid = evalQuad(0.5);
    ctx.font = `700 ${Math.round(12 * scaleFactor)}px "Fira Code", monospace`;
    const textW = ctx.measureText(pipe.label).width;
    const padX = 10 * scaleFactor;
    const boxW = textW + padX * 2;
    const boxH = 22 * scaleFactor;
    const bx = mid.x - boxW / 2;
    const by = mid.y - 26 * scaleFactor;
    roundRect(ctx, bx, by, boxW, boxH, 6 * scaleFactor);
    ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
    ctx.fill();
    ctx.strokeStyle = `${strokeColor}99`;
    ctx.lineWidth = 1.2 * scaleFactor;
    ctx.stroke();

    ctx.fillStyle = isError ? '#FCA5A5' : '#E2E8F0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pipe.label, mid.x, by + boxH / 2);
  }
  ctx.restore();
}

async function preloadProjectImages(project: StudioProject): Promise<Map<string, HTMLImageElement>> {
  const map = new Map<string, HTMLImageElement>();
  const srcs = new Set<string>();
  project.scenes.forEach((s) => {
    s.elements.forEach((el) => {
      if (el.type === 'image-frame' && el.customProps?.src) {
        srcs.add(String(el.customProps.src));
      }
    });
  });

  await Promise.all(
    Array.from(srcs).map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          if (!src.startsWith('data:') && !src.startsWith('blob:')) {
            img.crossOrigin = 'anonymous';
          }
          img.onload = () => {
            map.set(src, img);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  );
  return map;
}

function drawFittedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  fitMode: 'cover' | 'contain',
  motionEffect: string,
  intensity: number,
  sceneProgress: number
) {
  const iw = img.naturalWidth || img.width || bw;
  const ih = img.naturalHeight || img.height || bh;
  const baseScale =
    fitMode === 'contain' ? Math.min(bw / iw, bh / ih) : Math.max(bw / iw, bh / ih);

  const t = sceneProgress;
  let extraScale = 1;
  let tx = 0;
  let ty = 0;
  let rot = 0;
  let wipeFrac = 1;

  if (motionEffect === 'ken-burns-in') {
    extraScale = 1 + 0.16 * intensity * t;
  } else if (motionEffect === 'ken-burns-out') {
    extraScale = 1 + 0.16 * intensity * (1 - t);
  } else if (motionEffect === 'pan-left') {
    extraScale = 1.16 * Math.max(1, intensity * 0.92);
    tx = bw * 0.05 * intensity * (1 - 2 * t);
  } else if (motionEffect === 'pan-right') {
    extraScale = 1.16 * Math.max(1, intensity * 0.92);
    tx = -bw * 0.05 * intensity * (1 - 2 * t);
  } else if (motionEffect === 'float-3d') {
    extraScale = 1.05;
    ty = Math.sin(t * Math.PI * 2) * bh * 0.025 * intensity;
    rot = (Math.sin(t * Math.PI * 2) * 1.2 * intensity * Math.PI) / 180;
  } else if (motionEffect === 'reveal-wipe') {
    wipeFrac = Math.max(0.02, Math.min(1, t / 0.35));
    extraScale = 1 + 0.06 * t;
  } else if (motionEffect === 'pulse-beat') {
    extraScale = 1 + Math.abs(Math.sin(t * Math.PI * 4)) * 0.07 * intensity;
  }

  ctx.save();
  if (wipeFrac < 1) {
    ctx.beginPath();
    ctx.rect(bx, by, bw * wipeFrac, bh);
    ctx.clip();
  }
  ctx.translate(bx + bw / 2 + tx, by + bh / 2 + ty);
  if (rot !== 0) ctx.rotate(rot);
  ctx.scale(baseScale * extraScale, baseScale * extraScale);
  ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
  ctx.restore();
}

function drawElement(
  ctx: CanvasRenderingContext2D,
  el: StudioElement,
  width: number,
  height: number,
  sceneProgress: number,
  timeSec: number,
  scaleFactor: number,
  imageMap: Map<string, HTMLImageElement>
) {
  const beatStart = Math.max(0, Math.min(0.8, el.entranceBeat ?? 0));
  const beatProg = Math.max(0, Math.min(1, (sceneProgress - beatStart) / 0.16));
  const eased = 1 - Math.pow(1 - beatProg, 3);
  if (eased <= 0.01) return;

  const cx = (el.x / 100) * width;
  const cy = (el.y / 100) * height;
  const w = el.width * scaleFactor * 1.28;
  const h = el.height * scaleFactor * 1.28;

  let shakeX = 0;
  let shakeY = 0;
  if (el.status === 'crashed' || el.animation === 'overload-shake') {
    shakeX = Math.sin(timeSec * 42) * 3.5 * scaleFactor;
    shakeY = Math.cos(timeSec * 36) * 2.5 * scaleFactor;
  } else if (el.animation === 'float') {
    shakeY = Math.sin(timeSec * 2.4) * 5 * scaleFactor;
  }

  const pulseScale = el.animation === 'pulse' ? 1 + Math.sin(timeSec * 4) * 0.025 : 1;
  const totalScale = (0.86 + 0.14 * eased) * pulseScale;

  const isCrashed = el.status === 'crashed';
  const isWarning = el.status === 'warning';
  const accent =
    el.type === 'custom-card' && !isCrashed && !isWarning && el.customProps?.accentColor
      ? String(el.customProps.accentColor)
      : getStatusColor(el.status);

  ctx.save();
  ctx.globalAlpha = eased;
  ctx.translate(cx + shakeX, cy + shakeY);
  ctx.scale(totalScale, totalScale);

  const x = -w / 2;
  const y = -h / 2;

  // Special full-card layout for kinetic-title
  if (el.type === 'kinetic-title') {
    roundRect(ctx, x, y, w, h, 16 * scaleFactor);
    ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
    ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
    ctx.shadowBlur = 24 * scaleFactor;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.65)';
    ctx.lineWidth = 1.8 * scaleFactor;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${Math.round(24 * scaleFactor)}px "Space Grotesk", "Poppins", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(el.title || 'KINETIC TITLE', 0, el.subtitle ? -10 * scaleFactor : 0, w - 24 * scaleFactor);

    if (el.subtitle) {
      ctx.font = `600 ${Math.round(12 * scaleFactor)}px "Fira Code", monospace`;
      ctx.fillStyle = '#67E8F9';
      ctx.fillText(el.subtitle, 0, 18 * scaleFactor, w - 24 * scaleFactor);
    }
    ctx.restore();
    return;
  }

  // Animated Image Frame layout
  if (el.type === 'image-frame') {
    const cfg = el.customProps || {};
    const src = String(cfg.src || '');
    const img = src ? imageMap.get(src) : undefined;
    const motionEffect = String(cfg.motionEffect || 'ken-burns-in');
    const frameStyle = String(cfg.frameStyle || 'glass-card');
    const fitMode: 'cover' | 'contain' = cfg.fitMode === 'contain' ? 'contain' : 'cover';
    const intensity = typeof cfg.intensity === 'number' ? cfg.intensity : 1.0;
    const imgAccent = isCrashed ? '#EF4444' : isWarning ? '#F59E0B' : String(cfg.accentColor || '#38BDF8');

    const padFrame = frameStyle === 'full-bleed' || frameStyle === 'minimal' || frameStyle === 'browser' ? 0 : 8 * scaleFactor;
    const headerH = frameStyle === 'browser' ? 24 * scaleFactor : 0;
    const footerH = frameStyle === 'polaroid' ? 24 * scaleFactor : frameStyle === 'glass-card' && (el.title || el.subtitle) ? 24 * scaleFactor : 0;

    roundRect(ctx, x, y, w, h, (frameStyle === 'full-bleed' ? 10 : 14) * scaleFactor);
    ctx.fillStyle = frameStyle === 'polaroid' ? '#F1F5F9' : 'rgba(2, 6, 23, 0.95)';
    if (frameStyle !== 'full-bleed') {
      ctx.shadowColor = `${imgAccent}55`;
      ctx.shadowBlur = 22 * scaleFactor;
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    if (frameStyle !== 'full-bleed' && frameStyle !== 'polaroid') {
      ctx.strokeStyle = `${imgAccent}99`;
      ctx.lineWidth = 1.6 * scaleFactor;
      ctx.stroke();
    }

    if (frameStyle === 'browser') {
      ctx.save();
      roundRect(ctx, x, y, w, headerH + 6 * scaleFactor, 14 * scaleFactor);
      ctx.clip();
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(x, y, w, headerH);
      ctx.restore();
      const dots = ['#F43F5E', '#FBBF24', '#34D399'];
      dots.forEach((col, i) => {
        ctx.beginPath();
        ctx.arc(x + (12 + i * 11) * scaleFactor, y + headerH / 2, 3 * scaleFactor, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
      });
      ctx.font = `600 ${Math.round(9.5 * scaleFactor)}px "Fira Code", monospace`;
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((el.title || 'showcase.png').slice(0, 32), 0, y + headerH / 2);
    }

    const imgX = x + padFrame;
    const imgY = y + padFrame + headerH;
    const imgW = w - padFrame * 2;
    const imgH = h - padFrame * 2 - headerH - footerH;

    ctx.save();
    roundRect(ctx, imgX, imgY, imgW, imgH, (frameStyle === 'full-bleed' ? 10 : 8) * scaleFactor);
    ctx.clip();
    ctx.fillStyle = '#090D16';
    ctx.fillRect(imgX, imgY, imgW, imgH);
    if (img) {
      drawFittedImage(ctx, img, imgX, imgY, imgW, imgH, fitMode, motionEffect, intensity, sceneProgress);
    } else {
      ctx.fillStyle = '#64748B';
      ctx.font = `600 ${Math.round(11 * scaleFactor)}px "Fira Code", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.title || 'IMAGE FRAME', 0, imgY + imgH / 2);
    }
    ctx.restore();

    if (footerH > 0) {
      ctx.textBaseline = 'middle';
      if (frameStyle === 'polaroid') {
        ctx.fillStyle = '#1E293B';
        ctx.font = `700 ${Math.round(10.5 * scaleFactor)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText((el.title || el.subtitle || 'Snapshot').slice(0, 36), 0, y + h - footerH / 2);
      } else {
        ctx.fillStyle = '#F8FAFC';
        ctx.font = `700 ${Math.round(10 * scaleFactor)}px "Fira Code", monospace`;
        ctx.textAlign = 'left';
        ctx.fillText((el.title || '').slice(0, 26), x + 12 * scaleFactor, y + h - footerH / 2 - 2 * scaleFactor);
        if (el.subtitle) {
          ctx.fillStyle = '#67E8F9';
          ctx.font = `500 ${Math.round(9 * scaleFactor)}px "Fira Code", monospace`;
          ctx.textAlign = 'right';
          ctx.fillText(el.subtitle.slice(0, 24), x + w - 12 * scaleFactor, y + h - footerH / 2 - 2 * scaleFactor);
        }
      }
    }

    ctx.restore();
    return;
  }

  // Card Container
  roundRect(ctx, x, y, w, h, 14 * scaleFactor);
  ctx.fillStyle = isCrashed
    ? 'rgba(45, 10, 14, 0.92)'
    : isWarning
    ? 'rgba(38, 24, 8, 0.92)'
    : el.type === 'systolic-array'
    ? 'rgba(5, 34, 24, 0.94)'
    : 'rgba(13, 19, 34, 0.94)';
  ctx.shadowColor = `${accent}66`;
  ctx.shadowBlur = 22 * scaleFactor;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = el.type === 'systolic-array' ? '#34D399' : accent;
  ctx.lineWidth = (el.type === 'sandbox-container' ? 2.2 : 1.8) * scaleFactor;
  if (el.type === 'sandbox-container') {
    ctx.setLineDash([7 * scaleFactor, 5 * scaleFactor]);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Header row
  const pad = 13 * scaleFactor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.round(12 * scaleFactor)}px "Fira Code", monospace`;
  ctx.fillStyle = '#F1F5F9';
  const maxTitleW = w - pad * 2 - 76 * scaleFactor;
  let titleText = el.title || el.type;
  while (ctx.measureText(titleText).width > maxTitleW && titleText.length > 4) {
    titleText = titleText.slice(0, -2) + '…';
  }
  ctx.fillText(titleText, x + pad, y + pad + 6 * scaleFactor);

  // Status tag
  const tagLabel =
    el.type === 'custom-card' && !isCrashed && el.customProps?.badgeText
      ? String(el.customProps.badgeText)
      : getStatusLabel(el.status);
  ctx.font = `700 ${Math.round(9.5 * scaleFactor)}px "Fira Code", monospace`;
  const tagW = ctx.measureText(tagLabel).width + 12 * scaleFactor;
  const tagH = 18 * scaleFactor;
  roundRect(ctx, x + w - pad - tagW, y + pad - 3 * scaleFactor, tagW, tagH, 5 * scaleFactor);
  ctx.fillStyle = `${accent}25`;
  ctx.fill();
  ctx.strokeStyle = `${accent}70`;
  ctx.lineWidth = 1 * scaleFactor;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.textAlign = 'center';
  ctx.fillText(tagLabel, x + w - pad - tagW / 2, y + pad + 6 * scaleFactor);

  // Body custom graphics per ElementType
  const bodyTop = y + 36 * scaleFactor;
  const bodyH = h - 66 * scaleFactor;

  if (el.type === 'server-blade') {
    const bayW = (w - pad * 2 - 18 * scaleFactor) / 4;
    for (let i = 0; i < 4; i++) {
      const bx = x + pad + i * (bayW + 6 * scaleFactor);
      roundRect(ctx, bx, bodyTop + 4 * scaleFactor, bayW, 20 * scaleFactor, 4 * scaleFactor);
      ctx.fillStyle = '#1E293B';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx + bayW - 7 * scaleFactor, bodyTop + 14 * scaleFactor, 2.5 * scaleFactor, 0, Math.PI * 2);
      ctx.fillStyle = isCrashed ? '#EF4444' : '#10B981';
      ctx.fill();
    }
    const barY = bodyTop + 36 * scaleFactor;
    roundRect(ctx, x + pad, barY, w - pad * 2, 7 * scaleFactor, 4 * scaleFactor);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    const pct = isCrashed ? 1 : isWarning ? 0.94 : el.status === 'active' ? 0.68 : 0.22;
    roundRect(ctx, x + pad, barY, (w - pad * 2) * pct, 7 * scaleFactor, 4 * scaleFactor);
    ctx.fillStyle = accent;
    ctx.fill();
  } else if (el.type === 'gpu-chip') {
    const dieSize = Math.min(w * 0.36, bodyH * 0.92);
    roundRect(ctx, -dieSize / 2, bodyTop + (bodyH - dieSize) / 2, dieSize, dieSize, 8 * scaleFactor);
    ctx.fillStyle = '#052E16';
    ctx.fill();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.6 * scaleFactor;
    ctx.stroke();
    ctx.fillStyle = '#6EE7B7';
    ctx.font = `700 ${Math.round(10 * scaleFactor)}px "Fira Code", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('TENSOR', 0, bodyTop + bodyH / 2 - 4 * scaleFactor);
    ctx.font = `500 ${Math.round(8.5 * scaleFactor)}px "Fira Code", monospace`;
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('14,592 Cores', 0, bodyTop + bodyH / 2 + 9 * scaleFactor);
  } else if (el.type === 'load-balancer') {
    const r = Math.min(w, bodyH) * 0.36;
    ctx.save();
    ctx.translate(0, bodyTop + bodyH / 2);
    ctx.rotate(timeSec * 0.9);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.55)';
    ctx.lineWidth = 2 * scaleFactor;
    ctx.setLineDash([6 * scaleFactor, 4 * scaleFactor]);
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(0, bodyTop + bodyH / 2, r * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(79, 70, 229, 0.7)';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `700 ${Math.round(13 * scaleFactor)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('⇄', 0, bodyTop + bodyH / 2);
  } else if (el.type === 'database-sql') {
    for (let i = 0; i < 3; i++) {
      const py = bodyTop + 6 * scaleFactor + i * 17 * scaleFactor;
      roundRect(ctx, -w * 0.28, py, w * 0.56, 13 * scaleFactor, 6 * scaleFactor);
      ctx.fillStyle = '#0C4A6E';
      ctx.fill();
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1 * scaleFactor;
      ctx.stroke();
    }
  } else if (el.type === 'binary-tree') {
    const topY = bodyTop + 12 * scaleFactor;
    const midY = bodyTop + bodyH * 0.52;
    const botY = bodyTop + bodyH - 10 * scaleFactor;
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.6 * scaleFactor;
    ctx.beginPath();
    ctx.moveTo(0, topY);
    ctx.lineTo(-w * 0.2, midY);
    ctx.lineTo(-w * 0.1, botY);
    ctx.stroke();
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(0, topY);
    ctx.lineTo(w * 0.2, midY);
    ctx.stroke();
    const nodes = [
      { x: 0, y: topY, v: '50', hi: true },
      { x: -w * 0.2, y: midY, v: '25', hi: true },
      { x: w * 0.2, y: midY, v: '75', hi: false },
      { x: -w * 0.1, y: botY, v: '42', hi: true },
    ];
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 12 * scaleFactor, 0, Math.PI * 2);
      ctx.fillStyle = n.v === '42' ? '#10B981' : '#0F172A';
      ctx.fill();
      ctx.strokeStyle = n.hi ? '#10B981' : '#475569';
      ctx.lineWidth = 1.5 * scaleFactor;
      ctx.stroke();
      ctx.fillStyle = n.v === '42' ? '#05080F' : '#E2E8F0';
      ctx.font = `700 ${Math.round(10 * scaleFactor)}px "Fira Code", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(n.v, n.x, n.y);
    });
  } else if (el.type === 'big-o-chart') {
    const lx = -w * 0.34;
    const rx = w * 0.36;
    const ty = bodyTop + 8 * scaleFactor;
    const by = bodyTop + bodyH - 8 * scaleFactor;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5 * scaleFactor;
    ctx.beginPath();
    ctx.moveTo(lx, ty);
    ctx.lineTo(lx, by);
    ctx.lineTo(rx, by);
    ctx.stroke();
    // O(log n)
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 2.2 * scaleFactor;
    ctx.beginPath();
    ctx.moveTo(lx, by);
    ctx.quadraticCurveTo(lx + (rx - lx) * 0.25, by - 14 * scaleFactor, rx, by - 22 * scaleFactor);
    ctx.stroke();
    // O(n^2)
    ctx.strokeStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(lx, by);
    ctx.quadraticCurveTo(lx + (rx - lx) * 0.22, by - 6 * scaleFactor, lx + (rx - lx) * 0.45, ty);
    ctx.stroke();
  } else if (el.type === 'metric-badge') {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 ${Math.round(22 * scaleFactor)}px sans-serif`;
    ctx.fillText(el.title, 0, bodyTop + bodyH * 0.45);
  } else if (el.type === 'agent-swarm') {
    // 6x2 pulsing grid of autonomous AI agent nodes
    const cols = 6;
    const rows = 2;
    const cellW = (w - pad * 2 - (cols - 1) * 6 * scaleFactor) / cols;
    const cellH = Math.min(24 * scaleFactor, (bodyH - 12 * scaleFactor) / rows);
    const startX = x + pad;
    const startY = bodyTop + (bodyH - (rows * cellH + 6 * scaleFactor)) / 2;
    for (let i = 0; i < 12; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const nx = startX + c * (cellW + 6 * scaleFactor);
      const ny = startY + r * (cellH + 6 * scaleFactor);
      const pulse = 0.5 + 0.5 * Math.sin(timeSec * 5 + i * 0.6);
      roundRect(ctx, nx, ny, cellW, cellH, 4 * scaleFactor);
      ctx.fillStyle = isCrashed
        ? `rgba(239, 68, 68, ${0.22 + pulse * 0.25})`
        : isWarning
        ? `rgba(245, 158, 11, ${0.2 + pulse * 0.25})`
        : `rgba(6, 182, 212, ${0.18 + pulse * 0.22})`;
      ctx.fill();
      ctx.strokeStyle = isCrashed ? '#F87171' : isWarning ? '#FBBF24' : '#22D3EE';
      ctx.lineWidth = 1 * scaleFactor;
      ctx.stroke();

      // Tiny agent core dot
      ctx.beginPath();
      ctx.arc(nx + cellW / 2, ny + cellH / 2, 3 * scaleFactor, 0, Math.PI * 2);
      ctx.fillStyle = isCrashed ? '#FCA5A5' : isWarning ? '#FDE68A' : '#A5F3FC';
      ctx.fill();
    }
  } else if (el.type === 'systolic-array') {
    // 5x3 diagonal heartbeat wave MAC matrix
    const cols = 5;
    const rows = 3;
    const cellW = (w - pad * 3.2 - (cols - 1) * 5 * scaleFactor) / cols;
    const cellH = Math.min(20 * scaleFactor, (bodyH - 12 * scaleFactor) / rows);
    const totalW = cols * cellW + (cols - 1) * 5 * scaleFactor;
    const totalH = rows * cellH + (rows - 1) * 5 * scaleFactor;
    const startX = -totalW / 2;
    const startY = bodyTop + (bodyH - totalH) / 2;
    const waveIdx = Math.floor(sceneProgress * 12) % 7;

    for (let i = 0; i < 15; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const lit = r + c === waveIdx || r + c === waveIdx - 1;
      const cxCell = startX + c * (cellW + 5 * scaleFactor);
      const cyCell = startY + r * (cellH + 5 * scaleFactor);
      roundRect(ctx, cxCell, cyCell, cellW, cellH, 3 * scaleFactor);
      ctx.fillStyle = lit ? '#34D399' : 'rgba(15, 23, 42, 0.9)';
      ctx.fill();
      ctx.strokeStyle = lit ? '#FFFFFF' : 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 1 * scaleFactor;
      ctx.stroke();

      ctx.fillStyle = lit ? '#022C22' : 'rgba(52, 211, 153, 0.65)';
      ctx.font = `700 ${Math.round(8.5 * scaleFactor)}px "Fira Code", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('W', cxCell + cellW / 2, cyCell + cellH / 2);
    }
  } else if (el.type === 'sandbox-container') {
    const pillW = Math.min(w - pad * 2, 172 * scaleFactor);
    const pillH = 26 * scaleFactor;
    roundRect(ctx, -pillW / 2, bodyTop + bodyH / 2 - pillH / 2, pillW, pillH, 7 * scaleFactor);
    ctx.fillStyle = isCrashed ? 'rgba(239, 68, 68, 0.22)' : 'rgba(15, 23, 42, 0.95)';
    ctx.fill();
    ctx.strokeStyle = isCrashed ? '#F87171' : '#475569';
    ctx.lineWidth = 1.2 * scaleFactor;
    ctx.stroke();

    ctx.fillStyle = isCrashed ? '#FECACA' : '#CBD5E1';
    ctx.font = `700 ${Math.round(10 * scaleFactor)}px "Fira Code", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(isCrashed ? 'ESCAPED VIA CACHE' : 'NO INTERNET · ISOLATED', 0, bodyTop + bodyH / 2);
  } else if (el.type === 'cache-redis') {
    roundRect(ctx, -56 * scaleFactor, bodyTop + bodyH / 2 - 14 * scaleFactor, 34 * scaleFactor, 28 * scaleFactor, 6 * scaleFactor);
    ctx.fillStyle = 'rgba(225, 29, 72, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#FB7185';
    ctx.lineWidth = 1.2 * scaleFactor;
    ctx.stroke();
    ctx.fillStyle = '#FDA4AF';
    ctx.font = `800 ${Math.round(11 * scaleFactor)}px "Fira Code", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('KV', -39 * scaleFactor, bodyTop + bodyH / 2);
    ctx.fillStyle = '#E2E8F0';
    ctx.font = `700 ${Math.round(12 * scaleFactor)}px "Fira Code", monospace`;
    ctx.fillText('128 GB RAM', 24 * scaleFactor, bodyTop + bodyH / 2);
  } else if (el.type === 'kafka-stream') {
    for (let i = 0; i < 4; i++) {
      const px = -w * 0.34 + i * (w * 0.18);
      roundRect(ctx, px, bodyTop + bodyH / 2 - 12 * scaleFactor, w * 0.14, 24 * scaleFactor, 4 * scaleFactor);
      ctx.fillStyle = 'rgba(88, 28, 135, 0.55)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.7)';
      ctx.lineWidth = 1 * scaleFactor;
      ctx.stroke();
      ctx.fillStyle = '#E9D5FF';
      ctx.font = `700 ${Math.round(9 * scaleFactor)}px "Fira Code", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(`p_${i + 1}`, px + (w * 0.07), bodyTop + bodyH / 2);
    }
  } else if (el.type === 'firewall-shield') {
    const bw = Math.min(w - pad * 2, 165 * scaleFactor);
    roundRect(ctx, -bw / 2, bodyTop + bodyH / 2 - 15 * scaleFactor, bw, 30 * scaleFactor, 8 * scaleFactor);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
    ctx.fill();
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 1.2 * scaleFactor;
    ctx.stroke();
    ctx.fillStyle = '#6EE7B7';
    ctx.font = `700 ${Math.round(10.5 * scaleFactor)}px "Fira Code", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('ZERO TRUST EDGE · TLS 1.3', 0, bodyTop + bodyH / 2);
  } else if (el.type === 'cloud-pod') {
    for (let i = 0; i < 3; i++) {
      const px = -w * 0.32 + i * (w * 0.23);
      roundRect(ctx, px, bodyTop + bodyH / 2 - 12 * scaleFactor, w * 0.19, 24 * scaleFactor, 5 * scaleFactor);
      ctx.fillStyle = 'rgba(12, 74, 110, 0.65)';
      ctx.fill();
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1 * scaleFactor;
      ctx.stroke();
      ctx.fillStyle = '#BAE6FD';
      ctx.font = `700 ${Math.round(9 * scaleFactor)}px "Fira Code", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(`pod-${i + 1}`, px + w * 0.095, bodyTop + bodyH / 2);
    }
  } else if (el.type === 'identity-idp') {
    const stepW = (w - pad * 2 - 12 * scaleFactor) / 3;
    const labels = ['HR Truth', 'Directory', 'SSO Vault'];
    labels.forEach((lbl, i) => {
      const bx = x + pad + i * (stepW + 6 * scaleFactor);
      roundRect(ctx, bx, bodyTop + bodyH / 2 - 13 * scaleFactor, stepW, 26 * scaleFactor, 5 * scaleFactor);
      ctx.fillStyle = i === 1 ? 'rgba(14, 165, 233, 0.25)' : 'rgba(15, 23, 42, 0.9)';
      ctx.fill();
      ctx.strokeStyle = i === 1 ? '#38BDF8' : '#334155';
      ctx.lineWidth = 1.1 * scaleFactor;
      ctx.stroke();
      ctx.fillStyle = i === 1 ? '#BAE6FD' : '#CBD5E1';
      ctx.font = `700 ${Math.round(9 * scaleFactor)}px "Fira Code", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(lbl, bx + stepW / 2, bodyTop + bodyH / 2);
    });
  } else if (el.type === 'auth-token') {
    const segs = [
      { label: 'HDR', bg: 'rgba(244, 63, 94, 0.22)', border: '#FB7185', text: '#FECDD3' },
      { label: 'CLAIMS', bg: 'rgba(168, 85, 247, 0.22)', border: '#C084FC', text: '#E9D5FF' },
      { label: 'SIG', bg: 'rgba(6, 182, 212, 0.22)', border: '#22D3EE', text: '#A5F3FC' },
    ];
    const segW = (w - pad * 2 - 20 * scaleFactor) / 3;
    segs.forEach((s, i) => {
      const sx = x + pad + i * (segW + 10 * scaleFactor);
      roundRect(ctx, sx, bodyTop + bodyH / 2 - 13 * scaleFactor, segW, 26 * scaleFactor, 5 * scaleFactor);
      ctx.fillStyle = s.bg;
      ctx.fill();
      ctx.strokeStyle = s.border;
      ctx.lineWidth = 1.1 * scaleFactor;
      ctx.stroke();
      ctx.fillStyle = s.text;
      ctx.font = `700 ${Math.round(9.5 * scaleFactor)}px "Fira Code", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(s.label, sx + segW / 2, bodyTop + bodyH / 2);
    });
  } else if (el.type === 'access-policy') {
    const rows = [
      { left: 'role: engineer', right: 'ALLOW (15m JIT)', rightCol: '#34D399' },
      { left: 'role: payroll_admin', right: isWarning ? 'STALE GRANT!' : 'DENY (SoD)', rightCol: isWarning ? '#FBBF24' : '#FB7185' },
    ];
    rows.forEach((row, i) => {
      const ry = bodyTop + 6 * scaleFactor + i * 24 * scaleFactor;
      roundRect(ctx, x + pad, ry, w - pad * 2, 19 * scaleFactor, 4 * scaleFactor);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fill();
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1 * scaleFactor;
      ctx.stroke();
      ctx.font = `600 ${Math.round(8.5 * scaleFactor)}px "Fira Code", monospace`;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#CBD5E1';
      ctx.fillText(row.left, x + pad + 7 * scaleFactor, ry + 9.5 * scaleFactor);
      ctx.textAlign = 'right';
      ctx.fillStyle = row.rightCol;
      ctx.fillText(row.right, x + w - pad - 7 * scaleFactor, ry + 9.5 * scaleFactor);
    });
  } else if (el.type === 'siem-audit') {
    roundRect(ctx, x + pad, bodyTop + 3 * scaleFactor, w - pad * 2, bodyH - 6 * scaleFactor, 6 * scaleFactor);
    ctx.fillStyle = '#020617';
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1 * scaleFactor;
    ctx.stroke();
    const logs = [
      { txt: '23:01 passkey_ok user=sarah', col: '#34D399' },
      { txt: '23:02 jit_elevate ttl=15m', col: '#7DD3FC' },
      { txt: '23:17 scim_deprovision=true', col: '#FCD34D' },
    ];
    ctx.font = `600 ${Math.round(8.5 * scaleFactor)}px "Fira Code", monospace`;
    ctx.textAlign = 'left';
    logs.forEach((l, i) => {
      ctx.fillStyle = l.col;
      ctx.fillText(l.txt, x + pad + 8 * scaleFactor, bodyTop + 14 * scaleFactor + i * 15 * scaleFactor, w - pad * 2 - 16 * scaleFactor);
    });
  } else if (el.type === 'terminal-window') {
    roundRect(ctx, x + pad, bodyTop + 2 * scaleFactor, w - pad * 2, bodyH - 4 * scaleFactor, 6 * scaleFactor);
    ctx.fillStyle = '#020617';
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1 * scaleFactor;
    ctx.stroke();
    const lines: string[] = Array.isArray(el.customProps?.lines) && el.customProps.lines.length > 0
      ? el.customProps.lines.slice(0, 4)
      : ['> init_handler()', 'await stream.process(batch)'];
    ctx.font = `600 ${Math.round(8.8 * scaleFactor)}px "Fira Code", monospace`;
    ctx.textAlign = 'left';
    lines.forEach((ln, i) => {
      const col = ln.includes('error') || ln.includes('CRASH') || ln.includes('0 alerts')
        ? '#FCA5A5'
        : ln.includes('await') || ln.includes('action')
        ? '#22D3EE'
        : '#34D399';
      ctx.fillStyle = col;
      ctx.fillText(String(ln).slice(0, 34), x + pad + 8 * scaleFactor, bodyTop + 13 * scaleFactor + i * 13 * scaleFactor, w - pad * 2 - 16 * scaleFactor);
    });
  } else if (el.type === 'custom-card') {
    const cfg = el.customProps || {};
    const layoutMode: 'gauge' | 'specs' | 'steps' | 'hero' = cfg.layoutMode || 'gauge';
    const rows: string[] = Array.isArray(cfg.rows) ? cfg.rows : [];
    const gaugeValue = typeof cfg.gaugeValue === 'number' ? Math.max(0, Math.min(100, cfg.gaugeValue)) : 80;
    const gaugeLabel = String(cfg.gaugeLabel || 'Load');

    if (layoutMode === 'gauge') {
      const labelY = bodyTop + bodyH * 0.34;
      ctx.font = `600 ${Math.round(10 * scaleFactor)}px "Fira Code", monospace`;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(gaugeLabel.slice(0, 22), x + pad, labelY);
      ctx.textAlign = 'right';
      ctx.fillStyle = accent;
      ctx.fillText(`${gaugeValue}%`, x + w - pad, labelY);

      const barY = bodyTop + bodyH * 0.56;
      const barW = w - pad * 2;
      roundRect(ctx, x + pad, barY, barW, 8 * scaleFactor, 4 * scaleFactor);
      ctx.fillStyle = '#1E293B';
      ctx.fill();
      roundRect(ctx, x + pad, barY, (barW * gaugeValue) / 100, 8 * scaleFactor, 4 * scaleFactor);
      ctx.fillStyle = accent;
      ctx.fill();
    } else if (layoutMode === 'specs') {
      const displayRows = (rows.length > 0 ? rows : ['Metric: Ready']).slice(0, 3);
      displayRows.forEach((raw, idx) => {
        const [k, ...rest] = String(raw).split(':');
        const v = rest.join(':').trim();
        const ry = bodyTop + 4 * scaleFactor + idx * 19 * scaleFactor;
        roundRect(ctx, x + pad, ry, w - pad * 2, 15 * scaleFactor, 4 * scaleFactor);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fill();
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1 * scaleFactor;
        ctx.stroke();
        ctx.font = `600 ${Math.round(8.5 * scaleFactor)}px "Fira Code", monospace`;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(k.trim().slice(0, 18), x + pad + 6 * scaleFactor, ry + 7.5 * scaleFactor);
        if (v) {
          ctx.textAlign = 'right';
          ctx.fillStyle = accent;
          ctx.fillText(v.slice(0, 16), x + w - pad - 6 * scaleFactor, ry + 7.5 * scaleFactor);
        }
      });
    } else if (layoutMode === 'steps') {
      const displaySteps = (rows.length > 0 ? rows : ['Step 1: Initialize']).slice(0, 3);
      displaySteps.forEach((step, idx) => {
        const sy = bodyTop + 11 * scaleFactor + idx * 18 * scaleFactor;
        ctx.beginPath();
        ctx.arc(x + pad + 7 * scaleFactor, sy, 6.5 * scaleFactor, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
        ctx.fillStyle = '#020617';
        ctx.font = `800 ${Math.round(8 * scaleFactor)}px "Fira Code", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(String(idx + 1), x + pad + 7 * scaleFactor, sy);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#E2E8F0';
        ctx.font = `600 ${Math.round(9 * scaleFactor)}px "Fira Code", monospace`;
        ctx.fillText(String(step).slice(0, 26), x + pad + 18 * scaleFactor, sy);
      });
    } else {
      // hero layout
      const heroVal = String(rows[0] || el.customProps?.badgeText || '99.9%');
      ctx.textAlign = 'center';
      ctx.fillStyle = accent;
      ctx.font = `800 ${Math.round(20 * scaleFactor)}px "Space Grotesk", sans-serif`;
      ctx.fillText(heroVal.slice(0, 18), 0, bodyTop + bodyH * 0.42);
      if (rows[1]) {
        ctx.fillStyle = '#94A3B8';
        ctx.font = `500 ${Math.round(9.5 * scaleFactor)}px "Fira Code", monospace`;
        ctx.fillText(String(rows[1]).slice(0, 32), 0, bodyTop + bodyH * 0.75);
      }
    }
  } else {
    // Clean stylized formula / story / generic center visual
    ctx.textAlign = 'center';
    ctx.fillStyle = '#CBD5E1';
    ctx.font = `600 ${Math.round(11.5 * scaleFactor)}px "Fira Code", monospace`;
    const centerText =
      el.type === 'math-formula'
        ? el.subtitle || 'Softmax(QK^T / √d) · V'
        : el.type === 'habit-loop'
        ? 'Cue ➔ Crave ➔ Reward'
        : el.subtitle || el.title;
    ctx.fillText(centerText.slice(0, 34), 0, bodyTop + bodyH / 2);
  }

  // Footer subtitle
  if (el.subtitle) {
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.lineWidth = 1 * scaleFactor;
    ctx.beginPath();
    ctx.moveTo(x + pad, y + h - 26 * scaleFactor);
    ctx.lineTo(x + w - pad, y + h - 26 * scaleFactor);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = `500 ${Math.round(10 * scaleFactor)}px "Fira Code", monospace`;
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(el.subtitle.slice(0, 38), 0, y + h - 13 * scaleFactor);
  }

  // Crash overload tag
  if (isCrashed) {
    const tagW2 = 82 * scaleFactor;
    const tagH2 = 20 * scaleFactor;
    roundRect(ctx, x + w - tagW2 + 6 * scaleFactor, y - 10 * scaleFactor, tagW2, tagH2, 5 * scaleFactor);
    ctx.fillStyle = '#DC2626';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 ${Math.round(10 * scaleFactor)}px "Fira Code", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('OVERLOAD!', x + w - tagW2 / 2 + 6 * scaleFactor, y);
  }

  ctx.restore();
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  scene: StudioScene,
  width: number,
  scaleFactor: number
) {
  if (!scene.hud.show) return;
  const y = 26 * scaleFactor;
  const padX = 28 * scaleFactor;

  ctx.save();
  ctx.font = `700 ${Math.round(11 * scaleFactor)}px "Fira Code", monospace`;
  ctx.textBaseline = 'middle';

  const statusText = scene.hud.statusText || 'SYSTEM RUNNING';
  const statusColor = scene.hud.statusColor || '#10B981';
  const stW = ctx.measureText(statusText).width + 26 * scaleFactor;
  roundRect(ctx, padX, y, stW, 28 * scaleFactor, 8 * scaleFactor);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fill();
  ctx.strokeStyle = `${statusColor}66`;
  ctx.lineWidth = 1.2 * scaleFactor;
  ctx.stroke();

  ctx.fillStyle = statusColor;
  ctx.textAlign = 'left';
  ctx.fillText(statusText, padX + 13 * scaleFactor, y + 14 * scaleFactor);

  // Right metrics
  const metrics: Array<{ label: string; val: string; color: string }> = [];
  if (scene.hud.rps !== undefined) metrics.push({ label: 'RPS', val: scene.hud.rps.toLocaleString(), color: '#22D3EE' });
  if (scene.hud.latencyMs !== undefined)
    metrics.push({
      label: 'LAT',
      val: `${scene.hud.latencyMs}ms`,
      color: scene.hud.latencyMs > 500 ? '#F87171' : '#F8FAFC',
    });
  if (scene.hud.cpuPercent !== undefined)
    metrics.push({
      label: 'CPU',
      val: `${scene.hud.cpuPercent}%`,
      color: scene.hud.cpuPercent > 80 ? '#F87171' : '#F8FAFC',
    });

  let cursorX = width - padX;
  for (let i = metrics.length - 1; i >= 0; i--) {
    const m = metrics[i];
    const text = `${m.label}: ${m.val}`;
    const mw = ctx.measureText(text).width + 20 * scaleFactor;
    cursorX -= mw;
    roundRect(ctx, cursorX, y, mw, 28 * scaleFactor, 8 * scaleFactor);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
    ctx.stroke();
    ctx.fillStyle = m.color;
    ctx.textAlign = 'center';
    ctx.fillText(text, cursorX + mw / 2, y + 14 * scaleFactor);
    cursorX -= 10 * scaleFactor;
  }
  ctx.restore();
}

function drawHeadline(
  ctx: CanvasRenderingContext2D,
  scene: StudioScene,
  width: number,
  height: number,
  sceneProgress: number,
  scaleFactor: number
) {
  if (!scene.headline?.text) return;
  const intro = Math.min(1, sceneProgress / 0.16);
  const eased = 1 - Math.pow(1 - intro, 3);

  ctx.save();
  ctx.globalAlpha = eased;
  const topOffset = (scene.hud.show ? 82 : 42) * scaleFactor - (1 - eased) * 14 * scaleFactor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = `800 ${Math.round(28 * scaleFactor)}px "Space Grotesk", "Poppins", sans-serif`;
  ctx.fillStyle = scene.headline.color || '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 12 * scaleFactor;
  ctx.fillText(scene.headline.text, width / 2, topOffset, width * 0.86);

  if (scene.headline.subtext) {
    ctx.shadowBlur = 0;
    ctx.font = `500 ${Math.round(14 * scaleFactor)}px sans-serif`;
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText(scene.headline.subtext, width / 2, topOffset + 34 * scaleFactor, width * 0.82);
  }
  ctx.restore();
}

function drawSubtitles(
  ctx: CanvasRenderingContext2D,
  narration: string,
  width: number,
  height: number,
  sceneProgress: number,
  scaleFactor: number
) {
  if (!narration.trim()) return;
  const words = narration.trim().split(/\s+/);
  const activeIdx = Math.min(words.length - 1, Math.floor(sceneProgress * words.length));

  ctx.save();
  ctx.font = `700 ${Math.round(17 * scaleFactor)}px sans-serif`;
  const maxBoxW = width * 0.8;

  // Wrap words into lines
  const lines: Array<Array<{ word: string; idx: number }>> = [[]];
  let lineW = 0;
  const spaceW = ctx.measureText(' ').width;
  words.forEach((word, idx) => {
    const ww = ctx.measureText(word).width;
    if (lineW + ww > maxBoxW - 36 * scaleFactor && lines[lines.length - 1].length > 0) {
      lines.push([]);
      lineW = 0;
    }
    lines[lines.length - 1].push({ word, idx });
    lineW += ww + spaceW;
  });

  const lineH = 26 * scaleFactor;
  const boxH = lines.length * lineH + 20 * scaleFactor;
  const boxW = Math.min(maxBoxW, Math.max(240 * scaleFactor, width * 0.65));
  const bx = (width - boxW) / 2;
  const by = height - boxH - 24 * scaleFactor;

  roundRect(ctx, bx, by, boxW, boxH, 12 * scaleFactor);
  ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.85)';
  ctx.lineWidth = 1.2 * scaleFactor;
  ctx.stroke();

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  lines.forEach((line, li) => {
    const totalLineW =
      line.reduce((acc, item) => acc + ctx.measureText(item.word).width, 0) +
      Math.max(0, line.length - 1) * spaceW;
    let cx = (width - totalLineW) / 2;
    const cy = by + 10 * scaleFactor + li * lineH + lineH / 2;
    line.forEach((item) => {
      const isActive = item.idx === activeIdx;
      ctx.fillStyle = isActive ? '#FCD34D' : item.idx < activeIdx ? '#F8FAFC' : '#94A3B8';
      ctx.fillText(item.word, cx, cy);
      cx += ctx.measureText(item.word).width + spaceW;
    });
  });

  ctx.restore();
}

function triggerSceneAudio(ctx: AudioContext, dest: MediaStreamAudioDestinationNode, scene: StudioScene) {
  try {
    const now = ctx.currentTime;
    const hasCrash = scene.elements.some((e) => e.status === 'crashed');
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = hasCrash ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(hasCrash ? 260 : 640, now);
    osc.frequency.exponentialRampToValueAtTime(hasCrash ? 120 : 960, now + 0.14);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch {
    // Ignore audio errors in headless environments
  }
}

export async function renderProjectToVideo(
  project: StudioProject,
  options: RenderOptions = {}
): Promise<RenderResult> {
  const {
    resolution = '720p',
    fps = 30,
    includeAudio = true,
    signal,
    onProgress,
  } = options;

  const isVertical = project.aspectRatio === '9:16';
  const baseShort = resolution === '1080p' ? 1080 : 720;
  const baseLong = resolution === '1080p' ? 1920 : 1280;
  const width = isVertical ? baseShort : baseLong;
  const height = isVertical ? baseLong : baseShort;
  const scaleFactor = width / (isVertical ? 720 : 1280);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context is not available in this browser.');

  // Preload all uploaded/remote images referenced by image-frame nodes
  const imageMap = await preloadProjectImages(project);

  // Pick best supported MediaRecorder MIME type
  const candidates = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  const mimeType = candidates.find((m) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) || 'video/webm';
  const extension: 'mp4' | 'webm' = mimeType.includes('mp4') ? 'mp4' : 'webm';

  const stream = canvas.captureStream(fps);

  let audioCtx: AudioContext | null = null;
  let audioDest: MediaStreamAudioDestinationNode | null = null;

  if (includeAudio && typeof window !== 'undefined') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
        audioDest = audioCtx.createMediaStreamDestination();
        // Silent carrier so audio track stays active for entire video
        const silentOsc = audioCtx.createOscillator();
        const silentGain = audioCtx.createGain();
        silentGain.gain.value = 0.0001;
        silentOsc.connect(silentGain);
        silentGain.connect(audioDest);
        silentOsc.start();
        audioDest.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
      }
    } catch {
      audioCtx = null;
      audioDest = null;
    }
  }

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: resolution === '1080p' ? 6_000_000 : 3_500_000,
  });

  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) chunks.push(ev.data);
  };

  const totalDuration = project.scenes.reduce((acc, s) => acc + s.duration, 0);
  const totalFrames = Math.max(1, Math.round(totalDuration * fps));

  const stopPromise = new Promise<RenderResult>((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
      resolve({ blob, url, mimeType, extension, durationSec: totalDuration });
    };
    recorder.onerror = (err) => {
      if (audioCtx) audioCtx.close().catch(() => {});
      reject(err);
    };
  });

  recorder.start(200);

  let frameIndex = 0;
  let lastSceneIdx = -1;
  const frameIntervalMs = 1000 / fps;
  const startWallMs = performance.now();

  for (let sIdx = 0; sIdx < project.scenes.length; sIdx++) {
    const scene = project.scenes[sIdx];
    const sceneFrames = Math.max(1, Math.round(scene.duration * fps));

    for (let f = 0; f < sceneFrames; f++) {
      if (signal?.aborted) {
        recorder.stop();
        throw new Error('Render cancelled');
      }

      if (sIdx !== lastSceneIdx) {
        lastSceneIdx = sIdx;
        if (audioCtx && audioDest && project.audio.sfxEnabled) {
          triggerSceneAudio(audioCtx, audioDest, scene);
        }
      }

      const sceneProg = f / Math.max(1, sceneFrames - 1);
      const timeSec = frameIndex / fps;

      // Render frame
      drawBackground(ctx, scene, width, height, timeSec);

      // Camera transform (2.5D keyframe interpolation) + scene intro transition
      const transProg = Math.min(1, sceneProg / 0.14);
      const transEase = 1 - Math.pow(1 - transProg, 3);
      const easeInOut = sceneProg < 0.5
        ? 2 * sceneProg * sceneProg
        : 1 - Math.pow(-2 * sceneProg + 2, 2) / 2;

      const endZoom = scene.camera.zoom || 1.0;
      const startZoom = scene.camera.startZoom ?? endZoom;
      const endPanX = scene.camera.panX || 0;
      const startPanX = scene.camera.startPanX ?? endPanX;
      const endPanY = scene.camera.panY || 0;
      const startPanY = scene.camera.startPanY ?? endPanY;

      const interpZoom = startZoom + (endZoom - startZoom) * easeInOut;
      const interpPanX = startPanX + (endPanX - startPanX) * easeInOut;
      const interpPanY = startPanY + (endPanY - startPanY) * easeInOut;

      const zoom = interpZoom * (scene.transition === 'zoom' ? 0.92 + 0.08 * transEase : 1);
      const slideX = scene.transition === 'slide' ? (1 - transEase) * width * 0.08 : 0;
      const shakeX = scene.camera.focus === 'shake' ? Math.sin(timeSec * 38) * 6 * scaleFactor : 0;
      const shakeY = scene.camera.focus === 'shake' ? Math.cos(timeSec * 32) * 4 * scaleFactor : 0;

      ctx.save();
      ctx.globalAlpha = scene.transition === 'cut' ? 1 : transEase;
      ctx.translate(width / 2 + shakeX + slideX, height / 2 + shakeY);
      ctx.scale(zoom, zoom);
      ctx.translate(
        -width / 2 - (interpPanX / 100) * width,
        -height / 2 - (interpPanY / 100) * height
      );

      // Pipes with trim-path drawBeat reveal
      const elMap = new Map<string, StudioElement>();
      scene.elements.forEach((e) => elMap.set(e.id, e));
      scene.pipes.forEach((pipe, pipeIdx) => {
        const fromEl = elMap.get(pipe.fromId);
        const toEl = elMap.get(pipe.toId);
        if (fromEl && toEl) {
          drawPipe(ctx, pipe, pipeIdx, fromEl, toEl, width, height, sceneProg, timeSec, scaleFactor);
        }
      });

      // Elements
      scene.elements.forEach((el) => {
        drawElement(ctx, el, width, height, sceneProg, timeSec, scaleFactor, imageMap);
      });

      ctx.restore();

      // HUD, Headline, Subtitles
      drawHUD(ctx, scene, width, scaleFactor);
      drawHeadline(ctx, scene, width, height, sceneProg, scaleFactor);
      drawSubtitles(ctx, scene.narration, width, height, sceneProg, scaleFactor);

      // Progress bar at very bottom
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(0, height - 4 * scaleFactor, width, 4 * scaleFactor);
      const totalProg = (frameIndex + 1) / totalFrames;
      const pGrad = ctx.createLinearGradient(0, 0, width, 0);
      pGrad.addColorStop(0, '#22D3EE');
      pGrad.addColorStop(1, '#6366F1');
      ctx.fillStyle = pGrad;
      ctx.fillRect(0, height - 4 * scaleFactor, width * totalProg, 4 * scaleFactor);

      frameIndex++;
      onProgress?.({
        percent: Math.min(99, Math.round((frameIndex / totalFrames) * 100)),
        currentSceneIndex: sIdx,
        totalScenes: project.scenes.length,
        sceneTitle: scene.title,
        frame: frameIndex,
        totalFrames,
      });

      // Pace frame encoding to real-time clock for accurate video duration
      const targetWallMs = startWallMs + frameIndex * frameIntervalMs;
      const delayMs = Math.max(0, targetWallMs - performance.now());
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  onProgress?.({
    percent: 100,
    currentSceneIndex: project.scenes.length - 1,
    totalScenes: project.scenes.length,
    sceneTitle: project.scenes[project.scenes.length - 1]?.title || '',
    frame: totalFrames,
    totalFrames,
  });

  recorder.stop();
  return stopPromise;
}
