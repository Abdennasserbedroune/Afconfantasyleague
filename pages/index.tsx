import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Slate, Fixture } from '@/types';
import { fetchJson } from '@/lib/api';
import CountdownPill from '@/components/CountdownPill';
import MatchTile from '@/components/MatchTile';
import ZellijPattern from '@/components/ZellijPattern';
import BottomNav from '@/components/BottomNav';

interface BootstrapData {
  nextSlate: {
    id: string;
    name: string;
    lockAt: string;
  } | null;
  slates: Array<{
    id: string;
    name: string;
    lockAt: string;
    status: string;
    fixtureCount: number;
  }>;
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [bootstrapData, setBootstrapData] = useState<BootstrapData | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchJson<BootstrapData>('/api/bootstrap');
        setBootstrapData(data);

        if (data.nextSlate) {
          // Fetch fixtures for the next slate
          const fixturesResponse = await fetchJson<Fixture[]>(`/api/slates/${data.nextSlate.id}/fixtures`);
          setFixtures(fixturesResponse);
        }
      } catch (error) {
        console.error('Failed to load bootstrap data:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#0B0F14' }}>
        <div className="px-4 py-6 pb-24">
          <div className="text-center text-muted">Loading...</div>
        </div>
      </div>
    );
  }

  const nextSlate = bootstrapData?.nextSlate;

  return (
    <div className="min-h-screen" style={{ background: '#0B0F14' }}>
      {/* Main Content */}
      <main className="px-4 py-6 pb-24 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6 relative">
          <ZellijPattern position="top-right" opacity={0.12} />
          <div className="relative z-10">
            <h1
              className="text-2xl font-bold uppercase tracking-wider"
              style={{
                color: '#EAF0F6',
                fontFamily: 'system-ui, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              AFCON 2025
            </h1>
            <div
              className="h-0.5 w-20 mt-1"
              style={{ background: '#E0B700' }}
            />
            <p className="text-sm mt-2" style={{ color: '#A9B4C1' }}>
              Daily Fantasy Slate
            </p>
          </div>
        </header>

        {/* Today's Slate Card */}
        {nextSlate ? (
          <div
            className="relative rounded-2xl overflow-hidden mb-6"
            style={{
              background: 'linear-gradient(135deg, #111826 0%, #1A2636 100%)',
              border: '2px solid #E0B700',
              padding: '20px',
            }}
          >
            {/* Zellij Pattern (subtle) */}
            <ZellijPattern position="bottom-left" opacity={0.06} size={150} />

            {/* Date */}
            <div className="relative z-10 mb-4">
              <p
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: '#A9B4C1' }}
              >
                {formatDate(nextSlate.lockAt)}
              </p>
            </div>

            {/* Fixtures */}
            {fixtures.length > 0 && (
              <div className="relative z-10 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                <div className="flex gap-3">
                  {fixtures.map((fixture) => (
                    <MatchTile key={fixture.id} fixture={fixture} />
                  ))}
                </div>
              </div>
            )}

            {/* Lock Countdown */}
            <div className="relative z-10 flex justify-end mb-4">
              <CountdownPill deadline={nextSlate.lockAt} status="OPEN" />
            </div>

            {/* CTA Button */}
            <Link
              href={nextSlate.id ? `/pick-xi/${nextSlate.id}` : '/my-team'}
              className="relative z-10 block w-full text-center py-3 px-6 rounded-xl font-bold text-base uppercase tracking-wider transition-all hover:scale-[1.02]"
              style={{
                background: '#E0B700',
                color: '#0B0F14',
              }}
            >
              Pick Your XI
            </Link>

            {/* Microcopy */}
            <div className="relative z-10 mt-4 space-y-1">
              <p className="text-xs text-center" style={{ color: '#A9B4C1' }}>
                • Player pool: teams playing today only
              </p>
              <p className="text-xs text-center" style={{ color: '#A9B4C1' }}>
                • Locks at first kickoff
              </p>
              <p className="text-xs text-center" style={{ color: '#A9B4C1' }}>
                • Your XI is editable until locked
              </p>
            </div>
          </div>
        ) : (
          <div
            className="relative rounded-2xl overflow-hidden mb-6"
            style={{
              background: 'linear-gradient(135deg, #111826 0%, #1A2636 100%)',
              border: '2px solid #2D3F54',
              padding: '20px',
            }}
          >
            <div className="text-center py-8">
              <p className="text-lg font-semibold mb-2" style={{ color: '#EAF0F6' }}>
                No Active Slate
              </p>
              <p className="text-sm" style={{ color: '#A9B4C1' }}>
                Check back later for the next fantasy slate
              </p>
            </div>
          </div>
        )}

        {/* Next Slate Card (Preview) */}
        {bootstrapData?.slates && bootstrapData.slates.length > 1 && (
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #111826 0%, #1A2636 100%)',
              border: '2px solid #2D3F54',
              padding: '20px',
              opacity: 0.6,
            }}
          >
            <p
              className="text-xs font-medium uppercase tracking-wider mb-2"
              style={{ color: '#A9B4C1' }}
            >
              Next Slate
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: '#EAF0F6' }}>
                  {bootstrapData.slates[1].name}
                </p>
                <p className="text-xs mt-1" style={{ color: '#A9B4C1' }}>
                  {bootstrapData.slates[1].fixtureCount} matches
                </p>
              </div>
              <div
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: '#2D3F54',
                  color: '#A9B4C1',
                }}
              >
                Coming Soon
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link
            href="/leaderboard"
            className="p-4 rounded-xl text-center transition-all hover:scale-[1.02]"
            style={{
              background: '#111826',
              border: '1px solid #2D3F54',
            }}
          >
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#EAF0F6' }}>
              Leaderboard
            </p>
            <p className="text-xs" style={{ color: '#A9B4C1' }}>
              View rankings
            </p>
          </Link>

          <Link
            href="/my-team"
            className="p-4 rounded-xl text-center transition-all hover:scale-[1.02]"
            style={{
              background: '#111826',
              border: '1px solid #2D3F54',
            }}
          >
            <div className="text-2xl mb-2">⚽</div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#EAF0F6' }}>
              My Team
            </p>
            <p className="text-xs" style={{ color: '#A9B4C1' }}>
              View entries
            </p>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
