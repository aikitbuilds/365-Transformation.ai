import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isDemo: boolean;
    signInWithGoogle: () => Promise<void>;
    enterDemoMode: () => void;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        try {
            unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                if (!isDemo) {
                    setUser(currentUser);
                    setLoading(false);
                }
            });
        } catch (error) {
            console.warn("Firebase auth listener failed to initialize:", error);
            setLoading(false);
        }
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [isDemo]);

    const enterDemoMode = () => {
        const demoUser = {
            uid: 'demo-user-123',
            displayName: 'Demo User',
            email: 'demo@example.com',
            photoURL: null,
            emailVerified: true,
            isAnonymous: false,
            metadata: {},
            providerData: [],
            refreshToken: '',
            tenantId: null,
            delete: async () => {},
            getIdToken: async () => 'mock-token',
            getIdTokenResult: async () => ({
                token: 'mock-token',
                signInProvider: 'google',
                claims: {},
                authTime: '',
                issuedAtTime: '',
                expirationTime: '',
            }),
            reload: async () => {},
            toJSON: () => ({}),
            phoneNumber: null,
        } as unknown as User;
        setUser(demoUser);
        setIsDemo(true);
        setLoading(false);
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            setIsDemo(false);
        } catch (error: any) {
            console.error("Error signing in with Google", error);
            // Fallback to Demo Mode if configuration is missing or invalid
            if (error.code === 'auth/api-key-not-valid' || 
                error.code === 'auth/internal-error' || 
                error.code === 'auth/configuration-not-found' || 
                error.code === 'auth/invalid-api-key') {
                console.warn("Firebase configuration invalid. Entering Demo Mode automatically.");
                enterDemoMode();
            } else {
                alert("Sign in failed: " + error.message);
            }
        }
    };

    const signOut = async () => {
        try {
            if (isDemo) {
                setUser(null);
                setIsDemo(false);
            } else {
                await firebaseSignOut(auth);
            }
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const value = { user, loading, isDemo, signInWithGoogle, enterDemoMode, signOut };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};