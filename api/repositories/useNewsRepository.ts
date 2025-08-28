import { NewsType } from "@/types/NewsModel";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { create } from "zustand";
import NewsService from "../services/NewsService";

const initialState: State = {
    allNews: [],
    allNewsForAdmin: [],
    loading: false,
    hasMore: true,
    lastDoc: null
}

interface State {
    allNews: NewsType[]
    allNewsForAdmin: NewsType[]
    loading: boolean;
    hasMore: boolean;
    lastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
}

interface Actions {
    addNews: (newNews: NewsType, newsImageUrl: File) => Promise<void>
    loadMoreNews: () => Promise<void>
    getAllNews: (pageSize?: number, lastDoc?: any) => Promise<void>
    updateNews: (
        id: string,
        data: Partial<NewsType>,
        file: File | undefined
    ) => Promise<void>;
    listenNews: () => () => void;
    deleteNews: (id: string) => Promise<void>
}

export const useNewsRepository = create<Actions & State>((set) => ({
    ...initialState,

    addNews: async (newNews: NewsType, newsImageUrl: File) => {
        set({ loading: true })
        try {
            const news = await NewsService.shared.addNews(newNews, newsImageUrl)

            set((state) => ({
                ...state, 
                allNews: [...state.allNews, news],
                loading: false
            }))
        } catch (error) {
            set({ loading: false })
            console.error("Error adding campaign:", error);
            throw error;
        }
    },

    loadMoreNews: async () => {
        try {
            const state = useNewsRepository.getState();
            // const {allNews: newNews, lastDoc: newDoc } = await NewsService.shared.getAllNews(7, state.lastDoc);

            // set((state) => {
            //     const existingIds = new Set(state.allNews.map((b) => b.title));
            //     const uniqueNewsTitle = newNews.filter(
            //     (b) => !existingIds.has(b.title)
            //     );
            //     const updatedNews = [...state.allNews, ...uniqueNewsTitle];

            //     return {
            //     allNews: updatedNews,
            //     hasMore: newNews.length === 5,
            //     lastDoc: newDoc,
            //     };
            // });
        } catch (error) {
            console.error("Erro ao carregar mais notícias:", error);
            throw error;
        }
    },

    getAllNews: async (pageSize = 15, lastDoc = null) => {
        try {
            const {allNews: newNews, lastDoc: newDoc } = await NewsService.shared.getAllNews(pageSize, lastDoc);

            set((state) => {
                const existingIds = new Set(state.allNews.map((n) => n.title));
                const uniqueNews = newNews.filter(
                (n) => !existingIds.has(n.title)
                );
                const updatedNews = [...state.allNews, ...uniqueNews];
                return { allNews: updatedNews, lastDoc: newDoc };
            });

        } catch (error) {
            console.error("Error ao pegar as notícias:", error);
            throw error;
        }
    },

    listenNews: (): () => void => {
        const unsubscribe = NewsService.shared.listenNews((allNews) => {
            
        set({allNewsForAdmin: allNews});
        });
        return unsubscribe;
    },

    updateNews: async (
        id: string, 
        data: Partial<NewsType>,
        file: File | undefined
    ) => {
        
        try {
            await NewsService.shared.updateNews(id, data, file)

            set((state) => ({
                allNewsForAdmin: state.allNewsForAdmin.map((newsForAdmin) => newsForAdmin.id === id ? { ...newsForAdmin, ...data } : newsForAdmin)
            }))
        } catch (error) {
            console.error("Error updating campaign:", error);
            throw error;
        }
        
    },

    deleteNews: async (id: string) => {
        try {

        await NewsService.shared.deleteNews(id);

        set((state) => ({
            allNews: state.allNews.filter((event) => event.id !== id),
        }));
        } catch (error) {
        console.error("Error ao eliminar a notícia:", error);
        throw error;
        }
  },

}))