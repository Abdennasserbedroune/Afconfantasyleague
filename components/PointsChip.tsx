import React from 'react';

type ChipType = 'gain' | 'loss' | 'neutral';

interface PointsChipProps {
  label: string;
  value: number;
  type: ChipType;
}

export default function PointsChip({ label, value, type }: PointsChipProps) {
  const chipStyle = {
    gain: {
      background: 'rgba(24, 158, 75, 0.15)',
      color: '#34D399',
      borderColor: 'rgba(24, 158, 75, 0.3)',
    },
    loss: {
      background: 'rgba(210, 16, 52, 0.15)',
      color: '#F87171',
      borderColor: 'rgba(210, 16, 52, 0.3)',
    },
    neutral: {
      background: 'rgba(169, 180, 193, 0.15)',
      color: '#A9B4C1',
      borderColor: 'rgba(169, 180, 193, 0.3)',
    },
  };

  const style = chipStyle[type];

  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
      style={{
        background: style.background,
        color: style.color,
        border: `1px solid ${style.borderColor}`,
      }}
    >
      <span>{label}</span>
      <span className="font-bold">{value > 0 ? `+${value}` : value}</span>
    </div>
  );
}
