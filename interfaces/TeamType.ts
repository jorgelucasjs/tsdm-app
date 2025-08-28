export type TeamType  = {
  id: string;
  name: string;
  short_code: string;
  country: string;
  founded: number;
  stadium: string;
  players: number;
  img: string;
  form?: string;
  coach_id: string;
  kit_colors?: {
    [key: string]: string;
  };
}