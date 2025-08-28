// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [authService, setAuthService] = useState<any>(null);

    useEffect(() => {
        const initAuth = async () => {
            if (Platform.OS === 'web') {
                setLoading(false);
                return;
            }

            try {
                const authModule = await import('@react-native-firebase/auth');
                const auth = authModule.default();
                setAuthService(auth);

                const unsubscribe = auth.onAuthStateChanged((user: any) => {
                    setUser(user);
                    setLoading(false);
                });

                return unsubscribe;
            } catch (error) {
                console.error('Erro ao inicializar Auth:', error);
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const signIn = async (email: string, password: string) => {
        if (!authService) {
            throw new Error('Firebase Auth não inicializado');
        }
        
        try {
            await authService.signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string) => {
        if (!authService) {
            throw new Error('Firebase Auth não inicializado');
        }
        
        try {
            await authService.createUserWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Erro ao criar conta:', error);
            throw error;
        }
    };

    const signOut = async () => {
        if (!authService) {
            throw new Error('Firebase Auth não inicializado');
        }
        
        try {
            await authService.signOut();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        }
    };

    return {
        user,
        loading,
        signIn,
        signUp,
        signOut,
    };
};