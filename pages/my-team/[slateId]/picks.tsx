import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FormationView from '@/components/FormationView';
import { Player, SlateEntry } from '@/types';
import { fetchJsonWithFallback } from '@/lib/api';

interface PicksResponse {
  slateId: string;
  slateName: string;
  status: 'OPEN' | 'LOCKED' | 'SCORED';
  players: Player[];
}

export default function MyTeamPicksPage() {
  const router = useRouter();
  const slateId = router.query.slateId as string | undefined;

  const [data, setData] = useState<PicksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slateId) return;

    const load = async () => {
      try {
        const result = await fetchJsonWithFallback<PicksResponse>([
          `/api/slates/${slateId}/my-picks`,
          `/api/my-team/${slateId}/picks`
        ]);
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

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="pageHeader">
            <h1>My picks</h1>
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
            <h1>My picks</h1>
          </div>
          <div className="section">
            <p style={{ color: 'var(--danger)' }}>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const canEdit = data.status === 'OPEN';
  const showPoints = data.status === 'SCORED';

  return (
    <div className="container">
      <div className="card">
        <div className="pageHeader">
          <div>
            <h1>{data.slateName}</h1>
            <div style={{ marginTop: 8 }}>
              {data.status === 'LOCKED' || data.status === 'SCORED' ? (
                <span className="badge">View only</span>
              ) : (
                <span className="badge">Editable</span>
              )}
            </div>
          </div>
          <div className="headerActions">
            <Link className="btn" href="/my-team">
              Back
            </Link>
            {canEdit ? (
              <Link className="btn btnPrimary" href={`/slate/${data.slateId}`}>
                Edit
              </Link>
            ) : null}
          </div>
        </div>

        <div className="section">
          <FormationView players={data.players} showPoints={showPoints} />
        </div>
      </div>
    </div>
  );
}
