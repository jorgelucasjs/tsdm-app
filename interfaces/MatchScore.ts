
// football-get-match-score
export interface MatchScore {
  name: string;
  id: number;
  score: number;
  imageUrl: string;
}

export interface MatchScoreResponse {
  status: string;
  response: {
    scores: MatchScore[];
  };
}