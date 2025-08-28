/**
 * Utilitários para desenvolvimento - detecta ambiente e carrega dados locais
 */

// Declaração de tipo para a variável global __DEV__ do React Native
declare var __DEV__: boolean;

/**
 * Detecta se a aplicação está rodando em ambiente de desenvolvimento
 * Em React Native, usa a variável global __DEV__
 */
export const isDevelopment = (): boolean => {
  return __DEV__;
};

/**
 * Carrega dados de um arquivo JSON local
 * Em React Native, usa require() para importar arquivos JSON diretamente
 */
export const loadLocalJsonData = async (filename: string): Promise<any> => {
  try {
    // Mapeamento dos arquivos JSON para require()
    const jsonFiles: Record<string, any> = {
      'getTeamById.json': require('../json_files/getTeamById.json'),
      'getLeaguesByTeam.json': require('../json_files/getLeaguesByTeam.json'),
      'getTeamFixtures.json': require('../json_files/getTeamFixtures.json'),
      'getPlayersByTeam.json': require('../json_files/getPlayersByTeam.json'),
      'getLiveFixtures.json': require('../json_files/getLiveFixtures.json'),
      'getTodayFixtures.json': require('../json_files/getTodayFixtures.json'),
      'getStandings.json': require('../json_files/getStandings.json'),
      'getLeagues.json': require('../json_files/getLeagues.json'),
      'getFixturesByDate.json': require('../json_files/getFixturesByDate.json'),
      'getPlayerById.json': require('../json_files/getPlayerById.json'),
      'getPlayerTeams.json': require('../json_files/getPlayerTeams.json'),
      'getLeagueById.json': require('../json_files/getLeagueById.json'),
      'getCoachById.json': require('../json_files/getCoachById.json'),
      'getVenueById.json': require('../json_files/getVenueById.json'),
      'getTeamsByVenue.json': require('../json_files/getTeamsByVenue.json'),
      'getCountries.json': require('../json_files/getCountries.json'),
      'getTeamsByCountry.json': require('../json_files/getTeamsByCountry.json'),
      'getTeamStatistics.json': require('../json_files/getTeamStatistics.json'),
      'searchTeams.json': require('../json_files/searchTeams.json'),
      'searchPlayers.json': require('../json_files/searchPlayers.json'),
      'searchLeagues.json': require('../json_files/searchLeagues.json'),
      'searchCountries.json': require('../json_files/searchCountries.json'),
      'leagues_seasons.json': require('../json_files/leagues_seasons.json'),
      'getFixturesByLeague.json': require('../json_files/getFixturesByLeague.json'),
      'getUpcomingFixtures.json': require('../json_files/getUpcomingFixtures.json')
    };

    const data = jsonFiles[filename];
    if (!data) {
      throw new Error(`JSON file ${filename} not found`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error loading local JSON file ${filename}:`, error);
    throw error;
  }
};

/**
 * Mapeamento entre métodos da API e arquivos JSON correspondentes
 */
export const API_TO_JSON_MAPPING: Record<string, string> = {
  // FootballApiService methods
  getTeamById: 'getTeamById.json',
  getTeamStatistics: 'getTeamStatistics.json',
  getLeaguesByTeam: 'getLeaguesByTeam.json',
  getTeamFixtures: 'getTeamFixtures.json',
  getUpcomingFixtures: 'getUpcomingFixtures.json',
  getPlayersByTeam: 'getPlayersByTeam.json',
  getLiveFixtures: 'getLiveFixtures.json',
  getTodayFixtures: 'getTodayFixtures.json',
  getStandings: 'getStandings.json',
  getLeagues: 'getLeagues.json',
  getFixturesByDate: 'getFixturesByDate.json',
  getFixturesByLeague: 'getFixturesByLeague.json',
  getPlayerById: 'getPlayerById.json',
  getPlayerTeams: 'getPlayerTeams.json',
  getLeagueById: 'getLeagueById.json',
  getCoachById: 'getCoachById.json',
  getVenueById: 'getVenueById.json',
  getTeamsByVenue: 'getTeamsByVenue.json',
  getCountries: 'getCountries.json',
  getTeamsByCountry: 'getTeamsByCountry.json',
  
  // SearchApiService methods
  searchTeams: 'searchTeams.json',
  searchPlayers: 'searchPlayers.json',
  searchLeagues: 'searchLeagues.json',
  searchCountries: 'searchCountries.json',
};

/**
 * Simula delay de rede para tornar o desenvolvimento mais realista
 */
export const simulateNetworkDelay = (min: number = 200, max: number = 800): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Wrapper para executar requisição local ou remota baseado no ambiente
 */
export const executeRequest = async <T>(
  methodName: keyof typeof API_TO_JSON_MAPPING,
  remoteRequestFn: () => Promise<T>,
  params?: any
): Promise<T> => {
  if (isDevelopment()) {
    console.log(`🔧 [DEV MODE] Using local data for ${methodName}`);
    
    // Simula delay de rede
    await simulateNetworkDelay();
    
    const jsonFile = API_TO_JSON_MAPPING[methodName];
    return await loadLocalJsonData(jsonFile);
  } else {
    console.log(`🌐 [PROD MODE] Using remote API for ${methodName}`);
    return await remoteRequestFn();
  }
};