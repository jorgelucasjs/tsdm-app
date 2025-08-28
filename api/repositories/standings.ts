import { create } from 'zustand';
import { standingsDao } from '../daos/StandingsDao';
import { handleUserFriendlyError } from '@/utils/errorHandler';
import { RapidApiResponse } from '@/interfaces/RapidApiStandings';

interface StandingsState {
    loading: boolean;
    error: string | null;
    currentStandings: RapidApiResponse | null;
}

interface StandingsActions {
    getStandingsByLeagueId: (leagueId: string, season?: string) => Promise<void>;
    clearStandings: () => void;
}

const initialState: StandingsState = {
    loading: false,
    error: null,
    currentStandings: null
};

export const useStandingsStore = create<StandingsState & StandingsActions>((set) => ({
    ...initialState,
    getStandingsByLeagueId: async (leagueId: string, season: string = "2024") => {
        try {
            set({ loading: true, error: null });
            const standings = await standingsDao.getStandingsByLeagueId(leagueId, season);
            set({ currentStandings: standings, loading: false });
        } catch (error) {
            const errorMessage = handleUserFriendlyError(error, { 
                context: 'classificações' 
            });
            
            set({
                error: errorMessage,
                loading: false
            });
        }
    },
    clearStandings: () => set({ currentStandings: null, error: null, loading: false })
}));
