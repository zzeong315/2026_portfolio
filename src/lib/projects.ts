import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { z } from 'zod';

const schema = z.object({
  title: z.string(),
  summary: z.string(),
  // web: 웹사이트 케이스 스터디 / report: 리포트 디자인 / leaflet: 리플렛·인쇄물
  category: z.enum(['web', 'report', 'leaflet']),
  client: z.string().optional(),
  // 2024.05 처럼 숫자로 읽히는 값도 문자열로 받음
  period: z.coerce.string(),
  roles: z.array(z.string()),
  team: z.string().optional(),
  tools: z.array(z.string()).default([]),
  // 기획·디자인·개발 비중(%). PM 역량을 보여주는 핵심 지표
  contribution: z
    .object({
      planning: z.number().default(0),
      design: z.number().default(0),
      development: z.number().default(0),
    })
    .optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.coerce.string() })).default([]),
  cover: z.string().optional(),
  gallery: z.array(z.object({ src: z.string(), caption: z.string().optional() })).default([]),
  link: z.string().url().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(99),
});

export type ProjectData = z.infer<typeof schema>;
export type Category = ProjectData['category'];
export type Project = { slug: string; data: ProjectData; html: string };

export const categoryLabel: Record<Category, string> = {
  web: 'Website',
  report: 'Report',
  leaflet: 'Leaflet',
};

const dir = path.join(process.cwd(), 'src/content/projects');

export function getProjects(): Project[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`${file} frontmatter 오류: ${parsed.error.message}`);
      }
      return {
        slug: file.replace(/\.md$/, ''),
        data: parsed.data,
        html: marked.parse(content, { async: false }),
      };
    })
    .sort((a, b) => a.data.order - b.data.order);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}
