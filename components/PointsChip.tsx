import React from 'react';

interface PointsChipProps {
  label: string;
  value: number;
  type: 'gain' | 'loss' | 'neutral';
}

const PointsChip: React.FC<PointsChipProps> = ({ label, value, type }) => {
  const colors = {
    gain: 'bg-accent-green/20 text-accent-green border-accent-green/30',
    loss: 'bg-accent-red/20 text-accent-red border-accent-red/30',
    neutral: 'bg-dark-border/50 text-text-secondary border-dark-border',
  };

  return (
    <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${colors[type]}`}>
      <span>{label}</span>
      <span className="opacity-70">{value > 0 ? `+${value}` : value}</span>
    </div>
  );
};

export default PointsChip;
