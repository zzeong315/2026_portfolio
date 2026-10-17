import Link from 'next/link';
import { categoryLabel, type Project } from '@/lib/projects';
import styles from './ProjectCard.module.css';

// feature: 웹사이트용 큰 이미지 교차 배치 / print: 인쇄물용 세로형 썸네일
type Props = {
  project: Project;
  index: number;
  variant?: 'feature' | 'print';
};

export default function ProjectCard({ project, index, variant = 'print' }: Props) {
  const { title, summary, cover, roles, period, metrics, category, client } = project.data;
  const label = categoryLabel[category];
  const no = String(index + 1).padStart(2, '0');
  const href = `/work/${project.slug}`;

  if (variant === 'print') {
    return (
      <Link href={href} className={styles.print}>
        {cover ? (
          <img src={cover} alt={title} loading="lazy" className={styles.thumb} />
        ) : (
          <div className={`${styles.thumb} placeholder`}>{label}</div>
        )}
        <div className={styles.caption}>
          <span className="label">
            {no} — {label}
          </span>
          <h3>{title}</h3>
          <p className="muted">{summary}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={`${styles.feature} ${index % 2 === 1 ? styles.reversed : ''}`}>
      <div className={styles.media}>
        {cover ? (
          <img src={cover} alt={title} loading="lazy" />
        ) : (
          <div className="placeholder">{label} — Cover</div>
        )}
      </div>
      <div>
        <div className={styles.top}>
          <span className={styles.no}>{no}</span>
          <span className="label">
            {client ?? label} · {period}
          </span>
        </div>
        <h3>{title}</h3>
        <p className={styles.summary}>{summary}</p>
        <p className={`label ${styles.roles}`}>{roles.join(' / ')}</p>
        {metrics.length > 0 && (
          <ul className={styles.metrics}>
            {metrics.slice(0, 3).map((m) => (
              <li key={m.label}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </li>
            ))}
          </ul>
        )}
        <span className={styles.more}>Read case study →</span>
      </div>
    </Link>
  );
}
