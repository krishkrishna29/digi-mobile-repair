import React from 'react';
import { useNotifications } from './useNotifications';
import { BellIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const formatFullDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    }).format(date);
};

const Notifications = () => {
    const { notifications, isLoading, markAsRead, deleteNotification, markAllAsRead, clearAll, unreadCount } = useNotifications();

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">All Notifications</h2>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={markAllAsRead} 
                        disabled={unreadCount === 0}
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                        Mark All as Read
                    </button>
                    <button 
                        onClick={clearAll} 
                        className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                    >
                        <TrashIcon className="h-5 w-5 mr-1.5" />
                        Clear All
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex-grow flex items-center justify-center text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500">
                    <BellIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold">No Notifications</h3>
                    <p>You're all caught up!</p>
                </div>
            ) : (
                <div className="-mx-4 sm:-mx-6 lg:-mx-8 flex-grow overflow-y-auto">
                    <div className="divide-y divide-gray-200">
                        {notifications.map(notif => (
                            <div 
                                key={notif.id} 
                                className={`p-4 sm:p-6 flex items-start justify-between gap-4 transition-colors ${!notif.read ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50/50'}`}
                            >
                                <div className="flex-grow">
                                    <h4 className={`font-semibold text-gray-800 ${!notif.read ? 'font-bold' : ''}`}>{notif.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">{formatFullDate(notif.createdAt)}</p>
                                </div>
                                <div className="flex-shrink-0 flex items-center space-x-3">
                                    {!notif.read && (
                                        <button 
                                            onClick={() => markAsRead(notif.id)} 
                                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
                                            title="Mark as read"
                                        >
                                            <CheckCircleIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => deleteNotification(notif.id)} 
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                        title="Delete notification"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
