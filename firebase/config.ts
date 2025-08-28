// firebase/config.ts
// Configuração Firebase segura para web e dispositivos nativos

export interface FirebaseServices {
  firebase: any;
  auth: any;
  crashlytics: any;
  firestore: any;
  storage: any;
}

// Função para inicializar Firebase apenas em dispositivos nativos
export const initializeFirebase = async (): Promise<FirebaseServices | null> => {
  // Verificar se estamos na web
  if (typeof window !== 'undefined') {
    console.log('Firebase não disponível na web - usando React Native Firebase');
    return null;
  }
  
  // Verificar se estamos em um ambiente React Native
  if (typeof require === 'undefined') {
    console.log('Ambiente não suporta require');
    return null;
  }
  
  try {
    console.log('Inicializando Firebase para dispositivo nativo...');
    
    // Importar módulos Firebase dinamicamente apenas em runtime
    const firebaseApp = require('@react-native-firebase/app');
    const firebaseAuth = require('@react-native-firebase/auth');
    const firebaseCrashlytics = require('@react-native-firebase/crashlytics');
    const firebaseFirestore = require('@react-native-firebase/firestore');
    const firebaseStorage = require('@react-native-firebase/storage');
    
    // Configurações específicas para desenvolvimento
    if (__DEV__) {
      // Desabilitar crashlytics em desenvolvimento
      firebaseCrashlytics.default().setCrashlyticsCollectionEnabled(false);
    }
    
    console.log('Firebase inicializado com sucesso!');
    
    return {
      firebase: firebaseApp.default,
      auth: firebaseAuth.default(),
      crashlytics: firebaseCrashlytics.default(),
      firestore: firebaseFirestore.default(),
      storage: firebaseStorage.default(),
    };
  } catch (error) {
    console.warn('Erro ao inicializar Firebase:', error);
    return null;
  }
};

// Exportar apenas a função de inicialização
export default initializeFirebase;