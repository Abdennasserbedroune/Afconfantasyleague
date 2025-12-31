import React from 'react';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dark-bg text-text-primary font-body pb-24">
      <main className="relative overflow-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
