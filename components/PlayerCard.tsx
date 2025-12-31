import React from 'react';
import { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  showPoints: boolean;
}

export default function PlayerCard({ player, showPoints }: PlayerCardProps) {
  return (
    <div className="card" style={{ padding: 12, minWidth: 160 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontWeight: 700 }}>{player.name}</div>
        {player.isCaptain ? <span className="badge">C</span> : null}
      </div>
      <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
        {player.team} • {player.position}
      </div>

      {showPoints ? (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700 }}>{player.points ?? 0} pts</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
            {player.minutesPlayed != null ? <div>Minutes: {player.minutesPlayed}</div> : null}
            {player.goals != null ? <div>Goals: {player.goals}</div> : null}
            {player.assists != null ? <div>Assists: {player.assists}</div> : null}
            {player.cleanSheet != null ? <div>CS: {player.cleanSheet ? 'Yes' : 'No'}</div> : null}
            {player.yellowCards != null ? <div>YC: {player.yellowCards}</div> : null}
            {player.redCards != null ? <div>RC: {player.redCards}</div> : null}
          </div>
        </div>
      ) : (
        <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
          Points available once scored.
        </div>
      )}
    </div>
  );
}
