import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Slate, Fixture } from '@/types';
import CountdownPill from '@/components/CountdownPill';
import FixtureCarousel from '@/components/FixtureCarousel';

export default function HomePage() {
  const [data, setData] = useState<{ todaySlate: Slate | null, nextSlate: Slate | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/home')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-accent-gold font-heading text-2xl animate-pulse">Loading Slate...</div>
      </div>
    );
  }

  const todaySlate = data?.todaySlate;
  const nextSlate = data?.nextSlate;

  return (
    <div className="px-4 py-6 space-y-8 max-w-2xl mx-auto relative">
      {/* Zellij Pattern Top Right */}
      <div className="zellij-pattern zellij-tr opacity-10" />

      <header className="relative z-10">
        <h1 className="text-3xl text-text-primary mb-1">AFCON 2025</h1>
        <div className="h-1 w-12 bg-accent-gold mb-1" />
        <p className="text-text-secondary text-sm">Daily Fantasy Slate</p>
      </header>

      {/* Today's Slate Hero Card */}
      {todaySlate ? (
        <section className="relative z-10">
          <div className="bg-gradient-to-br from-dark-surface to-dark-surface2 rounded-3xl p-6 border-2 border-accent-gold shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-text-secondary text-xs uppercase font-bold tracking-widest mb-1">Today's Slate</p>
                <h2 className="text-2xl text-text-primary">{todaySlate.name}</h2>
                <p className="text-text-secondary text-xs mt-1">
                  {new Date(todaySlate.date).toLocaleDateString('en-GB', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <CountdownPill deadline={todaySlate.lockAt} status={todaySlate.status} />
            </div>

            <div className="mb-8">
              <p className="text-text-secondary text-[10px] uppercase font-bold mb-3 tracking-tighter">Matchday Fixtures</p>
              <FixtureCarousel fixtures={todaySlate.fixtures} />
            </div>

            <Link 
              href={todaySlate.status === 'OPEN' ? '/my-team' : `/slate/${todaySlate.id}`}
              className={`block w-full py-4 rounded-xl font-heading text-xl text-center transition-all ${
                todaySlate.status === 'OPEN' 
                  ? 'bg-accent-gold text-dark-bg hover:bg-opacity-90 active:scale-[0.98]' 
                  : 'bg-dark-border text-text-secondary cursor-not-allowed'
              }`}
            >
              {todaySlate.status === 'OPEN' ? 'PICK YOUR XI' : 'VIEW LINEUP'}
            </Link>
            
            <div className="mt-4 flex flex-col space-y-1">
              <p className="text-[10px] text-text-secondary text-center italic">"Player pool: teams playing today only"</p>
              <p className="text-[10px] text-text-secondary text-center italic">"Locks at first kickoff"</p>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-dark-surface p-8 rounded-3xl border border-dark-border text-center">
          <p className="text-text-secondary font-heading">No active slates found</p>
        </div>
      )}

      {/* Next Slate Secondary Card */}
      {nextSlate && (
        <section className="opacity-50 grayscale relative z-10">
          <div className="bg-dark-surface rounded-3xl p-6 border border-dark-border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-text-secondary text-xs uppercase font-bold tracking-widest mb-1">Next Slate</p>
                <h2 className="text-xl text-text-primary">{nextSlate.name}</h2>
                <p className="text-text-secondary text-xs mt-1">
                  {new Date(nextSlate.date).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long'
                  })}
                </p>
              </div>
              <div className="bg-dark-border px-3 py-1 rounded-full text-[10px] font-bold text-text-secondary uppercase">
                UPCOMING
              </div>
            </div>
            
            <div className="mb-6 pointer-events-none">
              <FixtureCarousel fixtures={nextSlate.fixtures} />
            </div>

            <button disabled className="w-full py-3 rounded-xl bg-dark-border text-text-secondary font-heading text-lg cursor-not-allowed">
              AVAILABLE AT {new Date(nextSlate.lockAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </button>
          </div>
        </section>
      )}

      {/* Zellij Pattern Bottom Left */}
      <div className="zellij-pattern zellij-bl opacity-10" />
      
      <div className="h-20" /> {/* Spacer for bottom nav */}
    </div>
  );
}
