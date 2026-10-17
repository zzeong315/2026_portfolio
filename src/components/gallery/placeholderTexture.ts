import * as THREE from 'three';
import { palette } from '@/lib/palette';
import type { GalleryItem } from './types';

// 실제 이미지가 들어오기 전까지 쓰는 잡지 도판 스타일 카드
const themes = [
  { bg: palette.plum, fg: palette.cream, accent: palette.pear },
  { bg: palette.pear, fg: palette.soil, accent: palette.plum },
  { bg: palette.soil, fg: palette.cream, accent: palette.pear },
  { bg: palette.creamDeep, fg: palette.plum, accent: palette.soil },
];

const SERIF = '"Instrument Serif", "Noto Serif KR", Georgia, serif';
const SANS = '"Pretendard Variable", Pretendard, system-ui, sans-serif';

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = word;
    // 한 단어가 너무 길면 글자 단위로 자름
    while (ctx.measureText(line).width > maxWidth && line.length > 1) {
      let cut = line.length - 1;
      while (cut > 1 && ctx.measureText(line.slice(0, cut)).width > maxWidth) cut--;
      lines.push(line.slice(0, cut));
      line = line.slice(cut);
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function makePlaceholderTexture(item: GalleryItem, aspect: number): THREE.CanvasTexture {
  const w = 600;
  const h = Math.round(w / aspect);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const theme = themes[(item.fig - 1) % themes.length];
  const pad = 40;

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, w, h);

  // 머리 괘선과 도판 번호
  ctx.fillStyle = theme.fg;
  ctx.fillRect(pad, pad, w - pad * 2, 3);
  ctx.font = `600 20px ${SANS}`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(`FIG. ${String(item.fig).padStart(2, '0')}`, pad, pad + 16);
  ctx.textAlign = 'right';
  ctx.fillText(item.category.toUpperCase(), w - pad, pad + 16);

  // 큰 이탤릭 숫자
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = theme.accent;
  ctx.font = `italic ${Math.round(h * 0.42)}px ${SERIF}`;
  ctx.fillText(String(item.fig).padStart(2, '0'), pad - 6, h * 0.62);

  // 제목 (아래에서 위로)
  ctx.fillStyle = theme.fg;
  ctx.font = `56px ${SERIF}`;
  const lines = wrapText(ctx, item.title, w - pad * 2);
  const lineHeight = 62;
  lines.forEach((line, i) => {
    ctx.fillText(line, pad, h - pad - (lines.length - 1 - i) * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
