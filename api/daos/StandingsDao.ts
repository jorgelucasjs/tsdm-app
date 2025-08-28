import { RapidApiResponse } from '@/interfaces/RapidApiStandings';
import { LEAGUE_FILE_MAPPING, LeagueId, StandingResponse } from '@/interfaces/Standings';
import { executeRequest } from '@/utils/devUtils';
import { footballApiCacheService } from '@/services/FootballApiCacheService';
import { BASE_URL, FOOTBALL_PI_KEY } from '@/utils';

class StandingsDao {
    async getStandingsByLeagueId(leagueId: string, season: string): Promise<RapidApiResponse> {
        return footballApiCacheService.getStandings(
            parseInt(leagueId),
            parseInt(season),
            () => executeRequest(
                'getStandings',
                async () => {
                    try {
                        const myHeaders = new Headers();
                        //myHeaders.append("x-rapidapi-host", "api-football-v1.p.rapidapi.com");
                        myHeaders.append("x-rapidapi-key", FOOTBALL_PI_KEY);

                        const requestOptions: RequestInit = {
                            method: "GET",
                            headers: myHeaders,
                            redirect: "follow" as RequestRedirect
                        };

                        const response = await fetch(`${BASE_URL}/standings?league=${leagueId}&season=${season}`, requestOptions);
                        
                        if (!response.ok) {
                            throw new Error(`Failed to fetch standings: ${response.status}`);
                        }
                        
                        const result: RapidApiResponse = await response.json();
                        //console.log("getStandingsByLeagueId", result);
                        return result;
                    } catch (error) {
                        //console.error(`Error loading standings for league ${leagueId}:`, error);
                        throw new Error(`Failed to load standings for league ${leagueId}`);
                    }
                },
                { leagueId, season }
            )
        );
    }

    async getAllStandings(): Promise<Record<LeagueId, StandingResponse>> {
        const standings: Partial<Record<LeagueId, StandingResponse>> = {};
        const leagueIds = Object.keys(LEAGUE_FILE_MAPPING) as LeagueId[];
        const errors: string[] = [];

        await Promise.all(
            leagueIds.map(async (leagueId) => {
                try {
                    //standings[leagueId] = await this.getStandingsByLeagueId(leagueId);
                } catch (error) {
                    console.error(`Error loading standings for ${leagueId}:`, error);
                    errors.push(`Failed to load standings for ${leagueId}`);
                }
            })
        );

        if (errors.length > 0) {
            throw new Error(errors.join('; '));
        }

        return standings as Record<LeagueId, StandingResponse>;
    }
}

export const standingsDao = new StandingsDao();

