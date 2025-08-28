
import Compressor from "compressorjs";
import { v4 as uuidv4 } from "uuid";
import storage from '@react-native-firebase/storage';
// ajusta o caminho conforme teu projeto

export function uploadFileToServer(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file || !file.type || !file.name) {
        console.warn("Arquivo inválido ou sem tipo definido.");
        return resolve("");
      }

      const metadata = {
        contentType: file.type,
      };

      //const compressedFile = await fileCompressor(file);
      const extension = extractExtension(file.type);
      const fileName = `${Date.now()}-${uuidv4()}.${extension}`;
      const storageRef = storage().ref(`files/${fileName}`);

      let fileToUpload: File | Blob = file;

      console.log("storageRef", storageRef);

      if(file.type.startsWith("image/")) {
        fileToUpload = await fileCompressor(file);
      }

      const snapshot = await storageRef.put(fileToUpload, metadata);
      
      const url = await storageRef.getDownloadURL();

      console.log("Download URL:", url);
      resolve(url);
    } catch (error) {
      console.error("Erro no upload:", error);
      reject(error);
    }
  });
}

function fileCompressor(coverFile: File): Promise<File | Blob> {
  return new Promise((resolve, reject) => {
    new Compressor(coverFile, {
      quality: 0.8,
      success: (compressedFile) => {
        resolve(compressedFile);
      },
      error: (error) => {
        console.error("Erro no CompressorJS:", error);
        reject(error);
      },
    });
  });
}

function extractExtension(type: string): string {
  return type.split("/")[1] || "jpg";
}


export async function deleteFileFromServer(url: string): Promise<void> {
  try {
    if (!url) throw new Error("URL inválida.");
    if (!url.startsWith("https://firebasestorage.googleapis.com/")) {
      throw new Error("A URL não é uma URL válida do Firebase Storage.");
    }

    const pathStart = url.indexOf(`/o/`) + 3;
    const pathEnd = url.indexOf(`?`);
    const encodedPath = url.substring(pathStart, pathEnd);
    const filePath = decodeURIComponent(encodedPath);

    const fileRef = storage().ref(filePath);
    await fileRef.delete();

    console.log(`Arquivo deletado: ${filePath}`);
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    throw error;
  }
}

