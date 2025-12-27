import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = useCallback(async (user) => {
        if (!user) {
            setUserProfile(null);
            setLoading(false);
            return;
        }
        console.log("Fetching profile for user:", user.uid);
        try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("User profile found:", docSnap.data());
                setUserProfile({ uid: user.uid, ...docSnap.data() });
            } else {
                console.log("No user profile found in Firestore for UID:", user.uid);
                // Handle case where user exists in auth but not in firestore
                setUserProfile({ uid: user.uid, email: user.email, role: 'user' }); // Set a default role
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            // Set a basic profile to avoid full app failure
            setUserProfile({ uid: user.uid, email: user.email, role: 'user' }); // Set a default role
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            await fetchUserProfile(user);
        });
        return () => unsubscribe();
    }, [fetchUserProfile]);

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await fetchUserProfile(userCredential.user);
        return userCredential;
    };

    const signup = async (email, password, fullName, phoneNumber) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Create user profile in Firestore
        await setDoc(doc(db, "users", user.uid), {
            fullName,
            email,
            phoneNumber,
            role: 'user', // Assign default role
            createdAt: new Date()
        });
        await fetchUserProfile(user);
        return userCredential;
    };

    const logout = () => {
        setUserProfile(null); // Clear user profile on logout
        return signOut(auth);
    };

    // This function will be used by the profile page to trigger a refresh
    const refreshUserProfile = () => {
        if (currentUser) {
            return fetchUserProfile(currentUser);
        }
    }

    const value = {
        currentUser,
        userProfile,
        loading,
        login,
        signup,
        logout,
        refreshUserProfile // Expose the refresh function
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};