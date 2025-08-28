// Tipos básicos para dados comuns
interface Birth {
  date: string; // Formato ISO: "YYYY-MM-DD"
  place: string | null;
  country: string;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  season: number;
}

// Estatísticas detalhadas do jogador
interface GamesStats {
  appearences: number | null;
  lineups: number | null;
  minutes: number | null;
  number: number | null;
  position: string; // Ex: "Midfielder", "Defender"
  rating: string | null; // String numérica com casas decimais
  captain: boolean;
}

interface Substitutes {
  in: number | null;
  out: number | null;
  bench: number | null;
}

interface Shots {
  total: number | null;
  on: number | null;
}

interface Goals {
  total: number | null;
  conceded: number | null;
  assists: number | null;
  saves: number | null;
}

interface Passes {
  total: number | null;
  key: number | null;
  accuracy: number | null; // Pode ser número ou porcentagem
}

interface Tackles {
  total: number | null;
  blocks: number | null;
  interceptions: number | null;
}

interface Duels {
  total: number | null;
  won: number | null;
}

interface Dribbles {
  attempts: number | null;
  success: number | null;
  past: number | null;
}

interface Fouls {
  drawn: number | null;
  committed: number | null;
}

interface Cards {
  yellow: number | null;
  yellowred: number | null;
  red: number | null;
}

interface Penalty {
  won: number | null;
  commited: number | null;
  scored: number | null;
  missed: number | null;
  saved: number | null;
}

// Estatísticas por competição
interface Statistics {
  team: Team;
  league: League;
  games: GamesStats;
  substitutes: Substitutes;
  shots: Shots;
  goals: Goals;
  passes: Passes;
  tackles: Tackles;
  duels: Duels;
  dribbles: Dribbles;
  fouls: Fouls;
  cards: Cards;
  penalty: Penalty;
}

// Dados do jogador
interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: Birth;
  nationality: string;
  height: string | null; // Ex: "183 cm"
  weight: string | null; // Ex: "76 kg"
  injured: boolean;
  photo: string;
}

// Estrutura principal de resposta para cada jogador
interface PlayerResponse {
  player: Player;
  statistics: Statistics[];
}

// Estrutura da resposta completa da API
interface ApiResponse {
  get: string;
  parameters: {
    team: string;
    season: string;
  };
  errors: string[]; // Pode ser string[] ou any[], mas geralmente é string[]
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: PlayerResponse[];
}

// Exportar todos os tipos para uso em outros módulos
export type {
  Birth,
  Team,
  League,
  GamesStats,
  Substitutes,
  Shots,
  Goals,
  Passes,
  Tackles,
  Duels,
  Dribbles,
  Fouls,
  Cards,
  Penalty,
  Statistics,
  Player,
  PlayerResponse,
  ApiResponse,
};