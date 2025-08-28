// // import { uploadFileToServer } from "@/app/repository/FileRepository";
// import { uploadFileToServer } from "@/api/repositories/FileRepository";
// import {
//   addDocument,
//   deleteDocument,
//   setDocument,
//   updateDocument,
// } from "@/firebase/firestore";
// import { NewsType } from "@/types/NewsModel";
// import { COLLECTION_NEWS } from "@/utils/collections";
// import { convertTimestampToDate } from "@/utils/helpers";
// import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// export default class NewsService {
//   static shared = new NewsService();

//   addNews(
//     newNews: NewsType,
//     newsImageUrl: File | undefined
//   ): Promise<NewsType> {
//     return new Promise(async (resolve, reject) => {
//       uploadFileToServer(newsImageUrl as File)
//         .then((coverUrl) => {
//           newNews.thumbnail = coverUrl;

//           const docRef = addDocument(COLLECTION_NEWS, newNews);
//           docRef
//             .then((doc) => {
//               newNews.id = doc.id;
//               setDocument(COLLECTION_NEWS, newNews.id, newNews, true)
//                 .then(() => resolve(newNews))
//                 .catch(() => reject());
//             })
//             .catch((err) => {
//               console.error("Error adding event:", err);
//               reject(err);
//             });
//         })
//         .catch((error) => {
//           console.log("error", error);
//           reject(error);
//         });
//     });
//   }

//   async getAllNews(
//     pageSize = 0,
//     lastDoc = null
//   ): Promise<{ allNews: NewsType[]; lastDoc: any }> {
//     return new Promise((resolve, reject) => {
//       let query = firestore().collection(COLLECTION_NEWS).limit(pageSize);

//       if (lastDoc) {
//         query = query.startAfter(lastDoc);
//       }

//       query.get().then((snapshot) => {
//         const news: NewsType[] = [];

//         snapshot.docs.forEach((doc) => {
//           const data = doc.data() as NewsType;
//           data.id = doc.id;

//           if (data.date) {
//             data.date = convertTimestampToDate(data.date);
//           }

//           news.push(data);
//         });

//         resolve({
//           allNews: news,
//           lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
//         });
//       })
//     })
   
//   }

//   listenNews(callback: (allNews: NewsType[]) => void): () => void {
//     const unsubscribe = firestore()
//       .collection(COLLECTION_NEWS)
//       .onSnapshot(
//         (snapshot) => {
//           const allNews: NewsType[] = [];
//           snapshot.forEach((doc) => {
//             const data = doc.data() as NewsType;

//             if (data.date) {
//               data.date = convertTimestampToDate(data.date);
//             }

//             allNews.push(data);
//           });
//           callback(allNews);
//         },
//         (error: any) => {
//           console.error("Erro ao escutar allNews:", error);
//         }
//       );
//     return unsubscribe;
//   }

//   updateNews(
//     id: string, 
//     newNews: Partial<NewsType>,
//     file: File | undefined
//   ): Promise<void> {
//     return new Promise( async (resolve, reject) => {
//         uploadFileToServer(file as File)
//             .then(async (coverUrl) => {
//                 if (file !== undefined) {
//                     newNews.thumbnail = coverUrl
//                 }

//                 const eventToUpdate = {
//                     ...newNews,
//                     updatedAt: new Date()
//                 }

//                 await setDocument(COLLECTION_NEWS, id, eventToUpdate, true);

//                 resolve();
//             })
//             .catch(reject)
//     })
//   }

//   async deleteNews(id: string): Promise<void> {
//     try {
//       await deleteDocument(COLLECTION_NEWS, id);
//     } catch (error) {
//       console.error("Erro ao excluir notícia:", error);
//       throw error;
//     }
//   }
// }
