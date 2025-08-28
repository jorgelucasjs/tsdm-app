// Tipos para o sistema de cache da API de futebol

export interface CacheMetadata {
  id: string;
  endpoint: string;
  params: Record<string, any>;
  cachedAt: Date;
  expiresAt: Date;
  dataType: CacheDataType;
  isLive?: boolean;
}

export enum CacheDataType {
  FIXTURES = 'fixtures',
  TEAMS = 'teams',
  PLAYERS = 'players',
  LEAGUES = 'leagues',
  STANDINGS = 'standings',
  COACHES = 'coaches',
  VENUES = 'venues',
  COUNTRIES = 'countries',
  SEARCH = 'search'
}

export interface CachedData<T = any> {
  id: string;
  data: T;
  metadata: CacheMetadata;
  createdAt: Date;
  updatedAt: Date;
}

// Configurações de cache por tipo de dados
export interface CacheConfig {
  ttl: number; // Time to live em milissegundos
  refreshOnExpiry: boolean;
  alwaysFresh?: boolean; // Para dados que sempre devem vir da API (ex: jogos ao vivo)
}

export const CACHE_CONFIGS: Record<CacheDataType, CacheConfig> = {
  [CacheDataType.FIXTURES]: {
    ttl: 5 * 60 * 1000, // 5 minutos para fixtures
    refreshOnExpiry: true,
    alwaysFresh: false
  },
  [CacheDataType.TEAMS]: {
    ttl: 24 * 60 * 60 * 1000, // 24 horas para times
    refreshOnExpiry: true
  },
  [CacheDataType.PLAYERS]: {
    ttl: 12 * 60 * 60 * 1000, // 12 horas para jogadores
    refreshOnExpiry: true
  },
  [CacheDataType.LEAGUES]: {
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 dias para ligas
    refreshOnExpiry: true
  },
  [CacheDataType.STANDINGS]: {
    ttl: 60 * 60 * 1000, // 1 hora para classificações
    refreshOnExpiry: true
  },
  [CacheDataType.COACHES]: {
    ttl: 24 * 60 * 60 * 1000, // 24 horas para treinadores
    refreshOnExpiry: true
  },
  [CacheDataType.VENUES]: {
    ttl: 30 * 24 * 60 * 60 * 1000, // 30 dias para estádios
    refreshOnExpiry: false
  },
  [CacheDataType.COUNTRIES]: {
    ttl: 30 * 24 * 60 * 60 * 1000, // 30 dias para países
    refreshOnExpiry: false
  },
  [CacheDataType.SEARCH]: {
    ttl: 10 * 60 * 1000, // 10 minutos para buscas
    refreshOnExpiry: true
  }
};

// Tipos específicos para diferentes endpoints
export interface FixtureCacheKey {
  type: 'live' | 'date' | 'team' | 'league' | 'id' | 'dateRange' | 'next' | 'last' | 'round' | 'status' | 'ids' | 'rounds' | 'statistics' | 'events' | 'lineups' | 'players';
  date?: string;
  teamId?: number;
  leagueId?: number;
  season?: number;
  fixtureId?: number;
  from?: string;
  to?: string;
  next?: number;
  last?: number;
  round?: string;
  status?: string;
  fixtureIds?: string;
}

export interface TeamCacheKey {
  type: 'id' | 'country' | 'venue' | 'statistics';
  teamId?: number;
  country?: string;
  venueId?: number;
  leagueId?: number;
  season?: number;
}

export interface PlayerCacheKey {
  type: 'id' | 'team' | 'search' | 'teams' | 'league' | 'team_season' | 'seasons' | 'statistics' | 'topscorers';
  playerId?: number;
  teamId?: number;
  season?: number;
  search?: string;
  playerName?: string;
  leagueId?: number;
}

export interface LeagueCacheKey {
  type: 'id' | 'all' | 'country' | 'team';
  leagueId?: number;
  country?: string;
  teamId?: number;
}

export interface StandingsCacheKey {
  leagueId: number;
  season: number;
}

export interface CoachCacheKey {
  coachId: number;
}

export interface VenueCacheKey {
  type: 'id' | 'teams';
  venueId: number;
}

export interface CountryCacheKey {
  type: 'all' | 'teams';
  country?: string;
}

export interface SearchCacheKey {
  type: 'all' | 'teams' | 'players' | 'leagues' | 'countries' | 'coaches' | 'venues';
  query: string;
  leagueId?: number;
}

// Utilitários para gerar chaves de cache
export class CacheKeyGenerator {
  static generateFixtureKey(params: FixtureCacheKey): string {
    const parts = [`fixtures_${params.type}`];
    
    if (params.date) parts.push(`date_${params.date}`);
    if (params.teamId) parts.push(`team_${params.teamId}`);
    if (params.leagueId) parts.push(`league_${params.leagueId}`);
    if (params.season) parts.push(`season_${params.season}`);
    if (params.fixtureId) parts.push(`id_${params.fixtureId}`);
    
    return parts.join('_');
  }
  
  static generateTeamKey(params: TeamCacheKey): string {
    const parts = [`teams_${params.type}`];
    
    if (params.teamId) parts.push(`id_${params.teamId}`);
    if (params.country) parts.push(`country_${params.country}`);
    if (params.venueId) parts.push(`venue_${params.venueId}`);
    if (params.leagueId) parts.push(`league_${params.leagueId}`);
    if (params.season) parts.push(`season_${params.season}`);
    
    return parts.join('_');
  }
  
  static generatePlayerKey(params: PlayerCacheKey): string {
    const parts = [`players_${params.type}`];
    
    if (params.playerId) parts.push(`id_${params.playerId}`);
    if (params.teamId) parts.push(`team_${params.teamId}`);
    if (params.season) parts.push(`season_${params.season}`);
    if (params.search) parts.push(`search_${encodeURIComponent(params.search)}`);
    
    return parts.join('_');
  }
  
  static generateLeagueKey(params: LeagueCacheKey): string {
    const parts = [`leagues_${params.type}`];
    
    if (params.leagueId) parts.push(`id_${params.leagueId}`);
    if (params.country) parts.push(`country_${params.country}`);
    if (params.teamId) parts.push(`team_${params.teamId}`);
    
    return parts.join('_');
  }
  
  static generateStandingsKey(params: StandingsCacheKey): string {
    return `standings_league_${params.leagueId}_season_${params.season}`;
  }
  
  static generateCoachKey(params: CoachCacheKey): string {
    return `coaches_id_${params.coachId}`;
  }
  
  static generateVenueKey(params: VenueCacheKey): string {
    return `venues_${params.type}_id_${params.venueId}`;
  }
  
  static generateCountryKey(params: CountryCacheKey): string {
    const parts = [`countries_${params.type}`];
    if (params.country) parts.push(`name_${params.country}`);
    return parts.join('_');
  }
  
  static generateSearchKey(params: SearchCacheKey): string {
    const parts = [`search_${params.type}`];
    parts.push(`query_${params.query.toLowerCase().replace(/\s+/g, '_')}`);
    if (params.leagueId) parts.push(`league_${params.leagueId}`);
    return parts.join('_');
  }
}

// Interface para estratégias de cache
export interface CacheStrategy {
  shouldUseCache(params: any): boolean;
  shouldRefreshCache(cachedData: CachedData): boolean;
  getCacheTTL(params: any): number;
}

// Estratégia específica para fixtures
export class FixtureCacheStrategy implements CacheStrategy {
  shouldUseCache(params: FixtureCacheKey): boolean {
    // Jogos ao vivo nunca usam cache
    if (params.type === 'live') {
      return false;
    }
    
    // Jogos de hoje podem usar cache por pouco tempo
    if (params.type === 'date' && params.date) {
      const today = new Date().toISOString().split('T')[0];
      return params.date !== today;
    }
    
    return true;
  }
  
  shouldRefreshCache(cachedData: CachedData): boolean {
    const now = new Date();
    return now > cachedData.metadata.expiresAt;
  }
  
  getCacheTTL(params: FixtureCacheKey): number {
    if (params.type === 'live') {
      return 0; // Nunca cachear jogos ao vivo
    }
    
    if (params.type === 'date' && params.date) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      if (params.date === today) {
        return 2 * 60 * 1000; // 2 minutos para jogos de hoje
      } else if (params.date === tomorrow) {
        return 10 * 60 * 1000; // 10 minutos para jogos de amanhã
      } else {
        return 24 * 60 * 60 * 1000; // 24 horas para outros jogos
      }
    }
    
    return CACHE_CONFIGS[CacheDataType.FIXTURES].ttl;
  }
}