import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

export const useNotifications = () => {
    const { currentUser, userProfile, loading: authLoading } = useAuth(); // Destructure userProfile and authLoading
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Only proceed if auth is not loading and userProfile is available
        if (authLoading || !currentUser || !userProfile) {
            setIsLoading(false);
            setNotifications([]);
            return;
        }

        const notificationsQuery = query(
            collection(db, 'notifications'),
            where('userId', '==', userProfile.role === 'admin' ? 'admin' : currentUser.uid), // Use userProfile.role directly
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(notificationsQuery, 
            (snapshot) => {
                const fetchedNotifications = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() // Convert Firestore Timestamp to JS Date
                }));
                setNotifications(fetchedNotifications);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error fetching notifications: ", error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser, userProfile, authLoading]); // Add userProfile and authLoading to dependencies

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (id) => {
        try {
            const notifRef = doc(db, 'notifications', id);
            await updateDoc(notifRef, { read: true });
        } catch (error) {
            console.error("Error marking notification as read: ", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const batch = writeBatch(db);
            const unreadNotifs = notifications.filter(n => !n.read);
            unreadNotifs.forEach(notif => {
                const notifRef = doc(db, 'notifications', notif.id);
                batch.update(notifRef, { read: true });
            });
            await batch.commit();
        } catch (error) {
            console.error("Error marking all notifications as read: ", error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const notifRef = doc(db, 'notifications', id);
            await deleteDoc(notifRef);
        } catch (error) {
            console.error("Error deleting notification: ", error);
        }
    };
    
    const clearAll = async () => {
        try {
            const batch = writeBatch(db);
            notifications.forEach(notif => {
                const notifRef = doc(db, 'notifications', notif.id);
                batch.delete(notifRef);
            });
            await batch.commit();
        } catch (error) {
            console.error("Error clearing all notifications: ", error);
        }
    };

    return { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification, clearAll };
};