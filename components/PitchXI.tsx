import React from 'react';
import { Player } from '@/types';

interface PitchXIProps {
  lineup: Player[];
  onAddPlayer: (position: 'GK' | 'DEF' | 'MID' | 'FWD', index: number) => void;
  onRemovePlayer: (playerId: string) => void;
  isLocked?: boolean;
}

const PitchSlot: React.FC<{
  player?: Player;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  index: number;
  onAdd: (pos: 'GK' | 'DEF' | 'MID' | 'FWD', idx: number) => void;
  onRemove: (id: string) => void;
  isLocked?: boolean;
}> = ({ player, position, index, onAdd, onRemove, isLocked }) => {
  return (
    <div className="flex flex-col items-center space-y-1 w-16">
      <div 
        onClick={() => !isLocked && (player ? onRemove(player.id) : onAdd(position, index))}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer border-2 ${
          player 
            ? 'bg-dark-surface border-accent-green' 
            : 'bg-dark-surface/50 border-dark-border border-dashed hover:border-text-secondary'
        } ${isLocked ? 'cursor-default' : ''}`}
      >
        {player ? (
          <div className="text-xl">👕</div>
        ) : (
          <div className="text-text-secondary text-lg">+</div>
        )}
      </div>
      <div className={`text-[10px] font-bold text-center leading-tight h-6 overflow-hidden ${player ? 'text-text-primary' : 'text-text-secondary opacity-50'}`}>
        {player ? player.name : position}
      </div>
      {player?.isCaptain && (
        <div className="bg-accent-gold text-dark-bg text-[8px] font-bold px-1 rounded absolute -top-1 -right-1">C</div>
      )}
    </div>
  );
};

const PitchXI: React.FC<PitchXIProps> = ({ lineup, onAddPlayer, onRemovePlayer, isLocked }) => {
  const getPlayersByPos = (pos: string) => lineup.filter(p => p.position === pos);

  const renderRow = (pos: 'GK' | 'DEF' | 'MID' | 'FWD', count: number) => {
    const players = getPlayersByPos(pos);
    return Array.from({ length: count }).map((_, i) => (
      <PitchSlot
        key={`${pos}-${i}`}
        index={i}
        position={pos}
        player={players[i]}
        onAdd={onAddPlayer}
        onRemove={onRemovePlayer}
        isLocked={isLocked}
      />
    ));
  };

  return (
    <div className="relative bg-gradient-to-b from-[#189E4B] to-[#0B4D24] rounded-3xl p-6 border-4 border-dark-border shadow-2xl overflow-hidden aspect-[4/5] flex flex-col justify-between">
      {/* Pitch markings */}
      <div className="absolute inset-0 border-2 border-white/20 m-2 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 border-b border-l border-r border-white/20 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-20 border-t border-l border-r border-white/20 pointer-events-none" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/20 rounded-full pointer-events-none" />

      {/* GK Row */}
      <div className="relative z-10 flex justify-center">
        {renderRow('GK', 1)}
      </div>

      {/* DEF Row */}
      <div className="relative z-10 flex justify-around">
        {renderRow('DEF', 4)}
      </div>

      {/* MID Row */}
      <div className="relative z-10 flex justify-around">
        {renderRow('MID', 4)}
      </div>

      {/* FWD Row */}
      <div className="relative z-10 flex justify-center gap-12">
        {renderRow('FWD', 2)}
      </div>
    </div>
  );
};

export default PitchXI;
