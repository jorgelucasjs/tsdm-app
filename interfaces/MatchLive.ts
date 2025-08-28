export enum MatchStatus {
  NotStarted = "Not Started",
  Inplay = "Inplay",
  Halftime = "Halftime",
  Finished = "Finished",
  Postponed = "Postponed",
  Cancelled = "Cancelled",
  Suspended = "Suspended",
  Abandoned = "Abandoned",
  live = "live",
}

export interface MatchLive {
  id: string;
  status: number;
  status_name: MatchStatus; // Usando o enum aqui
  status_period: string | null;
  pitch: string | null;
  referee_id: string;
  round_id: string;
  round_name: string;
  season_id: string;
  season_name: string;
  stage_id: string;
  stage_name: string;
  group_id: string;
  group_name: string;
  aggregate_id: string | null;
  winner_team_id: string | null;
  venue_id: string;
  leg: string | null;
  week: string;
  deleted: string;
  info: string | null;
  related_id: string | null;
  attendance: string | null;
  time: {
    datetime: string;
    date: string;
    time: string;
    minute: number;
    timestamp: number;
    timezone: string;
  };
  teams: {
    home: Team;
    away: Team;
  };
  league: {
    id: number;
    name: string;
    type: string;
    country_id: string;
    country_name: string;
    country_code: string;
    country_flag: string;
  };
  scores: {
    home_score: string;
    away_score: string;
    ht_score: string;
    ft_score: string;
    et_score: string | null;
    ps_score: string | null;
  };
  standings: {
    home_position: number;
    away_position: number;
  };
  assistants: {
    first_assistant_id: string | null;
    second_assistant_id: string | null;
    fourth_assistant_id: string | null;
  };
  coverage: {
    has_lineups: number;
    has_tvs: number;
    has_standings: number;
  };
  weather_report: string | null;
}

interface Team {
  id: number;
  name: string;
  short_code: string;
  img: string;
  form: string;
  coach_id: string;
  kit_colors: {
    [key: string]: string;
  };
}


export interface MatchLineup {
  data: {
    home: TeamLineup;
    away: TeamLineup;
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

export interface TeamLineup {
  formation: string;
  confirmed_formation: number;
  coach: {
    id: number;
    name: string;
  };
  squad: SquadMember[];
}

export interface SquadMember {
  player: {
    id: string;
    name: string;
    common_name: string;
    firstname: string | null;
    lastname: string | null;
    weight: string | null;
    height: string | null;
    img: string;
    country: {
      id: string | null;
      name: string | null;
      cc: string | null;
    };
  };
  number: string;
  captain: string | null;
  position: string;
  position_name: string;
  order: number;
}