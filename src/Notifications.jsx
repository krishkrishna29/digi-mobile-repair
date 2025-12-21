import React, { useState } from 'react';
import {
    BellIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    CheckIcon,
    TrashIcon,
} from '@heroicons/react/24/solid';

const initialNotifications = [
    {
        id: 1,
        type: 'success',
        title: 'Repair Job Completed',
        message: 'Job #MRJ-002 for Sarah Smith has been marked as completed.',
        time: '2 hours ago',
        read: false,
    },
    {
        id: 2,
        type: 'warning',
        title: 'Low Stock Alert',
        message: 'Stock for iPhone 13 screens is running low. Only 15 units left.',
        time: '1 day ago',
        read: false,
    },
    {
        id: 3,
        type: 'info',
        title: 'New Customer Registered',
        message: 'A new customer, David Chen, has registered and is awaiting verification.',
        time: '3 days ago',
        read: true,
    },
    {
        id: 4,
        type: 'error',
        title: 'Payment Failed',
        message: 'Payment for invoice #INV-007 failed. Please check payment details.',
        time: '4 days ago',
        read: false,
    },
    {
        id: 5,
        type: 'info',
        title: 'System Update',
        message: 'A new version of the dashboard is available. Please refresh the page.',
        time: 'Last week',
        read: true,
    },
];

const getNotificationIcon = (type) => {
    const iconClasses = "h-8 w-8";
    switch (type) {
        case 'success':
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
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState('All');

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleDelete = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'All') return true;
        if (filter === 'Unread') return !n.read;
        return n.type === filter.toLowerCase();
    });

    const filterTabs = ['All', 'Unread', 'Success', 'Warning', 'Info', 'Error'];

    return (
        <div className="bg-gray-50 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
                    <p className="text-gray-600 mt-1">Manage and stay updated with the latest activities.</p>
                </div>
                <button 
                    onClick={handleMarkAllAsRead}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center">
                    <CheckIcon className="h-5 w-5 mr-2"/> Mark All as Read
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="mb-4 border-b border-gray-200">
                    <div className="flex space-x-4">
                        {filterTabs.map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`py-2 px-4 font-semibold ${filter === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <ul className="divide-y divide-gray-200">
                    {filteredNotifications.length > 0 ? filteredNotifications.map((notification) => (
                        <li key={notification.id} className={`py-4 flex items-start space-x-4 group transition-colors ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}>
                            <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-lg font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>{notification.title}</h4>
                                <p className="text-gray-600">{notification.message}</p>
                                <p className="text-sm text-gray-400 mt-1">{notification.time}</p>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notification.read && (
                                    <button onClick={() => handleMarkAsRead(notification.id)} className="p-2 text-gray-500 hover:text-green-600 rounded-full bg-gray-100 hover:bg-gray-200" title="Mark as Read">
                                        <CheckIcon className="h-5 w-5" />
                                    </button>
                                )}
                                <button onClick={() => handleDelete(notification.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full bg-gray-100 hover:bg-gray-200" title="Delete">
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
