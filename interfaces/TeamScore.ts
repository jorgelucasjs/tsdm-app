
export interface TeamScore {
  id: number;
  score: number;
  name: string;
  longName?: string;
  redCards?: number;
}

export interface TeamScoreSimple {
  id: string;
  name: string;
  score: number;
}