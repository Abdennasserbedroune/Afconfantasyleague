import React from 'react';
import { Fixture } from '@/types';

interface MatchTileProps {
  fixture: Fixture;
  isActive?: boolean;
  onClick?: () => void;
}

const MatchTile: React.FC<MatchTileProps> = ({ fixture, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex-shrink-0 w-32 bg-dark-surface p-3 rounded-xl border transition-all cursor-pointer ${
        isActive ? 'border-accent-gold shadow-lg shadow-accent-gold/10' : 'border-dark-border hover:border-text-secondary/30'
      }`}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="flex justify-between w-full items-center">
          <div className="w-8 h-8 bg-dark-surface2 rounded-full flex items-center justify-center text-[10px] font-bold">
            {fixture.homeTeam.substring(0, 3).toUpperCase()}
          </div>
          <div className="text-xs font-heading font-bold text-text-primary">
            {new Date(fixture.kickoff).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="w-8 h-8 bg-dark-surface2 rounded-full flex items-center justify-center text-[10px] font-bold">
            {fixture.awayTeam.substring(0, 3).toUpperCase()}
          </div>
        </div>
        <div className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter text-center line-clamp-1">
          {fixture.homeTeam} v {fixture.awayTeam}
        </div>
      </div>
    </div>
  );
};

export default MatchTile;
