import Link from 'next/link';
import { site } from '@/data/site';
import styles from './Header.module.css';

const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'Print', href: '/#print' },
  { label: 'Process', href: '/#process' },
  { label: 'Contact', href: '/#contact' },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          {site.name}
        </Link>
        <span className={styles.issue}>Portfolio — Vol. 2026</span>
        <nav className={styles.nav}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
