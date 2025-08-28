
export interface LeaguesResponse {
  data: League[];
  meta: MetaData;
};

export interface League  {
  id: string;
  name: string;
  is_cup: string;
  is_amateur: string;
  is_friendly: string;
  continent_id: string;
  continent_name: string;
  country_id: string;
  country_name: string;
  cc: string;
  current_season_id: string;
  current_round_id: string;
  current_stage_id: string | null;
};

type MetaData = {
  requests_left: number;
  user: string;
  plan: string;
  pages: number;
  page: string;
  count: number;
  total: number;
  msg: string | null;
};
