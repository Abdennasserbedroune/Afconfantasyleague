import React from 'react';
import { Fixture } from '@/types';
import { formatDateTime } from '@/lib/api';

export default function FixtureTile({ fixture }: { fixture: Fixture }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontWeight: 700 }}>
          {fixture.homeTeam} vs {fixture.awayTeam}
        </div>
        <span className="badge">{fixture.status}</span>
      </div>
      <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
        Kickoff: {formatDateTime(fixture.kickoff)}
      </div>
    </div>
  );
}
