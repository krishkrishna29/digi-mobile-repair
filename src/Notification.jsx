import React, { useState } from 'react';
import { BellIcon, XMarkIcon, CheckIcon, ArrowRightIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNotifications } from './useNotifications'; // Import the hook

const formatTimeAgo = (date) => {
    if (!date) return 'N/A';
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

function Notification({ onNotificationClick, onViewAll }) {
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, clearAll } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(prev => !prev);

    const handleNotificationItemClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        setIsOpen(false);
        if (onNotificationClick) {
            onNotificationClick(notification);
        }
    };
    
    return (
        <div className="relative z-50">
             <button onClick={handleToggle} className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-transform duration-300 ease-in-out hover:scale-105">
                <BellIcon className="h-8 w-8" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold animate-bounce">{unreadCount}</span>}
            </button>

            {isOpen && (
                 <div className="fixed bottom-24 right-8 w-80 sm:w-96 max-h-[70vh] bg-white rounded-2xl shadow-2xl p-4 flex flex-col z-50 animate-fade-in-up">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                        <button onClick={handleToggle} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="h-6 w-6" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto mt-4 -mr-2 pr-2 space-y-3">
                        {isLoading ? <p className="text-gray-500 text-center py-8">Loading...</p> : 
                         notifications.length === 0 ? (
                            <div className="text-center py-8"><BellIcon className="h-12 w-12 mx-auto text-gray-300"/><p className="text-gray-600 mt-2">No new notifications.</p></div>
                        ) : (
                            notifications.map((notification) => (
                                <div key={notification.id} onClick={() => handleNotificationItemClick(notification)} className={`p-3 rounded-lg cursor-pointer transition-all group ${notification.read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-purple-50 font-semibold hover:bg-purple-100'}`}>
                                    <p className={`text-sm font-medium ${notification.read ? 'text-gray-800' : 'text-purple-800'}`}>{notification.title}</p>
                                    <p className={`text-xs mt-1 ${notification.read ? 'text-gray-600' : 'text-purple-700'}`}>{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(notification.createdAt)}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                         <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                            <button onClick={markAllAsRead} disabled={unreadCount === 0} className="flex items-center justify-center w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-purple-700 disabled:bg-gray-300 transition-colors"><CheckIcon className="h-5 w-5 mr-2"/>Mark all as read</button>
                            <button onClick={clearAll} className="flex items-center justify-center w-full px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-600 transition-colors"><TrashIcon className="h-5 w-5 mr-2" />Clear All</button>
                        </div>
                    )}
                    <button onClick={() => { setIsOpen(false); if (onViewAll) onViewAll(); }} className="flex items-center justify-center w-full px-4 py-2 mt-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"><ArrowRightIcon className="h-4 w-4 ml-2"/>View All Notifications</button>
                </div>
            )}
        </div>
    );
}

export default Notification;
