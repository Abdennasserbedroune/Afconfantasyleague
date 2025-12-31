import React, { useEffect, useState } from 'react';
import { Player } from '@/types';
import { fetchJson } from '@/lib/api';
import PointsChip from '@/components/PointsChip';
import BottomNav from '@/components/BottomNav';
import ZellijPattern from '@/components/ZellijPattern';

interface ResultsData {
  points: number;
  players: Array<{
    player: Player;
    points: number;
    breakdown: Array<{
      type: string;
      label: string;
      value: number;
      category: 'gain' | 'loss' | 'neutral';
    }>;
  }>;
  captain?: {
    playerId: string;
    playerName: string;
    points: number;
    boostedPoints: number;
  };
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResultsData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // For now, mock data
        const mockData: ResultsData = {
          points: 127,
          captain: {
            playerId: '1',
            playerName: 'Mohamed Salah',
            points: 12,
            boostedPoints: 18,
          },
          players: [
            {
              player: {
                id: '1',
                name: 'Mohamed Salah',
                team: 'Egypt',
                position: 'FWD',
                isCaptain: true,
                points: 18,
              },
              points: 18,
              breakdown: [
                { type: 'minutes', label: '90m', value: 2, category: 'neutral' },
                { type: 'goal', label: 'G', value: 4, category: 'gain' },
                { type: 'assist', label: 'A', value: 3, category: 'gain' },
                { type: 'cleanSheet', label: 'CS', value: 1, category: 'gain' },
              ],
            },
            {
              player: {
                id: '2',
                name: 'Victor Osimhen',
                team: 'Nigeria',
                position: 'FWD',
                points: 10,
              },
              points: 10,
              breakdown: [
                { type: 'minutes', label: '90m', value: 2, category: 'neutral' },
                { type: 'goal', label: 'G', value: 4, category: 'gain' },
              ],
            },
            {
              player: {
                id: '3',
                name: 'Achraf Hakimi',
                team: 'Morocco',
                position: 'DEF',
                points: 8,
              },
              points: 8,
              breakdown: [
                { type: 'minutes', label: '90m', value: 2, category: 'neutral' },
                { type: 'cleanSheet', label: 'CS', value: 4, category: 'gain' },
                { type: 'yellowCard', label: 'YC', value: -1, category: 'loss' },
              ],
            },
            {
              player: {
                id: '4',
                name: 'Thomas Partey',
                team: 'Ghana',
                position: 'MID',
                points: 12,
              },
              points: 12,
              breakdown: [
                { type: 'minutes', label: '90m', value: 2, category: 'neutral' },
                { type: 'assist', label: 'A', value: 3, category: 'gain' },
                { type: 'assist', label: 'A', value: 3, category: 'gain' },
                { type: 'cleanSheet', label: 'CS', value: 1, category: 'gain' },
              ],
            },
            {
              player: {
                id: '5',
                name: 'Edouard Mendy',
                team: 'Senegal',
                position: 'GK',
                points: 6,
              },
              points: 6,
              breakdown: [
                { type: 'minutes', label: '90m', value: 2, category: 'neutral' },
                { type: 'cleanSheet', label: 'CS', value: 4, category: 'gain' },
                { type: 'saves', label: '3s', value: 1, category: 'neutral' },
              ],
            },
          ],
        };

        setData(mockData);
      } catch (error) {
        console.error('Failed to load results:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

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
              Slate Results
            </h1>
            <div
              className="h-0.5 w-20"
              style={{ background: '#E0B700' }}
            />
          </div>
        </header>

        {/* Total Points */}
        {data && (
          <div
            className="relative rounded-2xl overflow-hidden mb-6 p-6 text-center"
            style={{
              background: 'linear-gradient(135deg, #111826 0%, #1A2636 100%)',
              border: '2px solid #E0B700',
            }}
          >
            <p className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: '#A9B4C1' }}>
              Total Points
            </p>
            <p
              className="text-5xl font-bold mb-2"
              style={{
                color: '#E0B700',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '0.05em',
              }}
            >
              {data.points}
            </p>
            <p className="text-xs" style={{ color: '#A9B4C1' }}>
              Updated at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )}

        {/* Captain Summary */}
        {data?.captain && (
          <div
            className="mb-6 p-4 rounded-xl"
            style={{
              background: 'rgba(224, 183, 0, 0.1)',
              border: '2px solid #E0B700',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#E0B700' }}>
                  Captain
                </p>
                <p className="text-sm font-semibold" style={{ color: '#EAF0F6' }}>
                  {data.captain.playerName}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-2xl font-bold"
                  style={{ color: '#E0B700' }}
                >
                  {data.captain.boostedPoints}
                </p>
                <p className="text-xs" style={{ color: '#A9B4C1' }}>
                  {data.captain.points} × 1.5
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Points Breakdown */}
        {data && data.players.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#A9B4C1' }}>
              Points Breakdown
            </h2>

            {[...data.players].sort((a, b) => b.points - a.points).map((item) => (
              <div
                key={item.player.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: '#111826',
                  border: '1px solid #2D3F54',
                }}
              >
                {/* Player Header */}
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#2D3F54' }}>
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
                      {item.player.team.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: '#EAF0F6' }}>
                          {item.player.name}
                        </span>
                        {item.player.isCaptain && (
                          <span
                            className="px-2 py-0.5 rounded text-xs font-bold"
                            style={{
                              background: '#E0B700',
                              color: '#0B0F14',
                            }}
                          >
                            C
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#A9B4C1' }}>
                        {item.player.team} • {item.player.position}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${
                        item.player.isCaptain ? 'text-[#E0B700]' : ''
                      }`}
                      style={{ color: item.player.isCaptain ? '#E0B700' : '#EAF0F6' }}
                    >
                      {item.points}
                    </p>
                  </div>
                </div>

                {/* Breakdown Chips */}
                <div className="px-4 py-3 flex gap-2 flex-wrap">
                  {item.breakdown.map((chip, idx) => (
                    <PointsChip
                      key={`${item.player.id}-${chip.type}-${idx}`}
                      label={chip.label}
                      value={chip.value}
                      type={chip.category}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
