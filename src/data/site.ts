// 사이트 전반의 개인 정보와 문구는 이 파일 하나에서 관리합니다.
export const site = {
  name: 'Your Name',
  title: 'Product Designer & Frontend Developer',
  // 큰 세리프 헤드라인. <em>은 이탤릭 + 포인트 컬러로 표시
  headline: 'Design,<br />Build,<br />&amp; <em>Ship.</em>',
  tagline: '디자인하고, 만들고, 끝까지 출시합니다.',
  // 히어로 옆 메타 정보 (잡지 표지의 기사 정보처럼)
  meta: [
    { label: 'Role', value: 'Frontend · Design' },
    { label: 'Moving to', value: 'Product Manager' },
    { label: 'Works', value: 'Web 5 · Print 10+' },
  ],
  intro:
    '프론트엔드 개발과 디자인을 오가며 웹사이트와 인쇄물을 만들어 왔습니다. 화면을 그리고 코드로 구현하던 경험을 바탕으로, 이제는 문제를 정의하고 팀이 같은 방향으로 출시하도록 이끄는 일에 집중하고 있습니다.',
  email: 'hello@example.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
  resume: '/resume.pdf',
};

// 디자인 → 개발 → 프로덕트로 이어지는 강점
export const strengths = [
  {
    label: 'Design',
    title: '사용자 관점의 설계',
    body: '정보 구조와 UI, 리포트·리플렛 같은 편집 디자인까지. 복잡한 내용을 읽히는 형태로 정리합니다.',
  },
  {
    label: 'Build',
    title: '구현 가능한 결정',
    body: '직접 프론트엔드를 구현해 봤기에 일정과 기술 제약을 이해하고 개발자와 같은 언어로 이야기합니다.',
  },
  {
    label: 'Product',
    title: '문제 정의부터 출시까지',
    body: '요구사항을 정리하고 우선순위를 세우며, 이해관계자 사이에서 범위와 일정을 조율해 결과를 만듭니다.',
  },
];

// PM 전환을 뒷받침하는 일하는 방식
export const process = [
  { step: '01', title: 'Discover', body: '이해관계자 인터뷰, 기존 자료와 데이터 분석으로 진짜 문제를 찾습니다.' },
  { step: '02', title: 'Define', body: '목표와 성공 기준을 합의하고 요구사항과 우선순위를 문서로 정리합니다.' },
  { step: '03', title: 'Design', body: '와이어프레임과 프로토타입으로 빠르게 검증하고 피드백을 반영합니다.' },
  { step: '04', title: 'Build', body: '개발 일정과 범위를 조율하며 직접 구현에도 참여해 품질을 챙깁니다.' },
  { step: '05', title: 'Measure', body: '출시 후 지표와 피드백을 확인하고 다음 개선 과제로 연결합니다.' },
];

export const experience = [
  {
    period: '2023 — 현재',
    company: '회사명',
    role: '프론트엔드 개발 · 디자인',
    body: '웹사이트 4~5건 기획·디자인·개발, 연간 리포트 및 홍보 리플렛 디자인 담당',
  },
  {
    period: '20XX — 20XX',
    company: '이전 회사 / 학교',
    role: '직무',
    body: '주요 업무 한 줄 요약',
  },
];
