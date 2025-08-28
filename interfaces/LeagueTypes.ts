export type LeagueResponse = {
  league: {
    id: number;
    name: string;
    type: string; // ex: "Cup", poderia ser mais específico se souber os valores possíveis
    logo: string; // URL
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
  seasons: Season[];
};

export type Season = {
  year: number;
  start: string; // Data no formato ISO (ex: "2024-06-14")
  end: string; // Data no formato ISO
  current: boolean;
  coverage: Coverage;
};

export type Coverage = {
  fixtures: {
    events: boolean;
    lineups: boolean;
    statistics_fixtures: boolean;
    statistics_players: boolean;
  };
  standings: boolean;
  players: boolean;
  top_scorers: boolean;
  top_assists: boolean;
  top_cards: boolean;
  injuries: boolean;
  predictions: boolean;
  odds: boolean;
};