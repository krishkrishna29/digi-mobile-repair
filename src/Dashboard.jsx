import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, where, addDoc, serverTimestamp, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from './AuthContext';
import {
  ChartBarSquareIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  BellIcon,
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';

const menuItems = [
  { id: 'dashboard', text: 'Dashboard', icon: ChartBarSquareIcon },
  { id: 'new-repair', text: 'New Repair Request', icon: PlusIcon },
  { id: 'my-repairs', text: 'My Repairs', icon: WrenchScrewdriverIcon },
];

const getStatusChip = (status) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";
    switch (status) {
        case 'In Progress':
            return <span className={`${baseClasses} text-blue-800 bg-blue-100`}>{status}</span>;
        case 'Completed':
            return <span className={`${baseClasses} text-green-800 bg-green-100`}>{status}</span>;
        case 'Pending':
            return <span className={`${baseClasses} text-gray-800 bg-gray-200`}>{status}</span>;
        default:
            return <span className={`${baseClasses} text-gray-800 bg-gray-200`}>{status}</span>;
    }
};

const getNotificationIcon = (type) => {
    const iconClasses = "h-6 w-6";
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

const DashboardContent = ({ repairs, pendingJobs, completedJobs }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-slate-700 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center text-white">
        <BriefcaseIcon className="h-12 w-12 text-blue-400 mb-4" />
        <p className="text-lg font-semibold">Total Repairs</p>
        <p className="text-3xl font-bold">{repairs.length}</p>
      </div>
      <div className="bg-slate-700 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center text-white">
        <ClockIcon className="h-12 w-12 text-yellow-400 mb-4" />
        <p className="text-lg font-semibold">Pending Repairs</p>
        <p className="text-3xl font-bold">{pendingJobs}</p>
      </div>
      <div className="bg-slate-700 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center text-white">
        <CheckCircleIcon className="h-12 w-12 text-green-400 mb-4" />
        <p className="text-lg font-semibold">Completed Repairs</p>
        <p className="text-3xl font-bold">{completedJobs}</p>
      </div>
    </div>
    <MyRepairs repairs={repairs} />
  </>
);

const MyRepairs = ({repairs}) => (
    <div className="bg-slate-800 p-8 rounded-xl shadow-lg mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">My Repair History</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-slate-400 font-semibold">
                        <th className="py-3 px-4">Repair ID</th>
                        <th className="py-3 px-4">Device</th>
                        <th className="py-3 px-4">Issue</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date Submitted</th>
                    </tr>
                </thead>
                <tbody>
                    {repairs.map(job => (
                        <tr key={job.id} className="border-b border-slate-700 hover:bg-slate-700/50 text-white">
                            <td className="py-4 px-4">{job.id.substring(0, 8)}...</td>
                            <td className="py-4 px-4">{job.device}</td>
                            <td className="py-4 px-4">{job.issue}</td>
                            <td className="py-4 px-4">{getStatusChip(job.status)}</td>
                            <td className="py-4 px-4">{job.createdAt?.toDate().toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const NewRepairRequest = ({ currentUser }) => {
    const [device, setDevice] = useState('');
    const [issue, setIssue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!device || !issue) {
            setSubmitStatus({ type: 'error', message: 'Please fill out all fields.' });
            return;
        }
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const newRepairRef = await addDoc(collection(db, 'repairs'), {
                device,
                issue,
                userId: currentUser.uid,
                status: 'Pending',
                createdAt: serverTimestamp(),
            });

            await addDoc(collection(db, 'notifications'), {
                userId: currentUser.uid,
                type: 'info',
                title: 'Repair Request Submitted',
                message: `Your request for "${device}" has been received.`,
                read: false,
                createdAt: serverTimestamp(),
                relatedRepairId: newRepairRef.id,
            });

            setDevice('');
            setIssue('');
            setSubmitStatus({ type: 'success', message: 'Your repair request has been submitted!' });
        } catch (error) {
            console.error("Error submitting request: ", error);
            setSubmitStatus({ type: 'error', message: 'Failed to submit request. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Submit a New Repair Request</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label htmlFor="device" className="block text-sm font-medium text-slate-300 mb-2">Device Model (e.g., iPhone 13 Pro)</label>
                        <input type="text" id="device" value={device} onChange={(e) => setDevice(e.target.value)} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="issue" className="block text-sm font-medium text-slate-300 mb-2">Describe the Issue</label>
                        <textarea id="issue" rows="4" value={issue} onChange={(e) => setIssue(e.target.value)} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                </div>
                {submitStatus && (
                    <div className={`mt-4 text-sm p-3 rounded-lg flex items-center ${submitStatus.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                        {submitStatus.type === 'success' ? <CheckCircleIcon className="h-5 w-5 mr-2"/> : <XCircleIcon className="h-5 w-5 mr-2"/>}
                        {submitStatus.message}
                    </div>
                )}
                <div className="mt-6 text-right">
                    <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </form>
        </div>
    );
};


function Dashboard() {
  const { currentUser } = useAuth();
  const [repairs, setRepairs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const notificationsMenuRef = useRef(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
        const qRepairs = query(collection(db, 'repairs'), where("userId", "==", currentUser.uid));
        const unsubscribeRepairs = onSnapshot(qRepairs, (snapshot) => {
            const repairsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRepairs(repairsData);
        });

        const qNotifications = query(collection(db, 'notifications'), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
        const unsubscribeNotifications = onSnapshot(qNotifications, (snapshot) => {
            const notificationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(notificationsData);

            // This is a simple way to trigger a browser notification for new, unread messages
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added' && !change.doc.data().read) {
                    // You might want to ask for permission first in a real app
                    // new Notification(change.doc.data().title, { body: change.doc.data().message });
                }
            });
        });

        return () => {
            unsubscribeRepairs();
            unsubscribeNotifications();
        };
    }
  }, [currentUser]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/login');
    });
  };

  const handleMarkAsRead = async (id) => {
    const notifRef = doc(db, 'notifications', id);
    await updateDoc(notifRef, { read: true });
  };

  const completedJobs = repairs.filter(r => r.status === 'Completed').length;
  const pendingJobs = repairs.filter(r => r.status !== 'Completed').length;

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardContent {...{ repairs, pendingJobs, completedJobs }} />;
      case 'my-repairs':
        return <MyRepairs repairs={repairs} />;
      case 'new-repair':
        return <NewRepairRequest currentUser={currentUser} />;
      default:
        return <DashboardContent {...{ repairs, pendingJobs, completedJobs }} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Dashboard</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id} className="mb-2">
                <button onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }} className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === item.id ? 'bg-slate-900' : 'hover:bg-slate-700'}`}>
                  <item.icon className="h-6 w-6 mr-3" />
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center">
              <button className="md:hidden mr-4" onClick={() => setIsSidebarOpen(true)}>
                  <Bars3Icon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-bold">{(menuItems.find(i => i.id === activeView) || {}).text}</h2>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative" ref={notificationsMenuRef}>
                    <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                        <BellIcon className="h-6 w-6 text-slate-400" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{unreadCount}</span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-700 rounded-lg shadow-lg z-20">
                            <div className="p-4 border-b border-slate-600">
                                <h3 className="font-bold text-white">Notifications</h3>
                            </div>
                            <ul className="py-2 max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map(notif => (
                                    <li key={notif.id} onClick={() => handleMarkAsRead(notif.id)} className={`flex items-start p-4 space-x-3 cursor-pointer hover:bg-slate-600/50 ${!notif.read ? 'bg-slate-600' : ''}`}>
                                        <div>{getNotificationIcon(notif.type)}</div>
                                        <div>
                                            <p className="font-semibold text-sm text-white">{notif.title}</p>
                                            <p className="text-sm text-slate-300">{notif.message}</p>
                                            <p className="text-xs text-slate-400 mt-1">{notif.createdAt?.toDate().toLocaleDateString()}</p>
                                        </div>
                                    </li>
                                )) : (
                                    <p className="text-center py-4 text-slate-400">No notifications yet.</p>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="relative" ref={profileMenuRef}>
                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center">
                        <UserCircleIcon className="h-8 w-8 text-slate-400" />
                        <span className="hidden sm:inline ml-2 text-sm font-medium">{currentUser?.displayName || 'User'}</span>
                        <ChevronDownIcon className="h-4 w-4 text-slate-400 ml-1" />
                    </button>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg py-1 z-10">
                            <button
                                onClick={handleSignOut}
                                className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-600">
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>

        <main className="flex-1 p-8 bg-slate-900 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
