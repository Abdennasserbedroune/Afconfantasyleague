import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LeaderboardTable from '@/components/LeaderboardTable';
import { SlateLeaderboardEntry } from '@/types';
import { fetchJson } from '@/lib/api';

interface SlateLeaderboardResponse {
  slateName?: string;
  slateDate?: string;
  entries: SlateLeaderboardEntry[];
}

export default function SlateLeaderboardPage() {
  const router = useRouter();
  const slateId = router.query.slateId as string | undefined;

  const [data, setData] = useState<SlateLeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slateId) return;

    const load = async () => {
      try {
        const result = await fetchJson<SlateLeaderboardResponse>(`/api/slates/${slateId}/leaderboard`);
        setData(result);
        setError(null);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slateId]);

  const myLineup = useMemo(() => {
    return data?.entries.find((e) => e.isMyLineup);
  }, [data]);

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="pageHeader">
            <h1>Slate leaderboard</h1>
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
            <h1>Slate leaderboard</h1>
          </div>
          <div className="section">
            <p style={{ color: 'var(--danger)' }}>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container">
      <div className="card">
        <div className="pageHeader">
          <div>
            <h1>
              {data.slateName ?? `Slate ${slateId}`} {data.slateDate ? <span className="muted">({data.slateDate})</span> : null}
            </h1>
            {myLineup ? (
              <div className="muted" style={{ marginTop: 6 }}>
                Your rank: <strong style={{ color: 'var(--text)' }}>{myLineup.rank}</strong>
              </div>
            ) : (
              <div className="muted" style={{ marginTop: 6 }}>Not played</div>
            )}
          </div>
          <div className="headerActions">
            <Link className="btn" href={`/slate/${slateId}/results`}>
              Back to results
            </Link>
          </div>
        </div>

        <div className="section" style={{ padding: 0 }}>
          <LeaderboardTable<SlateLeaderboardEntry>
            columns={[
              {
                key: 'rank',
                label: 'Rank',
                render: (row) => <span style={{ fontWeight: 700 }}>{row.rank}</span>
              },
              {
                key: 'teamName',
                label: 'Team name',
                render: (row) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{row.teamName}</div>
                    {row.isMyLineup ? (
                      <span className="badge" style={{ marginTop: 4 }}>
                        My lineup
                      </span>
                    ) : null}
                  </div>
                )
              },
              {
                key: 'points',
                label: 'Points',
                render: (row) => <span style={{ fontWeight: 700 }}>{row.points}</span>,
                align: 'right'
              }
            ]}
            data={data.entries}
            getRowClassName={(row) => (row.isMyLineup ? 'highlightRow' : '')}
          />
        </div>
      </div>
    </div>
  );
}
