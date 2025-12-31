import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Player, SlateEntry } from '@/types';
import PitchXI from '@/components/PitchXI';
import CountdownPill from '@/components/CountdownPill';

interface PicksResponse {
  slateId: string;
  slateName: string;
  status: 'OPEN' | 'LOCKED' | 'SCORED';
  players: Player[];
  lockTime?: string;
}

export default function MyTeamPicksPage() {
  const router = useRouter();
  const { slateId } = router.query;

  const [data, setData] = useState<PicksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slateId) return;

    fetch(`/api/slates/${slateId}/my-picks`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slateId]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-accent-gold font-heading text-2xl animate-pulse">Retrieving XI...</div>
      </div>
    );
  }

  const isLocked = data.status !== 'OPEN';

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      {isLocked && (
        <div className="bg-accent-gold text-dark-bg p-3 rounded-xl flex items-center justify-center space-x-2 shadow-xl animate-in slide-in-from-top duration-500">
          <span className="text-xl">🔒</span>
          <span className="font-heading text-xl uppercase tracking-widest">XI Locked</span>
        </div>
      )}

      <header className="flex justify-between items-center bg-dark-bg/80 backdrop-blur-md z-40 py-2">
        <div>
          <h2 className="text-xl text-text-primary mb-0.5">{data.slateName}</h2>
          <p className="text-text-secondary text-[10px] uppercase font-bold tracking-widest">
            {data.status === 'SCORED' ? 'Scored' : 'Locked Lineup'}
          </p>
        </div>
        {data.lockTime && <CountdownPill deadline={data.lockTime} status={data.status} />}
        <button onClick={() => router.back()} className="text-text-secondary hover:text-text-primary p-2">
          ✕
        </button>
      </header>

      <section className="space-y-6">
        <PitchXI 
          lineup={data.players} 
          onAddPlayer={() => {}} 
          onRemovePlayer={() => {}} 
          isLocked={true}
        />

        <div className="space-y-4">
          <div className="bg-dark-surface p-6 rounded-3xl border border-dark-border text-center space-y-2">
            {data.status === 'LOCKED' ? (
              <>
                <p className="text-text-primary font-bold">Matches are currently in progress</p>
                <p className="text-text-secondary text-xs">Points will be computed once all fixtures end.</p>
              </>
            ) : data.status === 'SCORED' ? (
              <>
                <p className="text-accent-green font-bold">Final Results Available</p>
                <Link 
                  href="/results"
                  className="inline-block mt-4 px-8 py-3 bg-accent-blue text-text-primary rounded-xl font-heading text-lg hover:bg-opacity-80 transition-all"
                >
                  VIEW FULL BREAKDOWN
                </Link>
              </>
            ) : (
              <p className="text-text-secondary">Lineup is editable. Go to the builder to make changes.</p>
            )}
          </div>

          {!isLocked && (
            <Link 
              href={`/slate/${data.slateId}`}
              className="block w-full py-4 rounded-xl bg-accent-gold text-dark-bg font-heading text-xl text-center shadow-lg active:scale-95 transition-all"
            >
              EDIT LINEUP
            </Link>
          )}
        </div>
      </section>

      <div className="h-24" />
    </div>
  );
}
