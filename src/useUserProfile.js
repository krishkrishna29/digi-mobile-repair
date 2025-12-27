import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

export const useUserProfile = () => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const fetchProfile = useCallback(async () => {
        if (!currentUser) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfile({ id: docSnap.id, ...docSnap.data() });
            } else {
                throw new Error("User profile not found.");
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to load profile. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateUserProfile = async (newProfileData) => {
        if (!currentUser) {
            setError("You must be logged in to update your profile.");
            return false;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, newProfileData);
            await fetchProfile(); // Refetch the profile to get the latest data
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
            return true;
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile. Please check your details and try again.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { profile, isLoading, error, success, updateUserProfile, refetchProfile: fetchProfile };
};