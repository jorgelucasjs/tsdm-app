import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';



// React Native Firebase doesn't need global window declarations

export function loginWithEmailAndPassword(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
	return new Promise((resolve, reject) => {
		auth().signInWithEmailAndPassword(email, password)
			.then(resolve)
			.catch(reject)
	})
}

export function loginWithGoogle(): Promise<FirebaseAuthTypes.User> {
	return new Promise(async (resolve, reject) => {
		try {
			// Check if your device supports Google Play
			// await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
			// // Get the users ID token
			// const { idToken } = await GoogleSignin.signIn();
			// // Create a Google credential with the token
			// const googleCredential = auth.GoogleAuthProvider.credential(idToken);
			// // Sign-in the user with the credential
			// const result = await auth().signInWithCredential(googleCredential);
			// return resolve(result.user)
		} catch (error: any) {
			return reject(error)
		}
	})
}


export async function loginWithApple(): Promise<FirebaseAuthTypes.User> {
	return new Promise(async (resolve, reject) => {
		try {
			// Start the sign-in request
			const appleAuthRequestResponse = await appleAuth.performRequest({
				requestedOperation: appleAuth.Operation.LOGIN,
				requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
			});
			// Ensure Apple returned a user identityToken
			if (!appleAuthRequestResponse.identityToken) {
				throw new Error('Apple Sign-In failed - no identify token returned');
			}
			// Create a Firebase credential from the response
			const { identityToken, nonce } = appleAuthRequestResponse;
			const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
			// Sign the user in with the credential
			const result = await auth().signInWithCredential(appleCredential);
			resolve(result.user)
		} catch (error: any) {
			reject(error)
		}
	})
}

export function loginInWithPhoneNumber(code: string, phoneNumber: string): Promise<FirebaseAuthTypes.ConfirmationResult> {
	return new Promise((resolve, reject) => {
		try {
			if (phoneNumber !== "") {
				const phoneNumberWithCode = code + phoneNumber
				auth().signInWithPhoneNumber(phoneNumberWithCode)
					.then(resolve)
					.catch(reject)
			} else {
				reject({ code: "auth/missing-phone-number" })
			}
		} catch (error) {
			reject(error)
		}
	})
}


export function updateUserProfile(
	user: {
		displayName?: string | null | undefined;
		photoURL?: string | null | undefined;
	}
) {
	return auth().currentUser?.updateProfile(user)
}

export function currentUser() {
	return auth().currentUser
}

