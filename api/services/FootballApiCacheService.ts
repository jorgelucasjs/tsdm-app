import { cacheService } from './CacheService';
import {
  CacheDataType,
  FixtureCacheKey,
  TeamCacheKey,
  PlayerCacheKey,
  LeagueCacheKey,
  StandingsCacheKey,
  CoachCacheKey,
  VenueCacheKey,
  CountryCacheKey,
  CacheKeyGenerator,
  FixtureCacheStrategy,
} from '@/types/cacheTypes';
import { handleUserFriendlyError } from '@/utils/errorHandler';

export class FootballApiCacheService {
  private static instance: FootballApiCacheService;
  private fixtureStrategy: FixtureCacheStrategy;
  
  private constructor() {
    this.fixtureStrategy = new FixtureCacheStrategy();
  }
  
  static getInstance(): FootballApiCacheService {
    if (!FootballApiCacheService.instance) {
      FootballApiCacheService.instance = new FootballApiCacheService();
    }
    return FootballApiCacheService.instance;
  }
  
  // ==================== FIXTURES ====================
  
  /**
   * Cache para jogos ao vivo - sempre busca da API
   */
  async getLiveFixtures<T>(apiCall: () => Promise<T>): Promise<T> {
    // Jogos ao vivo nunca usam cache
    console.log('🔴 Buscando jogos ao vivo da API (sem cache)');
    return await apiCall();
  }
  
  /**
   * Cache para jogos por data
   */
  async getFixturesByDate<T>(
    date: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'date', date };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    // Verifica se deve usar cache
    if (!this.fixtureStrategy.shouldUseCache(cacheKey)) {
      console.log(`🔴 Buscando fixtures de ${date} da API (estratégia não permite cache)`);
      const data = await apiCall();
      
      // Salva no cache se não for hoje
      const today = new Date().toISOString().split('T')[0];
      if (date !== today) {
        const ttl = this.fixtureStrategy.getCacheTTL(cacheKey);
        await cacheService.saveToCache(
          key,
          data,
          CacheDataType.FIXTURES,
          `/fixtures?date=${date}`,
          { date },
          ttl
        );
      }
      
      return data;
    }
    
    // Tenta buscar do cache
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES,
      this.fixtureStrategy
    );
    
    if (cachedData) {
      console.log(`✅ Fixtures de ${date} encontrados no cache`);
      return cachedData.data;
    }
    
    // Busca da API e salva no cache
    console.log(`🔄 Buscando fixtures de ${date} da API e salvando no cache`);
    const data = await apiCall();
    const ttl = this.fixtureStrategy.getCacheTTL(cacheKey);
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures?date=${date}`,
      { date },
      ttl
    );
    
    return data;
  }
  
  /**
   * Cache para jogos de um time
   */
  async getTeamFixtures<T>(
    teamId: number,
    season: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'team', teamId, season };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    // Tenta buscar do cache
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES,
      this.fixtureStrategy
    );
    
    if (cachedData) {
      console.log(`✅ Fixtures do time ${teamId} encontrados no cache`);
      return cachedData.data;
    }
    
    // Busca da API e salva no cache
    console.log(`🔄 Buscando fixtures do time ${teamId} da API`);
    const data = await apiCall();
    const ttl = this.fixtureStrategy.getCacheTTL(cacheKey);
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures?season=${season}&team=${teamId}`,
      { teamId, season },
      ttl
    );
    
    return data;
  }
  
  /**
   * Cache para fixture por ID
   */
  async getFixtureById<T>(
    fixtureId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'id', fixtureId };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    // Tenta buscar do cache
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES
    );
    
    if (cachedData) {
      console.log(`✅ Fixture ${fixtureId} encontrado no cache`);
      return cachedData.data;
    }
    
    // Busca da API e salva no cache
    console.log(`🔄 Buscando fixture ${fixtureId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures?id=${fixtureId}`,
      { fixtureId },
      24 * 60 * 60 * 1000 // 24 horas para fixtures específicos
    );
    
    return data;
  }

  /**
   * Cache para jogos por liga
   */
  async getFixturesByLeague<T>(
    leagueId: number,
    season: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'league', leagueId, season };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES,
      this.fixtureStrategy
    );
    
    if (cachedData) {
      console.log(`✅ Fixtures da liga ${leagueId} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando fixtures da liga ${leagueId} da API`);
    const data = await apiCall();
    const ttl = this.fixtureStrategy.getCacheTTL(cacheKey);
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures?league=${leagueId}&season=${season}`,
      { leagueId, season },
      ttl
    );
    
    return data;
  }

  /**
   * Cache para jogos por intervalo de datas
   */
  async getFixturesByDateRange<T>(
    from: string,
    to: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'dateRange', from, to };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES,
      this.fixtureStrategy
    );
    
    if (cachedData) {
      console.log(`✅ Fixtures de ${from} a ${to} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando fixtures de ${from} a ${to} da API`);
    const data = await apiCall();
    const ttl = this.fixtureStrategy.getCacheTTL(cacheKey);
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures?from=${from}&to=${to}`,
      { from, to },
      ttl
    );
    
    return data;
  }

  /**
   * Cache para próximos jogos
   */
  async getNextFixtures<T>(
    teamId: number,
    next: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'next', teamId, next };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    // Próximos jogos têm cache mais curto pois mudam frequentemente
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES
    );
    
    if (cachedData) {
      console.log(`✅ Próximos ${next} jogos do time ${teamId} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando próximos ${next} jogos do time ${teamId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures?team=${teamId}&next=${next}`,
      { teamId, next },
      30 * 60 * 1000 // 30 minutos para próximos jogos
    );
    
    return data;
  }

  /**
   * Cache para últimos jogos
   */
  async getLastFixtures<T>(
    teamId: number,
    last: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'last', teamId, last };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES
    );
    
    if (cachedData) {
      console.log(`✅ Últimos ${last} jogos do time ${teamId} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando últimos ${last} jogos do time ${teamId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures?team=${teamId}&last=${last}`,
      { teamId, last },
      2 * 60 * 60 * 1000 // 2 horas para últimos jogos
    );
    
    return data;
  }

  /**
   * Cache para jogos por rodada
   */
  async getFixturesByRound<T>(
    leagueId: number,
    season: number,
    round: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'round', leagueId, season, round };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES,
      this.fixtureStrategy
    );
    
    if (cachedData) {
      console.log(`✅ Fixtures da rodada ${round} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando fixtures da rodada ${round} da API`);
    const data = await apiCall();
    const ttl = this.fixtureStrategy.getCacheTTL(cacheKey);
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures?league=${leagueId}&season=${season}&round=${encodeURIComponent(round)}`,
      { leagueId, season, round },
      ttl
    );
    
    return data;
  }

  /**
   * Cache para jogos por status
   */
  async getFixturesByStatus<T>(
    status: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'status', status };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    // Status como 'live' não devem usar cache
    if (status.toLowerCase() === 'live') {
      console.log('🔴 Buscando jogos ao vivo da API (sem cache)');
      return await apiCall();
    }
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES
    );
    
    if (cachedData) {
      console.log(`✅ Fixtures com status ${status} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando fixtures com status ${status} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures?status=${status}`,
      { status },
      60 * 60 * 1000 // 1 hora para jogos por status
    );
    
    return data;
  }

  /**
   * Cache para múltiplos jogos por IDs
   */
  async getFixturesByIds<T>(
    fixtureIds: number[],
    apiCall: () => Promise<T>
  ): Promise<T> {
    const idsString = fixtureIds.sort().join(',');
    const cacheKey: FixtureCacheKey = { type: 'ids', fixtureIds: idsString };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES
    );
    
    if (cachedData) {
      console.log(`✅ Fixtures ${idsString} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando fixtures ${idsString} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures?ids=${idsString}`,
      { fixtureIds: idsString },
      24 * 60 * 60 * 1000 // 24 horas para fixtures específicos
    );
    
    return data;
  }

  /**
   * Cache para rodadas de uma liga
   */
  async getFixtureRounds<T>(
    leagueId: number,
    season: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'rounds', leagueId, season };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES
    );
    
    if (cachedData) {
      console.log(`✅ Rodadas da liga ${leagueId} encontradas no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando rodadas da liga ${leagueId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures/rounds?league=${leagueId}&season=${season}`,
      { leagueId, season },
      7 * 24 * 60 * 60 * 1000 // 7 dias para rodadas (dados estáticos)
    );
    
    return data;
  }

  /**
   * Cache para estatísticas de um jogo
   */
  async getFixtureStatistics<T>(
    fixtureId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'statistics', fixtureId };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES
    );
    
    if (cachedData) {
      console.log(`✅ Estatísticas do jogo ${fixtureId} encontradas no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando estatísticas do jogo ${fixtureId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures/statistics?fixture=${fixtureId}`,
      { fixtureId },
      24 * 60 * 60 * 1000 // 24 horas para estatísticas de jogos
    );
    
    return data;
  }

  /**
   * Cache para eventos de um jogo
   */
  async getFixtureEvents<T>(
    fixtureId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'events', fixtureId };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES
    );
    
    if (cachedData) {
      console.log(`✅ Eventos do jogo ${fixtureId} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando eventos do jogo ${fixtureId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures/events?fixture=${fixtureId}`,
      { fixtureId },
      24 * 60 * 60 * 1000 // 24 horas para eventos de jogos
    );
    
    return data;
  }

  /**
   * Cache para escalações de um jogo
   */
  async getFixtureLineups<T>(
    fixtureId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'lineups', fixtureId };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES
    );
    
    if (cachedData) {
      console.log(`✅ Escalações do jogo ${fixtureId} encontradas no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando escalações do jogo ${fixtureId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures/lineups?fixture=${fixtureId}`,
      { fixtureId },
      24 * 60 * 60 * 1000 // 24 horas para escalações de jogos
    );
    
    return data;
  }

  /**
   * Cache para jogadores de um jogo
   */
  async getFixturePlayers<T>(
    fixtureId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: FixtureCacheKey = { type: 'players', fixtureId };
    const key = CacheKeyGenerator.generateFixtureKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.FIXTURES
    );
    
    if (cachedData) {
      console.log(`✅ Jogadores do jogo ${fixtureId} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando jogadores do jogo ${fixtureId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.FIXTURES,
      `/fixtures/players?fixture=${fixtureId}`,
      { fixtureId },
      24 * 60 * 60 * 1000 // 24 horas para jogadores de jogos
    );
    
    return data;
  }
  
  // ==================== TEAMS ====================
  
  /**
   * Cache para time por ID
   */
  async getTeamById<T>(
    teamId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: TeamCacheKey = { type: 'id', teamId };
    const key = CacheKeyGenerator.generateTeamKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.TEAMS
    );
    
    if (cachedData) {
      console.log(`✅ Time ${teamId} encontrado no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando time ${teamId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.TEAMS,
      `/teams?id=${teamId}`,
      { teamId }
    );
    
    return data;
  }
  
  /**
   * Cache para estatísticas de time
   */
  async getTeamStatistics<T>(
    teamId: number,
    leagueId: number,
    season: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: TeamCacheKey = { type: 'statistics', teamId, leagueId, season };
    const key = CacheKeyGenerator.generateTeamKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.TEAMS
    );
    
    if (cachedData) {
      console.log(`✅ Estatísticas do time ${teamId} encontradas no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando estatísticas do time ${teamId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.TEAMS,
      `/teams/statistics?league=${leagueId}&season=${season}&team=${teamId}`,
      { teamId, leagueId, season },
      12 * 60 * 60 * 1000 // 12 horas para estatísticas
    );
    
    return data;
  }
  
  /**
   * Cache para times por país
   */
  async getTeamsByCountry<T>(
    country: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: TeamCacheKey = { type: 'country', country };
    const key = CacheKeyGenerator.generateTeamKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.TEAMS
    );
    
    if (cachedData) {
      console.log(`✅ Times de ${country} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando times de ${country} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.TEAMS,
      `/teams?country=${country}`,
      { country },
      7 * 24 * 60 * 60 * 1000 // 7 dias para times por país
    );
    
    return data;
  }
  
  // ==================== PLAYERS ====================
  
  /**
   * Cache para jogador por ID
   */
  async getPlayerById<T>(
    playerId: number,
    season: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: PlayerCacheKey = { type: 'id', playerId, season };
    const key = CacheKeyGenerator.generatePlayerKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.PLAYERS
    );
    
    if (cachedData) {
      console.log(`✅ Jogador ${playerId} encontrado no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando jogador ${playerId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.PLAYERS,
      `/players?id=${playerId}&season=${season}`,
      { playerId, season }
    );
    
    return data;
  }
  
  /**
   * Cache para jogadores por time
   */
  async getPlayersByTeam<T>(
    teamId: number,
    season: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: PlayerCacheKey = { type: 'team', teamId, season };
    const key = CacheKeyGenerator.generatePlayerKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.PLAYERS
    );
    
    if (cachedData) {
      console.log(`✅ Jogadores do time ${teamId} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando jogadores do time ${teamId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.PLAYERS,
      `/players?team=${teamId}&season=${season}`,
      { teamId, season }
    );
    
    return data;
  }
  
  /**
   * Cache para times de um jogador
   */
  async getPlayerTeams<T>(
    playerId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: PlayerCacheKey = { type: 'teams', playerId };
    const key = CacheKeyGenerator.generatePlayerKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.PLAYERS
    );
    
    if (cachedData) {
      console.log(`✅ Times do jogador ${playerId} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando times do jogador ${playerId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.PLAYERS,
      `/players/teams?player=${playerId}`,
      { playerId },
      30 * 24 * 60 * 60 * 1000 // 30 dias para histórico de times
    );
    
    return data;
  }
  
  /**
   * Cache para busca de jogadores por nome
   */
  async searchPlayersByName<T>(
    playerName: string,
    leagueId: number | undefined,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: PlayerCacheKey = { 
      type: 'search', 
      playerName, 
      leagueId 
    };
    const key = CacheKeyGenerator.generatePlayerKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.PLAYERS
    );
    
    if (cachedData) {
      console.log(`✅ Busca por jogador "${playerName}" encontrada no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando jogador "${playerName}" da API`);
    const data = await apiCall();
    
    const endpoint = leagueId 
      ? `/players?league=${leagueId}&search=${encodeURIComponent(playerName)}`
      : `/players?search=${encodeURIComponent(playerName)}`;
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.PLAYERS,
      endpoint,
      { playerName, leagueId },
      6 * 60 * 60 * 1000 // 6 horas para buscas
    );
    
    return data;
  }
  
  /**
   * Cache para jogadores por liga
   */
  async getPlayersByLeague<T>(
    leagueId: number,
    season: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: PlayerCacheKey = { 
      type: 'league', 
      leagueId, 
      season 
    };
    const key = CacheKeyGenerator.generatePlayerKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.PLAYERS
    );
    
    if (cachedData) {
      console.log(`✅ Jogadores da liga ${leagueId} (temporada ${season}) encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando jogadores da liga ${leagueId} (temporada ${season}) da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.PLAYERS,
      `/players?league=${leagueId}&season=${season}`,
      { leagueId, season },
      24 * 60 * 60 * 1000 // 24 horas para jogadores por liga
    );
    
    return data;
  }
  
  /**
   * Cache para jogadores por time e temporada
   */
  async getPlayersByTeamAndSeason<T>(
    teamId: number,
    season: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: PlayerCacheKey = { 
      type: 'team_season', 
      teamId, 
      season 
    };
    const key = CacheKeyGenerator.generatePlayerKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.PLAYERS
    );
    
    if (cachedData) {
      console.log(`✅ Jogadores do time ${teamId} (temporada ${season}) encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando jogadores do time ${teamId} (temporada ${season}) da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.PLAYERS,
      `/players?team=${teamId}&season=${season}`,
      { teamId, season },
      24 * 60 * 60 * 1000 // 24 horas para jogadores por time e temporada
    );
    
    return data;
  }
  
  /**
   * Cache para todas as temporadas disponíveis
   */
  async getAllSeasons<T>(apiCall: () => Promise<T>): Promise<T> {
    const cacheKey: PlayerCacheKey = { type: 'seasons' };
    const key = CacheKeyGenerator.generatePlayerKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.PLAYERS
    );
    
    if (cachedData) {
      console.log('✅ Temporadas encontradas no cache');
      return cachedData.data;
    }
    
    console.log('🔄 Buscando temporadas da API');
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.PLAYERS,
      '/players/seasons',
      {},
      7 * 24 * 60 * 60 * 1000 // 7 dias para temporadas (dados estáticos)
    );
    
    return data;
  }
  
  /**
   * Cache para estatísticas de um jogador
   */
  async getPlayerStatistics<T>(
    playerId: number,
    season: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: PlayerCacheKey = { 
      type: 'statistics', 
      playerId, 
      season 
    };
    const key = CacheKeyGenerator.generatePlayerKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.PLAYERS
    );
    
    if (cachedData) {
      console.log(`✅ Estatísticas do jogador ${playerId} (temporada ${season}) encontradas no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando estatísticas do jogador ${playerId} (temporada ${season}) da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.PLAYERS,
      `/players?id=${playerId}&season=${season}`,
      { playerId, season },
      24 * 60 * 60 * 1000 // 24 horas para estatísticas de jogadores
    );
    
    return data;
  }
  
  // ==================== LEAGUES ====================
  
  /**
   * Cache para todas as ligas
   */
  async getLeagues<T>(apiCall: () => Promise<T>): Promise<T> {
    const cacheKey: LeagueCacheKey = { type: 'all' };
    const key = CacheKeyGenerator.generateLeagueKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.LEAGUES
    );
    
    if (cachedData) {
      console.log('✅ Ligas encontradas no cache');
      return cachedData.data;
    }
    
    console.log('🔄 Buscando ligas da API');
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.LEAGUES,
      '/leagues',
      {}
    );
    
    return data;
  }
  
  /**
   * Cache para liga por ID
   */
  async getLeagueById<T>(
    leagueId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: LeagueCacheKey = { type: 'id', leagueId };
    const key = CacheKeyGenerator.generateLeagueKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.LEAGUES
    );
    
    if (cachedData) {
      console.log(`✅ Liga ${leagueId} encontrada no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando liga ${leagueId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.LEAGUES,
      `/leagues?id=${leagueId}`,
      { leagueId }
    );
    
    return data;
  }
  
  /**
   * Cache para ligas por time
   */
  async getLeaguesByTeam<T>(
    teamId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: LeagueCacheKey = { type: 'team', teamId };
    const key = CacheKeyGenerator.generateLeagueKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.LEAGUES
    );
    
    if (cachedData) {
      console.log(`✅ Ligas do time ${teamId} encontradas no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando ligas do time ${teamId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.LEAGUES,
      `/leagues?team=${teamId}`,
      { teamId }
    );
    
    return data;
  }
  
  /**
   * Cache para ligas por país
   */
  async getLeaguesByCountry<T>(
    country: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: LeagueCacheKey = { type: 'country', country };
    const key = CacheKeyGenerator.generateLeagueKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.LEAGUES
    );
    
    if (cachedData) {
      console.log(`✅ Ligas do país ${country} encontradas no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando ligas do país ${country} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.LEAGUES,
      `/leagues?country=${country}`,
      { country }
    );
    
    return data;
  }
  
  // ==================== STANDINGS ====================
  
  /**
   * Cache para classificações
   */
  async getStandings<T>(
    leagueId: number,
    season: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    // Validar parâmetros antes de prosseguir
    if (!leagueId || leagueId <= 0) {
      throw new Error('ID da liga inválido');
    }
    
    if (!season || season === undefined || season <= 0) {
      console.warn(`Season inválida (${season}) para liga ${leagueId}, usando temporada atual`);
      season = new Date().getFullYear();
    }
    
    const cacheKey: StandingsCacheKey = { leagueId, season };
    const key = CacheKeyGenerator.generateStandingsKey(cacheKey);
    
    try {
      const cachedData = await cacheService.getFromCache<T>(
        key,
        CacheDataType.STANDINGS
      );
      
      if (cachedData) {
        console.log(`✅ Classificação da liga ${leagueId} encontrada no cache`);
        return cachedData.data;
      }
      
      console.log(`🔄 Buscando classificação da liga ${leagueId} da API`);
      const data = await apiCall();
      
      // Processar dados para remover arrays aninhados antes de salvar no cache
      const processedData = this.processStandingsData(data);
      
      try {
        await cacheService.saveToCache(
          key,
          processedData,
          CacheDataType.STANDINGS,
          `/standings?league=${leagueId}&season=${season}`,
          { leagueId, season }
        );
      } catch (cacheError) {
        // Log do erro técnico para desenvolvedores
        console.error('Erro ao salvar classificações no cache:', cacheError);
        // Não propaga o erro de cache, apenas retorna os dados da API
      }
      
      return data; // Retorna os dados originais para manter compatibilidade
    } catch (error) {
      // Se o erro for relacionado ao Firebase/cache, converte para mensagem amigável
      if (error instanceof Error && error.message.includes('FirebaseError')) {
        const friendlyMessage = handleUserFriendlyError(error, { 
          context: 'classificações',
          logError: false // Já foi logado acima
        });
        throw new Error(friendlyMessage);
      }
      // Para outros erros, mantém a mensagem original
      throw error;
    }
  }
  
  /**
   * Cache para top artilheiros de uma liga
   */
  async getTopScorers<T>(
    leagueId: number,
    season: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: PlayerCacheKey = { type: 'topscorers', leagueId, season };
    const key = CacheKeyGenerator.generatePlayerKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.PLAYERS
    );
    
    if (cachedData) {
      console.log(`✅ Top artilheiros da liga ${leagueId} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando top artilheiros da liga ${leagueId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.PLAYERS,
      `/players/topscorers?league=${leagueId}&season=${season}`,
      { leagueId, season },
      6 * 60 * 60 * 1000 // 6 horas para top scorers
    );
    
    return data;
  }
  
  // ==================== COACHES ====================
  
  /**
   * Cache para treinador por ID
   */
  async getCoachById<T>(
    coachId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: CoachCacheKey = { coachId };
    const key = CacheKeyGenerator.generateCoachKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.COACHES
    );
    
    if (cachedData) {
      console.log(`✅ Treinador ${coachId} encontrado no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando treinador ${coachId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.COACHES,
      `/coachs?id=${coachId}`,
      { coachId }
    );
    
    return data;
  }

  /**
   * Cache para carreira de um treinador
   */
  async getCoachCareer<T>(
    coachId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: CoachCacheKey = { coachId };
    const key = CacheKeyGenerator.generateCoachKey(cacheKey) + '_career';
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.COACHES
    );
    
    if (cachedData) {
      console.log(`✅ Carreira do treinador ${coachId} encontrada no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando carreira do treinador ${coachId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.COACHES,
      `/coachs?id=${coachId}`,
      { coachId },
      24 * 60 * 60 * 1000 // 24 horas para carreira de treinador
    );
    
    return data;
  }

  /**
   * Cache para estatísticas de um treinador
   */
  async getCoachStats<T>(
    coachId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: CoachCacheKey = { coachId };
    const key = CacheKeyGenerator.generateCoachKey(cacheKey) + '_stats';
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.COACHES
    );
    
    if (cachedData) {
      console.log(`✅ Estatísticas do treinador ${coachId} encontradas no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando estatísticas do treinador ${coachId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.COACHES,
      `/coachs?id=${coachId}`,
      { coachId },
      6 * 60 * 60 * 1000 // 6 horas para estatísticas de treinador
    );
    
    return data;
  }
  
  // ==================== VENUES ====================
  
  /**
   * Cache para estádio por ID
   */
  async getVenueById<T>(
    venueId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: VenueCacheKey = { type: 'id', venueId };
    const key = CacheKeyGenerator.generateVenueKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.VENUES
    );
    
    if (cachedData) {
      console.log(`✅ Estádio ${venueId} encontrado no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando estádio ${venueId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.VENUES,
      `/venues?id=${venueId}`,
      { venueId }
    );
    
    return data;
  }
  
  /**
   * Cache para times por estádio
   */
  async getTeamsByVenue<T>(
    venueId: number,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const cacheKey: VenueCacheKey = { type: 'teams', venueId };
    const key = CacheKeyGenerator.generateVenueKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.VENUES
    );
    
    if (cachedData) {
      console.log(`✅ Times do estádio ${venueId} encontrados no cache`);
      return cachedData.data;
    }
    
    console.log(`🔄 Buscando times do estádio ${venueId} da API`);
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.VENUES,
      `/teams?venue=${venueId}`,
      { venueId }
    );
    
    return data;
  }
  
  // ==================== COUNTRIES ====================
  
  /**
   * Cache para todos os países
   */
  async getCountries<T>(apiCall: () => Promise<T>): Promise<T> {
    const cacheKey: CountryCacheKey = { type: 'all' };
    const key = CacheKeyGenerator.generateCountryKey(cacheKey);
    
    const cachedData = await cacheService.getFromCache<T>(
      key,
      CacheDataType.COUNTRIES
    );
    
    if (cachedData) {
      console.log('✅ Países encontrados no cache');
      return cachedData.data;
    }
    
    console.log('🔄 Buscando países da API');
    const data = await apiCall();
    
    await cacheService.saveToCache(
      key,
      data,
      CacheDataType.COUNTRIES,
      '/countries',
      {}
    );
    
    return data;
  }
  
  // ==================== UTILITIES ====================
  
  /**
   * Limpa cache expirado
   */
  async clearExpiredCache(): Promise<void> {
    await cacheService.clearExpiredCache();
  }
  
  /**
   * Obtém estatísticas do cache
   */
  async getCacheStats() {
    return await cacheService.getCacheStats();
  }
  
  /**
   * Remove cache específico
   */
  async removeCacheByKey(key: string, dataType: CacheDataType): Promise<void> {
    await cacheService.removeFromCache(key, dataType);
  }

  /**
   * Processa dados de standings para remover arrays aninhados
   * Firebase não suporta arrays aninhados, então achatamos a estrutura
   */
  private processStandingsData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Se é um array, processa cada item
    if (Array.isArray(data)) {
      return data.map(item => this.processStandingsData(item));
    }

    // Se é um objeto, processa suas propriedades
    const processed: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (key === 'standings' && Array.isArray(value)) {
        // Achata o array aninhado de standings
        // standings: [[...]] -> standings: [...]
        processed[key] = value.length > 0 && Array.isArray(value[0]) ? value[0] : value;
      } else if (Array.isArray(value)) {
        // Para outros arrays, processa cada item
        processed[key] = value.map(item => this.processStandingsData(item));
      } else if (value && typeof value === 'object') {
        // Para objetos aninhados, processa recursivamente
        processed[key] = this.processStandingsData(value);
      } else {
        // Para valores primitivos, mantém como está
        processed[key] = value;
      }
    }

    return processed;
  }
}

export const footballApiCacheService = FootballApiCacheService.getInstance();
export default footballApiCacheService;