import { ApiResponse as PlayersResponse } from '@/types/PlayerTypes';
import { FixturesResponse, LeaguesByTeamResponse, TeamsResponse, TeamStatisticsResponse } from '@/types/teamDetailsTypes';
import footballApiCacheService from './services/FootballApiCacheService';
import { BASE_URL, FOOTBALL_PI_KEY } from './utils';
import { executeRequest } from './utils/devUtils';


class FootballApiService {
  private headers: Headers;

  constructor() {
    this.headers = new Headers();
    //this.headers.append('x-rapidapi-host', RAPIDAPI_HOST);
    this.headers.append('x-rapidapi-key', FOOTBALL_PI_KEY);
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Busca informações básicas de um time pelo ID
   */
  async getTeamById(teamId: number): Promise<TeamsResponse> {
    return footballApiCacheService.getTeamById(
      teamId,
      () => executeRequest(
        'getTeamById',
        () => this.makeRequest<TeamsResponse>(`/teams?id=${teamId}`),
        { teamId }
      )
    );
  }


  /**
   * Busca estatísticas de um time em uma liga/temporada específica
   */
  async getTeamStatistics(teamId: number, leagueId: number, season: number): Promise<TeamStatisticsResponse> {
    return footballApiCacheService.getTeamStatistics(
      teamId,
      leagueId,
      season,
      () => executeRequest(
        'getTeamStatistics',
        () => this.makeRequest<TeamStatisticsResponse>(`/teams/statistics?league=${leagueId}&season=${season}&team=${teamId}`),
        { teamId, leagueId, season }
      )
    );
  }

  /**
   * Busca todas as ligas que um time participou
   */
  async getLeaguesByTeam(teamId: number): Promise<LeaguesByTeamResponse> {
    return footballApiCacheService.getLeaguesByTeam(
      teamId,
      () => executeRequest(
        'getLeaguesByTeam',
        () => this.makeRequest<LeaguesByTeamResponse>(`/leagues?team=${teamId}`),
        { teamId }
      )
    );
  }

  /**
   * Busca jogos de um time em uma temporada específica
   */
  async getTeamFixtures(teamId: number, season: number): Promise<FixturesResponse> {
    return footballApiCacheService.getTeamFixtures(
      teamId,
      season,
      () => executeRequest(
        'getTeamFixtures',
        () => this.makeRequest<FixturesResponse>(`/fixtures?season=${season}&team=${teamId}`),
        { teamId, season }
      )
    );
  }

  /**
   * Busca próximos jogos de um time
   */
  async getUpcomingFixtures(teamId: number, next: number = 5): Promise<FixturesResponse> {
    return executeRequest(
      'getUpcomingFixtures',
      () => this.makeRequest<FixturesResponse>(`/fixtures?team=${teamId}&next=${next}`),
      { teamId, next }
    );
  }

  /**
   * Busca jogos recentes de um time
   */
  async getRecentFixtures(teamId: number, last: number = 5): Promise<FixturesResponse> {
    return footballApiCacheService.getTeamFixtures(
      teamId,
      new Date().getFullYear(),
      () => executeRequest(
        'getRecentFixtures',
        () => this.makeRequest<FixturesResponse>(`/fixtures?team=${teamId}&last=${last}`),
        { teamId, last }
      )
    );
  }

  /**
   * Busca jogadores de um time em uma temporada específica
   */
  async getPlayersByTeam(teamId: number, season: number): Promise<PlayersResponse> {
    return footballApiCacheService.getPlayersByTeam(
      teamId,
      season,
      () => executeRequest(
        'getPlayersByTeam',
        () => this.makeRequest<PlayersResponse>(`/players?team=${teamId}&season=${season}`),
        { teamId, season }
      )
    );
  }

  /**
   * Busca jogos ao vivo - sempre da API (sem cache)
   */
  async getLiveFixtures(): Promise<any> {
    return executeRequest(
      'getLiveFixtures',
      () => this.makeRequest<any>('/fixtures?live=all')
    );
  }

  /**
   * Busca jogos de hoje
   */
  async getTodayFixtures(): Promise<any> {
    const today = new Date().toISOString().split('T')[0];
    return footballApiCacheService.getFixturesByDate(
      today,
      () => executeRequest(
        'getTodayFixtures',
        () => this.makeRequest<any>(`/fixtures?date=${today}`)
      )
    );
  }

  /**
   * Busca classificações de uma liga
   */
  async getStandings(leagueId: number, season: number): Promise<any> {
    return footballApiCacheService.getStandings(
      leagueId,
      season,
      () => executeRequest(
        'getStandings',
        () => this.makeRequest<any>(`/standings?league=${leagueId}&season=${season}`),
        { leagueId, season }
      )
    );
  }

  /**
   * Busca top artilheiros de uma liga
   */
  async getTopScorers(leagueId: number, season: number): Promise<any> {
    return footballApiCacheService.getTopScorers(
      leagueId,
      season,
      () => executeRequest(
        'getTopScorers',
        () => this.makeRequest<any>(`/players/topscorers?league=${leagueId}&season=${season}`),
        { leagueId, season }
      )
    );
  }

  /**
   * Busca todas as ligas disponíveis
   */
  async getLeagues(): Promise<any> {
    return footballApiCacheService.getLeagues(
      () => executeRequest(
        'getLeagues',
        () => this.makeRequest<any>('/leagues')
      )
    );
  }

  /**
   * Busca ligas por país
   */
  async getLeaguesByCountry(country: string): Promise<any> {
    return footballApiCacheService.getLeaguesByCountry(
      country,
      () => executeRequest(
        'getLeaguesByCountry',
        () => this.makeRequest<any>(`/leagues?country=${country}`)
      )
    );
  }

  /**
   * Busca estatísticas de uma liga
   */
  // async getLeagueStatistics(leagueId: number, season: number): Promise<any> {
  //   return this.makeRequest<any>(`/leagues/statistics?league=${leagueId}&season=${season}`);
  // }

  /**
   * Busca próximos jogos por data
   */
  async getFixturesByDate(date: string): Promise<any> {
    return footballApiCacheService.getFixturesByDate(
      date,
      () => executeRequest(
        'getFixturesByDate',
        () => this.makeRequest<any>(`/fixtures?date=${date}`),
        { date }
      )
    );
  }

  /**
   * Busca jogos por liga e temporada
   */
  // async getFixturesByLeague(leagueId: number, season: number): Promise<any> {
  //   return this.makeRequest<any>(`/fixtures?league=${leagueId}&season=${season}`);
  // }

  /**
   * Busca informações de um jogador pelo ID
   */
  async getPlayerById(playerId: number, season: number = 2024): Promise<any> {
    return footballApiCacheService.getPlayerById(
      playerId,
      season,
      () => executeRequest(
        'getPlayerById',
        () => this.makeRequest<any>(`/players?id=${playerId}&season=${season}`),
        { playerId, season }
      )
    );
  }

  /**
   * Busca estatísticas de um jogador em uma temporada específica
   */
  async getPlayerStatistics(playerId: number, season: number): Promise<any> {
    return footballApiCacheService.getPlayerStatistics(
      playerId,
      season,
      () => executeRequest(
        'getPlayerStatistics',
        () => this.makeRequest<any>(`/players?id=${playerId}&season=${season}`)
      )
    );
  }

  /**
   * Busca todas as temporadas disponíveis para um jogador
   */
  // async getPlayerSeasons(playerId: number): Promise<any> {
  //   return this.makeRequest<any>(`/players/seasons?player=${playerId}`);
  // }

  /**
   * Busca todas as temporadas disponíveis na API
   */
  async getAllSeasons(): Promise<any> {
    return footballApiCacheService.getAllSeasons(
      () => executeRequest(
        'getAllSeasons',
        () => this.makeRequest<any>(`/players/seasons`)
      )
    );
  }

  /**
   * Busca jogadores por nome em uma liga específica
   */
  async searchPlayersByName(playerName: string, leagueId?: number): Promise<any> {
    return footballApiCacheService.searchPlayersByName(
      playerName,
      leagueId,
      () => {
        const endpoint = leagueId 
          ? `/players?league=${leagueId}&search=${encodeURIComponent(playerName)}`
          : `/players?search=${encodeURIComponent(playerName)}`;
        return executeRequest(
          'searchPlayersByName',
          () => this.makeRequest<any>(endpoint)
        );
      }
    );
  }

  /**
   * Busca estatísticas de jogadores por liga e temporada
   */
  async getPlayersByLeague(leagueId: number, season: number): Promise<any> {
    return footballApiCacheService.getPlayersByLeague(
      leagueId,
      season,
      () => executeRequest(
        'getPlayersByLeague',
        () => this.makeRequest<any>(`/players?league=${leagueId}&season=${season}`)
      )
    );
  }

  /**
   * Busca estatísticas de jogadores por time e temporada
   */
  async getPlayersByTeamAndSeason(teamId: number, season: number): Promise<any> {
    return footballApiCacheService.getPlayersByTeamAndSeason(
      teamId,
      season,
      () => executeRequest(
        'getPlayersByTeamAndSeason',
        () => this.makeRequest<any>(`/players?team=${teamId}&season=${season}`)
      )
    );
  }

  /**
	 * Get all teams a player has played for
	 */
	async getPlayerTeams(playerId: number): Promise<any> {
		return footballApiCacheService.getPlayerTeams(
			playerId,
			() => executeRequest(
				'getPlayerTeams',
				async () => {
					try {
						const response = await this.makeRequest(`/players/teams?player=${playerId}`);
						return response;
					} catch (error) {
						console.error('Error fetching player teams:', error);
						throw error;
					}
				},
				{ playerId }
			)
		);
	}

  /**
   * Busca informações de uma liga pelo ID
   */
  async getLeagueById(leagueId: number): Promise<any> {
    return footballApiCacheService.getLeagueById(
      leagueId,
      () => executeRequest(
        'getLeagueById',
        () => this.makeRequest<any>(`/leagues?id=${leagueId}`),
        { leagueId }
      )
    );
  }

  /**
   * Busca informações de um treinador pelo ID
   */
  async getCoachById(coachId: number): Promise<any> {
    return footballApiCacheService.getCoachById(
      coachId,
      () => executeRequest(
        'getCoachById',
        () => this.makeRequest<any>(`/coachs?id=${coachId}`),
        { coachId }
      )
    );
  }

  /**
   * Busca carreira de um treinador
   */
  async getCoachCareer(coachId: number): Promise<any> {
    return footballApiCacheService.getCoachCareer(
      coachId,
      () => executeRequest(
        'getCoachCareer',
        () => this.makeRequest<any>(`/coachs?id=${coachId}`),
        { coachId }
      )
    );
  }

  /**
   * Busca informações de um estádio pelo ID
   */
  async getVenueById(venueId: number): Promise<any> {
    return footballApiCacheService.getVenueById(
      venueId,
      () => executeRequest(
        'getVenueById',
        () => this.makeRequest<any>(`/venues?id=${venueId}`),
        { venueId }
      )
    );
  }

  /**
   * Busca times que jogam em um estádio
   */
  async getTeamsByVenue(venueId: number): Promise<any> {
    return footballApiCacheService.getTeamsByVenue(
      venueId,
      () => executeRequest(
        'getTeamsByVenue',
        () => this.makeRequest<any>(`/teams?venue=${venueId}`),
        { venueId }
      )
    );
  }

  /**
   * Busca todos os países disponíveis
   */
  async getCountries(): Promise<any> {
    return footballApiCacheService.getCountries(
      () => executeRequest(
        'getCountries',
        () => this.makeRequest<any>('/countries')
      )
    );
  }

  /**
   * Busca times de um país
   */
  async getTeamsByCountry(country: string): Promise<any> {
    return footballApiCacheService.getTeamsByCountry(
      country,
      () => executeRequest(
        'getTeamsByCountry',
        () => this.makeRequest<any>(`/teams?country=${country}`),
        { country }
      )
    );
  }

  /**
   * Busca estatísticas de um treinador
   */
  async getCoachStats(coachId: number): Promise<any> {
    return footballApiCacheService.getCoachStats(
      coachId,
      () => executeRequest(
        'getCoachStats',
        () => this.makeRequest<any>(`/coachs?id=${coachId}`),
        { coachId }
      )
    );
  }
}

export const footballApi = new FootballApiService();
export default footballApi;