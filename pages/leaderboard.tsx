import React, { useEffect, useMemo, useState } from 'react';
import { LeaderboardEntry } from '@/types';
import { fetchJson } from '@/lib/api';
import BottomNav from '@/components/BottomNav';
import ZellijPattern from '@/components/ZellijPattern';

const REFRESH_INTERVAL_MS = 30000;
const ITEMS_PER_PAGE = 20;

type LeaderboardApiRow = Partial<LeaderboardEntry> & {
  teamName: string;
  totalPoints: number;
  slatesPlayed: number;
  lastUpdate?: string;
  lastUpdatedAt?: string;
  updatedAt?: string;
  isMyTeam?: boolean;
};

type TabType = 'today' | 'overall';

export default function LeaderboardPage() {
  const [rawData, setRawData] = useState<LeaderboardApiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [myTeamData, setMyTeamData] = useState<LeaderboardEntry | null>(null);

  const loadData = async () => {
    try {
      const result = await fetchJson<LeaderboardApiRow[]>('/api/leaderboard');
      setRawData(result);
      setError(null);

      // Find and store my team data
      const myTeam = result.find((row) => row.isMyTeam);
      if (myTeam) {
        const myTeamEntry: LeaderboardEntry = {
          rank: 0, // Will be calculated after sorting
          teamName: myTeam.teamName || '',
          totalPoints: myTeam.totalPoints ?? 0,
          slatesPlayed: myTeam.slatesPlayed ?? 0,
          lastUpdate: myTeam.lastUpdate || myTeam.lastUpdatedAt || myTeam.updatedAt || '',
          isMyTeam: true,
        };
        setMyTeamData(myTeamEntry);
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();

    const intervalId = setInterval(() => {
      void loadData();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  const data = useMemo<LeaderboardEntry[]>(() => {
    const sorted = [...rawData].sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));

    return sorted.map((row, idx) => {
      const lastUpdate = row.lastUpdate ?? row.lastUpdatedAt ?? row.updatedAt ?? '';

      return {
        rank: idx + 1,
        teamName: row.teamName,
        totalPoints: row.totalPoints,
        slatesPlayed: row.slatesPlayed,
        lastUpdate,
        isMyTeam: Boolean(row.isMyTeam),
      };
    });
  }, [rawData]);

  // Update my team rank after sorting
  useEffect(() => {
    if (myTeamData) {
      const myRank = data.findIndex((row) => row.isMyTeam) + 1;
      setMyTeamData((prev) => (prev ? { ...prev, rank: myRank } : null));
    }
  }, [data, myTeamData]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
    if (page > totalPages) setPage(totalPages);
  }, [data.length, page]);

  const paginatedData = data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleRefresh = () => {
    setLoading(true);
    void loadData();
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return '#E0B700'; // Gold for top 3
    return '#2D3F54'; // Grey for others
  };

  const getTeamCrest = (teamName: string): string => {
    // Simple placeholder based on team name
    return teamName.slice(0, 2).toUpperCase();
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
              Leaderboard
            </h1>
            <div
              className="h-0.5 w-20"
              style={{ background: '#E0B700' }}
            />
          </div>
        </header>

        {/* Toggle Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm uppercase transition-all ${
              activeTab === 'today' ? 'scale-105' : 'opacity-60'
            }`}
            style={{
              background: activeTab === 'today' ? '#E0B700' : '#1A2636',
              color: activeTab === 'today' ? '#0B0F14' : '#EAF0F6',
              border: activeTab === 'today' ? 'none' : '1px solid #2D3F54',
            }}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('overall')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm uppercase transition-all ${
              activeTab === 'overall' ? 'scale-105' : 'opacity-60'
            }`}
            style={{
              background: activeTab === 'overall' ? '#E0B700' : '#1A2636',
              color: activeTab === 'overall' ? '#0B0F14' : '#EAF0F6',
              border: activeTab === 'overall' ? 'none' : '1px solid #2D3F54',
            }}
          >
            Overall
          </button>
        </div>

        {/* Loading State */}
        {loading && data.length === 0 && (
          <div className="text-center py-12 text-muted">Loading...</div>
        )}

        {/* Error State */}
        {error && (
          <div
            className="text-center py-12"
            style={{ color: '#D21034' }}
          >
            <p className="mb-4">Error: {error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 rounded-lg font-semibold"
              style={{
                background: '#E0B700',
                color: '#0B0F14',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* My Team Card (if exists) */}
        {myTeamData && (
          <div
            className="mb-6 p-4 rounded-xl"
            style={{
              background: '#1A2636',
              border: '2px solid #1D4ED8',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: '#1D4ED8',
                    color: '#FFFFFF',
                  }}
                >
                  {myTeamData.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: '#EAF0F6' }}>
                      {myTeamData.teamName}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        background: 'rgba(29, 78, 216, 0.2)',
                        color: '#60A5FA',
                        border: '1px solid rgba(29, 78, 216, 0.4)',
                      }}
                    >
                      You
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#A9B4C1' }}>
                    {myTeamData.slatesPlayed} slates played
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className="text-2xl font-bold"
                  style={{ color: '#E0B700' }}
                >
                  {myTeamData.totalPoints}
                </p>
                <p className="text-xs" style={{ color: '#A9B4C1' }}>
                  pts
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        {!loading && !error && paginatedData.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: '#111826',
              border: '1px solid #2D3F54',
            }}
          >
            {/* Table Header */}
            <div
              className="flex items-center px-4 py-3 border-b"
              style={{
                background: '#1A2636',
                borderColor: '#2D3F54',
              }}
            >
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A9B4C1' }}>
                  Rank
                </p>
              </div>
              <div className="flex-[3]">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A9B4C1' }}>
                  Team
                </p>
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A9B4C1' }}>
                  Pts
                </p>
              </div>
            </div>

            {/* Table Rows */}
            {paginatedData.map((row) => (
              <div
                key={row.teamName}
                className={`flex items-center px-4 py-3 border-b transition-all ${
                  row.isMyTeam ? 'bg-opacity-10' : ''
                }`}
                style={{
                  background: row.isMyTeam ? 'rgba(29, 78, 216, 0.1)' : 'transparent',
                  borderColor: '#2D3F54',
                }}
              >
                {/* Rank */}
                <div className="flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: getRankBadgeColor(row.rank),
                      color: row.rank <= 3 ? '#0B0F14' : '#EAF0F6',
                    }}
                  >
                    {getRankStyle(row.rank)}
                  </div>
                </div>

                {/* Team */}
                <div className="flex-[3]">
                  <div className="flex items-center gap-2">
                    {/* Team Crest Placeholder */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: '#1A2636',
                        color: '#A9B4C1',
                        border: '1px solid #2D3F54',
                      }}
                    >
                      {getTeamCrest(row.teamName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#EAF0F6' }}>
                        {row.teamName}
                      </p>
                      {row.isMyTeam && (
                        <p className="text-xs" style={{ color: '#60A5FA' }}>
                          You
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="flex-1 text-right">
                  <p
                    className="text-lg font-bold"
                    style={{
                      color: row.isMyTeam ? '#E0B700' : '#EAF0F6',
                    }}
                  >
                    {row.totalPoints}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg font-semibold transition-all"
              style={{
                background: page === 1 ? '#2D3F54' : '#1A2636',
                color: page === 1 ? '#A9B4C1' : '#EAF0F6',
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            <span className="flex items-center px-4 py-2" style={{ color: '#EAF0F6' }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg font-semibold transition-all"
              style={{
                background: page === totalPages ? '#2D3F54' : '#1A2636',
                color: page === totalPages ? '#A9B4C1' : '#EAF0F6',
                opacity: page === totalPages ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="text-center mt-4">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
            style={{
              background: 'rgba(24, 158, 75, 0.15)',
              color: '#34D399',
              border: '1px solid rgba(24, 158, 75, 0.3)',
            }}
          >
            <span className="animate-pulse">●</span>
            Auto-refresh: 30s
          </span>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
