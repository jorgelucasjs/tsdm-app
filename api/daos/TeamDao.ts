// import {
// 	addDocument,
// 	deleteDocument,
// 	setDocument,
// } from "@/firebase/firestore";
// import { COOLLECTION_TEAMS } from "../../utils/collections";
// import firestore from '@react-native-firebase/firestore';
// import { TeamType } from "@/interfaces/TeamType";
// import { uploadFileToServer } from "../repositories/FileRepository";
// import { TeamDetail } from "@/interfaces/TeamDetail";


// export default class TeamsDao {
// 	static shared = new TeamsDao();

// 	createNewTeam(
// 		newTeam: TeamType,
// 		file: File | undefined
// 	): Promise<TeamType> {
// 		return new Promise((resolve, reject) => {
// 			uploadFileToServer(file as File)
// 				.then((coverUrl) => {
// 					newTeam.img = coverUrl;
// 					const docRef = addDocument(COOLLECTION_TEAMS, newTeam);

// 					docRef
// 						.then((doc) => {
// 							newTeam.id = doc.id;
// 							setDocument(COOLLECTION_TEAMS, newTeam.id, newTeam, true)
// 								.then(() => resolve(newTeam))
// 								.catch(() => reject());
// 						})
// 						.catch((err) => {
// 							console.error("Error ao adicionar team:", err);
// 							reject(err);
// 						});

// 				})
// 				.catch((error) => {
// 					console.log("error", error);
// 					reject(error);
// 				});
// 		});
// 	}

// 	updateTeam(
// 		id: string,
// 		team: Partial<TeamDetail>,
// 		file: File | undefined
// 	): Promise<void> {
// 		return new Promise(async (resolve, reject) => {
// 			uploadFileToServer(file as File)
// 				.then(async (coverUrl) => {
// 					if (file !== undefined) {
// 						team.logo = coverUrl;
// 					}


// 					const benefitToUpdate = {
// 						...team,
// 						updatedAt: new Date(),
// 					};

// 					const docRef = doc(db, COOLLECTION_TEAMS, id);
// 					await setDoc(docRef, benefitToUpdate, { merge: true });

// 					resolve();
// 				})
// 				.catch((error) => {
// 					console.error("Erro no updateTeam:", error);
// 					reject(error);
// 				});
// 		});
// 	}

// 	getAllTeamCreated(
// 		pageSize = 0,
// 		lastDoc = null
// 	): Promise<{ listTeams: TeamType[], lastDoc: any }> {
// 		return new Promise((resolve, reject) => {
// 			let query = firestore().collection(COOLLECTION_TEAMS).limit(pageSize);

// 			if (lastDoc) {
// 				query = query.startAfter(lastDoc);
// 			}

// 			query.get()
// 				.then((snapshot) => {
// 					const listTeams: TeamType[] = [];
// 					snapshot.docs.forEach((doc) => {
// 						const data = doc.data() as TeamType;
// 						data.id = doc.id;

// 						listTeams.push(data);
// 					});
// 					resolve({
// 						listTeams,
// 						lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
// 					});
// 				})
// 				.catch(reject);
// 		})
// 	}

// 	deleteTeam(id: string, urlFile: string): Promise<void> {
// 		return new Promise(async (resolve, reject) => {
// 			try {
// 				console.log("Url valida", urlFile);
// 				// if (urlFile) {
// 				//   await deleteFileFromServer(urlFile);
// 				// }

// 				await deleteDocument(COOLLECTION_TEAMS, id);

// 				resolve();
// 			} catch (error) {
// 				console.error("Erro ao deletar team:", error);
// 				reject(error);
// 			}
// 		});
// 	}
// }
