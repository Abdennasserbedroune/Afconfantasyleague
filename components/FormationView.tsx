import React from 'react';
import { Player } from '@/types';
import PlayerCard from './PlayerCard';

interface FormationViewProps {
  players: Player[];
  showPoints: boolean;
}

function Row({ title, players, showPoints }: { title: string; players: Player[]; showPoints: boolean }) {
  if (players.length === 0) return null;

  return (
    <div>
      <div className="muted" style={{ marginBottom: 10, fontSize: 13 }}>
        {title}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {players.map((p) => (
          <PlayerCard key={p.id} player={p} showPoints={showPoints} />
        ))}
      </div>
    </div>
  );
}

export default function FormationView({ players, showPoints }: FormationViewProps) {
  const gk = players.filter((p) => p.position === 'GK');
  const def = players.filter((p) => p.position === 'DEF');
  const mid = players.filter((p) => p.position === 'MID');
  const fwd = players.filter((p) => p.position === 'FWD');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Row title="Forwards" players={fwd} showPoints={showPoints} />
      <Row title="Midfielders" players={mid} showPoints={showPoints} />
      <Row title="Defenders" players={def} showPoints={showPoints} />
      <Row title="Goalkeeper" players={gk} showPoints={showPoints} />
    </div>
  );
}
