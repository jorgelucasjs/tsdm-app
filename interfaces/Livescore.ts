// =====================
// Tipos Básicos
// =====================

type Timestamp = number;

interface TimeInfo {
  datetime: string; // "2025-08-15 16:00:00"
  date: string;     // "2025-08-15"
  time: string;     // "16:00:00"
  minute: string;   // Pode ser vazio
  timestamp: Timestamp;
  timezone: string; // "UTC"
}

// =====================
// Times
// =====================

interface KitColors {
  home_main_color?: string;
  home_second_color?: string;
  home_number_color?: string;
  home_gk_main_color?: string;
  home_gk_second_color?: string;
  home_gk_number_color?: string;

  away_main_color?: string;
  away_second_color?: string;
  away_number_color?: string;
  away_gk_main_color?: string;
  away_gk_second_color?: string;
  away_gk_number_color?: string;
}

interface Team {
  id: number;
  name: string;
  short_code: string;
  img: string; // URL
  form: string; // ex: "4-3-3"
  coach_id: number | null;
  kit_colors: KitColors;
}

interface Teams {
  home: Team;
  away: Team;
}

// =====================
// Liga
// =====================

interface League {
  id: number;
  name: string;
  type: string; // Pode ser vazio
  country_id: string;
  country_name: string;
  country_code: string;
  country_flag: string; // URL
}

// =====================
// Placares
// =====================

interface Scores {
  home_score: string | number; // Pode ser vazio ou número
  away_score: string | number;
  ht_score: string | null;
  ft_score: string | null;
  et_score: string | null;
  ps_score: string | null;
}

// =====================
// Classificação
// =====================

interface Standings {
  home_position: number;
  away_position: number;
}

// =====================
// Árbitros
// =====================

interface Assistants {
  first_assistant_id: number | null;
  second_assistant_id: number | null;
  fourth_assistant_id: number | null;
}

// =====================
// Cobertura
// =====================

interface Coverage {
  has_lineups: 0 | 1;
  has_tvs: 0 | 1;
  has_standings: 0 | 1;
}

// =====================
// Partida (Match)
// =====================

export interface Match {
  id: number;
  status: number;
  status_name: "Notstarted" | "Live" | "Ended" | string; // Pode expandir
  status_period: string | null;
  pitch: string | null;
  referee_id: number | null;
  round_id: string;
  round_name: string;
  season_id: string;
  season_name: string;
  stage_id: string;
  stage_name: string;
  group_id: string;
  group_name: string;
  aggregate_id: number | null;
  winner_team_id: number | null;
  venue_id: string;
  leg: string | null;
  week: string;
  deleted: "0" | "1";
  info: string | null;
  related_id: number | null;
  attendance: number | null;
  time: TimeInfo;
  teams: Teams;
  league: League;
  scores: Scores;
  standings: Standings;
  assistants: Assistants;
  coverage: Coverage;
  weather_report: unknown | null; // Pode ser mais específico se houver dados
}

// =====================
// Meta (informações da API)
// =====================

interface Meta {
  requests_left: number;
  user: string;
  plan: string;
  pages: number;
  page: number;
  count: number;
  total: number;
  msg: string | null;
}

// =====================
// Estrutura Raiz
// =====================

export interface LiveScoreResponse {
  data: Match[];
  meta: Meta;
}