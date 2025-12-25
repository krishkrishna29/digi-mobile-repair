import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, writeBatch, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import { BellIcon, XMarkIcon, CheckIcon, ArrowRightIcon, TrashIcon } from '@heroicons/react/24/outline';

const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
};

function Notification({ onNotificationClick, onViewAll }) {
    const { currentUser, userRole } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const getTargetUserId = () => {
        if (userRole === 'admin') return 'admin';
        return currentUser?.uid;
    }

    const buildQuery = (conditions = []) => {
        let baseQuery = query(collection(db, 'notifications'), where('userId', '==', getTargetUserId()));
        
        conditions.forEach(cond => {
            baseQuery = query(baseQuery, where(cond.field, cond.op, cond.value));
        });
        return baseQuery;
    }

    // Always listen for unread count
    useEffect(() => {
        if (!currentUser) return;

        const q = buildQuery([{ field: 'read', op: '==', value: false }]);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUnreadCount(snapshot.size);
        }, (error) => {
            console.error("Error fetching unread count:", error);
        });

        return () => unsubscribe();
    }, [currentUser, userRole]);

    // Listen for the list of notifications (limited to 10)
    useEffect(() => {
        if (!currentUser) return;

        setIsLoading(true);
        // We listen even if not open to keep the data fresh
        const q = query(buildQuery(), orderBy('createdAt', 'desc'), limit(10));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(fetchedNotifications);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching notifications: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser, userRole]);

    const handleToggle = () => {
        if (currentUser) {
            setIsOpen(!isOpen);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const q = buildQuery([{ field: 'read', op: '==', value: false }]);
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const batch = writeBatch(db);
                snapshot.docs.forEach((doc) => batch.update(doc.ref, { read: true }));
                await batch.commit();
            }
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const handleClearAll = async () => {
        try {
            const q = query(buildQuery(), orderBy('createdAt', 'desc'), limit(10));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const batch = writeBatch(db);
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
            }
        } catch (error) {
            console.error("Error clearing all notifications:", error);
        }
    };

    const handleNotificationItemClick = async (notification) => {
        if (!notification.read) {
             try {
                const notificationRef = doc(db, 'notifications', notification.id);
                await updateDoc(notificationRef, { read: true });
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        }
        setIsOpen(false);
        if (onNotificationClick) {
            onNotificationClick(notification);
        }
    };
    
    if (!currentUser) return null;

    return (
        <div className="relative z-50">
             <button
                onClick={handleToggle}
                className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                <BellIcon className="h-8 w-8" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                 <div 
                    className="fixed bottom-24 right-8 w-80 sm:w-96 max-h-[70vh] bg-white rounded-2xl shadow-2xl p-4 flex flex-col z-50 animate-fade-in-up"
                >
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                        <button onClick={handleToggle} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto mt-4 -mr-2 pr-2 space-y-3">
                        {isLoading ? (
                            <p className="text-gray-500 text-center py-8">Loading...</p>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-8">
                                <BellIcon className="h-12 w-12 mx-auto text-gray-300"/>
                                <p className="text-gray-600 mt-2">No new notifications.</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationItemClick(notification)}
                                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group
                                        ${notification.read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 font-semibold hover:bg-blue-100'}`
                                    }
                                >
                                    <p className={`text-sm font-medium ${notification.read ? 'text-gray-800' : 'text-blue-800'}`}>{notification.title}</p>
                                    <p className={`text-xs mt-1 ${notification.read ? 'text-gray-600' : 'text-blue-700'}`}>{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(notification.createdAt)}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                         <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={unreadCount === 0}
                                className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <CheckIcon className="h-5 w-5 mr-2"/>
                                Mark all as read
                            </button>
                             <button
                                onClick={handleClearAll}
                                className="flex items-center justify-center w-full px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-colors"
                            >
                                <TrashIcon className="h-5 w-5 mr-2" />
                                Clear All
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => { setIsOpen(false); if (onViewAll) onViewAll(); }}
                        className="flex items-center justify-center w-full px-4 py-2 mt-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors"
                    >
                        View All Notifications
                        <ArrowRightIcon className="h-4 w-4 ml-2"/>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Notification;
