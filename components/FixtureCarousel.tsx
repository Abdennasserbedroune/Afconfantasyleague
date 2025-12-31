import React from 'react';
import { Fixture } from '@/types';
import MatchTile from './MatchTile';

interface FixtureCarouselProps {
  fixtures: Fixture[];
  activeFixtureId?: string;
  onSelect?: (fixtureId: string) => void;
}

const FixtureCarousel: React.FC<FixtureCarouselProps> = ({ fixtures, activeFixtureId, onSelect }) => {
  return (
    <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
      {fixtures.map((fixture) => (
        <MatchTile
          key={fixture.id}
          fixture={fixture}
          isActive={fixture.id === activeFixtureId}
          onClick={() => onSelect && onSelect(fixture.id)}
        />
      ))}
    </div>
  );
};

export default FixtureCarousel;
