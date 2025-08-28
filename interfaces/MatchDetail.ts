
// football-get-match-detail-eventid
export interface MatchDetail {
  matchId: string;
  matchName: string;
  matchRound: string;
  teamColors: {
    darkMode: {
      home: string;
      away: string;
    };
    lightMode: {
      home: string;
      away: string;
    };
    fontDarkMode: {
      home: string;
      away: string;
    };
    fontLightMode: {
      home: string;
      away: string;
    };
  };
  leagueId: number;
  leagueName: string;
  leagueRoundName: string;
  parentLeagueId: number;
  countryCode: string;
  homeTeam: {
    name: string;
    id: number;
  };
  awayTeam: {
    name: string;
    id: number;
  };
  coverageLevel: string;
  matchTimeUTC: string;
  matchTimeUTCDate: string;
  started: boolean;
  finished: boolean;
}

export interface MatchDetailResponse {
  status: string;
  response: {
    detail: MatchDetail;
  };
}
