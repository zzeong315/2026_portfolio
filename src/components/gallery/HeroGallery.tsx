'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { GalleryItem } from './types';
import styles from './HeroGallery.module.css';

// three.js 는 브라우저에서만 동작하므로 서버 렌더링에서 제외
const GalleryScene = dynamic(() => import('./GalleryScene'), { ssr: false });

type Props = {
  items: GalleryItem[];
  name: string;
  title: string;
};

export default function HeroGallery({ items, name, title }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [hovered, setHovered] = useState<GalleryItem | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // 플레이스홀더 카드에 글자를 그리기 전에 웹폰트 로딩을 기다림 (최대 1.2초)
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const titles = items.map((i) => i.title).join('');
    const fonts = Promise.all([
      document.fonts.load('56px "Instrument Serif"'),
      document.fonts.load('italic 56px "Instrument Serif"'),
      document.fonts.load('56px "Noto Serif KR"', titles),
      document.fonts.load('600 20px "Pretendard Variable"'),
    ]);
    const timeout = new Promise((resolve) => setTimeout(resolve, 1200));
    Promise.race([fonts, timeout])
      .catch(() => {})
      .finally(() => setFontsReady(true));
  }, [items]);

  // 섹션을 지나가는 동안의 스크롤 진행도(0~1)를 3D 장면에 전달
  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      progress.current = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 0;
      // 가운데 이름이 흩어지는 카드와 겹치지 않도록 CSS 에서 페이드아웃에 사용
      el.style.setProperty('--progress', String(progress.current));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} aria-label="프로젝트 갤러리">
      <div className={styles.stage}>
        <div className={styles.canvas}>
          {fontsReady && (
            <GalleryScene
              items={items}
              progress={progress}
              onHover={setHovered}
              reducedMotion={reducedMotion}
            />
          )}
        </div>

        <div className={styles.center}>
          <p className={styles.name}>{name}</p>
          <p className="label">{title}</p>
        </div>

        <div className={styles.caption} aria-live="polite">
          {hovered ? (
            <>
              <strong>{hovered.title}</strong>
              <span>{hovered.meta}</span>
            </>
          ) : (
            <span className="label">Scroll to explore ↓</span>
          )}
        </div>

        <a href="#work" className={`label ${styles.skip}`}>
          Index ↓
        </a>
      </div>
    </section>
  );
}
