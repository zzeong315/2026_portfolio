import type { Category } from '@/lib/projects';

export type GalleryItem = {
  key: string;
  slug: string;
  title: string;
  category: Category;
  meta: string;
  // 이미지가 없으면 프로젝트 정보로 만든 플레이스홀더 카드가 표시됩니다
  src?: string;
  fig: number;
};
