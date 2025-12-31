import React, { useState } from 'react';
import { Player } from '@/types';

interface PlayerDrawerProps {
  availablePlayers: Player[];
  selectedPlayers: Map<string, Player>;
  onAddPlayer: (player: Player) => void;
  onRemovePlayer: (playerId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

type TabType = 'GK' | 'DEF' | 'MID' | 'FWD';

const TAB_LABELS: Record<TabType, string> = {
  GK: 'GK',
  DEF: 'DEF',
  MID: 'MID',
  FWD: 'FWD',
};

export default function PlayerDrawer({
  availablePlayers,
  selectedPlayers,
  onAddPlayer,
  onRemovePlayer,
  isOpen = true,
  onClose,
}: PlayerDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('GK');

  const tabs: TabType[] = ['GK', 'DEF', 'MID', 'FWD'];

  const getPlayersForTab = (tab: TabType): Player[] => {
    return availablePlayers.filter((p) => p.position === tab);
  };

  const isSelected = (playerId: string): boolean => selectedPlayers.has(playerId);

  const canAddPlayer = (player: Player): boolean => {
    const positionCount = Array.from(selectedPlayers.values()).filter(
      (p) => p.position === player.position
    ).length;

    const maxForPosition = player.position === 'GK' ? 1 : player.position === 'DEF' ? 4 : 4;
    if (positionCount >= maxForPosition) return false;

    const teamCount = Array.from(selectedPlayers.values()).filter(
      (p) => p.team === player.team
    ).length;
    if (teamCount >= 3) return false; // Max 3 players per team

    return !isSelected(player.id);
  };

  if (!isOpen) return null;

  const playersInTab = getPlayersForTab(activeTab);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl border-t"
      style={{
        background: '#111826',
        borderColor: '#2D3F54',
        maxHeight: '70vh',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
      }}
    >
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-2">
        <button onClick={onClose} className="w-12 h-1 rounded-full" style={{ background: '#2D3F54' }} />
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const countInTab = Array.from(selectedPlayers.values()).filter((p) => p.position === tab).length;
          const maxInTab = tab === 'GK' ? 1 : tab === 'DEF' ? 4 : tab === 'MID' ? 4 : 2;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                isActive ? 'transform scale-105' : 'opacity-60'
              }`}
              style={{
                background: isActive ? '#E0B700' : '#1A2636',
                color: isActive ? '#0B0F14' : '#EAF0F6',
                border: isActive ? 'none' : '1px solid #2D3F54',
              }}
            >
              {TAB_LABELS[tab]}
              <span className="ml-2 text-xs opacity-75">
                ({countInTab}/{maxInTab})
              </span>
            </button>
          );
        })}
      </div>

      {/* Player List */}
      <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 120px)' }}>
        {playersInTab.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">No players available in this position</div>
        ) : (
          <div className="space-y-2">
            {playersInTab.map((player) => {
              const selected = isSelected(player.id);
              const canAdd = canAddPlayer(player);

              return (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-xl transition-all"
                  style={{
                    background: selected ? 'rgba(24, 158, 75, 0.1)' : '#1A2636',
                    border: selected ? '1px solid #189E4B' : '1px solid #2D3F54',
                    opacity: !canAdd && !selected ? 0.5 : 1,
                  }}
                >
                  {/* Player Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{player.name}</span>
                      <span className="text-xs text-muted">•</span>
                      <span className="text-xs text-muted">{player.team}</span>
                    </div>
                    <div className="text-xs text-muted mt-1">
                      {player.position}
                    </div>
                  </div>

                  {/* Add/Remove Button */}
                  <button
                    onClick={() => {
                      if (selected) {
                        onRemovePlayer(player.id);
                      } else if (canAdd) {
                        onAddPlayer(player);
                      }
                    }}
                    disabled={!canAdd && !selected}
                    className="px-4 py-2 rounded-lg font-bold text-sm transition-all"
                    style={{
                      background: selected
                        ? '#D21034'
                        : canAdd
                        ? '#189E4B'
                        : '#2D3F54',
                      color: '#FFFFFF',
                      opacity: canAdd || selected ? 1 : 0.5,
                    }}
                  >
                    {selected ? '✕ Remove' : canAdd ? '+ Add' : 'Full'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
