import React from 'react';

interface ZellijPatternProps {
  position: 'top-right' | 'bottom-left';
  opacity?: number;
  size?: number;
}

export default function ZellijPattern({ position, opacity = 0.12, size = 200 }: ZellijPatternProps) {
  const positionStyle = position === 'top-right'
    ? { position: 'absolute', top: 0, right: 0 }
    : { position: 'absolute', bottom: 0, left: 0 };

  return (
    <div
      style={{
        ...positionStyle,
        width: size,
        height: size,
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ mixBlendMode: 'overlay' }}
      >
        {/* Geometric Zellij pattern */}
        <path
          d="M0 0 L50 0 L50 50 L0 50 Z"
          stroke="#E0B700"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M50 0 L100 0 L100 50 L50 50 Z"
          stroke="#E0B700"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M0 50 L50 50 L50 100 L0 100 Z"
          stroke="#E0B700"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M50 50 L100 50 L100 100 L50 100 Z"
          stroke="#E0B700"
          strokeWidth="0.5"
          fill="none"
        />
        {/* Diagonal lines for star pattern */}
        <path d="M25 25 L75 75" stroke="#E0B700" strokeWidth="0.5" />
        <path d="M75 25 L25 75" stroke="#E0B700" strokeWidth="0.5" />
        {/* Diamond accents */}
        <path d="M50 0 L75 25 L50 50 L25 25 Z" stroke="#E0B700" strokeWidth="0.3" fill="none" />
        <path d="M50 50 L75 75 L50 100 L25 75 Z" stroke="#E0B700" strokeWidth="0.3" fill="none" />
      </svg>
    </div>
  );
}
