// ===================================
// Tipos Comuns Reutilizáveis
// ===================================

/**
 * Tempo de jogo (em segundos)
 */
export interface Periods {
  first: number; // timestamp do início do 1º tempo
  second: number; // timestamp do início do 2º tempo
}

/**
 * Informações do estádio
 */
export interface Venue {

  id: number;
  name: string;
  city: string;
  address?: string;
  capacity?: number;
  surface?: string;
  image?: string;
}

/**
 * Status de um jogo
 */
export interface Status {

  long: string;  // "Match Finished"
  short: string; // "FT", "HT", "AET"
  elapsed: number | null; // minutos jogados
  extra: number | null;   // minutos extras
}

/**
 * Time participante
 */
export interface Team {

  id: number;
  name: string;
  logo: string;
  winner: boolean | null; // null em caso de empate
}

/**
 * Placar por período
 */
export interface Score {

  halftime: {
    home: number | null;
    away: number | null;
  };
  fulltime: {
    home: number | null;
    away: number | null;
  };
  extratime: {
    home: number | null;
    away: number | null;
  };
  penalty: {
    home: number | null;
    away: number | null;
  };
}

/**
 * Gols marcados
 */
export type Goals = {

  home: number | null;
  away: number | null;
};

/**
 * Cobertura de dados disponíveis para uma temporada
 */
export interface Coverage {

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
}

// ===================================
// 1. Team Statistics Response
// ===================================

export type TeamStatisticsResponse = {
  get: "teams/statistics";
  parameters: {
    league: string;
    season: string;
    team: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: {
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string;
      season: number;
    };
    team: {
      id: number;
      name: string;
      logo: string;
    };
    form: string;
    fixtures: {
      played: { home: number; away: number; total: number };
      wins: { home: number; away: number; total: number };
      draws: { home: number; away: number; total: number };
      loses: { home: number; away: number; total: number };
    };
    goals: {
      for: {
        total: { home: number; away: number; total: number };
        average: { home: string; away: string; total: string };
        minute: Record<`${number}-${number}`, { total: number | null; percentage: string | null }>;
        under_over: Record<`${number}.${number}`, { over: number; under: number }>;
      };
      against: {
        total: { home: number; away: number; total: number };
        average: { home: string; away: string; total: string };
        minute: Record<`${number}-${number}`, { total: number | null; percentage: string | null }>;
        under_over: Record<`${number}.${number}`, { over: number; under: number }>;
      };
    };
    biggest: {
      streak: { wins: number; draws: number; loses: number };
      wins: { home: string; away: string };
      loses: { home: string; away: string };
      goals: {
        for: { home: number; away: number };
        against: { home: number; away: number };
      };
    };
    clean_sheet: { home: number; away: number; total: number };
    failed_to_score: { home: number; away: number; total: number };
    penalty: {
      scored: { total: number; percentage: string };
      missed: { total: number; percentage: string };
      total: number;
    };
    lineups: { formation: string; played: number }[];
    cards: {
      yellow: Record<`${number}-${number}`, { total: number | null; percentage: string | null }>;
      red: Record<`${number}-${number}`, { total: number | null; percentage: string | null }>;
    };
  };
};

// ===================================
// 2. Teams Response (info do time + estádio)
// ===================================

export type TeamsResponse = {

  get: "teams";
  parameters: { id: string };
  errors: string[];
  results: number;
  paging: { current: number; total: number };
  response: {
    team: {
      id: number;
      name: string;
      code: string;
      country: string;
      founded: number;
      national: boolean;
      logo: string;
    };
    venue: Venue;
  }[];
};

// ===================================
// 3. Leagues by Team (ligas que o time participou)
// ===================================

export type LeaguesByTeamResponse = {

  get: "leagues";
  parameters: { team: string };
  errors: string[];
  results: number;
  paging: { current: number; total: number };
  response: {
    league: {
      id: number;
      name: string;
      type: string; // "League" | "Cup"
      logo: string;
    };
    country: {
      name: string;
      code: string | null;
      flag: string | null;
    };
    seasons: {
      year: number;
      start: string; // "YYYY-MM-DD"
      end: string; // "YYYY-MM-DD"
      current: boolean;
      coverage: Coverage;
    }[];
  }[];
};

// ===================================
// 4. Fixtures Response (jogos do time)
// ===================================

export type FixturesResponse = {

  get: "fixtures";
  parameters: {
    team: string;
    season: string;
  };
  errors: string[];
  results: number;
  paging: { current: number; total: number };
  response: {
    fixture: {
      id: number;
      referee: string;
      timezone: string;
      date: string; // ISO string
      timestamp: number;
      periods: Periods;
      venue: Venue;
      status: Status;
    };
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string | null;
      season: number;
      round: string;
      standings?: boolean;
    };
    teams: {
      home: Team;
      away: Team;
    };
    goals: Goals;
    score: Score;
  }[];
};


// Interfaces para dados processados
export interface ProcessedTeamData {
  id: number;
  name: string;
  logo: string;
  founded: number;
  venue: {
    name: string;
    capacity: number;
    city: string;
  };
  country: string;
}

export interface ProcessedFixture {
  id: number;
  date: string;
  time: string;
  opponent: {
    name: string;
    logo: string;
  };
  venue: string;
  competition: string;
  isHome: boolean;
  status: string;
  goals?: {
    home: number | null;
    away: number | null;
  };
}

export interface ProcessedStats {
  form: string;
  fixtures: {
    played: number;
    wins: number;
    draws: number;
    loses: number;
  };
  goals: {
    for: number;
    against: number;
    average: {
      for: string;
      against: string;
    };
  };
  league: {
    name: string;
    logo: string;
    season: number;
  };
}