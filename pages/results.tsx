import React, { useEffect, useState } from 'react';
import PointsChip from '@/components/PointsChip';

export default function ResultsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // We need to pass the token since it's withAuth
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view results');
      setLoading(false);
      return;
    }

    fetch('/api/results', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse font-heading text-xl">Loading Results...</div>;
  if (error) return <div className="p-8 text-center text-accent-red font-heading">{error}</div>;

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl text-text-primary mb-1">Slate Results</h1>
        <div className="flex items-baseline space-x-3">
          <span className="text-accent-gold font-heading text-3xl">Total: {data.totalPoints} pts</span>
          <span className="text-text-secondary text-[10px] uppercase font-bold tracking-widest">
            {data.slateName}
          </span>
        </div>
      </header>

      {/* Captain Summary */}
      {data.picks.find((p: any) => p.isCaptain) && (
        <div className="bg-dark-surface p-4 rounded-2xl border border-accent-gold/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-accent-gold text-dark-bg w-8 h-8 rounded-full flex items-center justify-center font-bold">C</div>
            <div>
              <p className="text-xs text-text-secondary uppercase font-bold">Captain</p>
              <p className="text-text-primary font-bold">{data.picks.find((p: any) => p.isCaptain).name}</p>
            </div>
          </div>
          <div className="text-accent-gold font-heading text-xl">1.5x Multiplier</div>
        </div>
      )}

      {/* Points Breakdown List */}
      <section className="space-y-4">
        <h3 className="text-xs text-text-secondary uppercase font-bold tracking-widest">Player Breakdown</h3>
        <div className="space-y-3">
          {data.picks.map((player: any) => (
            <div key={player.id} className="bg-dark-surface p-4 rounded-2xl border border-dark-border group hover:border-accent-gold/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-dark-surface2 rounded-full flex items-center justify-center">👕</div>
                  <div>
                    <div className="text-text-primary font-bold">{player.name}</div>
                    <div className="text-[10px] text-text-secondary uppercase">{player.team}</div>
                  </div>
                </div>
                <div className="text-2xl text-accent-gold font-heading">{player.totalPoints || '—'}</div>
              </div>

              {player.stats && (
                <div className="flex flex-wrap gap-2">
                  {player.stats.minutes > 0 && <PointsChip label={`${player.stats.minutes}m`} value={player.stats.minutes >= 60 ? 2 : 1} type="neutral" />}
                  {player.stats.goals > 0 && <PointsChip label="G" value={player.stats.goals * 4} type="gain" />}
                  {player.stats.assists > 0 && <PointsChip label="A" value={player.stats.assists * 3} type="gain" />}
                  {player.stats.cleanSheet && <PointsChip label="CS" value={4} type="gain" />}
                  {player.stats.yellowCards > 0 && <PointsChip label="YC" value={-player.stats.yellowCards} type="loss" />}
                  {player.stats.redCards > 0 && <PointsChip label="RC" value={-3} type="loss" />}
                  {player.stats.ownGoals > 0 && <PointsChip label="OG" value={-2 * player.stats.ownGoals} type="loss" />}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="h-20" />
    </div>
  );
}
