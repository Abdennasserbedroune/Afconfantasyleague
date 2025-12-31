import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'Pick XI', href: '/my-team', icon: '⚽' },
  { label: 'Results', href: '/my-team', icon: '📊' },
  { label: 'Leaderboard', href: '/leaderboard', icon: '🏆' },
  { label: 'Profile', href: '/profile', icon: '👤' },
];

export default function BottomNav() {
  const router = useRouter();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        background: '#111826',
        borderColor: '#2D3F54',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 relative"
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{
                  color: isActive ? '#E0B700' : '#A9B4C1',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-0 w-8 h-0.5 rounded-full"
                  style={{
                    background: '#E0B700',
                    marginBottom: '-1px',
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
