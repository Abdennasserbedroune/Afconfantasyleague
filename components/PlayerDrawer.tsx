import React, { useState } from 'react';
import { Player } from '@/types';
import PlayerRow from './PlayerRow';

interface PlayerDrawerProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  isOpen: boolean;
  onClose: () => void;
  selectedPosition?: 'GK' | 'DEF' | 'MID' | 'FWD' | null;
  lineup: Player[];
}

const PlayerDrawer: React.FC<PlayerDrawerProps> = ({ 
  players, 
  onAddPlayer, 
  isOpen, 
  onClose, 
  selectedPosition,
  lineup
}) => {
  const [activeTab, setActiveTab] = useState<'GK' | 'DEF' | 'MID' | 'FWD'>(selectedPosition || 'GK');

  React.useEffect(() => {
    if (selectedPosition) setActiveTab(selectedPosition);
  }, [selectedPosition]);

  const tabs: ('GK' | 'DEF' | 'MID' | 'FWD')[] = ['GK', 'DEF', 'MID', 'FWD'];

  const filteredPlayers = players.filter(p => p.position === activeTab);

  const isPlayerSelected = (playerId: string) => lineup.some(p => p.id === playerId);

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-dark-bg/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      <div className={`absolute bottom-0 left-0 right-0 bg-dark-surface rounded-t-[40px] border-t border-dark-border shadow-2xl transition-transform duration-300 h-[70vh] flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex flex-col items-center p-4">
          <div className="w-12 h-1.5 bg-dark-border rounded-full mb-6" />
          <div className="flex justify-between w-full items-center px-4 mb-4">
            <h3 className="text-xl font-heading text-text-primary">Add Player</h3>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
              ✕ Close
            </button>
          </div>
          
          <div className="flex w-full px-4 space-x-2 border-b border-dark-border pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-heading font-bold rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-accent-gold text-dark-bg' 
                    : 'text-text-secondary hover:bg-dark-surface2'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <PlayerRow
                key={player.id}
                player={player}
                isEligible={!isPlayerSelected(player.id)}
                onAdd={(p) => {
                  onAddPlayer(p);
                  if (lineup.length + 1 >= 11) onClose();
                }}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <span className="text-4xl mb-4">🔍</span>
              <p className="text-text-secondary font-body italic">No players available for this position</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDrawer;
