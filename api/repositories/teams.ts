// src/repository/teams.ts
import { create } from 'zustand';
import { SearchResponseWithStatus } from '../../app/interface/SearchSuggestion';
import { TeamDetail, TeamDetailResponse } from '../../app/interface/TeamDetail';
import { TeamListResponse } from '../../app/interface/TeamStanding';

import TeamDao from '../daos/TeamDao';
import TeamsDao from '../daos/TeamDao';
import { StandingResponse } from '../../app/interface/Standings';
import { TeamType } from '../../app/interface/TeamType';

interface TeamState {
    loading: boolean;
    allTeams: TeamListResponse | null;
    awayTeams: TeamListResponse | null;
    homeTeams: TeamListResponse | null;
    teamDetail: TeamDetailResponse | null;
    listTeams: TeamType[];
    teamSearchResults: SearchResponseWithStatus | null;
    allStandings: StandingResponse | null;
    homeStandings: StandingResponse | null;
    awayStandings: StandingResponse | null;
    lastDoc: any
}

interface TeamActions {
    createNewTeam: (newTeam: TeamType, file: File | undefined) => Promise<void>
    deleteTeam: (id: string, url: string) => Promise<void>;
    getAllTeamCreated: (pageSize?: number, lastDoc?: any) => Promise<void>;
    getAllTeams: () => Promise<void>;
    getAwayTeams: () => Promise<void>;
    getHomeTeams: () => Promise<void>;
    getTeamDetail: (teamId: string) => Promise<void>;
    searchTeams: (search: string) => Promise<void>;
    getStandingAll: (leagueId: string) => Promise<void>;
    getStandingHome: (leagueId: string) => Promise<void>;
    getStandingAway: (leagueId: string) => Promise<void>;
    updateTeam: (
    id: string,
    data: Partial<TeamDetail>,
    file: File | undefined
  ) => Promise<void>;
}

const initialState: TeamState = {
    loading: false,
    allTeams: null,
    listTeams: [],
    awayTeams: null,
    homeTeams: null,
    teamDetail: null,
    teamSearchResults: null,
    allStandings: null,
    homeStandings: null,
    awayStandings: null,
    lastDoc: null,
};

export const useTeamsStore = create<TeamState & TeamActions>((set) => ({
    ...initialState,

    createNewTeam: (newTeam: TeamType, file: File | undefined) => {
        set({ loading: true });
        return new Promise((resolve, reject) => {
            if (newTeam.name === "" || newTeam.name.trim() === "") {
                reject(new Error("Introduza o nome da equipe!"));
            } if (newTeam.short_code === "" || newTeam.short_code.trim() === "") {
                reject(new Error("Introduza o código!"));
            } else {
                TeamsDao.shared.createNewTeam(newTeam, file)
                    .then((data) => {
                        set((state) => ({
                            ...state,
                            listTeams: [...state.listTeams, data],
                            loading: false
                        }));
                        resolve();
                    })
                    .catch((error) => {
                        set({ loading: false });
                        reject(error);
                });
            }
        })
    },

    updateTeam: async (
        id: string,
        team: Partial<TeamType>,
        file: File | undefined
    ) => {
        set({ loading: true })
        return new Promise(async (resolve, reject) => {
        if (!team.name.trim()) {
            reject(new Error("Introduza o nome da equipa!"));
            return;
        }
        if (!team.short_code.trim()) {
            reject(new Error("Introduza o apelido da equipa!"));
            return;
        } if (!team.country.trim()) {
            reject(new Error("Introduza um país!"));
            return;
        } if (!team.img) {
            reject(new Error("Adiciona uma imagem!"));
            return;
        } if (!team.stadium) {
            reject(new Error("Introduza o nome do estadio!"));
            return;
        } if (!team.founded) {
            reject(new Error("Introduza a data de fundação!"));
            return;
        } else {
            try {
                await TeamDao.shared.updateTeam(id, team, file);
                set((state) => ({
                    listTeams: state.listTeams.map((t) =>
                    t.id === id ? { ...t, ...team } : t
                    ),
                    loading: false
                }));
                resolve();
            } catch (error) {
                set({ loading: false })
                console.error("Error updating benefit:", error);
                reject(error);
            }
        }
        });   
    },

    getAllTeamCreated: async (pageSize = 10, lastDoc = null) => {
        
        try {

            const {listTeams: newTeams, lastDoc: newDoc } = await TeamDao.shared.getAllTeamCreated(pageSize, lastDoc);
            
            set((state) => {
                const existingIds = new Set(state.listTeams.map((team) => team.id));
                const uniqueNewTeams = newTeams.filter(
                (team) => !existingIds.has(team.id)
                );
                const updatedTeams = [...state.listTeams, ...uniqueNewTeams];
                return { listTeams: updatedTeams, lastDoc: newDoc };
            });
        } catch (error) {
            console.error("Error fetching active benefits:", error);
            throw error;
        }
    },

    deleteTeam: async (id, url) => {
        try {
            await TeamDao.shared.deleteTeam(id, url)

            set((state) => ({
                listTeams: state.listTeams.filter((team) => team.id !== id)
            }))
        } catch (error) {
            console.error("Error deleting team:", error);
            throw error;
        }
    },

    getAllTeams: () => {
        set({ loading: true });
        return new Promise((resolve, reject) => {
            // footballApiService.getAllTeams()
            //     .then((data) => {
            //         set({ allTeams: data.response, loading: false });
            //         resolve();
            //     })
            //     .catch((error) => {
            //         set({ loading: false });
            //         reject(error);
            //     });
        });
    },

    getAwayTeams: () => {
        set({ loading: true });
        return new Promise((resolve, reject) => {
            // footballApiService.getAwayTeams()
            //     .then((data) => {
            //         set({ awayTeams: data.response, loading: false });
            //         resolve();
            //     })
            //     .catch((error) => {
            //         set({ loading: false });
            //         reject(error);
            //     });
        });
    },

    getHomeTeams: () => {
        set({ loading: true });
        return new Promise((resolve, reject) => {
            // footballApiService.getHomeTeams()
            //     .then((data) => {
            //         set({ homeTeams: data.response, loading: false });
            //         resolve();
            //     })
            //     .catch((error) => {
            //         set({ loading: false });
            //         reject(error);
            //     });
        });
    },

    getTeamDetail: (teamId: string) => {
        set({ loading: true });
        return new Promise((resolve, reject) => {
            // footballApiService.getTeamDetail(teamId)
            //     .then((data) => {
            //         set({ teamDetail: data, loading: false });
            //         resolve();
            //     })
            //     .catch((error) => {
            //         set({ loading: false });
            //         reject(error);
            //     });
        });
    },

    searchTeams: (search: string) => {
        set({ loading: true });
        return new Promise((resolve, reject) => {
            // footballApiService.searchTeams(search)
            //     .then((data) => {
            //         set({ teamSearchResults: data, loading: false });
            //         resolve();
            //     })
            //     .catch((error) => {
            //         set({ loading: false });
            //         reject(error);
            //     });
        });
    },
    getStandingAll: (leagueId: string) => {
        set({ loading: true });
        return new Promise((resolve, reject) => {
            // footballApiService.getStandingAll(leagueId)
            //     .then((data) => {
            //         set({ allStandings: data.response, loading: false });
            //         resolve();
            //     })
            //     .catch((error) => {
            //         set({ loading: false });
            //         reject(error);
            //     });
        });
    },

    getStandingHome: (leagueId: string) => {
        set({ loading: true });
        return new Promise((resolve, reject) => {
            // footballApiService.getStandingHome(leagueId)
            //     .then((data) => {
            //         set({ homeStandings: data.response, loading: false });
            //         resolve();
            //     })
            //     .catch((error) => {
            //         set({ loading: false });
            //         reject(error);
            //     });
        });
    },

    getStandingAway: (leagueId: string) => {
        set({ loading: true });
        return new Promise((resolve, reject) => {
            // footballApiService.getStandingAway(leagueId)
            //     .then((data) => {
            //         set({ awayStandings: data.response, loading: false });
            //         resolve();
            //     })
            //     .catch((error) => {
            //         set({ loading: false });
            //         reject(error);
            //     });
        });
    },
}));