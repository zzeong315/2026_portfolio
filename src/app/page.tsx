import ProjectCard from '@/components/ProjectCard';
import HeroGallery from '@/components/gallery/HeroGallery';
import type { GalleryItem } from '@/components/gallery/types';
import { categoryLabel, getProjects, type Project } from '@/lib/projects';
import { site, strengths, process, experience } from '@/data/site';
import styles from './home.module.css';

const roman = ['I', 'II', 'III', 'IV', 'V'];

// 갤러리가 비어 보이지 않도록 최소 개수만큼 프로젝트 이미지를 반복 배치
const MIN_GALLERY_ITEMS = 16;

function toGalleryItems(projects: Project[]): GalleryItem[] {
  const base = projects.flatMap((p) => {
    const images = [p.data.cover, ...p.data.gallery.map((g) => g.src)].filter(
      (src): src is string => Boolean(src),
    );
    const common = {
      slug: p.slug,
      title: p.data.title,
      category: p.data.category,
      meta: `${categoryLabel[p.data.category]} — ${p.data.roles.join(', ')}`,
    };
    return images.length > 0 ? images.map((src) => ({ ...common, src })) : [{ ...common }];
  });
  if (base.length === 0) return [];

  const count = Math.max(MIN_GALLERY_ITEMS, base.length);
  return Array.from({ length: count }, (_, i) => ({
    ...base[i % base.length],
    key: `${base[i % base.length].slug}-${i}`,
    fig: i + 1,
  }));
}

export default function Home() {
  const projects = getProjects();
  const webProjects = projects.filter((p) => p.data.category === 'web');
  const printProjects = projects.filter((p) => p.data.category !== 'web');

  return (
    <>
      <HeroGallery items={toGalleryItems(projects)} name={site.name} title={site.title} />

      {/* Cover: 잡지 표지 */}
      <section className={`container ${styles.hero}`}>
        <div className={`label ${styles.heroTop}`}>
          <span>No. 01</span>
          <span>{site.title}</span>
          <span>{new Date().getFullYear()}</span>
        </div>
        <h1 dangerouslySetInnerHTML={{ __html: site.headline }} />
        <div className={styles.heroBottom}>
          <p className={styles.tagline}>{site.tagline}</p>
          <p className={styles.intro}>{site.intro}</p>
          <dl className={styles.meta}>
            {site.meta.map((m) => (
              <div key={m.label}>
                <dt className="label">{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Strengths */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span>Chapter I</span>
              <span>What I bring</span>
            </div>
            <h2 className="section-title">
              Design × Code × <em>Product</em>
            </h2>
          </div>
          <div className={styles.strengths}>
            {strengths.map((s, i) => (
              <div key={s.label} className={styles.strength}>
                <span className={styles.roman}>{roman[i]}.</span>
                <p className="label">{s.label}</p>
                <h3>{s.title}</h3>
                <p className="muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Web projects */}
      <section id="work" className="section">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span>Chapter II</span>
              <span>{webProjects.length} Projects</span>
            </div>
            <h2 className="section-title">
              Selected <em>Work</em>
            </h2>
            <p className="section-desc">기획부터 디자인, 개발, 출시까지 맡은 웹사이트 프로젝트</p>
          </div>
          <div>
            {webProjects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} variant="feature" />
            ))}
          </div>
        </div>
      </section>

      {/* Print */}
      <section id="print" className="section">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span>Chapter III</span>
              <span>Report &amp; Leaflet</span>
            </div>
            <h2 className="section-title">
              Print &amp; <em>Editorial</em>
            </h2>
            <p className="section-desc">복잡한 정보를 읽히는 형태로 정리한 리포트와 리플렛</p>
          </div>
          <div className={styles.gridPrint}>
            {printProjects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span>Chapter IV</span>
              <span>How I work</span>
            </div>
            <h2 className="section-title">
              From problem <em>to</em> launch
            </h2>
          </div>
          <ol className={styles.process}>
            {process.map((p) => (
              <li key={p.step}>
                <span className={styles.step}>{p.step}</span>
                <h3>{p.title}</h3>
                <p className="muted">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Experience */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span>Chapter V</span>
              <span>Experience</span>
            </div>
            <h2 className="section-title">Career</h2>
          </div>
          <ul className={styles.timeline}>
            {experience.map((e) => (
              <li key={e.period + e.company}>
                <span className="label">{e.period}</span>
                <h3>{e.company}</h3>
                <div>
                  <p className={styles.role}>{e.role}</p>
                  <p className="muted">{e.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className={`container ${styles.contact}`}>
          <div className="section-head">
            <div className="kicker">
              <span>Fin.</span>
              <span>Contact</span>
            </div>
          </div>
          <h2 className={styles.big}>
            Let&apos;s make
            <br />
            <em>something</em> together.
          </h2>
          <a className={styles.mail} href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className={styles.links}>
            {site.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener">
                {l.label} ↗
              </a>
            ))}
            <a href={site.resume}>Résumé PDF ↓</a>
          </div>
        </div>
      </section>
    </>
  );
}
