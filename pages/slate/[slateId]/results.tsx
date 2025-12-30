import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FixtureTile from '@/components/FixtureTile';
import { Slate } from '@/types';
import { fetchJson, formatDateTime } from '@/lib/api';

export default function SlateResultsPage() {
  const router = useRouter();
  const slateId = router.query.slateId as string | undefined;

  const [slate, setSlate] = useState<Slate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slateId) return;

    const load = async () => {
      try {
        const result = await fetchJson<Slate>(`/api/slates/${slateId}`);
        setSlate(result);
        setError(null);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slateId]);

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="pageHeader">
            <h1>Slate results</h1>
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
            <h1>Slate results</h1>
          </div>
          <div className="section">
            <p style={{ color: 'var(--danger)' }}>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!slate) return null;

  return (
    <div className="container">
      <div className="card">
        <div className="pageHeader">
          <div>
            <h1>{slate.name}</h1>
            <div className="muted" style={{ marginTop: 6 }}>
              Lock time: {formatDateTime(slate.lockTime)}
            </div>
          </div>
          <div className="headerActions">
            <Link className="btn btnPrimary" href={`/slate/${slate.id}/leaderboard`}>
              Leaderboard
            </Link>
          </div>
        </div>

        <div className="section">
          <h2 style={{ marginTop: 0 }}>Fixtures</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {slate.fixtures.length === 0 ? (
              <p className="muted">No fixtures for this slate.</p>
            ) : (
              slate.fixtures.map((fixture) => (
                <FixtureTile key={fixture.id} fixture={fixture} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
