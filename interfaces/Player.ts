
// football-get-list-player-teamid
export interface PlayerSquad {
  title: string;
  members: Player[];
}

export interface Player {
  id: number;
  name: string;
  shirtNumber?: number;
  ccode: string;
  cname: string;
  role: {
    key: string;
    fallback: string;
  };
  positionId?: number;
  injury: string | null;
  rating: number | null;
  goals: number;
  penalties: number;
  assists: number;
  rcards: number;
  ycards: number;
  excludeFromRanking: boolean;
  positionIds?: string;
  positionIdsDesc?: string;
  height: number;
  age: number;
  dateOfBirth: string;
  transferValue?: number;
}

export interface PlayerListResponse {
  list: {
    squad: PlayerSquad[];
  };
}