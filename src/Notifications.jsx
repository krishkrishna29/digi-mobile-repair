import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, writeBatch, doc, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import {
    BellIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    CheckIcon,
    TrashIcon,
    ShieldExclamationIcon
} from '@heroicons/react/24/solid';
import ConfirmationModal from './ConfirmationModal';

const getNotificationIcon = (type) => {
    const iconClasses = "h-8 w-8";
    switch (type) {
        case 'success':
        case 'repair_request_new': // Keep this for repair request notifications
            return <CheckCircleIcon className={`${iconClasses} text-green-500`} />;
        case 'warning':
            return <ExclamationTriangleIcon className={`${iconClasses} text-yellow-500`} />;
        case 'info':
            return <InformationCircleIcon className={`${iconClasses} text-blue-500`} />;
        case 'error':
        case 'cancelled': // Added for cancelled status consistency
            return <XCircleIcon className={`${iconClasses} text-red-500`} />;
        default:
            return <BellIcon className={`${iconClasses} text-gray-500`} />;
    }
};

const Notifications = () => {
    const { currentUser, userRole } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        let baseQuery;

        if (userRole === 'admin') {
            // Admins should only see notifications specifically for them (userId: 'admin')
            baseQuery = query(collection(db, 'notifications'), where('userId', '==', 'admin'), orderBy('createdAt', 'desc'));
        } else {
            // Regular users see their own notifications
            baseQuery = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
        }

        const unsubscribe = onSnapshot(baseQuery, (snapshot) => {
            const fetchedNotifications = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNotifications(fetchedNotifications);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching notifications:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser, userRole]);

    const createBatchForUser = async (conditions = []) => {
        if (!currentUser) return null;

        let targetQuery;
        
        if (userRole === 'admin') {
            targetQuery = query(collection(db, 'notifications'), where('userId', '==', 'admin'));
        } else {
            targetQuery = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid));
        }

        conditions.forEach(cond => {
            targetQuery = query(targetQuery, where(cond.field, cond.op, cond.value));
        });

        return await getDocs(targetQuery);
    };

    const handleMarkAllAsRead = async () => {
        try {
            const snapshot = await createBatchForUser([
                { field: 'read', op: '==', value: false }
            ]);
            if (snapshot && !snapshot.empty) {
                const batch = writeBatch(db);
                snapshot.docs.forEach(doc => batch.update(doc.ref, { read: true }));
                await batch.commit();
            }
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const handleDeleteAllRead = async () => {
        try {
            const snapshot = await createBatchForUser([
                { field: 'read', op: '==', value: true }
            ]);
            if (snapshot && !snapshot.empty) {
                const batch = writeBatch(db);
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
            }
        } catch (error) {
            console.error("Error deleting all read notifications:", error);
        } finally {
            setIsModalOpen(false);
        }
    };

    const handleClearAll = async () => {
        try {
            const snapshot = await createBatchForUser(); 
            if (snapshot && !snapshot.empty) {
                const batch = writeBatch(db);
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
            }
        } catch (error) {
            console.error("Error clearing all notifications:", error);
        } finally {
            setIsModalOpen(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await updateDoc(doc(db, 'notifications', id), { read: true });
        } catch (error) {
             console.error("Error marking as read:", error);
        }
    };

    const handleDelete = async (id) => {
         try {
            await deleteDoc(doc(db, 'notifications', id));
        } catch (error) {
             console.error("Error deleting notification:", error);
        }
    };


    const openModal = (actionCallback) => {
        setModalAction(() => actionCallback);
        setIsModalOpen(true);
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'All') return true;
        if (filter === 'Unread') return !n.read;
        // Modified to handle specific notification types as exact matches for filter tabs
        if (filter === 'New Request') return n.type === 'repair_request_new';
        if (filter === 'Info') return n.type === 'info';
        if (filter === 'Success') return n.type === 'success';
        if (filter === 'Warning') return n.type === 'warning';
        if (filter === 'Error') return n.type === 'error';
        return false;
    });

    const filterTabs = ['All', 'Unread', 'New Request', 'Info', 'Success', 'Warning', 'Error'];

    if (!currentUser) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700">Access Denied</h2>
                    <p className="text-gray-500 mt-2">Please log in to view your notifications.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
                        <p className="text-gray-600 mt-1">Stay updated with the latest activities.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={handleMarkAllAsRead}
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center shadow-sm">
                            <CheckIcon className="h-5 w-5 mr-2"/> Mark All as Read
                        </button>
                        <button 
                            onClick={() => openModal(handleDeleteAllRead)}
                            className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-200 transition-colors flex items-center shadow-sm">
                            <TrashIcon className="h-5 w-5 mr-2"/> Delete All Read
                        </button>
                         <button 
                            onClick={() => openModal(handleClearAll)}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center shadow-sm">
                            <TrashIcon className="h-5 w-5 mr-2"/> Clear All
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                    <div className="mb-4 border-b border-gray-200 overflow-x-auto">
                        <div className="flex space-x-2 sm:space-x-4">
                            {filterTabs.map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`py-2 px-4 font-semibold whitespace-nowrap ${filter === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ul className="divide-y divide-gray-200">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <BellIcon className="h-16 w-16 text-gray-300 mx-auto animate-pulse" />
                                <h3 className="mt-4 text-xl font-semibold text-gray-700">Loading Notifications...</h3>
                            </div>
                        ) : filteredNotifications.length > 0 ? filteredNotifications.map((notification) => (
                            <li key={notification.id} className={`py-4 px-2 flex items-start space-x-4 group transition-colors rounded-lg ${!notification.read ? 'bg-blue-50/50' : 'bg-white'}`}>
                                <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-lg font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>{notification.title}</h4>
                                    <p className="text-gray-600">{notification.message}</p>
                                    <p className="text-sm text-gray-400 mt-1">{notification.createdAt?.toDate().toLocaleString()}</p>
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!notification.read && (
                                        <button onClick={() => handleMarkAsRead(notification.id)} className="p-2 text-gray-500 hover:text-green-600 rounded-full bg-gray-100 hover:bg-green-100" title="Mark as Read">
                                            <CheckIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(notification.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full bg-gray-100 hover:bg-red-100" title="Delete">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </li>
                        )) : (
                            <div className="text-center py-12">
                                <BellIcon className="h-16 w-16 text-gray-300 mx-auto" />
                                <h3 className="mt-4 text-xl font-semibold text-gray-700">No Notifications Found</h3>
                                <p className="mt-1 text-gray-500">Your notification tray is empty for this filter.</p>
                            </div>
                        )}
                    </ul>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={modalAction}
                title="Confirm Action"
                description="Are you sure you want to proceed? This action cannot be undone."
                icon={<ShieldExclamationIcon className="h-10 w-10 text-red-500 mx-auto" />}
            />
        </>
    );
};

export default Notifications;
