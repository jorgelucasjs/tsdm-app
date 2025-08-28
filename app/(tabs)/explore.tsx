import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function TabTwoScreen() {
    const { user, loading, signIn, signUp, signOut } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useState<any>(null);



    useEffect(() => {
        if (user && Platform.OS !== 'web') {
            const fetchUserData = async () => {
                try {
                    // Importar firestore dinamicamente
                    const firestoreModule = await import('@react-native-firebase/firestore');
                    const firestore = firestoreModule.default();
                    
                    const userDoc = await firestore
                        .collection('users')
                        .doc(user.uid)
                        .get();

                    if (userDoc.exists) {
                        setUserData(userDoc.data());
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                }
            };

            fetchUserData();
        }
    }, [user]);

    const handleSignIn = async () => {
        try {
            await signIn(email, password);
        } catch (error: any) {
            Alert.alert('Erro', error.message);
        }
    };

    const handleSignUp = async () => {
        try {
            await signUp(email, password);
            
            // Criar documento do usuário no Firestore (apenas em plataformas nativas)
            if (Platform.OS !== 'web') {
                const firestoreModule = await import('@react-native-firebase/firestore');
                const authModule = await import('@react-native-firebase/auth');
                const firestore = firestoreModule.default();
                const auth = authModule.default();
                
                await firestore
                    .collection('users')
                    .doc(auth.currentUser?.uid)
                    .set({
                        email: email,
                        createdAt: new Date(),
                    });
            }
        } catch (error: any) {
            Alert.alert('Erro', error.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    if (user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Bem-vindo!</Text>
                <Text>Email: {user.email}</Text>
                {userData && (
                    <Text>Dados do usuário: {JSON.stringify(userData, null, 2)}</Text>
                )}
                <TouchableOpacity style={styles.button} onPress={signOut}>
                    <Text style={styles.buttonText}>Sair</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Criar Conta</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    secondaryButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});