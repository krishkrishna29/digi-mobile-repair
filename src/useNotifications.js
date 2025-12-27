import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

export const useNotifications = () => {
    const { currentUser, userProfile, loading: authLoading } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading || !currentUser || !userProfile) {
            setIsLoading(false);
            setNotifications([]);
            return;
        }

        // Determine the correct collection path based on user role
        const notificationsPath = userProfile.role === 'admin' 
            ? 'admin_notifications' 
            : `users/${currentUser.uid}/notifications`;

        const notificationsQuery = query(
            collection(db, notificationsPath),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(notificationsQuery, 
            (snapshot) => {
                const fetchedNotifications = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate()
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
    }, [currentUser, userProfile, authLoading]);

    const unreadCount = notifications.filter(n => !n.read).length;
    const notificationsPath = userProfile?.role === 'admin' ? 'admin_notifications' : `users/${currentUser?.uid}/notifications`;


    const markAsRead = async (id) => {
        try {
            const notifRef = doc(db, notificationsPath, id);
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
                const notifRef = doc(db, notificationsPath, notif.id);
                batch.update(notifRef, { read: true });
            });
            await batch.commit();
        } catch (error) {
            console.error("Error marking all notifications as read: ", error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const notifRef = doc(db, notificationsPath, id);
            await deleteDoc(notifRef);
        } catch (error) {
            console.error("Error deleting notification: ", error);
        }
    };
    
    const clearAll = async () => {
        try {
            const batch = writeBatch(db);
            notifications.forEach(notif => {
                const notifRef = doc(db, notificationsPath, notif.id);
                batch.delete(notifRef);
            });
            await batch.commit();
        } catch (error) {
            console.error("Error clearing all notifications: ", error);
        }
    };

    return { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification, clearAll };
};