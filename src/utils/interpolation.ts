import { CanvasElement, KeyframeData, EasingType } from '../types/element';

export const applyEasing = (t: number, easing: EasingType = 'easeInOut'): number => {
  const clamped = Math.max(0, Math.min(1, t));
  switch (easing) {
    case 'linear':
      return clamped;
    case 'easeIn':
      return clamped * clamped;
    case 'easeOut':
      return clamped * (2 - clamped);
    case 'spring':
      return 1 + Math.sin(clamped * Math.PI * 4.5) * Math.exp(-clamped * 6);
    case 'easeInOut':
    default:
      return clamped < 0.5 ? 2 * clamped * clamped : -1 + (4 - 2 * clamped) * clamped;
  }
};

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

export const lerpColor = (c1: string, c2: string, t: number): string => {
  if (!c1 || !c2 || !c1.startsWith('#') || !c2.startsWith('#')) return c2 || c1;
  const hex1 = c1.replace('#', '');
  const hex2 = c2.replace('#', '');
  if (hex1.length !== 6 || hex2.length !== 6) return c2;

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(lerp(r1, r2, t));
  const g = Math.round(lerp(g1, g2, t));
  const b = Math.round(lerp(b1, b2, t));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const evaluateElementAtTime = (element: CanvasElement, currentTime: number): CanvasElement => {
  const kfs = [...element.keyframes].sort((a, b) => a.time - b.time);
  let currentProps = { ...element };

  if (kfs.length > 0) {
    if (currentTime <= kfs[0].time) {
      currentProps = { ...currentProps, ...kfs[0] };
    } else if (currentTime >= kfs[kfs.length - 1].time) {
      currentProps = { ...currentProps, ...kfs[kfs.length - 1] };
    } else {
      for (let i = 0; i < kfs.length - 1; i++) {
        const k1 = kfs[i];
        const k2 = kfs[i + 1];
        if (currentTime >= k1.time && currentTime <= k2.time) {
          const duration = k2.time - k1.time;
          const rawProgress = duration > 0 ? (currentTime - k1.time) / duration : 1;
          const easedT = applyEasing(rawProgress, k2.easing || 'easeInOut');

          if (k1.x !== undefined && k2.x !== undefined) currentProps.x = lerp(k1.x, k2.x, easedT);
          if (k1.y !== undefined && k2.y !== undefined) currentProps.y = lerp(k1.y, k2.y, easedT);
          if (k1.width !== undefined && k2.width !== undefined) currentProps.width = lerp(k1.width, k2.width, easedT);
          if (k1.height !== undefined && k2.height !== undefined) currentProps.height = lerp(k1.height, k2.height, easedT);
          if (k1.rotation !== undefined && k2.rotation !== undefined) currentProps.rotation = lerp(k1.rotation, k2.rotation, easedT);
          if (k1.scale !== undefined && k2.scale !== undefined) currentProps.scale = lerp(k1.scale, k2.scale, easedT);
          if (k1.opacity !== undefined && k2.opacity !== undefined) currentProps.opacity = lerp(k1.opacity, k2.opacity, easedT);
          if (k1.strokeWidth !== undefined && k2.strokeWidth !== undefined) currentProps.strokeWidth = lerp(k1.strokeWidth, k2.strokeWidth, easedT);
          if (k1.glowRadius !== undefined && k2.glowRadius !== undefined) currentProps.glowRadius = lerp(k1.glowRadius, k2.glowRadius, easedT);

          if (k1.fill && k2.fill) currentProps.fill = lerpColor(k1.fill, k2.fill, easedT);
          if (k1.stroke && k2.stroke) currentProps.stroke = lerpColor(k1.stroke, k2.stroke, easedT);
          if (k1.glowColor && k2.glowColor) currentProps.glowColor = lerpColor(k1.glowColor, k2.glowColor, easedT);

          if (k2.text !== undefined && rawProgress >= 0.5) currentProps.text = k2.text;
          break;
        }
      }
    }
  }

  // Expanded Motion Behaviors
  switch (element.behavior) {
    case 'shake': {
      const shakeFreq = currentTime * 45;
      currentProps.x += Math.sin(shakeFreq) * 5;
      currentProps.y += Math.cos(shakeFreq * 1.3) * 4;
      currentProps.rotation += Math.sin(shakeFreq * 0.8) * 3;
      break;
    }
    case 'pulse': {
      const pulseFactor = 1 + Math.sin(currentTime * 6) * 0.08;
      currentProps.scale *= pulseFactor;
      break;
    }
    case 'heartbeat': {
      // Classic dub-lub double heartbeat
      const cycle = (currentTime * 2) % 1;
      let thump = 0;
      if (cycle < 0.15) {
        thump = Math.sin(cycle * Math.PI / 0.15) * 0.14;
      } else if (cycle > 0.25 && cycle < 0.4) {
        thump = Math.sin((cycle - 0.25) * Math.PI / 0.15) * 0.08;
      }
      currentProps.scale *= (1 + thump);
      break;
    }
    case 'bounce': {
      // Bouncing off bottom floor
      const bounceCycle = Math.abs(Math.sin(currentTime * 4));
      currentProps.y -= bounceCycle * 25;
      // Squash when landing
      if (bounceCycle < 0.1) {
        currentProps.scale *= 1.05;
      }
      break;
    }
    case 'float': {
      currentProps.y += Math.sin(currentTime * 2.5) * 10;
      break;
    }
    case 'swing': {
      // Pendulum swing
      currentProps.rotation += Math.sin(currentTime * 3) * 12;
      break;
    }
    case 'spin': {
      currentProps.rotation = (currentProps.rotation + currentTime * 90) % 360;
      break;
    }
    case 'orbit': {
      // Orbit in a circle
      const orbitSpeed = currentTime * 2;
      currentProps.x += Math.cos(orbitSpeed) * 30;
      currentProps.y += Math.sin(orbitSpeed) * 18;
      break;
    }
    case 'neonFlicker': {
      // Rapid cyber neon light flicker
      const noise = Math.sin(currentTime * 30) + Math.sin(currentTime * 73);
      if (noise > 1.4) {
        currentProps.opacity = 0.35;
        currentProps.glowRadius = 2;
      } else {
        currentProps.glowRadius = (currentProps.glowRadius || 15) + Math.sin(currentTime * 10) * 5;
      }
      break;
    }
    case 'wave': {
      currentProps.x += Math.sin(currentTime * 3) * 12;
      currentProps.y += Math.cos(currentTime * 4) * 8;
      currentProps.rotation += Math.sin(currentTime * 2) * 4;
      break;
    }
    case 'glitch': {
      if (Math.sin(currentTime * 20) > 0.8) {
        currentProps.x += (Math.random() - 0.5) * 14;
        currentProps.opacity = 0.65;
      }
      break;
    }
  }

  return currentProps;
};
