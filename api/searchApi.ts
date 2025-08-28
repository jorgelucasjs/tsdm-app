import { searchApiCacheService, SearchResult } from "./services/SearchApiCacheService";

class SearchApiService {
  private searchCacheService = searchApiCacheService;

  async searchAll(query: string): Promise<SearchResult[]> {
    return this.searchCacheService.searchAll(query);
  }

  // Método para buscar por tipo específico
  async searchByType(query: string, type: SearchResult['type']): Promise<SearchResult[]> {
    const allResults = await this.searchAll(query);
    return allResults.filter(result => result.type === type);
  }

  // Limpar cache (útil para testes ou quando necessário)
  clearCache(): void {
    // O cache agora é gerenciado pelo SearchApiCacheService
    console.log('Cache é gerenciado pelo SearchApiCacheService centralizado');
  }
}

export const searchApi = new SearchApiService();
export default searchApi;
export type { SearchResult };
