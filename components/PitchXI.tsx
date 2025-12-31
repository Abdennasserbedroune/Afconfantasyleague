import React from 'react';
import { Player } from '@/types';

interface PitchXIProps {
  lineup: Map<string, Player>;
  onPlayerClick: (position: string) => void;
  isLocked: boolean;
  formation?: string[];
}

const DEFAULT_FORMATION = ['GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'FWD', 'FWD'];

const POSITION_LABELS: Record<string, string> = {
  GK: 'GK',
  DEF: 'DEF',
  MID: 'MID',
  FWD: 'FWD',
};

export default function PitchXI({ lineup, onPlayerClick, isLocked, formation = DEFAULT_FORMATION }: PitchXIProps) {
  // Formation layout for 4-4-2
  const formationLayout = [
    ['GK'],
    ['DEF', 'DEF', 'DEF', 'DEF'],
    ['MID', 'MID', 'MID', 'MID'],
    ['FWD', 'FWD'],
  ];

  const getPlayerForSlot = (position: string, index: number): Player | undefined => {
    // Get players in this position, then select by index
    const playersInPosition = Array.from(lineup.values()).filter((p) => p.position === position);
    return playersInPosition[index];
  };

  const isEmpty = (player: Player | undefined): boolean => {
    return !player;
  };

  const isInvalid = (player: Player | undefined): boolean => {
    if (!player) return false;
    // You can add validation logic here (e.g., duplicate players, ineligible, etc.)
    return false;
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0D5A2F 0%, #0A4A26 100%)',
        border: '2px solid #2D3F54',
        minHeight: '400px',
      }}
    >
      {/* Pitch Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Center Circle */}
        <div
          className="absolute rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        />

        {/* Center Line */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />

        {/* Penalty Areas */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '60px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderTop: 'none',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '60px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderBottom: 'none',
          }}
        />
      </div>

      {/* Player Slots */}
      <div className="relative z-10 flex flex-col justify-between py-6 px-4 h-[400px]">
        {formationLayout.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex justify-center gap-2 md:gap-4"
            style={{
              flex: 1,
              alignItems: rowIndex === 0 ? 'flex-start' : rowIndex === formationLayout.length - 1 ? 'flex-end' : 'center',
            }}
          >
            {row.map((position, colIndex) => {
              const player = getPlayerForSlot(position, colIndex);
              const empty = isEmpty(player);
              const invalid = isInvalid(player);
              const slotKey = `${position}-${colIndex}`;

              return (
                <button
                  key={slotKey}
                  onClick={() => !isLocked && onPlayerClick(slotKey)}
                  disabled={isLocked && !player}
                  className={`
                    relative rounded-xl transition-all duration-200 flex-shrink-0
                    ${empty ? 'border-2 border-dashed' : 'border-2'}
                    ${invalid ? 'border-red-500 bg-red-500/10' : ''}
                    ${!empty && !invalid ? 'border-gold/50 bg-surface' : ''}
                    ${!empty && !invalid && !isLocked ? 'hover:border-gold cursor-pointer' : ''}
                    ${isLocked ? 'cursor-default opacity-80' : ''}
                  `}
                  style={{
                    width: '70px',
                    height: '90px',
                    minWidth: '70px',
                    minHeight: '90px',
                    borderColor: empty ? '#2D3F54' : undefined,
                    background: empty ? 'rgba(0, 0, 0, 0.2)' : undefined,
                  }}
                  aria-label={`${position} slot ${colIndex + 1}`}
                >
                  {/* Player Info */}
                  {player ? (
                    <>
                      {/* Captain Badge */}
                      {player.isCaptain && (
                        <div
                          className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: '#E0B700',
                            color: '#0B0F14',
                          }}
                        >
                          C
                        </div>
                      )}

                      {/* Team Crest Placeholder */}
                      <div
                        className="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: '#1A2636',
                          color: '#A9B4C1',
                        }}
                      >
                        {player.team.slice(0, 2).toUpperCase()}
                      </div>

                      {/* Player Name */}
                      <div className="absolute bottom-1 left-1 right-1">
                        <div
                          className="text-xs font-semibold text-white truncate text-center leading-tight"
                          style={{
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                          }}
                        >
                          {player.name.split(' ').pop()}
                        </div>
                        {player.points !== undefined && (
                          <div
                            className="text-xs font-bold text-center mt-0.5"
                            style={{ color: '#E0B700' }}
                          >
                            {player.points}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Empty Slot */}
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ color: '#A9B4C1' }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="8" r="4" strokeWidth="1.5" />
                          <path d="M4 20C4 16 7 14 12 14C17 14 20 16 20 20" strokeWidth="1.5" />
                        </svg>
                      </div>
                      <div className="absolute bottom-1 left-0 right-0 text-xs font-bold text-center">
                        {position}
                      </div>
                    </>
                  )}

                  {/* Invalid indicator */}
                  {invalid && (
                    <div
                      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"
                      style={{ fontSize: '10px' }}
                    >
                      !
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 text-xs text-muted flex gap-3">
        <div className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded"
            style={{ background: 'rgba(224, 183, 0, 0.3)', border: '1px solid #E0B700' }}
          />
          <span>Filled</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-dashed" style={{ borderColor: '#2D3F54' }} />
          <span>Empty</span>
        </div>
      </div>
    </div>
  );
}
