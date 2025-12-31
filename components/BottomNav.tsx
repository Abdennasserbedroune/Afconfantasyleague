import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const BottomNav = () => {
  const router = useRouter();
  
  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Pick XI', path: '/my-team', icon: '⚽' },
    { name: 'Results', path: '/results', icon: '📊' },
    { name: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-border z-50 h-20 px-4">
      <div className="flex justify-between items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = router.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? 'text-accent-gold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-body font-medium uppercase tracking-tight">
                {item.name}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-1 bg-accent-gold rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
