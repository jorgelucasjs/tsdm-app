// Shared Interfaces
export interface MatchStatus {
  utcTime: string;
  finished: boolean;
  started: boolean;
  cancelled: boolean;
  awarded?: boolean;
  scoreStr?: string;
  reason?: {
    short: string;
    shortKey: string;
    long: string;
    longKey: string;
  };
  numberOfHomeRedCards?: number;
  numberOfAwayRedCards?: number;
  halfs?: {
    firstHalfStarted?: string;
    firstHalfEnded?: string;
    secondHalfStarted?: string;
    secondHalfEnded?: string;
    firstExtraHalfStarted?: string;
    secondExtraHalfStarted?: string;
    gameEnded?: string;
  };
  whoLostOnPenalties?: string | null;
  whoLostOnAggregated?: string;
}