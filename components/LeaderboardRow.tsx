import React from 'react';

interface LeaderboardRowProps {
  rank: number;
  teamName: string;
  points: number;
  isCurrentUser?: boolean;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ rank, teamName, points, isCurrentUser }) => {
  const isTop3 = rank <= 3;
  
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
      isCurrentUser 
        ? 'bg-dark-surface2 border-accent-blue shadow-lg shadow-accent-blue/5' 
        : 'bg-dark-surface border-dark-border'
    }`}>
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading text-lg ${
          isTop3 ? 'bg-accent-gold text-dark-bg' : 'bg-dark-surface2 text-text-secondary'
        }`}>
          {rank}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-text-primary font-bold">{teamName}</span>
            {isCurrentUser && (
              <span className="bg-accent-blue/20 text-accent-blue text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">You</span>
            )}
          </div>
        </div>
      </div>
      <div className="text-xl font-heading text-text-primary tracking-tight">
        {points} <span className="text-[10px] text-text-secondary uppercase">pts</span>
      </div>
    </div>
  );
};

export default LeaderboardRow;
