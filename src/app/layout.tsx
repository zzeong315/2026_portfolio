import type { Metadata } from 'next';
import Header from '@/components/Header';
import { site } from '@/data/site';
import styles from './layout.module.css';
import './globals.css';

export const metadata: Metadata = {
  title: { default: `${site.name} · Portfolio`, template: `%s — ${site.name}` },
  description: site.intro,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Noto+Serif+KR:wght@400;600&display=swap"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <footer className={styles.footer}>
          <div className="container">
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
            <span>Portfolio — Design, Build &amp; Ship</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
