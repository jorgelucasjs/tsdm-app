export interface ApiResponse<T> {
  ok: boolean;
  message?: string;
  data: T;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  flag?: string;
}

export interface League {
  id: number;
  name: string;
  country_id: number;
  season_id?: number;
}

export interface Season {
  id: number;
  name: string;
  league_id: number;
}

export interface Stage {
  id: number;
  name: string;
  season_id: number;
}

export interface Group {
  id: number;
  name: string;
  season_id: number;
}

export interface Round {
  id: number;
  name: string;
  season_id: number;
}

export interface Team {
  id: number;
  name: string;
  country_id?: number;
  season_id?: number;
}

export interface Player {
  id: number;
  name: string;
  team_id?: number;
}

export interface Stat {
  id: number;
  type: string;
  value: number;
}

export interface Leader {
  player_id: number;
  goals?: number;
  assists?: number;
  cards?: number;
}



export interface LeagueData {
	id: number;
	name: string;
	type: string;
	logo: string;
	country: {
		name: string;
		code: string;
		flag: string;
	};
	seasons: {
		year: number;
		start: string;
		end: string;
		current: boolean;
	}[];
}

export interface StandingTeam {
	rank: number;
	team: {
		id: number;
		name: string;
		logo: string;
	};
	points: number;
	gamesDiff: number;
	all: {
		played: number;
		win: number;
		draw: number;
		lose: number;
		goals: {
			for: number;
			against: number;
		};
	};
	form: string;
	status: string;
	description: string;
}
