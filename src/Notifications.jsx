import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, writeBatch, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import {
    BellIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    CheckIcon,
    TrashIcon,
} from '@heroicons/react/24/solid';

const getNotificationIcon = (type) => {
    const iconClasses = "h-8 w-8";
    switch (type) {
        case 'success':
        case 'repair_request_new': // Treat new requests as success/info
            return <CheckCircleIcon className={`${iconClasses} text-green-500`} />;
        case 'warning':
            return <ExclamationTriangleIcon className={`${iconClasses} text-yellow-500`} />;
        case 'info':
            return <InformationCircleIcon className={`${iconClasses} text-blue-500`} />;
        case 'error':
            return <XCircleIcon className={`${iconClasses} text-red-500`} />;
        default:
            return <BellIcon className={`${iconClasses} text-gray-500`} />;
    }
}

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
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
    }, []);

    const handleMarkAsRead = async (id) => {
        const notificationRef = doc(db, 'notifications', id);
        await writeBatch(db).update(notificationRef, { read: true }).commit();
    };

    const handleDelete = async (id) => {
        const notificationRef = doc(db, 'notifications', id);
        await deleteDoc(notificationRef);
    };

    const handleMarkAllAsRead = async () => {
        const batch = writeBatch(db);
        const unread = notifications.filter(n => !n.read);
        unread.forEach(notification => {
            const notificationRef = doc(db, 'notifications', notification.id);
            batch.update(notificationRef, { read: true });
        });
        await batch.commit();
    };

    const handleDeleteAllRead = async () => {
        const batch = writeBatch(db);
        const readNotifications = query(collection(db, 'notifications'), where('read', '==', true));
        const snapshot = await getDocs(readNotifications);
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'All') return true;
        if (filter === 'Unread') return !n.read;
        // A simple dynamic filter based on notification type
        return n.type.toLowerCase().includes(filter.toLowerCase());
    });

    const filterTabs = ['All', 'Unread', 'New Request', 'Info', 'Success', 'Warning', 'Error'];

    return (
        <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
                    <p className="text-gray-600 mt-1">Manage and stay updated with the latest activities.</p>
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={handleMarkAllAsRead}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center shadow-sm">
                        <CheckIcon className="h-5 w-5 mr-2"/> Mark All as Read
                    </button>
                    <button 
                        onClick={handleDeleteAllRead}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center shadow-sm">
                        <TrashIcon className="h-5 w-5 mr-2"/> Delete All Read
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
                            <h3 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h3>
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
                            <h3 className="mt-4 text-xl font-semibold text-gray-700">No Notifications</h3>
                            <p className="mt-1 text-gray-500">You're all caught up!</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Notifications;
