import React, { useEffect, useState } from 'react';
import LeaderboardRow from '@/components/LeaderboardRow';

type LeaderboardType = 'today' | 'overall';

export default function LeaderboardPage() {
  const [type, setType] = useState<LeaderboardType>('today');
  const [data, setData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?type=${type}`)
      .then(res => res.json())
      .then(data => {
        setData(data.rankings || []);
        setUserData(data.currentUser);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [type]);

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto space-y-6 relative">
      {/* Zellij Pattern Bottom Left */}
      <div className="zellij-pattern zellij-bl opacity-10" />

      <header className="flex justify-between items-end relative z-10">
        <div>
          <h1 className="text-3xl text-text-primary mb-1">Leaderboard</h1>
          <p className="text-text-secondary text-xs uppercase tracking-widest font-bold">AFCON 2025 Standings</p>
        </div>
        <div className="flex bg-dark-surface p-1 rounded-xl border border-dark-border">
          <button
            onClick={() => setType('today')}
            className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
              type === 'today' ? 'bg-accent-gold text-dark-bg' : 'text-text-secondary'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setType('overall')}
            className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
              type === 'overall' ? 'bg-accent-gold text-dark-bg' : 'text-text-secondary'
            }`}
          >
            Overall
          </button>
        </div>
      </header>

      {/* Your Rank Card (Pinned at top) */}
      {userData && (
        <section className="sticky top-4 z-20 shadow-2xl">
          <LeaderboardRow 
            rank={userData.rank} 
            teamName={userData.teamName} 
            points={userData.points} 
            isCurrentUser 
          />
        </section>
      )}

      {/* Leaderboard Table */}
      <section className="space-y-3">
        {loading ? (
          <div className="p-8 text-center animate-pulse font-heading text-xl">Ranking...</div>
        ) : (
          data.map((entry) => (
            <LeaderboardRow
              key={entry.teamName}
              rank={entry.rank}
              teamName={entry.teamName}
              points={entry.points}
              isCurrentUser={userData?.teamName === entry.teamName}
            />
          ))
        )}
      </section>

      <div className="h-20" />
    </div>
  );
}
