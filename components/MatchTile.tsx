import React from 'react';
import { Fixture } from '@/types';

interface MatchTileProps {
  fixture: Fixture;
  isActive?: boolean;
  onClick?: () => void;
}

export default function MatchTile({ fixture, isActive = false, onClick }: MatchTileProps) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-xl p-3 cursor-pointer transition-all duration-200"
      style={{
        border: isActive ? '2px solid #E0B700' : '1px solid #2D3F54',
        background: '#111826',
        minWidth: '180px',
      }}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Home Team */}
        <div className="flex-1 text-center">
          <div className="text-sm font-semibold text-white truncate">
            {fixture.homeTeam}
          </div>
          {/* Team Crest Placeholder */}
          <div className="w-10 h-10 mx-auto mt-1 rounded-full bg-surface2 flex items-center justify-center text-xs text-muted">
            {fixture.homeTeam.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Match Time */}
        <div className="flex-shrink-0 px-2 text-center">
          <div className="text-xs text-muted">vs</div>
          <div className="text-sm font-bold text-white mt-1">
            {fixture.status === 'SCHEDULED'
              ? new Date(fixture.kickoff).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
              : fixture.status === 'LIVE'
              ? 'LIVE'
              : 'FT'}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex-1 text-center">
          <div className="text-sm font-semibold text-white truncate">
            {fixture.awayTeam}
          </div>
          {/* Team Crest Placeholder */}
          <div className="w-10 h-10 mx-auto mt-1 rounded-full bg-surface2 flex items-center justify-center text-xs text-muted">
            {fixture.awayTeam.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Status Badge */}
      {fixture.status !== 'SCHEDULED' && (
        <div className="absolute top-1 right-1">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
            style={{
              background:
                fixture.status === 'LIVE'
                  ? 'rgba(29, 78, 216, 0.2)'
                  : 'rgba(24, 158, 75, 0.2)',
              color: fixture.status === 'LIVE' ? '#60A5FA' : '#34D399',
              border: `1px solid ${
                fixture.status === 'LIVE' ? 'rgba(29, 78, 216, 0.4)' : 'rgba(24, 158, 75, 0.4)'
              }`,
            }}
          >
            {fixture.status}
          </span>
        </div>
      )}
    </div>
  );
}
