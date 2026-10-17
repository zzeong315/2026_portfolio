'use client';

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { makePlaceholderTexture } from './placeholderTexture';
import type { GalleryItem } from './types';

type SceneProps = {
  items: GalleryItem[];
  // 0 = 원형 배치, 1 = 흩어진 배치. 스크롤에 따라 부모가 갱신
  progress: RefObject<number>;
  onHover: (item: GalleryItem | null) => void;
  reducedMotion: boolean;
};

type Slot = { angle: number; cloud: THREE.Vector3; cloudScale: number };

type CardProps = {
  item: GalleryItem;
  index: number;
  slot: Slot;
  spin: RefObject<number>;
  progress: RefObject<number>;
  hovered: number | null;
  setHovered: (index: number | null) => void;
};

const placeholderAspect = { web: 4 / 3, report: 3 / 4, leaflet: 3 / 4 };

const { lerp, damp } = THREE.MathUtils;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

// 새로고침해도 같은 배치가 나오도록 시드 고정 난수
function seededRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function GalleryScene(props: SceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 35 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <Gallery {...props} />
    </Canvas>
  );
}

function Gallery({ items, progress, onHover, reducedMotion }: SceneProps) {
  const group = useRef<THREE.Group>(null!);
  const spin = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const slots = useMemo<Slot[]>(() => {
    const rand = seededRandom(7);
    return items.map((_, i) => ({
      angle: (i / items.length) * Math.PI * 2 + Math.PI / 2,
      cloud: new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 3.5 - 2.5),
      cloudScale: 0.75 + rand() * 1.1,
    }));
  }, [items]);

  const handleHover = (index: number | null) => {
    setHovered(index);
    onHover(index === null ? null : items[index]);
    document.body.style.cursor = index === null ? '' : 'pointer';
  };

  useEffect(() => () => void (document.body.style.cursor = ''), []);

  useFrame((state, delta) => {
    // 천천히 회전하다가 hover 하면 멈춤. 스크롤하면 추가로 회전
    if (!reducedMotion && hovered === null) spin.current += delta * 0.05;
    // 마우스 위치에 따라 공간 전체가 살짝 기울어짐
    const g = group.current;
    g.rotation.x = damp(g.rotation.x, -state.pointer.y * 0.12, 3, delta);
    g.rotation.y = damp(g.rotation.y, state.pointer.x * 0.18, 3, delta);
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <Card
          key={item.key}
          item={item}
          index={i}
          slot={slots[i]}
          spin={spin}
          progress={progress}
          hovered={hovered}
          setHovered={handleHover}
        />
      ))}
    </group>
  );
}

function Card(props: CardProps) {
  return props.item.src ? (
    <Suspense fallback={null}>
      <ImageCard {...props} src={props.item.src} />
    </Suspense>
  ) : (
    <PlaceholderCard {...props} />
  );
}

function ImageCard({ src, ...props }: CardProps & { src: string }) {
  const texture = useLoader(THREE.TextureLoader, src);
  texture.colorSpace = THREE.SRGBColorSpace;
  const image = texture.image as HTMLImageElement;
  return <CardMesh {...props} texture={texture} aspect={image.width / image.height} />;
}

function PlaceholderCard(props: CardProps) {
  const aspect = placeholderAspect[props.item.category];
  const texture = useMemo(() => makePlaceholderTexture(props.item, aspect), [props.item, aspect]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <CardMesh {...props} texture={texture} aspect={aspect} />;
}

function CardMesh({
  item,
  index,
  slot,
  spin,
  progress,
  hovered,
  setHovered,
  texture,
  aspect,
}: CardProps & { texture: THREE.Texture; aspect: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const material = useRef<THREE.MeshBasicMaterial>(null!);
  const target = useMemo(() => new THREE.Vector3(), []);
  const viewport = useThree((s) => s.viewport);
  const router = useRouter();

  // 처음 한 번만 아주 작게 시작해서 가운데에서 퍼져나오도록 함
  // (scale 을 prop 으로 주면 리렌더마다 초기화됨)
  useLayoutEffect(() => {
    mesh.current.scale.set(0.001, 0.001, 1);
  }, []);

  useFrame((_, delta) => {
    const t = smoothstep(progress.current ?? 0);
    const base = Math.min(viewport.width, viewport.height);
    const isHovered = hovered === index;

    // 원형 위치와 흩어진 위치 사이를 스크롤 진행도로 보간
    const angle = slot.angle + (spin.current ?? 0) + t * 0.8;
    const radius = base * 0.32;
    target.set(
      lerp(Math.cos(angle) * radius, slot.cloud.x * viewport.width * 0.42, t),
      lerp(Math.sin(angle) * radius, slot.cloud.y * viewport.height * 0.4, t),
      lerp(0, slot.cloud.z, t) + (isHovered ? 0.8 : 0),
    );
    // 프레임 속도와 상관없이 같은 속도로 따라가도록 시간 기반 감쇠
    const { position, scale } = mesh.current;
    position.x = damp(position.x, target.x, 5, delta);
    position.y = damp(position.y, target.y, 5, delta);
    position.z = damp(position.z, target.z, 5, delta);

    // 같은 면적을 유지하면서 이미지 비율대로 크기 지정
    const size = base * 0.1 * lerp(1, slot.cloudScale, t) * (isHovered ? 1.2 : 1);
    const ratio = Math.sqrt(aspect);
    scale.x = damp(scale.x, size * ratio, 6, delta);
    scale.y = damp(scale.y, size / ratio, 6, delta);

    // hover 중인 카드 외에는 흐리게
    const opacity = hovered === null || isHovered ? 1 : 0.3;
    material.current.opacity = damp(material.current.opacity, opacity, 5, delta);
  });

  return (
    <mesh
      ref={mesh}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(index);
      }}
      onPointerOut={() => setHovered(null)}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/work/${item.slug}`);
      }}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial ref={material} map={texture} transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}
