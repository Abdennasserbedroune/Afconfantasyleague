import React, { useEffect, useMemo, useState } from 'react';
import LeaderboardTable from '@/components/LeaderboardTable';
import { LeaderboardEntry } from '@/types';
import { fetchJson, formatDateTime } from '@/lib/api';

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

export default function LeaderboardPage() {
  const [rawData, setRawData] = useState<LeaderboardApiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadData = async () => {
    try {
      const result = await fetchJson<LeaderboardApiRow[]>('/api/leaderboard');
      setRawData(result);
      setError(null);
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
        isMyTeam: Boolean(row.isMyTeam)
      };
    });
  }, [rawData]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
    if (page > totalPages) setPage(totalPages);
  }, [data.length, page]);

  const handleRefresh = () => {
    setLoading(true);
    void loadData();
  };

  const paginatedData = data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  if (loading && data.length === 0) {
    return (
      <div className="container">
        <div className="card">
          <div className="pageHeader">
            <h1>Global Standings</h1>
          </div>
          <div className="section">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="pageHeader">
            <h1>Global Standings</h1>
          </div>
          <div className="section">
            <p style={{ color: 'var(--danger)' }}>Error: {error}</p>
            <button className="btn" onClick={handleRefresh}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="pageHeader">
          <h1>Global Standings</h1>
          <div className="headerActions">
            <button className="btn" onClick={handleRefresh} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <span className="badge">Auto-refresh: 30s</span>
          </div>
        </div>

        <div className="section" style={{ padding: 0 }}>
          <LeaderboardTable<LeaderboardEntry>
            columns={[
              {
                key: 'rank',
                label: 'Rank',
                render: (row) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700 }}>{row.rank}</span>
                    {row.rank === 1 ? <span>🥇</span> : null}
                    {row.rank === 2 ? <span>🥈</span> : null}
                    {row.rank === 3 ? <span>🥉</span> : null}
                  </div>
                )
              },
              {
                key: 'teamName',
                label: 'Team name',
                render: (row) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{row.teamName}</div>
                    {row.isMyTeam ? (
                      <span className="badge" style={{ marginTop: 4 }}>
                        My team
                      </span>
                    ) : null}
                  </div>
                )
              },
              {
                key: 'totalPoints',
                label: 'Total points',
                render: (row) => <span style={{ fontWeight: 700 }}>{row.totalPoints}</span>,
                align: 'right'
              },
              {
                key: 'slatesPlayed',
                label: 'Slates played',
                render: (row) => row.slatesPlayed,
                align: 'right'
              },
              {
                key: 'lastUpdate',
                label: 'Last update',
                render: (row) => <span className="muted">{formatDateTime(row.lastUpdate)}</span>,
                align: 'right'
              }
            ]}
            data={paginatedData}
            getRowClassName={(row) => (row.isMyTeam ? 'highlightRow' : '')}
            getRowKey={(row) => row.teamName}
          />
        </div>

        {totalPages > 1 && (
          <div className="section" style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>
            <span style={{ padding: '8px 12px' }}>
              {page} / {totalPages}
            </span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
