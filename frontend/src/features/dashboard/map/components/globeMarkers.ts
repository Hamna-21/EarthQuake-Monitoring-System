import * as THREE from 'three';
import type { Earthquake } from '@/types';
import { globeMarkerScale, markerColor as colorForMagnitude } from './markerDesign';

const textureCache = new Map<string, THREE.CanvasTexture>();
const materialCache = new Map<string, THREE.SpriteMaterial>();

export function markerColor(magnitude: number) {
  return colorForMagnitude(magnitude);
}

export function createGlobeMarker(event: Earthquake, selected: boolean, strongest: boolean, large = true) {
  const color = strongest ? '#ff2f2f' : markerColor(event.magnitude);
  const scale = globeMarkerScale(event.magnitude, large) * (selected || strongest ? 1.14 : 1);
  const strong = selected || strongest;
  const materialKey = `${color}-${strong ? 'strong' : 'normal'}`;
  let material = materialCache.get(materialKey);
  if (!material) {
    material = new THREE.SpriteMaterial({ map: tackTexture(color, strong), transparent: true, depthTest: true, depthWrite: false, sizeAttenuation: true });
    materialCache.set(materialKey, material);
  }
  const sprite = new THREE.Sprite(material);
  sprite.center.set(0.5, large ? 0.06 : 0.08);
  sprite.scale.set(scale * (large ? 1.9 : 1.42), scale * (large ? 3.18 : 2.38), 1);
  sprite.renderOrder = 40;
  return sprite;
}

function tackTexture(color: string, strong: boolean) {
  const key = `${color}-${strong ? 'strong' : 'normal'}`;
  const cached = textureCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 192);
  ctx.shadowColor = 'rgba(0,0,0,.42)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = stemGradient(ctx);
  ctx.beginPath();
  ctx.roundRect(61, 58, 6, 110, 3);
  ctx.fill();
  ctx.shadowBlur = 18;
  const ball = ctx.createRadialGradient(46, 34, 8, 64, 52, 50);
  ball.addColorStop(0, '#ffffff');
  ball.addColorStop(0.18, color);
  ball.addColorStop(1, shade(color));
  ctx.fillStyle = ball;
  ctx.beginPath();
  ctx.arc(64, 52, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = strong ? 7 : 5;
  ctx.strokeStyle = strong ? '#ffffff' : 'rgba(255,255,255,.92)';
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,.62)';
  ctx.beginPath();
  ctx.ellipse(49, 34, 12, 8, -0.45, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}

function stemGradient(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(58, 58, 70, 168);
  gradient.addColorStop(0, '#f8fafc');
  gradient.addColorStop(0.5, '#94a3b8');
  gradient.addColorStop(1, '#111827');
  return gradient;
}

function shade(color: string) {
  return color === '#fde047' ? '#a16207' : color === '#38d9f3' ? '#0369a1' : color === '#2563eb' ? '#1e3a8a' : color === '#8b5cf6' ? '#4c1d95' : color === '#f97316' ? '#9a3412' : '#991b1b';
}
