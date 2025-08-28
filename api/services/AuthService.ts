
import { deleteDocument, setDocument } from "@/api/firebase/firestore";
import { deleteFileFromServer, uploadFileToServer } from "@/api/repositories/FileRepository";
import { UserType } from "@/types/UserType";
import auth from '@react-native-firebase/auth';
import { COLLECTION_USERS } from "../utils/collections";

export default class AuthService {

  static shared = new AuthService();
  private auth = auth();

  async signInEmailPassword(email: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password)
    } catch (error) {
      throw error
    }
  }

  async signUpUser(newUser: UserType, password: string) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(
        newUser.email,
        password
      );

      const user = userCredential.user;
      newUser.id = user.uid;

      await this.createUserAccount(user.uid, newUser);
      await user.sendEmailVerification();

    } catch (error) {
      console.error("Erro ao criar conta de usuário:", error);
      throw error;
    }
  }

  updateUser(user: UserType, file: File | undefined): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (file !== undefined) {
          const coverUrl = await uploadFileToServer(file as File);
          user.imageUrl = coverUrl;
        }

        await setDocument(COLLECTION_USERS, user.id, user, true);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  resetPassword(email: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.auth.sendPasswordResetEmail(email);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  verifyResetCode(oobCode: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const email = await this.auth.verifyPasswordResetCode(oobCode);
        resolve(email);
      } catch (error) {
        console.error("Erro ao verificar código de redefinição:", error);
        reject(error);
      }
    });
  }

  confirmNewPassword(oobCode: string, newPassword: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.auth.confirmPasswordReset(oobCode, newPassword);
        resolve();
      } catch (error) {
        console.error("Erro ao confirmar nova senha:", error);
        reject(error);
      }
    });
  }

  removeUser(id: string, urlFile: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (urlFile) {
          await deleteFileFromServer(urlFile);
        }
        await deleteDocument(COLLECTION_USERS, id);

        resolve();
      } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        reject(error);
      }
    });
  }

  logOut() {
    this.auth.signOut()
  }

  private createUserAccount(uid: string, user: UserType): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await setDocument(COLLECTION_USERS, uid, user);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
