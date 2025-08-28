export interface TeamStandingg  {
  team_id: number;
  team_name: string;
  group: string;
  group_name: string;
  overall: StatDetail;
  home: StatDetail;
  away: StatDetail;
  total: number;
  status: string;
  result: string;
  points: number;
  recent_form: string;
};

interface StatDetail  {
  games_played: number;
  won: number;
  draw: number;
  lost: number;
  goals_diff: number;
  goals_scored: number;
  goals_against: number;
  points: number;
  position: number;
};

export interface StandingResponse {
  data: {
    league_id: number;
    season_id: number;
    has_groups: number;
    number_standings: number;
    standings: TeamStandingg[];
  };
  meta: {
    requests_left: number;
    user: string;
    plan: string;
    pages: number;
    page: number;
    count: number;
    total: number;
    msg: string | null;
  };
}

export interface StandingsState {
    loading: boolean;
    error: string | null;
    standings: Record<LeagueId, StandingResponse | null>;
}

export interface StandingsActions {
    getStandings: (leagueId: LeagueId) => Promise<void>;
}

export type LeagueId =
  | 'ALeague'
  | 'Superliga'
  | 'Bundesliga';


export const LEAGUE_ID_MAPPING: Record<LeagueId, string> = {
  ALeague: '974',
  Superliga: '1609',
  Bundesliga: '1005'
};

export const LEAGUE_FILE_MAPPING: Record<LeagueId, string> = {
  ALeague: 'ALeague.json',
  Superliga: 'Superliga.json',
  Bundesliga: 'TipicoBundesliga.json',
};

