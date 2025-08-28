// Tipos para a API do RapidAPI Football

export type MatchStats = {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: {
    for: number;
    against: number;
  };
};

export type Standing = {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: "same" | "promotion" | "relegation" | string;
  description: string | null;
  all: MatchStats;
  home: MatchStats;
  away: MatchStats;
  update: string; // ISO date string
};

export type LeagueData = {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  standings: Standing[][]; // Array de arrays de times (ex: torneios podem ter grupos)
};

export type ResponseItem = {
  league: LeagueData;
};

export type RapidApiResponse = {
  get: string;
  parameters: {
    league: string;
    season: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: ResponseItem[];
};