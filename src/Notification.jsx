import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import { ChatBubbleLeftRightIcon, XMarkIcon, CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// Utility function to format time as 'X time ago'
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate();
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

function Notification({ newRequestCount, onClear, onNotificationClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(10) // Limit to latest 10 notifications
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Ensure createdAt is converted to a Firestore Timestamp if not already
        createdAt: doc.data().createdAt
      }));
      setNotifications(fetchedNotifications);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching notifications: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllAsRead = async () => {
    const batch = writeBatch(db);
    notifications.filter(n => !n.read).forEach((notification) => {
      const notificationRef = doc(db, 'notifications', notification.id);
      batch.update(notificationRef, { read: true });
    });
    await batch.commit();
    onClear(); // Call the prop to clear the count in AdminDashboard
  };

  const handleNotificationItemClick = async (notification) => {
    // Mark individual notification as read on click
    if (!notification.read) {
      const notificationRef = doc(db, 'notifications', notification.id);
      await updateDoc(notificationRef, { read: true });
    }
    setIsOpen(false);
    if (onNotificationClick) {
        onNotificationClick(notification);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div>
      <button
        onClick={handleToggle}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <ChatBubbleLeftRightIcon className="h-8 w-8" />
        {newRequestCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-bounce-slow">
            {newRequestCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-8 w-80 max-h-[70vh] bg-white rounded-lg shadow-xl p-4 flex flex-col z-50 animate-fade-in-up">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
            <button onClick={handleToggle} className="text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mt-4 space-y-3">
            {isLoading ? (
              <p className="text-gray-500 text-center">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500 text-center">No new notifications.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationItemClick(notification)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${notification.read ? 'bg-gray-50 text-gray-700' : 'bg-blue-50 text-blue-800 font-semibold hover:bg-blue-100'}`}
                >
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
              {unreadNotifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <CheckIcon className="h-5 w-5 mr-2"/>
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => { /* Navigate to a dedicated notifications page */ setIsOpen(false); /* onNotificationClick to navigate to relevant page */ }}
                className="flex items-center justify-center w-full px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors"
              >
                <ArrowRightIcon className="h-5 w-5 mr-2"/>
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notification;
