import { cacheService } from './CacheService';
import { CacheDataType } from '@/types/cacheTypes';

/**
 * Serviço para monitoramento e logs do sistema de cache
 */
export class CacheMonitoringService {
  private static instance: CacheMonitoringService;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    saves: 0,
    errors: 0,
    totalRequests: 0,
    byType: {
      [CacheDataType.FIXTURES]: { hits: 0, misses: 0, saves: 0, errors: 0 },
      [CacheDataType.TEAMS]: { hits: 0, misses: 0, saves: 0, errors: 0 },
      [CacheDataType.PLAYERS]: { hits: 0, misses: 0, saves: 0, errors: 0 },
      [CacheDataType.LEAGUES]: { hits: 0, misses: 0, saves: 0, errors: 0 },
      [CacheDataType.STANDINGS]: { hits: 0, misses: 0, saves: 0, errors: 0 },
      [CacheDataType.COACHES]: { hits: 0, misses: 0, saves: 0, errors: 0 },
      [CacheDataType.VENUES]: { hits: 0, misses: 0, saves: 0, errors: 0 },
      [CacheDataType.COUNTRIES]: { hits: 0, misses: 0, saves: 0, errors: 0 }
    }
  };
  
  private constructor() {
    // Construtor privado para padrão Singleton
  }
  
  static getInstance(): CacheMonitoringService {
    if (!CacheMonitoringService.instance) {
      CacheMonitoringService.instance = new CacheMonitoringService();
    }
    return CacheMonitoringService.instance;
  }
  
  /**
   * Registra um hit no cache
   */
  recordCacheHit(dataType: CacheDataType, key: string, endpoint?: string) {
    this.stats.hits++;
    this.stats.totalRequests++;
    
    // Garante que as estatísticas por tipo existam
    if (!this.stats.byType[dataType]) {
      this.stats.byType[dataType] = { hits: 0, misses: 0, saves: 0, errors: 0 };
    }
    this.stats.byType[dataType].hits++;
    
    console.log(`✅ Cache HIT [${dataType}]: ${key}${endpoint ? ` (${endpoint})` : ''}`);
    
    this.logCacheEvent('HIT', dataType, key, endpoint);
  }
  
  /**
   * Registra um miss no cache
   */
  recordCacheMiss(dataType: CacheDataType, key: string, endpoint?: string) {
    this.stats.misses++;
    this.stats.totalRequests++;
    
    // Garante que as estatísticas por tipo existam
    if (!this.stats.byType[dataType]) {
      this.stats.byType[dataType] = { hits: 0, misses: 0, saves: 0, errors: 0 };
    }
    this.stats.byType[dataType].misses++;
    
    console.log(`❌ Cache MISS [${dataType}]: ${key}${endpoint ? ` (${endpoint})` : ''}`);
    
    this.logCacheEvent('MISS', dataType, key, endpoint);
  }
  
  /**
   * Registra uma operação de salvamento no cache
   */
  recordCacheSave(dataType: CacheDataType, key: string, endpoint?: string, ttl?: number) {
    this.stats.saves++;
    
    // Garante que as estatísticas por tipo existam
    if (!this.stats.byType[dataType]) {
      this.stats.byType[dataType] = { hits: 0, misses: 0, saves: 0, errors: 0 };
    }
    this.stats.byType[dataType].saves++;
    
    const ttlInfo = ttl ? ` (TTL: ${this.formatTTL(ttl)})` : '';
    console.log(`💾 Cache SAVE [${dataType}]: ${key}${endpoint ? ` (${endpoint})` : ''}${ttlInfo}`);
    
    this.logCacheEvent('SAVE', dataType, key, endpoint, { ttl });
  }
  
  /**
   * Registra um erro no cache
   */
  recordCacheError(dataType: CacheDataType, key: string, error: Error, endpoint?: string) {
    this.stats.errors++;
    
    // Garante que as estatísticas por tipo existam
    if (!this.stats.byType[dataType]) {
      this.stats.byType[dataType] = { hits: 0, misses: 0, saves: 0, errors: 0 };
    }
    this.stats.byType[dataType].errors++;
    
    console.error(`🚨 Cache ERROR [${dataType}]: ${key}${endpoint ? ` (${endpoint})` : ''} - ${error.message}`);
    
    this.logCacheEvent('ERROR', dataType, key, endpoint, { error: error.message });
  }
  
  /**
   * Obtém estatísticas do cache
   */
  getStats(): CacheStats {
    return {
      ...this.stats,
      hitRate: this.stats.totalRequests > 0 ? (this.stats.hits / this.stats.totalRequests) * 100 : 0,
      byType: { ...this.stats.byType }
    };
  }
  
  /**
   * Reseta as estatísticas
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      saves: 0,
      errors: 0,
      totalRequests: 0,
      byType: {
        [CacheDataType.FIXTURES]: { hits: 0, misses: 0, saves: 0, errors: 0 },
        [CacheDataType.TEAMS]: { hits: 0, misses: 0, saves: 0, errors: 0 },
        [CacheDataType.PLAYERS]: { hits: 0, misses: 0, saves: 0, errors: 0 },
        [CacheDataType.LEAGUES]: { hits: 0, misses: 0, saves: 0, errors: 0 },
        [CacheDataType.STANDINGS]: { hits: 0, misses: 0, saves: 0, errors: 0 },
        [CacheDataType.COACHES]: { hits: 0, misses: 0, saves: 0, errors: 0 },
        [CacheDataType.VENUES]: { hits: 0, misses: 0, saves: 0, errors: 0 },
        [CacheDataType.COUNTRIES]: { hits: 0, misses: 0, saves: 0, errors: 0 }
      }
    };
    
    console.log('📊 Estatísticas do cache resetadas');
  }
  
  /**
   * Exibe relatório detalhado das estatísticas
   */
  printDetailedReport() {
    const stats = this.getStats();
    
    console.log('\n📊 RELATÓRIO DETALHADO DO CACHE');
    console.log('=' .repeat(50));
    console.log(`📈 Total de Requests: ${stats.totalRequests}`);
    console.log(`✅ Cache Hits: ${stats.hits}`);
    console.log(`❌ Cache Misses: ${stats.misses}`);
    console.log(`💾 Cache Saves: ${stats.saves}`);
    console.log(`🚨 Errors: ${stats.errors}`);
    console.log(`🎯 Hit Rate: ${stats.hitRate?.toFixed(2)}%`);
    
    console.log('\n📋 ESTATÍSTICAS POR TIPO:');
    console.log('-' .repeat(30));
    
    Object.entries(stats.byType).forEach(([type, typeStats]) => {
      const total = typeStats.hits + typeStats.misses;
      const hitRate = total > 0 ? (typeStats.hits / total) * 100 : 0;
      
      console.log(`\n🏷️ ${type.toUpperCase()}:`);
      console.log(`   Requests: ${total}`);
      console.log(`   Hits: ${typeStats.hits}`);
      console.log(`   Misses: ${typeStats.misses}`);
      console.log(`   Saves: ${typeStats.saves}`);
      console.log(`   Errors: ${typeStats.errors}`);
      console.log(`   Hit Rate: ${hitRate.toFixed(2)}%`);
    });
    
    console.log('\n' + '=' .repeat(50));
  }
  
  /**
   * Monitora o desempenho do cache em tempo real
   */
  startRealTimeMonitoring(intervalMs: number = 30000) {
    console.log(`🔄 Iniciando monitoramento em tempo real (${intervalMs}ms)`);
    
    setInterval(() => {
      const stats = this.getStats();
      if (stats.totalRequests > 0) {
        console.log(`📊 Cache Stats - Requests: ${stats.totalRequests}, Hit Rate: ${stats.hitRate?.toFixed(2)}%`);
      }
    }, intervalMs);
  }
  
  /**
   * Formata TTL para exibição
   */
  private formatTTL(ttl: number): string {
    const seconds = Math.floor(ttl / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  }
  
  /**
   * Log estruturado de eventos do cache
   */
  private logCacheEvent(
    event: 'HIT' | 'MISS' | 'SAVE' | 'ERROR',
    dataType: CacheDataType,
    key: string,
    endpoint?: string,
    metadata?: any
  ) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      dataType,
      key,
      endpoint,
      metadata
    };
    
    // Em produção, você pode enviar esses logs para um serviço de monitoramento
    // como DataDog, New Relic, ou salvar no Firestore para análise posterior
    if (process.env.NODE_ENV === 'development') {
      console.debug('🔍 Cache Event:', logEntry);
    }
  }
}

/**
 * Interface para estatísticas do cache
 */
interface CacheStats {
  hits: number;
  misses: number;
  saves: number;
  errors: number;
  totalRequests: number;
  hitRate?: number;
  byType: Record<CacheDataType, {
    hits: number;
    misses: number;
    saves: number;
    errors: number;
  }>;
}

// Instância singleton
export const cacheMonitoringService = CacheMonitoringService.getInstance();

// Para uso no console do navegador
if (typeof window !== 'undefined') {
  (window as any).cacheStats = () => cacheMonitoringService.printDetailedReport();
  (window as any).resetCacheStats = () => cacheMonitoringService.resetStats();
  console.log('💡 Comandos disponíveis:');
  console.log('   - cacheStats(): Exibe relatório detalhado');
  console.log('   - resetCacheStats(): Reseta estatísticas');
}