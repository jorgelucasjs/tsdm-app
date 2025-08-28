import storage from '@react-native-firebase/storage';

export function getStorageRef(referenceImage: string) {
	return storage().ref(referenceImage);
}