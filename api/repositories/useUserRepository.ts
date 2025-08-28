import { createUserApi, deleteUserApi, updateUserApi } from "@/data";
import { deleteData, saveData, StorageEnum } from "@/data/LocalStorage";
import UserService from "@/services/UserService";
import { UserRole, UserType } from "@/types/UserType";
import { GENERIC_PASSWORD } from "@/utils/constants";
import { create } from "zustand";

const initialState: State = {
  userAuthPermission: null,
  user: null,
  users: [],
  errorMessage: "",
  loading: false,
};

interface State {
  userAuthPermission: UserRole | null;
  user: UserType | null;
  users: UserType[]
  errorMessage: string;
  loading: boolean;
}

interface Actions {
  clearError: () => void;
  createUser: (data: UserType) => Promise<void>;
  getUserByEmail: (email: string) => Promise<void>;
  getAllUsers: () => Promise<void>
  updateUser: (id: string, data: UserType) => Promise<void>;
  blockUser: (data: UserType) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
}

export const useUserRepository = create<Actions & State>((set) => ({
  ...initialState,


  clearError: () => {
    set({ errorMessage: "" });
  },

  createUser: async (data) => {
    set({ loading: true, errorMessage: "" });
    try {
      
      const createdUser = await createUserApi(data, GENERIC_PASSWORD);
    
       set((state) => ({
            ...state, 
            users: [...state.users, createdUser],
            loading: false
        }));

    } catch (error: any) {
      set({ errorMessage: error.message || "Erro ao criar usuário", loading: false });
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    set({ loading: true });

    try {
      const userData = await UserService.shared.getUserByEmail(email)
      set({ user: userData, loading: false})
    } catch (error) {
      set({ 
        errorMessage: error.message || "Erro ao pegar dados usuário", 
        loading: false 
      });
      throw error;
    }
  },

  getAllUsers: async () => {
  set({ loading: true });

  try {
    const userData = await UserService.shared.getAllUsers();
    set({ users: userData, loading: false }); 
  } catch (error) {
    set({ 
      errorMessage: error.message || "Erro ao pegar todos os usuários", 
      loading: false 
    });
    throw error;
  }
},

  blockUser: async (data) => {
      set({ loading: true, errorMessage: "" });

      try {
        await UserService.shared.blockUser(data)
      } catch (error) {
        set({ 
          errorMessage: error.message || "Erro ao atualizar o estado todos os usuários", 
          loading: false 
        });
        throw error;
      }
  },

  updateUser: async (id, data) => {
    set({ loading: true, errorMessage: "" });
    try {
      const updatedUser = await updateUserApi(id, data);

      set({ user: updatedUser, loading: false });

      saveData(StorageEnum.USERDATA, updatedUser);
    } catch (error: any) {
      set({ errorMessage: error.message || "Erro ao atualizar usuário", loading: false });
      throw error;
    }
  },

  // deleteUser: async (uid) => {
  //   set({ loading: true, errorMessage: "" });
  //   try {
  //     await deleteUserApi(uid);

  //     set({ user: null, userAuthPermission: null, loading: false });

  //     deleteData(StorageEnum.USERDATA);
  //   } catch (error) {
  //     set({ errorMessage: error.message || "Erro ao deletar usuário", loading: false });
  //     throw error;
  //   }
  // },

   deleteUser: async (uid) => {
    set({ loading: true, errorMessage: "" });
    try {
      await UserService.shared.deleteUser(uid);

      set({ user: null, userAuthPermission: null, loading: false });

      deleteData(StorageEnum.USERDATA);
    } catch (error) {
      set({ errorMessage: error.message || "Erro ao deletar usuário", loading: false });
      throw error;
    }
  },
}));
