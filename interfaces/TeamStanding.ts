

// football-get-list-all-team, football-get-list-away-team, football-get-list-home-team
export interface TeamStanding {
  competition?: string;
  country?: string;
  name: string;
  shortName: string;
  id: number;
  deduction: number | null;
  ongoing: any | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  scoresStr: string;
  goalConDiff: number;
  pts: number;
  idx: number;
  qualColor: string;
  logo: string;
}

export interface TeamListResponse {
  list: TeamStanding[];
}
