import { create } from "zustand";
import { MatchLive } from "../../app/interface/MatchLive";
import GameServices from "@/services/GameServices";

interface State {
  games: MatchLive[];
  loading: boolean;
  error: string | null;
  selectedGame: MatchLive | null;
}

interface Actions {
  // Games CRUD
  fetchGames: () => Promise<void>;
  addGame: (game: Omit<MatchLive, 'id'>) => Promise<MatchLive>;
  updateGame: (id: string, gameData: Partial<Omit<MatchLive, 'id'>>) => Promise<void>;
  removeGame: (id: string) => Promise<void>;
  getGameById: (id: string) => Promise<MatchLive | null>;
  
  // UI State
  setSelectedGame: (game: MatchLive | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

const initialState: State = {
  games: [],
  loading: false,
  error: null,
  selectedGame: null
};

export const useGamesStore = create<State & Actions>((set, get) => ({
  ...initialState,

  // Buscar todos os jogos
  fetchGames: async () => {
    set({ loading: true, error: null });
    try {
      const data = await GameServices.shared.getAllGames();
      set({ games: data, loading: false });
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao carregar jogos";
      set({ error: errorMessage, loading: false });
    }
  },

  // Adicionar novo jogo
  addGame: async (gameData) => {
    set({ loading: true, error: null });
    try {
      const createdGame = await GameServices.shared.createGame(gameData);
      
      set((state) => ({
        games: [...state.games, createdGame],
        loading: false
      }));
      
      return createdGame;
    } catch (error) {
      console.error('Erro ao criar jogo:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar jogo";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Atualizar jogo existente
  updateGame: async (id, gameData) => {
    set({ loading: true, error: null });
    try {
      await GameServices.shared.updateGame(id, gameData);
      
      set((state) => ({
        games: state.games.map((game) =>
          game.id === id ? { ...game, ...gameData } : game
        ),
        selectedGame: state.selectedGame?.id === id 
          ? { ...state.selectedGame, ...gameData } 
          : state.selectedGame,
        loading: false
      }));
    } catch (error) {
      console.error('Erro ao atualizar jogo:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar jogo";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Remover jogo
  removeGame: async (id) => {
    set({ loading: true, error: null });
    try {
      await GameServices.shared.deleteGame(id);
      
      set((state) => ({
        games: state.games.filter((game) => game.id !== id),
        selectedGame: state.selectedGame?.id === id ? null : state.selectedGame,
        loading: false
      }));
    } catch (error) {
      console.error('Erro ao remover jogo:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao remover jogo";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Buscar jogo por ID
  getGameById: async (id) => {
    set({ loading: true, error: null });
    try {
      const game = await GameServices.shared.getGameById(id);
      set({ loading: false });
      return game;
    } catch (error) {
      console.error('Erro ao buscar jogo:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao buscar jogo";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Utilitários para UI
  setSelectedGame: (game) => set({ selectedGame: game }),
  
  clearError: () => set({ error: null }),
  
  setLoading: (loading) => set({ loading }),

  // Seletores/Getters úteis
  getGamesByStatus: (status: string) => {
    return get().games.filter(game => game.status_name === status);
  },

  getGamesByDate: (date: string) => {
    return get().games.filter(game => 
      game.time?.date === date
    );
  },

  getGamesByLeague: (leagueId: string) => {
    return get().games.filter(game => 
      game.league?.id?.toString() === leagueId
    );
  }
}));