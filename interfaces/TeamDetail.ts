

// football-league-team-id
export interface TeamDetail {
  id: string;
  type: string;
  name: string;
  latestSeason: string;
  shortName: string;
  country: string;
  founded: number;
  stadium: string;
  capacity: number;
  players: number;
  president: string;
  coach: string;
  logo: string;
  city: string;
  faqJSONLD: {
    '@context': string;
    '@type': string;
    mainEntity: Array<{
      '@type': string;
      name: string;
      acceptedAnswer: {
        '@type': string;
        text: string;
      };
    }>;
  };
  sportsTeamJSONLD: {
    '@context': string;
    '@type': string;
    name: string;
    sport: string;
    gender: string;
    logo: string;
    url: string;
    athlete: any[];
    location: {
      '@type': string;
      name: string;
      address: {
        '@type': string;
        addressCountry: string;
        addressLocality: string;
      };
      geo: {
        '@type': string;
        latitude: string;
        longitude: string;
      };
    };
    memberOf: {
      '@type': string;
      name: string;
      url: string;
    };
  };
  breadcrumbJSONLD: {
    '@context': string;
    '@type': string;
    itemListElement: Array<{
      '@type': string;
      position: number;
      name: string;
      item: string;
    }>;
  };
  canSyncCalendar: boolean;
  primaryLeagueId: number;
  primaryLeagueName: string;
}

export interface TeamDetailResponse {
  status: string;
  response: {
    details: TeamDetail;
  };
}