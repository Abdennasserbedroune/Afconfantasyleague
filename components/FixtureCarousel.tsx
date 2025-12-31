import React, { useState } from 'react';
import { Fixture } from '@/types';
import MatchTile from './MatchTile';

interface FixtureCarouselProps {
  fixtures: Fixture[];
  activeFixtureId?: string;
  onSelectFixture?: (fixtureId: string) => void;
}

export default function FixtureCarousel({ fixtures, activeFixtureId, onSelectFixture }: FixtureCarouselProps) {
  const [scrollLeft, setScrollLeft] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('fixture-scroll-container');
    if (container) {
      const scrollAmount = 200;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative">
      {/* Left Scroll Button */}
      {scrollLeft > 0 && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: '#1A2636',
            border: '1px solid #2D3F54',
            color: '#EAF0F6',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
          aria-label="Scroll left"
        >
          ←
        </button>
      )}

      {/* Fixture Tiles Container */}
      <div
        id="fixture-scroll-container"
        className="flex gap-3 overflow-x-auto scroll-smooth px-1 py-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}
      >
        {fixtures.map((fixture) => (
          <MatchTile
            key={fixture.id}
            fixture={fixture}
            isActive={fixture.id === activeFixtureId}
            onClick={() => onSelectFixture?.(fixture.id)}
          />
        ))}
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        style={{
          background: '#1A2636',
          border: '1px solid #2D3F54',
          color: '#EAF0F6',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
        aria-label="Scroll right"
      >
        →
      </button>

      <style jsx>{`
        #fixture-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
