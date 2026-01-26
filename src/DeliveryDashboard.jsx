
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from './AuthContext';
import { useNotifications } from './useNotifications';
import { BellIcon, HomeIcon, ClockIcon, UserCircleIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Notification from './Notification';

// --- Sub-components for each screen ---

const ActiveJobsList = ({ jobs, onJobClick }) => (
    <div className="space-y-4">
        {jobs.length > 0 ? (
            jobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onJobClick(job.id)}>
                    <div>
                        <p className={`px-2 py-1 text-xs font-semibold rounded-full inline-block ${job.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>
                            {job.status === 'Pending' ? 'PICKUP' : 'DELIVERY'}
                        </p>
                        <p className="font-bold text-gray-800 mt-2">{job.customerName}</p>
                        <p className="text-sm text-gray-600">{job.pickupAddress?.address || 'Address not available'}</p>
                    </div>
                    <ChevronRightIcon className="h-6 w-6 text-gray-400" />
                </div>
            ))
        ) : (
            <div className="text-center py-10 px-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No active jobs right now.</p>
                <p className="text-sm text-gray-400 mt-2">You'll be notified when new jobs are assigned.</p>
            </div>
        )}
    </div>
);

const CompletedJobsList = ({ jobs }) => (
    <div className="space-y-4">
        {jobs.length > 0 ? (
            jobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm p-4 opacity-70">
                    <p className="font-semibold text-gray-700">{job.customerName}</p>
                    <p className="text-sm text-gray-500">Status: <span className="font-medium text-green-600">{job.status}</span></p>
                    <p className="text-xs text-gray-400 mt-1">Completed on: {new Date(job.statusHistory.find(h => h.status === 'Completed')?.timestamp.toDate()).toLocaleDateString()}</p>
                </div>
            ))
        ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">You haven't completed any jobs yet.</p>
            </div>
        )}
    </div>
);

const ProfileScreen = ({ userProfile, onSignOut }) => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <UserCircleIcon className="h-24 w-24 text-gray-300 mx-auto" />
        <h2 className="text-2xl font-bold mt-4 text-gray-800">{userProfile?.fullName}</h2>
        <p className="text-gray-500">{userProfile?.email}</p>
        <button 
            onClick={onSignOut} 
            className="mt-8 w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-105">
            Sign Out
        </button>
    </div>
);


// --- Main Dashboard Component ---

const DeliveryDashboard = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [activeView, setActiveView] = useState('Dashboard'); // Dashboard, History, Profile
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { unreadCount, markAsRead } = useNotifications();

  useEffect(() => {
    if (userProfile?.role !== 'delivery') return;

    const repairsQuery = query(
      collection(db, 'repairs'),
      where('deliveryPartnerId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(repairsQuery, (snapshot) => {
      const allJobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActiveJobs(allJobs.filter(job => job.status !== 'Completed' && job.status !== 'Cancelled').sort((a, b) => a.createdAt.seconds - b.createdAt.seconds));
      setCompletedJobs(allJobs.filter(job => job.status === 'Completed' || job.status === 'Cancelled').sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
    });

    return () => unsubscribe();
  }, [userProfile]);

  const handleSignOut = () => {
    signOut(auth).then(() => navigate('/login'));
  };
  
  const handleNotificationClick = (notification) => {
      if (notification.relatedRepairId) {
          navigate(`/delivery/job/${notification.relatedRepairId}`);
      }
      if (!notification.read) {
          markAsRead(notification.id);
      }
  };

  const renderHeader = () => {
    const headers = {
        Dashboard: 'Active Jobs',
        History: 'Completed Jobs',
        Profile: 'My Profile'
    };
    return headers[activeView];
  }

  const renderContent = () => {
      switch(activeView) {
          case 'Dashboard':
              return <ActiveJobsList jobs={activeJobs} onJobClick={(jobId) => navigate(`/delivery/job/${jobId}`)} />;
          case 'History':
              return <CompletedJobsList jobs={completedJobs} />;
          case 'Profile':
              return <ProfileScreen userProfile={userProfile} onSignOut={handleSignOut} />;
          default:
              return null;
      }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 font-sans pb-24">
        {/* --- Top Header --- */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-md mx-auto py-4 px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">{renderHeader()}</h1>
            <div className="relative">
              <BellIcon className="h-7 w-7 text-gray-500 cursor-pointer" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unreadCount}</span>}
            </div>
          </div>
        </header>

        {/* --- Main Content --- */}
        <main className="p-4 max-w-md mx-auto">
          {renderContent()}
        </main>

        {/* --- Bottom Navigation --- */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-md flex justify-around max-w-md mx-auto z-10">
          <button onClick={() => setActiveView('Dashboard')} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 ${activeView === 'Dashboard' ? 'text-blue-600' : 'text-gray-500'}`}>
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button onClick={() => setActiveView('History')} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 ${activeView === 'History' ? 'text-blue-600' : 'text-gray-500'}`}>
            <ClockIcon className="h-6 w-6" />
            <span className="text-xs mt-1">History</span>
          </button>
          <button onClick={() => setActiveView('Profile')} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 ${activeView === 'Profile' ? 'text-blue-600' : 'text-gray-500'}`}>
            <UserCircleIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </nav>
      </div>

      <Notification 
        onNotificationClick={handleNotificationClick}
      />
    </>
  );
};

export default DeliveryDashboard;
