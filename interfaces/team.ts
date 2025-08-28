export interface Team {
  id: number | string;
  name: string;
  fullName: string;
  logo: string;
  competition: string;
  country: string;
  founded: string;
  stadium: string;
  capacity: string;
  coach: string;
  form: string[];
  stats: {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  }
}
