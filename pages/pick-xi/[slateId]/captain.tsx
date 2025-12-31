import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Player } from '@/types';
import { fetchJson } from '@/lib/api';
import BottomNav from '@/components/BottomNav';

interface CaptainSelectionProps {
  slateId: string;
}

export default function CaptainSelectionPage() {
  const router = useRouter();
  const { slateId } = router.query;

  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!slateId || typeof slateId !== 'string') return;

      try {
        setLoading(true);
        const data = await fetchJson<{ picks: Player[] }>(`/api/slates/${slateId}/my-picks`);
        setPlayers(data.picks);
      } catch (error) {
        console.error('Failed to load lineup:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [slateId]);

  const handleSelectCaptain = (playerId: string) => {
    setCaptainId(playerId);
  };

  const handleConfirm = async () => {
    if (!captainId || !slateId || typeof slateId !== 'string') return;

    try {
      setSaving(true);
      await fetch(`/api/slates/${slateId}/lineup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captainId }),
      });

      await router.push('/my-team');
    } catch (error) {
      console.error('Failed to set captain:', error);
      alert('Failed to set captain. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#0B0F14' }}>
        <div className="px-4 py-6 pb-24">
          <div className="text-center text-muted">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0B0F14' }}>
      {/* Main Content */}
      <main className="px-4 py-6 pb-24 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1
            className="text-2xl font-bold uppercase tracking-wider mb-2"
            style={{
              color: '#EAF0F6',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            Select Your Captain
          </h1>
          <div
            className="h-0.5 w-20"
            style={{ background: '#E0B700' }}
          />
          <p className="text-sm mt-3" style={{ color: '#A9B4C1' }}>
            Your captain earns 1.5x points
          </p>
        </header>

        {/* Player List */}
        <div className="space-y-3">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => handleSelectCaptain(player.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                captainId === player.id ? 'scale-[1.02]' : ''
              }`}
              style={{
                background: captainId === player.id ? 'rgba(224, 183, 0, 0.15)' : '#111826',
                border: captainId === player.id ? '2px solid #E0B700' : '1px solid #2D3F54',
              }}
            >
              <div className="flex items-center gap-3">
                {/* Team Crest Placeholder */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: '#1A2636',
                    color: '#A9B4C1',
                    border: '1px solid #2D3F54',
                  }}
                >
                  {player.team.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold" style={{ color: '#EAF0F6' }}>
                    {player.name}
                  </p>
                  <p className="text-xs" style={{ color: '#A9B4C1' }}>
                    {player.team} • {player.position}
                  </p>
                </div>
              </div>
              {captainId === player.id && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: '#E0B700',
                    color: '#0B0F14',
                  }}
                >
                  C
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <div className="mt-6">
          <button
            onClick={handleConfirm}
            disabled={!captainId || saving}
            className="w-full text-center py-3 px-6 rounded-xl font-bold text-base uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: captainId ? '#E0B700' : '#2D3F54',
              color: captainId ? '#0B0F14' : '#A9B4C1',
            }}
          >
            {saving ? 'Saving...' : 'Confirm Captain'}
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

CaptainSelectionPage.getInitialProps = () => {
  return { slateId: '' };
};
