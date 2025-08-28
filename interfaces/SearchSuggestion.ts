import { MatchStatus } from "./MatchStatus";



// football-all-search, football-leagues-search, football-matches-search, football-players-search, football-teams-search
export interface SearchSuggestion {
  type: 'player' | 'team' | 'league' | 'match';
  id: string;
  score: number;
  name: string;
  isCoach?: boolean;
  teamId?: number;
  teamName?: string;
  leagueId?: number;
  leagueName?: string;
  ccode?: string;
  matchDate?: string;
  status?: MatchStatus;
  homeTeamId?: string;
  homeTeamName?: string;
  awayTeamId?: string;
  awayTeamName?: string;
}

export interface SearchResponse {
  suggestions: SearchSuggestion[];
}

// football-leagues-search, football-matches-search, football-players-search, football-teams-search
export interface SearchResponseWithStatus {
  status: string;
  response: {
    suggestions: SearchSuggestion[];
  };
}