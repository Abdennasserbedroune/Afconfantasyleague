import React from 'react';
import { Player } from '@/types';

interface PlayerRowProps {
  player: Player;
  isEligible: boolean;
  onAdd: (player: Player) => void;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, isEligible, onAdd }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-dark-border hover:bg-dark-surface2 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-dark-surface2 rounded-full flex items-center justify-center text-lg">
          👕
        </div>
        <div>
          <div className="text-text-primary font-bold">{player.name}</div>
          <div className="text-text-secondary text-xs uppercase tracking-tighter">
            {player.team} • {player.position}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className={`text-[10px] font-bold uppercase ${isEligible ? 'text-accent-green' : 'text-accent-red'}`}>
          {isEligible ? 'Available' : 'Ineligible'}
        </div>
        <button
          onClick={() => isEligible && onAdd(player)}
          disabled={!isEligible}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isEligible 
              ? 'bg-accent-green text-text-primary hover:bg-opacity-80 active:scale-95' 
              : 'bg-dark-border text-text-secondary cursor-not-allowed'
          }`}
        >
          {isEligible ? '+' : '✕'}
        </button>
      </div>
    </div>
  );
};

export default PlayerRow;
