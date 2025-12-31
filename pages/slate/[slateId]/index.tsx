import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Slate, Player } from '@/types';
import PitchXI from '@/components/PitchXI';
import PlayerDrawer from '@/components/PlayerDrawer';
import CountdownPill from '@/components/CountdownPill';
import FixtureCarousel from '@/components/FixtureCarousel';

export default function SlateBuilderPage() {
  const router = useRouter();
  const { slateId } = router.query;

  const [slate, setSlate] = useState<Slate | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [lineup, setLineup] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPos, setSelectedPos] = useState<'GK' | 'DEF' | 'MID' | 'FWD' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showCaptainModal, setShowCaptainModal] = useState(false);

  useEffect(() => {
    if (!slateId) return;

    const fetchData = async () => {
      try {
        const [slateRes, playersRes, currentLineupRes] = await Promise.all([
          fetch(`/api/slates/${slateId}`),
          fetch(`/api/bootstrap`), // get all players, then filter by slate teams
          fetch(`/api/slates/${slateId}/my-picks`)
        ]);

        const slateData = await slateRes.json();
        const bootstrapData = await playersRes.json();
        const currentLineupData = await currentLineupRes.json();

        setSlate(slateData);
        
        // Filter players from teams in this slate
        const slateTeamNames = new Set([
          ...slateData.fixtures.map((f: any) => f.homeTeam),
          ...slateData.fixtures.map((f: any) => f.awayTeam)
        ]);
        
        const slatePlayers = bootstrapData.players.filter((p: any) => slateTeamNames.has(p.team));
        setPlayers(slatePlayers);
        
        if (currentLineupData && currentLineupData.players) {
          setLineup(currentLineupData.players);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slateId]);

  const handleAddSlot = (pos: 'GK' | 'DEF' | 'MID' | 'FWD') => {
    setSelectedPos(pos);
    setIsDrawerOpen(true);
  };

  const handleAddPlayer = (player: Player) => {
    setLineup(prev => [...prev, player]);
  };

  const handleRemovePlayer = (playerId: string) => {
    setLineup(prev => prev.filter(p => p.id !== playerId));
  };

  const handleConfirmXI = async () => {
    if (lineup.length < 11) return;
    setShowCaptainModal(true);
  };

  const handleSelectCaptain = async (playerId: string) => {
    setIsSaving(true);
    try {
      const payload = {
        slateId,
        picks: lineup.map(p => ({
          playerId: p.id,
          isCaptain: p.id === playerId
        }))
      };

      const res = await fetch('/api/lineup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push('/my-team');
      } else {
        alert('Failed to save XI');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
      setShowCaptainModal(false);
    }
  };

  if (loading || !slate) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-accent-gold font-heading text-2xl animate-pulse">Initializing Pitch...</div>
      </div>
    );
  }

  const isLocked = slate.status !== 'OPEN';

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      {/* Header Bar (sticky) */}
      <header className="flex justify-between items-center sticky top-0 bg-dark-bg/80 backdrop-blur-md z-40 py-2 border-b border-dark-border">
        <div>
          <h2 className="text-xl text-text-primary mb-0.5">{slate.name}</h2>
          <p className="text-text-secondary text-[10px] uppercase font-bold tracking-widest">
            {new Date(slate.lockTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
        </div>
        <CountdownPill deadline={slate.lockTime} status={slate.status} />
        <button onClick={() => router.back()} className="text-text-secondary hover:text-text-primary p-2">
          ✕
        </button>
      </header>

      {/* Fixture carousel */}
      <section>
        <FixtureCarousel fixtures={slate.fixtures} />
      </section>

      {/* Pitch Section */}
      <section className="space-y-4">
        <PitchXI 
          lineup={lineup} 
          onAddPlayer={handleAddSlot} 
          onRemovePlayer={handleRemovePlayer} 
          isLocked={isLocked}
        />
        
        {/* Confirm Button State */}
        <div className="fixed bottom-24 left-4 right-4 max-w-2xl mx-auto z-40">
          {!isLocked ? (
            <button
              onClick={handleConfirmXI}
              disabled={lineup.length < 11 || isSaving}
              className={`w-full py-4 rounded-xl font-heading text-xl shadow-2xl transition-all active:scale-95 ${
                lineup.length === 11 
                  ? 'bg-accent-gold text-dark-bg hover:shadow-accent-gold/20' 
                  : 'bg-dark-surface2 text-text-secondary border border-dark-border'
              }`}
            >
              {isSaving ? 'Saving...' : lineup.length === 11 ? 'CONFIRM XI' : `ADD ${11 - lineup.length} MORE PLAYERS`}
            </button>
          ) : (
            <div className="w-full py-4 rounded-xl bg-dark-surface text-text-secondary font-heading text-xl text-center border border-dark-border uppercase tracking-widest">
              XI Locked
            </div>
          )}
        </div>
      </section>

      {/* Player Drawer */}
      <PlayerDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        players={players}
        onAddPlayer={handleAddPlayer}
        selectedPosition={selectedPos}
        lineup={lineup}
      />

      {/* Captain Selection Modal */}
      {showCaptainModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-bg/90 backdrop-blur-md" onClick={() => setShowCaptainModal(false)} />
          <div className="relative bg-dark-surface rounded-3xl border border-dark-border w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-dark-border">
              <h3 className="text-2xl text-accent-gold font-heading mb-1">Select Your Captain</h3>
              <p className="text-text-secondary text-xs italic">"Captain earns 1.5x points"</p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
              {lineup.map(player => (
                <button
                  key={player.id}
                  onClick={() => handleSelectCaptain(player.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-dark-surface2 border-b border-dark-border transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-dark-surface2 rounded-full flex items-center justify-center">👕</div>
                    <div className="text-left">
                      <div className="text-text-primary font-bold group-hover:text-accent-gold transition-colors">{player.name}</div>
                      <div className="text-[10px] text-text-secondary uppercase">{player.team} • {player.position}</div>
                    </div>
                  </div>
                  <div className="text-accent-gold opacity-0 group-hover:opacity-100 transition-opacity font-heading uppercase text-sm">Select</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="h-32" /> {/* Spacer for floating button */}
    </div>
  );
}
