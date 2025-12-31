import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Player, Fixture, Slate } from '@/types';
import { fetchJson } from '@/lib/api';
import PitchXI from '@/components/PitchXI';
import PlayerDrawer from '@/components/PlayerDrawer';
import FixtureCarousel from '@/components/FixtureCarousel';
import CountdownPill from '@/components/CountdownPill';
import BottomNav from '@/components/BottomNav';
import ZellijPattern from '@/components/ZellijPattern';

interface PickXIProps {
  slateId?: string;
}

export default function PickXIPage({ slateId: propSlateId }: PickXIProps) {
  const router = useRouter();
  const { slateId: querySlateId } = router.query;
  const slateId = (propSlateId || querySlateId) as string;

  const [loading, setLoading] = useState(true);
  const [slate, setSlate] = useState<Slate | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Map<string, Player>>(new Map());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFixtureId, setActiveFixtureId] = useState<string | undefined>();
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!slateId) return;

      try {
        setLoading(true);

        // Load slate details
        const slateData = await fetchJson<Slate>(`/api/slates/${slateId}`);
        setSlate(slateData);

        // Load fixtures
        const fixturesData = await fetchJson<Fixture[]>(`/api/slates/${slateId}/fixtures`);
        setFixtures(fixturesData);

        if (fixturesData.length > 0) {
          setActiveFixtureId(fixturesData[0].id);
        }

        // Load existing lineup
        const lineupData = await fetchJson<{ picks: Player[] }>(`/api/slates/${slateId}/my-picks`);
        const lineupMap = new Map(lineupData.picks.map((p) => [p.id, p]));
        setSelectedPlayers(lineupMap);

        // Load all available players
        const playersData = await fetchJson<Player[]>('/api/players');
        // Filter players by slate fixtures
        const fixtureTeamNames = fixturesData.flatMap((f) => [f.homeTeam, f.awayTeam]);
        const eligiblePlayers = playersData.filter((p) => fixtureTeamNames.includes(p.team));
        setAllPlayers(eligiblePlayers);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [slateId]);

  const filteredPlayers = activeFixtureId
    ? allPlayers.filter((p) => {
        const fixture = fixtures.find((f) => f.id === activeFixtureId);
        if (!fixture) return false;
        return p.team === fixture.homeTeam || p.team === fixture.awayTeam;
      })
    : allPlayers;

  const handleAddPlayer = (player: Player) => {
    setSelectedPlayers((prev) => new Map(prev).set(player.id, player));
    setDrawerOpen(false);
    setActiveSlot(null);
  };

  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers((prev) => {
      const newMap = new Map(prev);
      newMap.delete(playerId);
      return newMap;
    });
  };

  const handleSlotClick = (slot: string) => {
    setActiveSlot(slot);
    setDrawerOpen(true);
  };

  const handleSaveLineup = async () => {
    if (!slateId || selectedPlayers.size !== 11) return;

    try {
      setSaving(true);
      const picks = Array.from(selectedPlayers.values());

      await fetch(`/api/slates/${slateId}/lineup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ picks }),
      });

      // After saving, show captain selection
      await router.push(`/pick-xi/${slateId}/captain`);
    } catch (error) {
      console.error('Failed to save lineup:', error);
      alert('Failed to save lineup. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const isLineupValid = selectedPlayers.size === 11;
  const isSlateLocked = slate?.status !== 'OPEN';

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
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1
                className="text-xl font-bold uppercase tracking-wider"
                style={{
                  color: '#EAF0F6',
                  fontFamily: 'system-ui, sans-serif',
                  letterSpacing: '0.1em',
                }}
              >
                Pick Your XI
              </h1>
              <p className="text-sm mt-1" style={{ color: '#A9B4C1' }}>
                {slate?.name}
              </p>
            </div>
            <CountdownPill deadline={slate?.lockTime || ''} status={slate?.status || 'OPEN'} />
          </div>
        </header>

        {/* Fixture Carousel */}
        {fixtures.length > 0 && (
          <div className="mb-6">
            <FixtureCarousel
              fixtures={fixtures}
              activeFixtureId={activeFixtureId}
              onSelectFixture={setActiveFixtureId}
            />
          </div>
        )}

        {/* Validation Message */}
        {!isLineupValid && (
          <div
            className="mb-4 px-4 py-3 rounded-lg"
            style={{
              background: 'rgba(210, 16, 52, 0.1)',
              border: '1px solid rgba(210, 16, 52, 0.3)',
            }}
          >
            <p className="text-sm" style={{ color: '#F87171' }}>
              Select {11 - selectedPlayers.size} more players to complete your XI
            </p>
          </div>
        )}

        {/* Pitch */}
        <div className="mb-6">
          <PitchXI
            lineup={selectedPlayers}
            onPlayerClick={handleSlotClick}
            isLocked={isSlateLocked}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 text-center py-3 px-6 rounded-xl font-bold text-base uppercase transition-all"
            style={{
              background: '#2D3F54',
              color: '#A9B4C1',
            }}
          >
            Cancel
          </Link>
          <button
            onClick={handleSaveLineup}
            disabled={!isLineupValid || isSlateLocked || saving}
            className="flex-1 text-center py-3 px-6 rounded-xl font-bold text-base uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isLineupValid && !isSlateLocked ? '#E0B700' : '#2D3F54',
              color: isLineupValid && !isSlateLocked ? '#0B0F14' : '#A9B4C1',
            }}
          >
            {saving ? 'Saving...' : isLineupValid ? 'Confirm XI' : `Add ${11 - selectedPlayers.size} more`}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 space-y-2">
          <p className="text-xs text-center" style={{ color: '#A9B4C1' }}>
            • Select players from the fixtures above
          </p>
          <p className="text-xs text-center" style={{ color: '#A9B4C1' }}>
            • Max 1 GK, 4 DEF, 4 MID, 2 FWD
          </p>
          <p className="text-xs text-center" style={{ color: '#A9B4C1' }}>
            • Max 3 players per team
          </p>
        </div>
      </main>

      {/* Player Drawer */}
      <PlayerDrawer
        availablePlayers={filteredPlayers}
        selectedPlayers={selectedPlayers}
        onAddPlayer={handleAddPlayer}
        onRemovePlayer={handleRemovePlayer}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

PickXIPage.getInitialProps = async () => {
  return { slateId: undefined };
};
