# 2026 Portfolio

Next.js(App Router) + React Three Fiber 기반 포트폴리오 사이트입니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
```

## 구조

| 바꿀 것 | 파일 |
|---|---|
| 이름, 소개 문구, 연락처, 강점, 일하는 방식, 경력 | `src/data/site.ts` |
| 프로젝트 (웹사이트, 리포트, 리플렛) | `src/content/projects/*.md` |
| 이미지 | `public/images/` (`/images/파일명.jpg` 로 참조) |
| 이력서 PDF | `public/resume.pdf` |
| 색상, 폰트 | `src/app/globals.css` 의 `:root` + `src/lib/palette.ts` (3D 갤러리용) |
| 첫 화면 3D 갤러리 | `src/components/gallery/` |

## 프로젝트 추가하기

`src/content/projects/` 에 `.md` 파일을 하나 추가하면 메인 목록, 3D 갤러리, 상세 페이지(`/work/파일명`)에 자동으로 반영됩니다.

- `category`: `web` (웹사이트 섹션) / `report`, `leaflet` (인쇄물 섹션)
- `order`: 작을수록 앞에 표시
- `contribution`: 기획·디자인·개발 비중(%). 상세 페이지에 막대 그래프로 표시
- `metrics`: 성과 수치. 카드와 상세 페이지 상단에 강조
- `cover`, `gallery`: 이미지 경로. **3D 갤러리에도 이 이미지들이 사용됩니다.** 이미지가 없으면 프로젝트 정보로 만든 플레이스홀더 카드가 대신 표시됩니다.

웹사이트 케이스 스터디는 `web-01-corporate-site.md` 의 목차(배경과 문제 → 목표 → 나의 역할 → 과정과 의사결정 → 결과 → 회고)를 그대로 따라 쓰는 것을 권장합니다. PM 역량은 **나의 역할**과 **과정과 의사결정**에서 드러납니다.

## 3D 갤러리 동작

- 첫 화면에서 프로젝트 이미지가 원형으로 배치되어 천천히 회전합니다.
- 스크롤하면 원형에서 공간에 흩어진 배치로 바뀌고, 이후 일반 콘텐츠로 이어집니다.
- 마우스 위치에 따라 공간이 기울고, 이미지에 올리면 확대되며 하단에 프로젝트명이 표시됩니다. 클릭하면 상세 페이지로 이동합니다.
- 이미지 수가 16개보다 적으면 반복 배치해 채웁니다 (`src/app/page.tsx` 의 `MIN_GALLERY_ITEMS`).
