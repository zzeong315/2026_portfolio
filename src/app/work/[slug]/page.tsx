import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categoryLabel, getProject, getProjects } from '@/lib/projects';
import styles from './work.module.css';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.data.title, description: project.data.summary } : {};
}

export default async function WorkPage({ params }: Params) {
  const { slug } = await params;
  const projects = getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const d = project.data;

  const info = [
    { label: 'Client', value: d.client },
    { label: 'Period', value: d.period },
    { label: 'Role', value: d.roles.join(', ') },
    { label: 'Team', value: d.team },
    { label: 'Tools', value: d.tools.join(', ') },
  ].filter((i) => i.value);

  const contribution = d.contribution
    ? [
        { key: 'planning', label: '기획', value: d.contribution.planning },
        { key: 'design', label: '디자인', value: d.contribution.design },
        { key: 'development', label: '개발', value: d.contribution.development },
      ].filter((c) => c.value > 0)
    : [];

  return (
    <article className="container">
      <header className={styles.head}>
        <div className={`label ${styles.crumbs}`}>
          <Link href="/#work">← Index</Link>
          <span>{categoryLabel[d.category]}</span>
        </div>
        <h1>{d.title}</h1>
        <p className={styles.summary}>{d.summary}</p>
      </header>

      <dl className={styles.info}>
        {info.map((i) => (
          <div key={i.label}>
            <dt className="label">{i.label}</dt>
            <dd>{i.value}</dd>
          </div>
        ))}
        {contribution.length > 0 && (
          <div className={styles.contribution}>
            <dt className="label">Contribution</dt>
            <dd>
              <div className={styles.bar}>
                {contribution.map((c) => (
                  <span key={c.key} style={{ flex: c.value, background: `var(--c-${c.key})` }} />
                ))}
              </div>
              <ul>
                {contribution.map((c) => (
                  <li key={c.key}>
                    <i style={{ background: `var(--c-${c.key})` }} />
                    {c.label} {c.value}%
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>

      {d.cover ? (
        <img src={d.cover} alt={d.title} className={styles.cover} />
      ) : (
        <div className={`${styles.cover} placeholder`}>Cover Image</div>
      )}

      {d.metrics.length > 0 && (
        <ul className={styles.metrics}>
          {d.metrics.map((m) => (
            <li key={m.label}>
              <strong>{m.value}</strong>
              <span className="label">{m.label}</span>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.prose}>
        {/* 본문은 src/content/projects 의 마크다운에서 생성 */}
        <div dangerouslySetInnerHTML={{ __html: project.html }} />
        {d.link && (
          <a href={d.link} target="_blank" rel="noopener" className={styles.visit}>
            Visit site ↗
          </a>
        )}
      </div>

      {d.gallery.length > 0 && (
        <div className={styles.gallery}>
          {d.gallery.map((g, i) => (
            <figure key={g.src}>
              <img src={g.src} alt={g.caption ?? d.title} loading="lazy" />
              <figcaption className="label">
                Fig. {i + 1}
                {g.caption && ` — ${g.caption}`}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {next.slug !== project.slug && (
        <Link href={`/work/${next.slug}`} className={styles.next}>
          <span className="label">Next</span>
          <strong>{next.data.title} →</strong>
        </Link>
      )}
    </article>
  );
}
