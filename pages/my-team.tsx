import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SlateEntry, UserTeamData } from '@/types';
import { fetchJson, formatDateTime } from '@/lib/api';
import BottomNav from '@/components/BottomNav';
import ZellijPattern from '@/components/ZellijPattern';

type TabType = 'all' | 'current' | 'upcoming';

export default function MyTeamPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>('all');
  const [data, setData] = useState<UserTeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchJson<UserTeamData>('/api/my-team');
        setData(result);
        setError(null);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#0B0F14' }}>
        <div className="px-4 py-6 pb-24">
          <div className="text-center text-muted">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: '#0B0F14' }}>
        <div className="px-4 py-6 pb-24">
          <div className="text-center" style={{ color: '#D21034' }}>
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const currentSlates = data.entries.filter((e) => e.status === 'OPEN' || e.status === 'LOCKED');
  const upcomingSlates = data.entries.filter((e) => e.status === 'OPEN');

  let displayEntries: SlateEntry[] = [];
  if (tab === 'all') {
    displayEntries = data.entries;
  } else if (tab === 'current') {
    displayEntries = currentSlates;
  } else if (tab === 'upcoming') {
    displayEntries = upcomingSlates;
  }

  const handleRowClick = (entry: SlateEntry) => {
    if (entry.status === 'OPEN') {
      router.push(`/pick-xi/${entry.slateId}`);
    } else if (entry.status === 'LOCKED') {
      // View lineup (read-only)
      router.push(`/my-team/${entry.slateId}/picks`);
    } else if (entry.status === 'SCORED') {
      // View results
      router.push(`/results/${entry.slateId}`);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'OPEN':
        return {
          background: 'rgba(24, 158, 75, 0.2)',
          color: '#34D399',
          borderColor: 'rgba(24, 158, 75, 0.3)',
        };
      case 'LOCKED':
        return {
          background: 'rgba(224, 183, 0, 0.2)',
          color: '#E0B700',
          borderColor: 'rgba(224, 183, 0, 0.3)',
        };
      case 'SCORED':
        return {
          background: 'rgba(45, 63, 84, 0.3)',
          color: '#A9B4C1',
          borderColor: 'rgba(45, 63, 84, 0.5)',
        };
      default:
        return {
          background: 'rgba(169, 180, 193, 0.15)',
          color: '#A9B4C1',
          borderColor: 'rgba(169, 180, 193, 0.3)',
        };
    }
  };

  const getStatusText = (entry: SlateEntry): string => {
    if (entry.status === 'OPEN' && entry.pickCount === 11) {
      return 'Ready';
    }
    return entry.status;
  };

  const getCtaText = (entry: SlateEntry): string => {
    if (entry.status === 'OPEN' && entry.pickCount === 11) {
      return 'View XI';
    }
    if (entry.status === 'OPEN') {
      return `Pick ${11 - entry.pickCount} more`;
    }
    if (entry.status === 'LOCKED') {
      return 'View XI';
    }
    if (entry.status === 'SCORED') {
      return 'View Results';
    }
    return 'View';
  };

  const getCtaStyle = (entry: SlateEntry) => {
    if (entry.status === 'OPEN' && entry.pickCount === 11) {
      return {
        background: '#189E4B',
        color: '#FFFFFF',
      };
    }
    if (entry.status === 'OPEN') {
      return {
        background: '#E0B700',
        color: '#0B0F14',
      };
    }
    if (entry.status === 'LOCKED') {
      return {
        background: 'transparent',
        color: '#A9B4C1',
        border: '1px solid #2D3F54',
      };
    }
    if (entry.status === 'SCORED') {
      return {
        background: '#1D4ED8',
        color: '#FFFFFF',
      };
    }
    return {
      background: '#2D3F54',
      color: '#A9B4C1',
    };
  };

  return (
    <div className="min-h-screen" style={{ background: '#0B0F14' }}>
      {/* Main Content */}
      <main className="px-4 py-6 pb-24 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6 relative">
          <ZellijPattern position="top-right" opacity={0.1} />
          <div className="relative z-10">
            <h1
              className="text-2xl font-bold uppercase tracking-wider mb-2"
              style={{
                color: '#EAF0F6',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '0.1em',
              }}
            >
              My Team
            </h1>
            <div
              className="h-0.5 w-20"
              style={{ background: '#E0B700' }}
            />
            {/* Stats Summary */}
            <div className="flex gap-6 mt-4">
              <div>
                <p
                  className="text-2xl font-bold"
                  style={{ color: '#E0B700' }}
                >
                  {data.totalPoints}
                </p>
                <p className="text-xs uppercase tracking-wider" style={{ color: '#A9B4C1' }}>
                  Total Points
                </p>
              </div>
              <div>
                <p
                  className="text-2xl font-bold"
                  style={{ color: '#EAF0F6' }}
                >
                  {data.slatesPlayed}
                </p>
                <p className="text-xs uppercase tracking-wider" style={{ color: '#A9B4C1' }}>
                  Slates Played
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('all')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm uppercase transition-all ${
              tab === 'all' ? 'scale-105' : 'opacity-60'
            }`}
            style={{
              background: tab === 'all' ? '#E0B700' : '#1A2636',
              color: tab === 'all' ? '#0B0F14' : '#EAF0F6',
              border: tab === 'all' ? 'none' : '1px solid #2D3F54',
            }}
          >
            All
          </button>
          <button
            onClick={() => setTab('current')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm uppercase transition-all ${
              tab === 'current' ? 'scale-105' : 'opacity-60'
            }`}
            style={{
              background: tab === 'current' ? '#E0B700' : '#1A2636',
              color: tab === 'current' ? '#0B0F14' : '#EAF0F6',
              border: tab === 'current' ? 'none' : '1px solid #2D3F54',
            }}
          >
            Current
          </button>
          <button
            onClick={() => setTab('upcoming')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm uppercase transition-all ${
              tab === 'upcoming' ? 'scale-105' : 'opacity-60'
            }`}
            style={{
              background: tab === 'upcoming' ? '#E0B700' : '#1A2636',
              color: tab === 'upcoming' ? '#0B0F14' : '#EAF0F6',
              border: tab === 'upcoming' ? 'none' : '1px solid #2D3F54',
            }}
          >
            Upcoming
          </button>
        </div>

        {/* Entries List */}
        <div className="space-y-3">
          {displayEntries.length === 0 ? (
            <div
              className="text-center py-12 rounded-xl"
              style={{
                background: '#111826',
                border: '1px solid #2D3F54',
              }}
            >
              <p className="text-muted mb-3">No entries to display for this tab.</p>
              <Link
                href="/"
                className="inline-block px-6 py-2 rounded-lg font-semibold"
                style={{
                  background: '#E0B700',
                  color: '#0B0F14',
                }}
              >
                View Active Slates
              </Link>
            </div>
          ) : (
            displayEntries.map((entry) => (
              <div
                key={entry.slateId}
                onClick={() => handleRowClick(entry)}
                className="rounded-xl overflow-hidden transition-all hover:scale-[1.01] cursor-pointer"
                style={{
                  background: '#111826',
                  border: '1px solid #2D3F54',
                }}
              >
                <div className="flex items-center justify-between p-4">
                  {/* Left: Slate Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold" style={{ color: '#EAF0F6' }}>
                        {entry.slateName}
                      </p>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                        style={{
                          ...getStatusBadgeStyle(entry.status),
                          border: `1px solid ${getStatusBadgeStyle(entry.status).borderColor}`,
                        }}
                      >
                        {getStatusText(entry)}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: '#A9B4C1' }}>
                      {formatDateTime(entry.date)}
                    </p>
                  </div>

                  {/* Right: Points & CTA */}
                  <div className="text-right ml-4">
                    {entry.status === 'SCORED' && (
                      <p
                        className="text-2xl font-bold mb-2"
                        style={{ color: '#E0B700' }}
                      >
                        {entry.points ?? '—'}
                      </p>
                    )}
                    <span
                      className="px-4 py-2 rounded-lg text-xs font-bold uppercase inline-block"
                      style={getCtaStyle(entry)}
                    >
                      {getCtaText(entry)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar (for OPEN slates) */}
                {entry.status === 'OPEN' && (
                  <div className="px-4 pb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#A9B4C1' }}>
                        {entry.pickCount}/11 players
                      </span>
                      <span style={{ color: '#E0B700' }}>
                        {Math.round((entry.pickCount / 11) * 100)}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: '#1A2636' }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(entry.pickCount / 11) * 100}%`,
                          background: entry.pickCount === 11 ? '#189E4B' : '#E0B700',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
