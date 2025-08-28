import {
  deleteDocument,
  getDocument,
  setDocument
} from '@/api/firebase/firestore';

import {
  CACHE_CONFIGS,
  CacheDataType,
  CachedData,
  CacheMetadata,
  CacheStrategy
} from '@/types/cacheTypes';

import firestore from '@react-native-firebase/firestore';
import { COLLECTION_API_CACHE_METADATA, COLLECTION_COACHES_CACHE, COLLECTION_COUNTRIES_CACHE, COLLECTION_FIXTURES_CACHE, COLLECTION_LEAGUES_CACHE, COLLECTION_PLAYERS_CACHE, COLLECTION_SEARCH_CACHE, COLLECTION_STANDINGS_CACHE, COLLECTION_TEAMS_CACHE, COLLECTION_VENUES_CACHE } from '../utils/collections';
import { cacheMonitoringService } from './CacheMonitoringService';

export class CacheService {
  private static instance: CacheService;
  
  private constructor() {}
  
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }
  
  /**
   * Obtém a coleção correta baseada no tipo de dados
   */
  private getCollectionName(dataType: CacheDataType): string {
    const collections = {
      [CacheDataType.FIXTURES]: COLLECTION_FIXTURES_CACHE,
      [CacheDataType.TEAMS]: COLLECTION_TEAMS_CACHE,
      [CacheDataType.PLAYERS]: COLLECTION_PLAYERS_CACHE,
      [CacheDataType.LEAGUES]: COLLECTION_LEAGUES_CACHE,
      [CacheDataType.STANDINGS]: COLLECTION_STANDINGS_CACHE,
      [CacheDataType.COACHES]: COLLECTION_COACHES_CACHE,
      [CacheDataType.VENUES]: COLLECTION_VENUES_CACHE,
      [CacheDataType.COUNTRIES]: COLLECTION_COUNTRIES_CACHE,
      [CacheDataType.SEARCH]: COLLECTION_SEARCH_CACHE
    };
    
    return collections[dataType];
  }
  
  /**
   * Salva dados no cache
   */
  async saveToCache<T>(
    key: string,
    data: T,
    dataType: CacheDataType,
    endpoint: string,
    params: Record<string, any> = {},
    customTTL?: number
  ): Promise<void> {
    try {
      const now = new Date();
      const config = CACHE_CONFIGS[dataType];
      const ttl = customTTL || config.ttl;
      const expiresAt = new Date(now.getTime() + ttl);
      
      const metadata: CacheMetadata = {
        id: key,
        endpoint,
        params,
        cachedAt: now,
        expiresAt,
        dataType,
        isLive: endpoint.includes('live')
      };
      
      const cachedData: CachedData<T> = {
        id: key,
        data,
        metadata,
        createdAt: now,
        updatedAt: now
      };
      
      const collectionName = this.getCollectionName(dataType);
      
      // Salva os dados na coleção específica
      await setDocument(collectionName, key, cachedData);
      
      // Salva os metadados para controle
      await setDocument(COLLECTION_API_CACHE_METADATA, key, metadata);
      
      // Registra o save no monitoramento
      cacheMonitoringService.recordCacheSave(dataType, key, endpoint, ttl);
      
      console.log(`✅ Dados salvos no cache: ${key}`);
    } catch (error) {
      // Registra o erro no monitoramento
      cacheMonitoringService.recordCacheError(dataType, key, error as Error, endpoint);
      console.error('❌ Erro ao salvar no cache:', error);
      throw error;
    }
  }
  
  /**
   * Busca dados do cache
   */
  async getFromCache<T>(
    key: string,
    dataType: CacheDataType,
    strategy?: CacheStrategy
  ): Promise<CachedData<T> | null> {
    try {
      const collectionName = this.getCollectionName(dataType);
      const docSnapshot = await getDocument(collectionName, key);
      
      if (!docSnapshot.exists()) {
        // Registra cache miss no monitoramento
        cacheMonitoringService.recordCacheMiss(dataType, key);
        console.log(`📭 Cache miss: ${key}`);
        return null;
      }
      
      const cachedData = docSnapshot.data() as CachedData<T>;
      
      // Converte timestamps do Firestore para Date
      if (cachedData.metadata.cachedAt && typeof cachedData.metadata.cachedAt !== 'object') {
        cachedData.metadata.cachedAt = new Date(cachedData.metadata.cachedAt);
      }
      if (cachedData.metadata.expiresAt && typeof cachedData.metadata.expiresAt !== 'object') {
        cachedData.metadata.expiresAt = new Date(cachedData.metadata.expiresAt);
      }
      if (cachedData.createdAt && typeof cachedData.createdAt !== 'object') {
        cachedData.createdAt = new Date(cachedData.createdAt);
      }
      if (cachedData.updatedAt && typeof cachedData.updatedAt !== 'object') {
        cachedData.updatedAt = new Date(cachedData.updatedAt);
      }
      
      // Verifica se o cache expirou
      const now = new Date();
      if (now > cachedData.metadata.expiresAt) {
        console.log(`⏰ Cache expirado: ${key}`);
        
        // Se a estratégia permite refresh, remove o cache expirado
        if (strategy?.shouldRefreshCache(cachedData)) {
          await this.removeFromCache(key, dataType);
          // Registra cache miss por expiração
          cacheMonitoringService.recordCacheMiss(dataType, key);
          return null;
        }
      }
      
      // Registra cache hit no monitoramento
      cacheMonitoringService.recordCacheHit(dataType, key, cachedData.metadata.endpoint);
      console.log(`✅ Cache hit: ${key}`);
      return cachedData;
    } catch (error) {
      // Registra o erro no monitoramento
      cacheMonitoringService.recordCacheError(dataType, key, error as Error);
      console.error('❌ Erro ao buscar do cache:', error);
      return null;
    }
  }
  
  /**
   * Remove dados do cache
   */
  async removeFromCache(key: string, dataType: CacheDataType): Promise<void> {
    try {
      const collectionName = this.getCollectionName(dataType);
      
      // Remove da coleção específica
      await deleteDocument(collectionName, key);
      
      // Remove dos metadados
      await deleteDocument(COLLECTION_API_CACHE_METADATA, key);
      
      console.log(`🗑️ Cache removido: ${key}`);
    } catch (error) {
      console.error('❌ Erro ao remover do cache:', error);
      throw error;
    }
  }
  
  /**
   * Limpa cache expirado
   */
  async clearExpiredCache(dataType?: CacheDataType): Promise<void> {
    try {
      const now = new Date();
      
      if (dataType) {
        // Limpa cache expirado de um tipo específico
        await this.clearExpiredCacheForType(dataType, now);
      } else {
        // Limpa cache expirado de todos os tipos
        for (const type of Object.values(CacheDataType)) {
          await this.clearExpiredCacheForType(type, now);
        }
      }
      
      console.log('🧹 Cache expirado limpo');
    } catch (error) {
      console.error('❌ Erro ao limpar cache expirado:', error);
    }
  }
  
  private async clearExpiredCacheForType(dataType: CacheDataType, now: Date): Promise<void> {
    try {
      const collectionName = this.getCollectionName(dataType);
      const querySnapshot = await firestore()
        .collection(collectionName)
        .where('metadata.expiresAt', '<', now)
        .get();
      
      const deletePromises = querySnapshot.docs.map(doc => 
        this.removeFromCache(doc.id, dataType)
      );
      
      await Promise.all(deletePromises);
      
      console.log(`🧹 ${querySnapshot.docs.length} itens expirados removidos de ${dataType}`);
    } catch (error) {
      console.error(`❌ Erro ao limpar cache expirado para ${dataType}:`, error);
    }
  }
  
  /**
   * Obtém estatísticas do cache
   */
  async getCacheStats(dataType?: CacheDataType): Promise<{
    total: number;
    expired: number;
    byType: Record<CacheDataType, number>;
  }> {
    try {
      const stats = {
        total: 0,
        expired: 0,
        byType: {} as Record<CacheDataType, number>
      };
      
      const now = new Date();
      
      if (dataType) {
        const typeStats = await this.getCacheStatsForType(dataType, now);
        stats.total = typeStats.total;
        stats.expired = typeStats.expired;
        stats.byType[dataType] = typeStats.total;
      } else {
        for (const type of Object.values(CacheDataType)) {
          const typeStats = await this.getCacheStatsForType(type, now);
          stats.total += typeStats.total;
          stats.expired += typeStats.expired;
          stats.byType[type] = typeStats.total;
        }
      }
      
      return stats;
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas do cache:', error);
      return { total: 0, expired: 0, byType: {} as Record<CacheDataType, number> };
    }
  }
  
  private async getCacheStatsForType(dataType: CacheDataType, now: Date): Promise<{
    total: number;
    expired: number;
  }> {
    try {
      const collectionName = this.getCollectionName(dataType);
      
      // Total de itens
      const totalSnapshot = await firestore().collection(collectionName).get();
      const total = totalSnapshot.docs.length;
      
      // Itens expirados
      const expiredSnapshot = await firestore()
        .collection(collectionName)
        .where('metadata.expiresAt', '<', now)
        .get();
      const expired = expiredSnapshot.docs.length;
      
      return { total, expired };
    } catch (error) {
      console.error(`❌ Erro ao obter estatísticas para ${dataType}:`, error);
      return { total: 0, expired: 0 };
    }
  }
  
  /**
   * Verifica se deve usar cache baseado na estratégia
   */
  shouldUseCache(params: any, strategy?: CacheStrategy): boolean {
    if (!strategy) {
      return true;
    }
    
    return strategy.shouldUseCache(params);
  }
  
  /**
   * Obtém TTL personalizado baseado na estratégia
   */
  getCacheTTL(params: any, dataType: CacheDataType, strategy?: CacheStrategy): number {
    if (strategy) {
      return strategy.getCacheTTL(params);
    }
    
    return CACHE_CONFIGS[dataType].ttl;
  }
}

export const cacheService = CacheService.getInstance();
export default cacheService;