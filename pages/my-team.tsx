import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LeaderboardTable from '@/components/LeaderboardTable';
import { SlateEntry, UserTeamData } from '@/types';
import { fetchJson, formatDateTime } from '@/lib/api';

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
      <div className="container">
        <div className="card">
          <div className="pageHeader">
            <h1>My Team</h1>
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
            <h1>My Team</h1>
          </div>
          <div className="section">
            <p style={{ color: 'var(--danger)' }}>Error: {error}</p>
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
    router.push(`/my-team/${entry.slateId}/picks`);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="pageHeader">
          <div>
            <h1>My Team</h1>
            <div className="muted" style={{ marginTop: 6 }}>
              Total points: <strong style={{ color: 'var(--text)' }}>{data.totalPoints}</strong> • Slates played:{' '}
              <strong style={{ color: 'var(--text)' }}>{data.slatesPlayed}</strong>
            </div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={tab === 'all' ? 'tab tabActive' : 'tab'}
            onClick={() => setTab('all')}
          >
            All slates
          </button>
          <button
            className={tab === 'current' ? 'tab tabActive' : 'tab'}
            onClick={() => setTab('current')}
          >
            Current
          </button>
          <button
            className={tab === 'upcoming' ? 'tab tabActive' : 'tab'}
            onClick={() => setTab('upcoming')}
          >
            Upcoming
          </button>
        </div>

        <div className="section" style={{ padding: 0 }}>
          {displayEntries.length === 0 ? (
            <div className="section">
              <p className="muted">No entries to display for this tab.</p>
            </div>
          ) : (
            <LeaderboardTable<SlateEntry>
              columns={[
                {
                  key: 'slateName',
                  label: 'Slate',
                  render: (row) => (
                    <div>
                      <div style={{ fontWeight: 600 }}>{row.slateName}</div>
                      <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                        {formatDateTime(row.date)}
                      </div>
                    </div>
                  )
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => <span className="badge">{row.status}</span>
                },
                {
                  key: 'points',
                  label: 'Points',
                  render: (row) => (
                    <span style={{ fontWeight: 700 }}>
                      {row.status === 'SCORED' ? row.points ?? '—' : '—'}
                    </span>
                  ),
                  align: 'right'
                },
                {
                  key: 'pickCount',
                  label: 'Picks',
                  render: (row) => row.pickCount,
                  align: 'right'
                }
              ]}
              data={displayEntries}
              onRowClick={handleRowClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
