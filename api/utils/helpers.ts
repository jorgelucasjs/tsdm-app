import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';


export function convertTimestampToDate(value: any): Date {
    if (value && typeof value.toDate === 'function') {
        return value.toDate();
    }

    if (value instanceof Date) {
        return value;
    }

    throw new Error(`Valor inválido: esperado Timestamp ou Date: ${value}`);
}

export function getStringImageFilePath(
  reader: FileReader,
  file: Blob
): Promise<string> {
  return new Promise((resolve, reject) => {
    reader.onload = (e: ProgressEvent<FileReader>) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

