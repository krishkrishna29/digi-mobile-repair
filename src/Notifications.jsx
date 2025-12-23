import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch, where } from 'firebase/firestore';
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
            return <CheckCircleIcon className={`${iconClasses} text-green-500`} />;
        case 'warning':
            return <ExclamationTriangleIcon className={`${iconClasses} text-yellow-500`} />;
        case 'info':
        case 'repair_request_new':
            return <InformationCircleIcon className={`${iconClasses} text-blue-500`} />;
        case 'error':
            return <XCircleIcon className={`${iconClasses} text-red-500`} />;
        default:
            return <BellIcon className={`${iconClasses} text-gray-500`} />;
    }
}

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotifications(fetched);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

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

    const handleMarkAllAsRead = async () => {
        try {
            const batch = writeBatch(db);
            notifications.filter(n => !n.read).forEach(n => {
                batch.update(doc(db, 'notifications', n.id), { read: true });
            });
            await batch.commit();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'All') return true;
        if (filter === 'Unread') return !n.read;
        if (filter === 'Success') return n.type === 'success';
        if (filter === 'Warning') return n.type === 'warning';
        if (filter === 'Info') return n.type === 'info' || n.type === 'repair_request_new';
        if (filter === 'Error') return n.type === 'error';
        return true;
    });

    const filterTabs = ['All', 'Unread', 'Success', 'Warning', 'Info', 'Error'];

    if (isLoading) {
        return <div className="p-8 text-center">Loading notifications...</div>;
    }

    return (
        <div className="bg-gray-50 p-4 sm:p-8 min-h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
                    <p className="text-gray-600 mt-1">Manage and stay updated with the latest activities.</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <button 
                        onClick={handleMarkAllAsRead}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition-colors flex items-center">
                        <CheckIcon className="h-5 w-5 mr-2"/> Mark All as Read
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                <div className="mb-6 border-b border-gray-100 overflow-x-auto">
                    <div className="flex space-x-1 min-w-max">
                        {filterTabs.map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`py-3 px-4 font-semibold text-sm transition-all duration-200 border-b-2 ${filter === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <ul className="divide-y divide-gray-100">
                    {filteredNotifications.length > 0 ? filteredNotifications.map((notification) => (
                        <li key={notification.id} className={`py-6 flex items-start space-x-4 group transition-colors rounded-xl px-4 -mx-4 ${!notification.read ? 'bg-blue-50/50' : 'bg-transparent hover:bg-gray-50'}`}>
                            <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-lg font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>{notification.title}</h4>
                                <p className="text-gray-600 mt-1 leading-relaxed">{notification.message}</p>
                                <p className="text-sm text-gray-400 mt-2 flex items-center">
                                    <BellIcon className="h-3 w-3 mr-1" />
                                    {formatTimeAgo(notification.createdAt)}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notification.read && (
                                    <button onClick={() => handleMarkAsRead(notification.id)} className="p-2 text-blue-600 hover:text-blue-800 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors" title="Mark as Read">
                                        <CheckIcon className="h-5 w-5" />
                                    </button>
                                )}
                                <button onClick={() => handleDelete(notification.id)} className="p-2 text-red-600 hover:text-red-800 rounded-full bg-red-100 hover:bg-red-200 transition-colors" title="Delete">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    )) : (
                        <div className="text-center py-20">
                            <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BellIcon className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700">No Notifications</h3>
                            <p className="mt-2 text-gray-500">You're all caught up! No new activities to show.</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Notifications;
