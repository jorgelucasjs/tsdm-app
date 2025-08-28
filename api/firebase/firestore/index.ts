import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';


export const db = firestore()

/**
 *
 * @param collectionName - Name of collection (string)
 * @param document - Identity of document on collection (string)
 * @param data - Data to be stored on document (any)
 * @param isUpdate - If used, the document will be updated (boolean = false)
 */
export function setDocument(
	collectionName: string,
	document: string,
	data: any,
	isUpdate: boolean = false
) {
	if (isUpdate) {
		return db.collection(collectionName).doc(document).set(data, { merge: true })
	} else {
		return db.collection(collectionName).doc(document).set(data)
	}
}

/**
 *
 * @param collectionName - Name of collection (string)
 * @param document - Identity of document on collection (string)
 * @param data - Data to be stored on document (any)
 * @param isUpdate - If used, the document will be updated (boolean = false)
 */
export async function writeBatchDocument(
	collectionName: string,
	document: string[],
	data: any | any[],
	isUpdate: boolean = false
) {
	const batch = db.batch();

	for (const i in document) {
		const docRef = db.collection(collectionName).doc(document[i]);
		if (isUpdate) {
			batch.set(docRef, data, { merge: true })
		} else {
			console.log(collectionName, document[i])
			batch.set(docRef, data[i])
		}
	}
	try {
		return await batch.commit()
	} catch (error) {
		console.log(error)
	}
}

/**
 *
 * @param collectionName - Name of collection (string)
 * @param idDocument - (string)
 * @param subCollectionName - (string)
 * @param idDocumentOnSubcollection -  (string)
 * @param data - Data to be stored on document (any)
 */
export function setSubCollection(
	collectionName: string,
	idDocument: string,
	subCollectionName: string,
	idDocumentOnSubcollection: string,
	data: any,
) {
	return db.collection(collectionName).doc(idDocument).collection(subCollectionName).doc(idDocumentOnSubcollection).set(data, { merge: true });
}

/**
 *
 * @param collectionName - Name of collection (string)
 * @param idDocument - (string)
 * @param subCollectionName - (string)
 * @param idDocumentOnSubcollection -  (string)
 * @param data - Data to be stored on document (any)
 */
export async function updateDocument(
	collectionName: string,
	idDocument: string,
	data: any
) {
	return await db.collection(collectionName).doc(idDocument).update(data);
}

/**
 *
 * @param collectionName - Name of collection (string)
 * @param idDocument - (string)
 * @param subCollectionName - (string)
 * @param data - Data to be stored on document (any)
 */
export function addSubCollection(
	collectionName: string,
	idDocument: string,
	subCollectionName: string,
	data: any,
) {
	return db.collection(collectionName).doc(idDocument).collection(subCollectionName).add(data);
}

/**
 *
 * @param collectionName - Name of collection (string)
 * @param data - Data to be stored on document (any)
 */
export function addDocument(collectionName: string, data: any) {
	return db.collection(collectionName).add(data)
}

/**
 *
 * @param collectionName - Name of collection (string) ou QueryDocument
 */
export function getAllDocument(collectionName: string | FirebaseFirestoreTypes.Query) {
	if (typeof collectionName === "string") {
		return db.collection(collectionName).get()
	} else {
		return collectionName.get()
	}
}

/**
 *
 * @param collectionName - Name of collection (string)
 * @param document - Identity of document on collection (string)
 */
export function getDocument(collectionName: string, document: string) {
	return db.collection(collectionName).doc(document).get()
}

/**
 *
 * @param collectionName - Name of collection (string)
 * @param document - Identity of document on collection (string)
 */
export function deleteDocument(
	collectionName: string,
	idDocument: string,

) {
	return db.collection(collectionName).doc(idDocument).delete();
}

/**
 *
 * @param collectionName - Name of collection (string)
 * @param document - Identity of document on collection (string)
 */
export function getSnapshotDocument(
	collectionName: string,
	document: string,
	callback: (snapshot: FirebaseFirestoreTypes.DocumentSnapshot) => void) {
	return db.collection(collectionName).doc(document).onSnapshot(callback)
}

/**
 *
 * @param collectionName - Name of collection (string)
 * @param document - Identity of document on collection (string)
 */
export function getSnapshotQueryDocument(
	collectionName: string,
	queryConstraints: any[],
	limitNumber: number,
	callback: (snapshot: FirebaseFirestoreTypes.QuerySnapshot) => void,
	orderByField?: string,
) {
	const q = getAllDocumentWithQuery(collectionName, queryConstraints, limitNumber, orderByField)
	return q.onSnapshot(callback)
}

/**
 *
 * @param collectionName - Name of collection (string)
 */
export function getAllDocumentWithQuery(
	collectionName: string,
	queryConstraints: any[],
	limitNumber: number,
	orderByField?: string,
) {
	let q = db.collection(collectionName);
	
	// Apply query constraints
	// for (const constraint of queryConstraints) {
	// 	if (constraint.type === 'where') {
	// 		q = q.where(constraint.field, constraint.operator, constraint.value);
	// 	}
	// }
	
	// if (orderByField) {
	// 	q = q.orderBy(orderByField, 'asc');
	// }
	
	return q.limit(limitNumber);
}


export function getAllDocumentWithQueryLimit(
	collectionName: string,
	limitNumber: number
) {
	return db.collection(collectionName).limit(limitNumber)
}

export function getAllSubCollection(
	collectionName: string,
	document: string,
	subCollectionName: string,

) {
	return db.collection(collectionName).doc(document).collection(subCollectionName).get();
}

export function deleteDocOnSubCollection(
	collectionName: string,
	document: string,
	subCollectionName: string,
	idDocumentSubCollection: string
) {
	return db.collection(collectionName).doc(document).collection(subCollectionName).doc(idDocumentSubCollection).delete();
}

export function getAllSubCollectionWithQuery(
	collectionName: string,
	queryConstraints: any[],
	subCollectionName: string,
	document: string,
	orderByField?: string,
) {
	let q = db.collection(collectionName).doc(document).collection(subCollectionName);
	
	// Apply query constraints
	// for (const constraint of queryConstraints) {
	// 	if (constraint.type === 'where') {
	// 		q = q.where(constraint.field, constraint.operator, constraint.value);
	// 	}
	// }
	
	// if (orderByField) {
	// 	q = q.orderBy(orderByField, 'asc');
	// }
	
	return q;
}

export function getDocumentOnSubCollection(
	collectionName: string,
	document: string,
	subCollectionName: string,
	idDocumentSubCollection: string,
) {
	return db.collection(collectionName).doc(document).collection(subCollectionName).doc(idDocumentSubCollection).get();
}

export function updateDocumentOnSubCollection(
	collectionName: string,
	idDocument: string,
	subCollectionName: string,
	idDocumentSubCollection: string,
	data: any
) {
	return db.collection(collectionName).doc(idDocument).collection(subCollectionName).doc(idDocumentSubCollection).update(data);
}


export async function getSingleDocumentWithQuery(
	collectionName: string,
	queryConstraints: any[]
) {
	let q = db.collection(collectionName);
	
	// Apply query constraints
	// for (const constraint of queryConstraints) {
	// 	if (constraint.type === 'where') {
	// 		q = q.where(constraint.field, constraint.operator, constraint.value);
	// 	}
	// }
	
	const snapshot = await q.limit(1).get();

	if (snapshot.empty) {
		return null;
	}
	return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}


export function createById(collectionName: string, data: any, docId: string): Promise<void> {
	return new Promise((resolve, reject) => {
		db.collection(collectionName).doc(docId).set(data)
			.then(() => {
				resolve();
			}).catch(reject);
	})
}