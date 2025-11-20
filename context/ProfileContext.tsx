import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { UserProfile } from '../types';
import { AuthContext } from './AuthContext';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ProfileContextType {
    profile: UserProfile | null;
    onboardingComplete: boolean;
    isLoading: boolean;
    saveProfile: (profile: UserProfile) => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const authContext = useContext(AuthContext);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (authContext?.user) {
                setIsLoading(true);
                
                // Handle Demo User
                if (authContext.isDemo) {
                    // Check if we have a temporary profile in memory or just start fresh
                    if (!profile) {
                        setProfile(null);
                        setOnboardingComplete(false);
                    }
                    setIsLoading(false);
                    return;
                }

                try {
                    const profileDocRef = doc(db, 'users', authContext.user.uid);
                    const docSnap = await getDoc(profileDocRef);

                    if (docSnap.exists() && docSnap.data().mainGoal) { // Check if onboarding was actually completed
                        const userProfile = docSnap.data() as UserProfile;
                        setProfile(userProfile);
                        setOnboardingComplete(true);
                    } else {
                        // User is authenticated but has no profile yet or it's incomplete
                        setProfile(null);
                        setOnboardingComplete(false);
                    }
                } catch (error) {
                    console.error("Failed to load profile from Firestore", error);
                    setProfile(null);
                    setOnboardingComplete(false);
                } finally {
                    setIsLoading(false);
                }
            } else if (!authContext?.loading) {
                // User is not logged in or has logged out
                setProfile(null);
                setOnboardingComplete(false);
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [authContext?.user, authContext?.loading, authContext?.isDemo]);

    const saveProfile = async (newProfile: UserProfile) => {
        if (!authContext?.user) {
            console.error("Cannot save profile, no user logged in");
            return;
        }

        // Handle Demo User
        if (authContext.isDemo) {
            setProfile(newProfile);
            setOnboardingComplete(true);
            return;
        }

        try {
            const profileDocRef = doc(db, 'users', authContext.user.uid);
            await setDoc(profileDocRef, newProfile, { merge: true });
            setProfile(newProfile);
            setOnboardingComplete(true);
        } catch (error) {
            console.error("Failed to save profile to Firestore", error);
        }
    };

    return (
        <ProfileContext.Provider value={{ profile, onboardingComplete, isLoading, saveProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};