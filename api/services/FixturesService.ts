import { ApiResponse, FixtureResponse, RoundsApiResponse } from '@/types/fixturesTypes';
import { footballApiCacheService } from './FootballApiCacheService';


const RAPIDAPI_KEY = '0a6a5c44d87893761cccb568a8181fd1';
const BASE_URL = 'https://v3.football.api-sports.io/';

class FixturesService {
  private readonly baseUrl = BASE_URL;
  private readonly headers = {
    //'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
    'x-rapidapi-key': RAPIDAPI_KEY
  };

  private async makeRequest(endpoint: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  private async makeRoundsRequest(endpoint: string): Promise<RoundsApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching rounds data:', error);
      throw error;
    }
  }

  /**
   * Busca todos os jogos ao vivo (sem cache - chamada direta à API)
   */
  async getLiveFixtures(): Promise<FixtureResponse[]> {
    const response = await this.makeRequest('/fixtures?live=all');
    return response.response;
  }

  /**
   * Busca fixture por ID específico
   */
  async getFixtureById(id: number): Promise<FixtureResponse | null> {
    const result = await footballApiCacheService.getFixtureById(id, async () => {
      const response = await this.makeRequest(`/fixtures?id=${id}`);
      return response.response[0] || null;
    });
    return result;
  }

  /**
   * Busca fixtures por data específica
   */
  async getFixturesByDate(date: string): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getFixturesByDate(date, async () => {
      const response = await this.makeRequest(`/fixtures?date=${date}`);
      return response.response;
    });
  }

  /**
   * Busca fixtures por liga e temporada
   */
  async getFixturesByLeague(leagueId: number, season: number): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getFixturesByLeague(leagueId, season, async () => {
      const response = await this.makeRequest(`/fixtures?league=${leagueId}&season=${season}`);
      return response.response;
    });
  }

  /**
   * Busca fixtures por time e temporada
   */
  async getFixturesByTeam(teamId: number, season: number): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getTeamFixtures(teamId, season, async () => {
      const response = await this.makeRequest(`/fixtures?season=${season}&team=${teamId}`);
      return response.response;
    });
  }

  /**
   * Busca fixtures por liga, temporada e período de datas
   */
  async getFixturesByDateRange(
    leagueId: number,
    season: number,
    from: string,
    to: string
  ): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getFixturesByDateRange(from, to, async () => {
      const response = await this.makeRequest(
        `/fixtures?league=${leagueId}&season=${season}&from=${from}&to=${to}`
      );
      return response.response;
    });
  }

  /**
   * Busca fixtures por liga, temporada e rodada
   */
  async getFixturesByRound(
    leagueId: number,
    season: number,
    round: string
  ): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getFixturesByRound(leagueId, season, round, async () => {
      const encodedRound = encodeURIComponent(round);
      const response = await this.makeRequest(
        `/fixtures?league=${leagueId}&season=${season}&round=${encodedRound}`
      );
      return response.response;
    });
  }

  /**
   * Busca fixtures por status
   */
  async getFixturesByStatus(
    status: string
  ): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getFixturesByStatus(status, async () => {
      const response = await this.makeRequest(
        `/fixtures?status=${status}`
      );
      return response.response;
    });
  }

  /**
   * Busca fixtures por liga, temporada e status
   */
  async getFixturesByLeagueAndStatus(
    leagueId: number,
    season: number,
    status: string
  ): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getFixturesByStatus(status, async () => {
      const response = await this.makeRequest(
        `/fixtures?league=${leagueId}&season=${season}&status=${status}`
      );
      return response.response;
    });
  }

  /**
   * Busca próximos N jogos gerais
   */
  async getNextFixtures(count: number = 50): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getFixturesByStatus('NS', async () => {
      const response = await this.makeRequest(`/fixtures?next=${count}`);
      return response.response;
    });
  }

  /**
   * Busca próximos N jogos de um time específico
   */
  async getNextFixturesByTeam(
    teamId: number,
    next: number
  ): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getNextFixtures(teamId, next, async () => {
      const response = await this.makeRequest(
        `/fixtures?team=${teamId}&next=${next}`
      );
      return response.response;
    });
  }

  /**
   * Busca últimos N jogos gerais
   */
  async getLastFixtures(count: number = 50): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getFixturesByStatus('FT', async () => {
      const response = await this.makeRequest(`/fixtures?last=${count}`);
      return response.response;
    });
  }

  /**
   * Busca últimos N jogos de um time específico
   */
  async getLastFixturesByTeam(
    teamId: number,
    last: number
  ): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getLastFixtures(teamId, last, async () => {
      const response = await this.makeRequest(
        `/fixtures?team=${teamId}&last=${last}`
      );
      return response.response;
    });
  }

  /**
   * Busca múltiplos fixtures por IDs
   */
  async getFixturesByIds(ids: number[]): Promise<FixtureResponse[]> {
    return await footballApiCacheService.getFixturesByIds(ids, async () => {
      const idsString = ids.join('-');
      const response = await this.makeRequest(`/fixtures?ids=${idsString}`);
      return response.response;
    });
  }

  /**
   * Busca rodadas de uma liga e temporada
   */
  async getFixtureRounds(
    leagueId: number,
    season: number,
    includeDates: boolean = true
  ): Promise<string[]> {
    return await footballApiCacheService.getFixtureRounds(leagueId, season, async () => {
      const response = await this.makeRoundsRequest(
        `/fixtures/rounds?league=${leagueId}&season=${season}&dates=${includeDates}`
      );
      return response.response;
    });
  }

  /**
   * Busca estatísticas de um fixture específico
   */
  async getFixtureStatistics(
    fixtureId: number,
    includeHalfTime: boolean = true
  ): Promise<any> {
    return await footballApiCacheService.getFixtureStatistics(fixtureId, async () => {
      const response = await this.makeRequest(
        `/fixtures/statistics?fixture=${fixtureId}&half=${includeHalfTime}`
      );
      return response.response;
    });
  }

  /**
   * Busca eventos de um fixture específico
   */
  async getFixtureEvents(fixtureId: number): Promise<any> {
    return await footballApiCacheService.getFixtureEvents(fixtureId, async () => {
      const response = await this.makeRequest(`/fixtures/events?fixture=${fixtureId}`);
      return response.response;
    });
  }

  /**
   * Busca lineups de um fixture específico
   */
  async getFixtureLineups(fixtureId: number): Promise<any> {
    return await footballApiCacheService.getFixtureLineups(fixtureId, async () => {
      const response = await this.makeRequest(`/fixtures/lineups?fixture=${fixtureId}`);
      return response.response;
    });
  }

  /**
   * Busca jogadores de um fixture específico
   */
  async getFixturePlayers(fixtureId: number): Promise<any> {
    return await footballApiCacheService.getFixturePlayers(fixtureId, async () => {
      const response = await this.makeRequest(`/fixtures/players?fixture=${fixtureId}`);
      return response.response;
    });
  }
}

export const fixturesService = new FixturesService();
export default fixturesService;