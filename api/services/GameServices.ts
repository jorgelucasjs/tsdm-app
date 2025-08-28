// import { MatchLive } from "@/app/interface/MatchLive";
// import { addDocument, getAllDocument, setDocument, deleteDocument, getDocument } from "@/firebase/firestore";
// import { COLLECTION_GAMES } from "@/utils/collections";

// export default class GameServices {
//   static shared = new GameServices();

//   async getAllGames(): Promise<MatchLive[]> {
//     try {
//       const snapshot = await getAllDocument(COLLECTION_GAMES);
//       return snapshot.docs.map(docSnap => ({
//         id: docSnap.id,
//         ...(docSnap.data() as Omit<MatchLive, 'id'>),
//       }));
//     } catch (error) {
//       console.error('Erro ao buscar jogos:', error);
//       throw new Error('Falha ao carregar jogos');
//     }
//   }

//   async createGame(gameData: Omit<MatchLive, 'id'>): Promise<MatchLive> {
//     try {
//       // Validações básicas
//       if (!gameData.teams?.home || !gameData.teams?.away) {
//         throw new Error('Equipas são obrigatórias');
//       }
      
//       if (!gameData.time?.date) {
//         throw new Error('Data é obrigatória');
//       }

//       if (!gameData.league?.name) {
//         throw new Error('Liga/Competição é obrigatória');
//       }

//       const docRef = await addDocument(COLLECTION_GAMES, gameData);
//       return { 
//         id: docRef.id, 
//         ...gameData 
//       } as MatchLive;
//     } catch (error) {
//       console.error('Erro ao criar jogo:', error);
//       if (error instanceof Error) {
//         throw error;
//       }
//       throw new Error('Falha ao criar jogo');
//     }
//   }

//   async updateGame(id: string, gameData: Partial<Omit<MatchLive, 'id'>>): Promise<void> {
//     try {
//       if (!id) {
//         throw new Error('ID do jogo é obrigatório');
//       }

//       await setDocument(COLLECTION_GAMES, id, {
//         ...gameData,
//         updated_at: new Date().toISOString()
//       }, true);
//     } catch (error) {
//       console.error('Erro ao atualizar jogo:', error);
//       if (error instanceof Error) {
//         throw error;
//       }
//       throw new Error('Falha ao atualizar jogo');
//     }
//   }

//   async deleteGame(id: string): Promise<void> {
//     try {
//       if (!id) {
//         throw new Error('ID do jogo é obrigatório');
//       }

//       await deleteDocument(COLLECTION_GAMES, id);
//     } catch (error) {
//       console.error('Erro ao deletar jogo:', error);
//       if (error instanceof Error) {
//         throw error;
//       }
//       throw new Error('Falha ao deletar jogo');
//     }
//   }

//   async getGameById(id: string): Promise<MatchLive> {
//     try {
//       if (!id) {
//         throw new Error('ID do jogo é obrigatório');
//       }

//       const docSnap = await getDocument(COLLECTION_GAMES, id);
      
//       if (docSnap.exists()) {
//         return {
//           id: docSnap.id,
//           ...(docSnap.data() as Omit<MatchLive, 'id'>)
//         };
//       }
      
//       return null;
//     } catch (error) {
//       console.error('Erro ao buscar jogo por ID:', error);
//       if (error instanceof Error) {
//         throw error;
//       }
//       throw new Error('Falha ao buscar jogo');
//     }
//   }
// }