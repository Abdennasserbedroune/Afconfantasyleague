import React, { useState, useEffect } from 'react';

interface CountdownPillProps {
  deadline: string;
  status: 'OPEN' | 'LOCKED' | 'SCORED';
}

const CountdownPill: React.FC<CountdownPillProps> = ({ deadline, status }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (status !== 'OPEN') return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(deadline).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Locked');
        setIsUrgent(false);
        clearInterval(interval);
        return;
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`Locks in ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      setIsUrgent(diff < 15 * 60 * 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, status]);

  if (status === 'LOCKED' || status === 'SCORED' || timeLeft === 'Locked') {
    return (
      <div className="bg-dark-surface2 px-3 py-1 rounded-full border border-dark-border text-text-secondary text-sm font-heading font-bold uppercase relative overflow-hidden">
        <div className="zellij-pattern zellij-tr scale-50 -top-4 -right-4 opacity-20" />
        <span className="relative z-10">Locked</span>
      </div>
    );
  }

  return (
    <div className={`px-3 py-1 rounded-full border font-heading font-bold uppercase text-sm ${
      isUrgent 
        ? 'border-accent-red text-accent-red animate-pulse-red' 
        : 'border-accent-gold text-accent-gold'
    }`}>
      {timeLeft || 'Calculating...'}
    </div>
  );
};

export default CountdownPill;
