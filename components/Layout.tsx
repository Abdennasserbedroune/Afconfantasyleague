import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const isHomePage = router.pathname === '/';
  const isLeaderboardPage = router.pathname === '/leaderboard';
  const isMyTeamPage = router.pathname.startsWith('/my-team');

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setMenuOpen(false);
      await router.push('/');
    }
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div className={styles.logo}>
              <Link href="/">Fantasy Tournament</Link>
            </div>

            <button
              className={styles.mobileToggle}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>

            <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
              <Link
                href="/"
                className={isHomePage ? styles.active : ''}
                onClick={handleNavClick}
              >
                Home
              </Link>
              <Link
                href="/leaderboard"
                className={isLeaderboardPage ? styles.active : ''}
                onClick={handleNavClick}
              >
                Leaderboard
              </Link>
              <Link
                href="/my-team"
                className={isMyTeamPage ? styles.active : ''}
                onClick={handleNavClick}
              >
                My Team
              </Link>
              <button type="button" className={styles.navButton} onClick={handleLogout}>
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerLinks}>
            <Link href="/tournament-dates">Tournament dates</Link>
            <span>•</span>
            <Link href="/help">Help</Link>
            <span>•</span>
            <Link href="/about">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
