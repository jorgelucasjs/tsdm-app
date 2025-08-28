import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { COLLECTION_USERS } from '../utils/collections';



// Firebase configuration is handled by google-services.json and GoogleService-Info.plist
// No need to initialize Firebase manually in React Native Firebase

export const dbFirestore = firestore()
export const authApp = auth()
export const storageApp = storage()

export const storageFile = {
    ref: storage().ref,
    uploadBytes: (ref: any, data: any) => ref.put(data),
    getDownloadURL: (ref: any) => ref.getDownloadURL()
}


// React Native Firebase uses different API structure
// These functions are accessed directly from firestore() instance

// React Native Firebase auth functions are accessed directly from auth() instance


export const usersRef = dbFirestore.collection(COLLECTION_USERS);