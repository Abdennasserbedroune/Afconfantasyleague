export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  totalPoints: number;
  slatesPlayed: number;
  lastUpdate: string;
  isMyTeam?: boolean;
}

export interface SlateLeaderboardEntry {
  rank: number;
  teamName: string;
  points: number;
  isMyLineup?: boolean;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  isCaptain?: boolean;
  points?: number;
  minutesPlayed?: number;
  goals?: number;
  assists?: number;
  cleanSheet?: boolean;
  yellowCards?: number;
  redCards?: number;
}

export interface SlateEntry {
  slateId: string;
  slateName: string;
  status: 'OPEN' | 'LOCKED' | 'SCORED';
  date: string;
  points?: number;
  picks: Player[];
  pickCount: number;
}

export interface UserTeamData {
  entries: SlateEntry[];
  totalPoints: number;
  slatesPlayed: number;
}

export interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
}

export interface Slate {
  id: string;
  name: string;
  lockTime: string;
  status: 'OPEN' | 'LOCKED' | 'SCORED';
  fixtures: Fixture[];
}
