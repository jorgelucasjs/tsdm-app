// Tipos principais para a resposta da API-Football

export interface Time {
  elapsed: number;
  extra: number | null;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  winner?: boolean | null;
}

export interface Player {
  id: number | null;
  name: string;
}

export interface Assist {
  id: number | null;
  name: string | null;
}

/**
 * Eventos: Golos, cartões, substituições
 */
export interface Event {
  time: Time;
  team: Team;
  player: Player;
  assist: Assist;
  type: 'Goal' | 'Card' | 'subst'; // Tipo do evento: "Goal", "Card", "subst"
  detail: string; // Ex: "Normal Goal", "Yellow Card", "Substitution 1"
  comments: string | null;
}

/**
 * Informações do árbitro e local do jogo
 */
export interface Referee {
  id?: number;
  name?: string;
  type?: string;
  country?: string;
}

export interface Venue {
  id: number | null;
  name: string;
  city: string;
}

/**
 * Períodos do jogo (primeiro e segundo tempo)
 */
export interface Periods {
  first: number | null;
  second: number | null;
}

/**
 * Status do jogo (ex: "First Half", "Match Finished", etc)
 */
export interface Status {
  long: string; // ex: "Match Finished"
  short: string; // ex: "FT"
  elapsed: number | null;
}

/**
 * Resultados por tempo
 */
export interface Goals {
  home: number | null;
  away: number | null;
}

export interface Score {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
}

/**
 * Estrutura principal do fixture (jogo)
 */
export interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string; // ISO date
  timestamp: number;
  periods: Periods;
  venue: Venue;
  status: Status;
}

/**
 * Estrutura completa de uma resposta com detalhes do jogo
 */
export interface FixtureResponse {
  fixture: Fixture;
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: Team;
    away: Team;
  };
  goals: Goals;
  score: Score;
  events: Event[];
}

/**
 * Estatísticas de um time em uma partida
 */
export interface TeamStatistics {
  team: Team;
  statistics: {
    type: string; // Ex: "Shots on Goal", "Shots off Goal", "Total Shots", "Ball Possession"
    value: number | string | null;
  }[];
}

/**
 * Lineup de um jogador
 */
export interface LineupPlayer {
  player: {
    id: number;
    name: string;
    number: number;
    pos: string;
    grid: string | null;
  };
}

/**
 * Lineup de um time
 */
export interface TeamLineup {
  team: Team;
  formation: string;
  startXI: LineupPlayer[];
  substitutes: LineupPlayer[];
  coach: {
    id: number;
    name: string;
    photo: string;
  };
}

/**
 * Estatísticas de um jogador em uma partida
 */
export interface PlayerStatistics {
  player: {
    id: number;
    name: string;
    photo: string;
  };
  statistics: {
    games: {
      minutes: number | null;
      number: number | null;
      position: string;
      rating: string | null;
      captain: boolean;
      substitute: boolean;
    };
    offsides: number | null;
    shots: {
      total: number | null;
      on: number | null;
    };
    goals: {
      total: number | null;
      conceded: number | null;
      assists: number | null;
      saves: number | null;
    };
    passes: {
      total: number | null;
      key: number | null;
      accuracy: string | null;
    };
    tackles: {
      total: number | null;
      blocks: number | null;
      interceptions: number | null;
    };
    duels: {
      total: number | null;
      won: number | null;
    };
    dribbles: {
      attempts: number | null;
      success: number | null;
      past: number | null;
    };
    fouls: {
      drawn: number | null;
      committed: number | null;
    };
    cards: {
      yellow: number | null;
      red: number | null;
    };
    penalty: {
      won: number | null;
      committed: number | null;
      scored: number | null;
      missed: number | null;
      saved: number | null;
    };
  }[];
}

/**
 * Resposta final da API
 */
export interface ApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors?: string[];
  results: number;
  response: FixtureResponse[];
}

/**
 * Resposta da API para estatísticas
 */
export interface StatisticsApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors?: string[];
  results: number;
  response: TeamStatistics[];
}

/**
 * Resposta da API para lineups
 */
export interface LineupsApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors?: string[];
  results: number;
  response: TeamLineup[];
}

/**
 * Resposta da API para jogadores
 */
export interface PlayersApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors?: string[];
  results: number;
  response: {
    team: Team;
    players: PlayerStatistics[];
  }[];
}

/**
 * Resposta da API para eventos
 */
export interface EventsApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors?: string[];
  results: number;
  response: Event[];
}

/**
 * Resposta da API para busca de rodadas
 */
export interface RoundsApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors?: string[];
  results: number;
  response: string[];
}