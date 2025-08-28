// components/FirebaseExample.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, Platform } from 'react-native';
import { initializeFirebase } from '../firebase/config';

// Tipos para Firebase (importados condicionalmente)
type FirebaseAuthTypes = any;
type FirebaseAuth = any;
type FirebaseFirestore = any;
type FirebaseCrashlytics = any;

interface FirebaseExampleProps {
  // Props opcionais
}

const FirebaseExample: React.FC<FirebaseExampleProps> = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseServices, setFirebaseServices] = useState<{
    auth: FirebaseAuth | null;
    firestore: FirebaseFirestore | null;
    crashlytics: FirebaseCrashlytics | null;
  }>({ auth: null, firestore: null, crashlytics: null });

  useEffect(() => {
    const initFirebase = async () => {
      if (Platform.OS === 'web') {
        setLoading(false);
        return;
      }

      try {
        await initializeFirebase();
        
        // Importar serviços após inicialização
        const authModule = await import('@react-native-firebase/auth');
        const firestoreModule = await import('@react-native-firebase/firestore');
        const crashlyticsModule = await import('@react-native-firebase/crashlytics');
        
        const authService = authModule.default();
        const firestoreService = firestoreModule.default();
        const crashlyticsService = crashlyticsModule.default();
        
        setFirebaseServices({
          auth: authService,
          firestore: firestoreService,
          crashlytics: crashlyticsService,
        });
        
        // Listener para mudanças no estado de autenticação
        const unsubscribe = authService.onAuthStateChanged((user: any) => {
          setUser(user);
          setLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Erro ao inicializar Firebase:', error);
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  const signInAnonymously = async () => {
    if (!firebaseServices.auth) {
      Alert.alert('Erro', 'Firebase não inicializado');
      return;
    }
    
    try {
      await firebaseServices.auth.signInAnonymously();
      Alert.alert('Sucesso', 'Login anônimo realizado!');
    } catch (error) {
      console.error('Erro no login anônimo:', error);
      firebaseServices.crashlytics?.recordError(error as Error);
      Alert.alert('Erro', 'Falha no login anônimo');
    }
  };

  const signOut = async () => {
    if (!firebaseServices.auth) {
      Alert.alert('Erro', 'Firebase não inicializado');
      return;
    }
    
    try {
      await firebaseServices.auth.signOut();
      Alert.alert('Sucesso', 'Logout realizado!');
    } catch (error) {
      console.error('Erro no logout:', error);
      firebaseServices.crashlytics?.recordError(error as Error);
      Alert.alert('Erro', 'Falha no logout');
    }
  };

  const testFirestore = async () => {
    if (!firebaseServices.firestore) {
      Alert.alert('Erro', 'Firestore não inicializado');
      return;
    }
    
    try {
      // Adicionar um documento de teste
      const docRef = await firebaseServices.firestore.collection('test').add({
        message: 'Hello from Firebase!',
        timestamp: firebaseServices.firestore.FieldValue.serverTimestamp(),
        platform: Platform.OS,
      });
      
      Alert.alert('Sucesso', `Documento criado com ID: ${docRef.id}`);
    } catch (error) {
      console.error('Erro no Firestore:', error);
      firebaseServices.crashlytics?.recordError(error as Error);
      Alert.alert('Erro', 'Falha ao salvar no Firestore');
    }
  };

  const testCrashlytics = () => {
    if (!firebaseServices.crashlytics) {
      Alert.alert('Erro', 'Crashlytics não inicializado');
      return;
    }
    
    // Registrar um log personalizado
    firebaseServices.crashlytics.log('Teste de Crashlytics executado');
    
    // Definir atributos do usuário
    firebaseServices.crashlytics.setUserId(user?.uid || 'anonymous');
    firebaseServices.crashlytics.setAttribute('test_feature', 'firebase_example');
    
    Alert.alert('Sucesso', 'Log enviado para Crashlytics!');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando Firebase...</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Firebase Integration Test</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plataforma Web</Text>
          <Text style={styles.userInfo}>Firebase não está disponível na web com React Native Firebase.</Text>
          <Text style={styles.userInfo}>Use um dispositivo móvel ou emulador para testar o Firebase.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Integration Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication</Text>
        {user ? (
          <>
            <Text style={styles.userInfo}>Usuário: {user.uid}</Text>
            <Text style={styles.userInfo}>Anônimo: {user.isAnonymous ? 'Sim' : 'Não'}</Text>
            <Button title="Logout" onPress={signOut} />
          </>
        ) : (
          <Button title="Login Anônimo" onPress={signInAnonymously} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Firestore</Text>
        <Button title="Testar Firestore" onPress={testFirestore} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Crashlytics</Text>
        <Button title="Testar Crashlytics" onPress={testCrashlytics} />
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>✅ Firebase configurado para iOS e Android</Text>
        <Text style={styles.infoText}>✅ Auth, Firestore, Storage e Crashlytics disponíveis</Text>
        <Text style={styles.infoText}>✅ Compatível com Expo 53</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  userInfo: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  info: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#2d5a2d',
  },
});

export default FirebaseExample;