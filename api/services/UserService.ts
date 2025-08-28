// import { deleteDocument, getAllDocument, setDocument } from "@/firebase/firestore";
// import { UserType } from "@/types/UserType";
// import { COLLECTION_USERS } from "@/utils/collections";
// import { convertTimestampToDate } from "@/utils/helpers";
// import firestore from '@react-native-firebase/firestore';

// export default class UserService {
//   static shared = new UserService();

//   getUserByEmail(userEmail: string): Promise<UserType> {
//     return new Promise((resolve, reject) => {
//       firestore()
//         .collection(COLLECTION_USERS)
//         .where("email", "==", userEmail)
//         .get()
//         .then((querySnapshot) => {
//           if (querySnapshot.empty) {
//             reject();
//           } else {
//             querySnapshot.docs.forEach((docs) => {
//               const user = docs.data() as UserType;

//               if (user.creatAt) {
//                 user.creatAt = convertTimestampToDate(user.creatAt);
//               }

//               resolve(user);
//             });
//           }
//         })
//         .catch(reject);
//     });
//   }

//   getAllUsers(): Promise<UserType[]> {
//     return new Promise((resolve, reject) => {
//       getAllDocument(COLLECTION_USERS)
//         .then((querySnapshot) => {
//           const users: UserType[] = [];
//           querySnapshot.forEach((doc) => {
//             const data = doc.data() as UserType;
//             data.id = doc.id; 

//             if (data.creatAt) {
//               data.creatAt = convertTimestampToDate(data.creatAt);
//             }
            
//             users.push(data);
//           });
//           resolve(users);
//         })
//         .catch(reject);
//     });
//   }

//    blockUser(user: UserType): Promise<void> {
//      return new Promise( async (resolve, reject) => {
       
//         try {
//           await setDocument(COLLECTION_USERS, user.id, { 
//               status: "Bloqueado",
//               updatedAt: new Date()
//             }, true)
//           resolve()
//         } catch (error) {
//            console.error("Erro ao fazer checkin do Benefício:", error);
//           reject(error);
//         }
//      })
//   }

//   async deleteUser(id: string): Promise<void> {
//       try {
//         await deleteDocument(COLLECTION_USERS, id);
//       } catch (error) {
//         console.error("Erro ao excluir usuário:", error);
//         throw error;
//       }
//   }
// }
