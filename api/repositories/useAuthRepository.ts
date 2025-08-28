// import {
//   deleteData,
//   getData,
//   saveData,
//   StorageEnum,
// } from "@/data/LocalStorage";
// import auth from '@react-native-firebase/auth';
// import AuthService from "@/services/AuthService";
// import UserService from "@/services/UserService";
// import { UserRole, UserType } from "@/types/UserType";
// import { create } from "zustand";

// const initialState: State = {
//   userAuthPermission: null,
//   user: null,
//   email: "",
//   errorMessage: "",
//   loading: false,
// };

// interface State {
//   userAuthPermission: UserRole | null;
//   user: UserType | null;
//   email: string;
//   errorMessage: string;
//   loading: boolean;
// }

// interface Actions {
//   initializeAuth: () => () => void;
//   loginWithEmailAndPassword: (
//     email: string,
//     password: string
//   ) => Promise<UserRole>;
//   createAccount: (user: UserType, password: string) => Promise<void>
//   updateProfile: (user: UserType, file: File | undefined) => Promise<void>;
//   resetPassword: (email: string) => Promise<void>;
//   verifyCode: (oobCode: string) => Promise<void>;
//   confirmPassword: (oobCode: string, newPassword: string) => Promise<void>;
//   logOut: () => void;
// }

// export const useAuthRepository = create<Actions & State>((set) => ({
//   ...initialState,

//   initializeAuth: () => {
//     set({ loading: true });

//     const userLoggedIn = getData(StorageEnum.USERDATA) as UserType;

//     const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
//       if (userLoggedIn.email && !firebaseUser) {
//         set({
//           user: userLoggedIn,
//           userAuthPermission: userLoggedIn.role,
//           loading: false,
//         });
//       } else if (firebaseUser.email) {
//         try {
//           const user = await UserService.shared.getUserByEmail(
//             userLoggedIn.email
//           );

//           set({
//             user: user,
//             userAuthPermission: user.role as UserRole,
//             loading: false,
//           });

//           saveData(StorageEnum.USERDATA, user);
//         } catch (error) {
//           console.error("Erro ao recuperar usuário:", error);
//           deleteData(StorageEnum.USERDATA);

//           set({
//             user: null,
//             userAuthPermission: null,
//             loading: false,
//           });
//         }
//       } else {
//         set({
//           user: null,
//           userAuthPermission: null,
//           loading: false,
//         });
//       }
//     });

//     return unsubscribe;
//   },

//   loginWithEmailAndPassword: async (email: string, password: string) => {
//     if (!email) throw "Digite o seu e-mail!";
//     if (!password) throw "Digite a sua palavra-passe!";

//     try {
//       await AuthService.shared.signInEmailPassword(email, password);

//       const user = await UserService.shared.getUserByEmail(email);
//       console.log("Usuário", user);

//       set({ userAuthPermission: user.role as UserRole, user });
//       saveData(StorageEnum.USERDATA, user);

//       return user.role;
//     } catch (error: any) {
//       switch (error.code) {
//         case "auth/user-not-found":
//           throw "Usuário inexistente";
//         case "auth/missing-email":
//           throw "Por favor, insira o email";
//         case "auth/internal-error":
//           throw "Insira a senha";
//         case "auth/invalid-credential":
//           throw "Dados incorretos";
//         default:
//           throw "Senha ou email incorreto!";
//       }
//     }
//   },

//    createAccount: async (user: UserType, password: string) => {

//     set({ loading: true });

//     if (!user.email) throw "Digite o seu e-mail!";
//     if (!user.name) throw "Digite seu nome!";
//     if (!user.phone) throw "Digite seu número de telefone!";
//     if (!password) throw "Digite a sua palavra-passe!";

//     try {
      
//       await AuthService.shared.signUpUser(user, password);

//       set({ loading: false });
//     } catch (error: any) {
//       switch (error.code) {
//         case "auth/user-not-found":
//           throw "Usuário inexistente";
//         case "auth/missing-email":
//           throw "Por favor, insira o email";
//         case "auth/internal-error":
//           throw "Insira a senha";
//         case "auth/invalid-credential":
//           throw "Dados incorretos";
//         default:
//           throw "Senha ou email incorreto!";
//       }
//     }
//   },

//   updateProfile: (user: UserType, file: File | undefined) => {
//     return new Promise(async (resolve, reject) => {
//       AuthService.shared
//         .updateUser(user, file)
//         .then(() => {
//           set(() => ({ user: user }));
//           resolve();
//         })
//         .catch(() => {
//           reject("Erro ao actualizar usuário.");
//         });
//     });
//   },

//   verifyCode: async (oobCode) => {
//     set({ loading: true, errorMessage: "" });

//     try {
//       const email = await AuthService.shared.verifyResetCode(oobCode);
//       set({ email });
//     } catch {
//       set({ errorMessage: "Código inválido" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   confirmPassword: async (oobCode, newPassword) => {
//     set({ loading: true, errorMessage: "" });
//     try {
//       await AuthService.shared.confirmNewPassword(oobCode, newPassword);
//     } catch (error: any) {
//       set({ errorMessage: error.message || "Erro ao confirmar senha" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   resetPassword: (email: string) => {
//     return new Promise((resolve, reject) => {
//       if (!email) {
//         reject("Por favor, insira o e-mail.");
//       } else {
//         AuthService.shared
//           .resetPassword(email)
//           .then(() => {
//             resolve();
//           })
//           .catch((error) => {
//             switch (error.code) {
//               case "auth/user-not-found":
//                 reject("Usuário não encontrado.");
//                 break;
//               case "auth/invalid-email":
//                 reject("E-mail inválido.");
//                 break;
//               default:
//                 reject("Ocorreu um erro ao enviar o e-mail de redefinição.");
//                 break;
//             }
//           });
//       }
//     });
//   },

//   logOut: () => {
//     set(() => ({ userAuthPermission: null }));
//     set(() => ({ user: null }));
//     deleteData(StorageEnum.USERDATA);
//     return AuthService.shared.logOut();
//   },
// }));
