import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

const SystemHealth = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(newNotifications);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-white">System Health - Notifications</h3>
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div key={notification.id} className="bg-gray-700 p-4 rounded-md shadow-md">
              <p className="text-lg font-semibold text-white">{notification.message}</p>
              <p className="text-sm text-gray-400">{new Date(notification.timestamp?.toDate()).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default SystemHealth;
