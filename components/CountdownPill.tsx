import React, { useEffect, useState } from 'react';

interface CountdownPillProps {
  deadline: string;
  status: 'OPEN' | 'LOCKED' | 'SCORED';
}

export default function CountdownPill({ deadline, status }: CountdownPillProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (status !== 'OPEN') return;

    const updateCountdown = () => {
      const now = Date.now();
      const deadlineTime = new Date(deadline).getTime();
      const remaining = Math.max(0, deadlineTime - now);
      setTimeRemaining(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [deadline, status]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const secs = Math.floor((ms % 60000) / 1000);

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (status === 'LOCKED' || status === 'SCORED') {
    return (
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider"
        style={{
          background: '#A9B4C1',
          color: '#0B0F14',
        }}
      >
        <span>🔒</span>
        <span>Locked</span>
      </div>
    );
  }

  const isUrgent = timeRemaining > 0 && timeRemaining < 15 * 60 * 1000; // Less than 15 minutes

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider ${
        isUrgent ? 'animate-pulse-red' : ''
      }`}
      style={{
        background: isUrgent ? '#D21034' : 'transparent',
        color: isUrgent ? '#FFFFFF' : '#E0B700',
        border: isUrgent ? '2px solid #D21034' : '2px solid #E0B700',
      }}
    >
      <span>⏱</span>
      <span>Locks in {formatTime(timeRemaining)}</span>
    </div>
  );
}
