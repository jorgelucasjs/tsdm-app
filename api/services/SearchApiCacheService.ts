import { CacheService } from './CacheService';
import { CacheDataType, SearchCacheKey, CacheKeyGenerator } from '@/types/cacheTypes';
import { BASE_URL, FOOTBALL_PI_KEY } from '@/utils';
import { executeRequest } from '@/utils/devUtils';

interface SearchResult {
  id: number | string;
  type: 'team' | 'player' | 'league' | 'country' | 'coach' | 'venue';
  name: string;
  image?: string;
  logo?: string;
  [key: string]: any;
}

export class SearchApiCacheService {
  private cacheService: CacheService;
  private headers: Headers;
  private lastRequestTime = 0;
  private readonly REQUEST_DELAY = 3000; // 3 segundos entre requisições

  constructor() {
    this.cacheService = CacheService.getInstance();
    this.headers = new Headers();
    this.headers.append('x-rapidapi-key', FOOTBALL_PI_KEY);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.REQUEST_DELAY) {
      await this.delay(this.REQUEST_DELAY - timeSinceLastRequest);
    }
    
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
      this.lastRequestTime = Date.now();
      
      if (!response.ok) {
        if (response.status === 429) {
          const waitTime = Math.min(10000, 5000 + Math.random() * 5000);
          console.warn(`Rate limit atingido, aguardando ${waitTime/1000} segundos...`);
          await this.delay(waitTime);
          return this.makeRequest<T>(endpoint);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async searchTeams(query: string): Promise<SearchResult[]> {
    const cacheKey: SearchCacheKey = {
      type: 'teams',
      query: query.trim().toLowerCase()
    };
    
    const key = CacheKeyGenerator.generateSearchKey(cacheKey);
    
    try {
      // Verificar cache primeiro
      const cachedData = await this.cacheService.getFromCache<SearchResult[]>(key, CacheDataType.SEARCH);
      if (cachedData) {
        console.log(`✅ Cache hit para busca de times: ${query}`);
        return cachedData.data;
      }
      
      console.log(`🔄 Cache miss para busca de times: ${query}, buscando da API...`);
      
      // Buscar da API
      const response = await executeRequest(
        'searchTeams',
        () => this.makeRequest<any>(`/teams?search=${encodeURIComponent(query)}`),
        { query }
      );
      
      let results: SearchResult[] = [];
      if (response.response && Array.isArray(response.response)) {
        results = response.response.map((item: any) => ({
          id: item.team.id,
          type: 'team' as const,
          name: item.team.name,
          logo: item.team.logo,
          image: item.team.logo,
          country: item.team.country,
          founded: item.team.founded,
          venue: item.venue?.name
        }));
      }
      
      // Salvar no cache
      try {
        await this.cacheService.saveToCache(
          key,
          results,
          CacheDataType.SEARCH,
          `/teams?search=${encodeURIComponent(query)}`,
          { query }
        );
        console.log(`💾 Dados de busca de times salvos no cache: ${results.length} resultados`);
      } catch (cacheError) {
        console.error('Erro ao salvar busca de times no cache:', cacheError);
        // Não propaga o erro de cache, apenas retorna os dados da API
      }
      
      return results;
      
    } catch (error) {
      console.error('Erro ao buscar times:', error);
      return [];
    }
  }

  async searchPlayers(query: string): Promise<SearchResult[]> {
    const cacheKey: SearchCacheKey = {
      type: 'players',
      query: query.trim().toLowerCase()
    };
    
    const key = CacheKeyGenerator.generateSearchKey(cacheKey);
    
    try {
      // Verificar cache primeiro
      const cachedData = await this.cacheService.getFromCache<SearchResult[]>(key, CacheDataType.SEARCH);
      if (cachedData) {
        console.log(`✅ Cache hit para busca de jogadores: ${query}`);
        return cachedData.data;
      }
      
      console.log(`🔄 Cache miss para busca de jogadores: ${query}, buscando da API...`);
      
      // Buscar da API nas principais ligas
      const majorLeagues = [39, 61, 140, 78, 135, 132]; // Premier League, Ligue 1, La Liga, Bundesliga, Serie A, MLS
      const allResults: SearchResult[] = [];
      
      for (const leagueId of majorLeagues) {
        try {
          const response = await this.makeRequest<any>(`/players?league=${leagueId}&search=${encodeURIComponent(query)}`);
          
          if (response.response && Array.isArray(response.response)) {
            const leagueResults = response.response.map((item: any) => ({
              id: item.player.id,
              type: 'player' as const,
              name: item.player.name,
              image: item.player.photo,
              team: item.statistics?.[0]?.team?.name,
              position: item.statistics?.[0]?.games?.position,
              age: item.player.age,
              nationality: item.player.nationality
            }));
            allResults.push(...leagueResults);
          }
        } catch (leagueError) {
          console.error(`Erro ao buscar jogadores na liga ${leagueId}:`, leagueError);
        }
      }
      
      // Remove duplicatas baseado no ID do jogador
      const uniqueResults = allResults.filter((player, index, self) => 
        index === self.findIndex(p => p.id === player.id)
      );
      
      // Salvar no cache
      try {
        await this.cacheService.saveToCache(
          key,
          uniqueResults,
          CacheDataType.SEARCH,
          `/players?search=${encodeURIComponent(query)}`,
          { query }
        );
        console.log(`💾 Dados de busca de jogadores salvos no cache: ${uniqueResults.length} resultados`);
      } catch (cacheError) {
        console.error('Erro ao salvar busca de jogadores no cache:', cacheError);
        // Não propaga o erro de cache, apenas retorna os dados da API
      }
      
      return uniqueResults;
      
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
      return [];
    }
  }

  async searchLeagues(query: string): Promise<SearchResult[]> {
    const cacheKey: SearchCacheKey = {
      type: 'leagues',
      query: query.trim().toLowerCase()
    };
    
    const key = CacheKeyGenerator.generateSearchKey(cacheKey);
    
    try {
      // Verificar cache primeiro
      const cachedData = await this.cacheService.getFromCache<SearchResult[]>(key, CacheDataType.SEARCH);
      if (cachedData) {
        console.log(`✅ Cache hit para busca de ligas: ${query}`);
        return cachedData.data;
      }
      
      console.log(`🔄 Cache miss para busca de ligas: ${query}, buscando da API...`);
      
      // Buscar da API
      const response = await executeRequest(
        'searchLeagues',
        () => this.makeRequest<any>(`/leagues?search=${encodeURIComponent(query)}`),
        { query }
      );
      
      let results: SearchResult[] = [];
      if (response.response && Array.isArray(response.response)) {
        results = response.response.map((item: any) => ({
          id: item.league.id,
          type: 'league' as const,
          name: item.league.name,
          logo: item.league.logo,
          image: item.league.logo,
          country: item.country.name,
          season: item.seasons?.[0]?.year
        }));
      }
      
      // Salvar no cache
      await this.cacheService.saveToCache(
        key,
        results,
        CacheDataType.SEARCH,
        `/leagues?search=${encodeURIComponent(query)}`,
        { query }
      );
      
      console.log(`💾 Dados de busca de ligas salvos no cache: ${results.length} resultados`);
      return results;
      
    } catch (error) {
      console.error('Erro ao buscar ligas:', error);
      return [];
    }
  }

  async searchCountries(query: string): Promise<SearchResult[]> {
    const cacheKey: SearchCacheKey = {
      type: 'countries',
      query: query.trim().toLowerCase()
    };
    
    const key = CacheKeyGenerator.generateSearchKey(cacheKey);
    
    try {
      // Verificar cache primeiro
      const cachedData = await this.cacheService.getFromCache<SearchResult[]>(key, CacheDataType.SEARCH);
      if (cachedData) {
        console.log(`✅ Cache hit para busca de países: ${query}`);
        return cachedData.data;
      }
      
      console.log(`🔄 Cache miss para busca de países: ${query}, buscando da API...`);
      
      // Buscar da API
      const response = await executeRequest(
        'searchCountries',
        () => this.makeRequest<any>(`/countries?search=${encodeURIComponent(query)}`),
        { query }
      );
      
      let results: SearchResult[] = [];
      if (response.response && Array.isArray(response.response)) {
        results = response.response.map((item: any) => ({
          id: item.name,
          type: 'country' as const,
          name: item.name,
          image: item.flag,
          code: item.code
        }));
      }
      
      // Salvar no cache
      await this.cacheService.saveToCache(
        key,
        results,
        CacheDataType.SEARCH,
        `/countries?search=${encodeURIComponent(query)}`,
        { query }
      );
      
      console.log(`💾 Dados de busca de países salvos no cache: ${results.length} resultados`);
      return results;
      
    } catch (error) {
      console.error('Erro ao buscar países:', error);
      return [];
    }
  }

  async searchCoaches(query: string): Promise<SearchResult[]> {
    const cacheKey: SearchCacheKey = {
      type: 'coaches',
      query: query.trim().toLowerCase()
    };
    
    const key = CacheKeyGenerator.generateSearchKey(cacheKey);
    
    try {
      // Verificar cache primeiro
      const cachedData = await this.cacheService.getFromCache<SearchResult[]>(key, CacheDataType.SEARCH);
      if (cachedData) {
        console.log(`✅ Cache hit para busca de treinadores: ${query}`);
        return cachedData.data;
      }
      
      console.log(`🔄 Cache miss para busca de treinadores: ${query}, buscando da API...`);
      
      // Buscar da API
      const response = await this.makeRequest<any>(`/coachs?search=${encodeURIComponent(query)}`);
      
      let results: SearchResult[] = [];
      if (response.response && Array.isArray(response.response)) {
        results = response.response.map((item: any) => ({
          id: item.id,
          type: 'coach' as const,
          name: item.name,
          image: item.photo,
          team: item.team?.name,
          nationality: item.nationality,
          age: item.age
        }));
      }
      
      // Salvar no cache
      try {
        await this.cacheService.saveToCache(
          key,
          results,
          CacheDataType.SEARCH,
          `/coachs?search=${encodeURIComponent(query)}`,
          { query }
        );
        console.log(`💾 Dados de busca de treinadores salvos no cache: ${results.length} resultados`);
      } catch (cacheError) {
        console.error('Erro ao salvar busca de treinadores no cache:', cacheError);
        // Não propaga o erro de cache, apenas retorna os dados da API
      }
      
      return results;
      
      
    } catch (error) {
      console.error('Erro ao buscar treinadores:', error);
      return [];
    }
  }

  async searchVenues(query: string): Promise<SearchResult[]> {
    const cacheKey: SearchCacheKey = {
      type: 'venues',
      query: query.trim().toLowerCase()
    };
    
    const key = CacheKeyGenerator.generateSearchKey(cacheKey);
    
    try {
      // Verificar cache primeiro
      const cachedData = await this.cacheService.getFromCache<SearchResult[]>(key, CacheDataType.SEARCH);
      if (cachedData) {
        console.log(`✅ Cache hit para busca de estádios: ${query}`);
        return cachedData.data;
      }
      
      console.log(`🔄 Cache miss para busca de estádios: ${query}, buscando da API...`);
      
      // Buscar da API
      const response = await this.makeRequest<any>(`/venues?search=${encodeURIComponent(query)}`);
      
      let results: SearchResult[] = [];
      if (response.response && Array.isArray(response.response)) {
        results = response.response.map((item: any) => ({
          id: item.id,
          type: 'venue' as const,
          name: item.name,
          image: item.image,
          city: item.city,
          country: item.country,
          capacity: item.capacity
        }));
      }
      
      // Salvar no cache
      await this.cacheService.saveToCache(
        key,
        results,
        CacheDataType.SEARCH,
        `/venues?search=${encodeURIComponent(query)}`,
        { query }
      );
      
      console.log(`💾 Dados de busca de estádios salvos no cache: ${results.length} resultados`);
      return results;
      
    } catch (error) {
      console.error('Erro ao buscar estádios:', error);
      return [];
    }
  }

  async searchAll(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const trimmedQuery = query.trim().toLowerCase();
    const cacheKey: SearchCacheKey = {
      type: 'all',
      query: trimmedQuery
    };
    
    const key = CacheKeyGenerator.generateSearchKey(cacheKey);
    
    try {
      // Verificar cache primeiro
      const cachedData = await this.cacheService.getFromCache<SearchResult[]>(key, CacheDataType.SEARCH);
      if (cachedData) {
        console.log(`✅ Cache hit para busca geral: ${query}`);
        return cachedData.data;
      }
      
      console.log(`🔄 Cache miss para busca geral: ${query}, buscando da API...`);
      
      // Executar buscas sequencialmente para evitar rate limiting
      const results: SearchResult[] = [];
      
      try {
        const teams = await this.searchTeams(trimmedQuery);
        results.push(...teams);
      } catch (error) {
        console.error('Erro ao buscar times:', error);
      }
      
      try {
        const players = await this.searchPlayers(trimmedQuery);
        results.push(...players);
      } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
      }
      
      try {
        const leagues = await this.searchLeagues(trimmedQuery);
        results.push(...leagues);
      } catch (error) {
        console.error('Erro ao buscar ligas:', error);
      }
      
      try {
        const countries = await this.searchCountries(trimmedQuery);
        results.push(...countries);
      } catch (error) {
        console.error('Erro ao buscar países:', error);
      }
      
      try {
        const coaches = await this.searchCoaches(trimmedQuery);
        results.push(...coaches);
      } catch (error) {
        console.error('Erro ao buscar treinadores:', error);
      }
      
      try {
        const venues = await this.searchVenues(trimmedQuery);
        results.push(...venues);
      } catch (error) {
        console.error('Erro ao buscar estádios:', error);
      }

      // Ordenar por relevância
      const sortedResults = results.sort((a, b) => {
        const aExact = a.name.toLowerCase() === trimmedQuery;
        const bExact = b.name.toLowerCase() === trimmedQuery;
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        const aStarts = a.name.toLowerCase().startsWith(trimmedQuery);
        const bStarts = b.name.toLowerCase().startsWith(trimmedQuery);
        
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        return a.name.localeCompare(b.name);
      });
      
      // Salvar no cache
      await this.cacheService.saveToCache(
        key,
        sortedResults,
        CacheDataType.SEARCH,
        `/search/all?query=${encodeURIComponent(query)}`,
        { query }
      );
      
      console.log(`💾 Dados de busca geral salvos no cache: ${sortedResults.length} resultados`);
      return sortedResults;
      
    } catch (error) {
      console.error('Erro ao realizar busca geral:', error);
      return [];
    }
  }
}

export const searchApiCacheService = new SearchApiCacheService();
export type { SearchResult };