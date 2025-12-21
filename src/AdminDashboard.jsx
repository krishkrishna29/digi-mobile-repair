import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';
import {
  ChartBarSquareIcon,
  WrenchScrewdriverIcon,
  TicketIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ArchiveBoxIcon,
  DocumentChartBarIcon,
  BellIcon,
  LifebuoyIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  BanknotesIcon,
  ClockIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Notification from './Notification';
import Customers from './Customers';
import Promotions from './Promotions';
import Technicians from './Technicians';
import Inventory from './Inventory';
import Reports from './Reports';
import Notifications from './Notifications';
import Support from './Support';

const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#00C49F'];

const menuItems = [
  { id: 'dashboard', text: 'Dashboard', icon: ChartBarSquareIcon },
  { id: 'repair-jobs', text: 'Repair Jobs', icon: WrenchScrewdriverIcon },
  { id: 'sales-revenue', text: 'Sales & Revenue', icon: TicketIcon },
  { id: 'customers', text: 'Customers', icon: UserGroupIcon },
  { id: 'technicians', text: 'Technician Management', icon: BriefcaseIcon },
  { id: 'inventory', text: 'Inventory', icon: ArchiveBoxIcon },
  { id: 'reports', text: 'Reports & Analytics', icon: DocumentChartBarIcon },
  { id: 'notifications', text: 'Notifications', icon: BellIcon },
  { id: 'support', text: 'Support', icon: LifebuoyIcon },
  { id: 'promotions', text: 'Offers & Promotions', icon: CalendarDaysIcon },
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

const RepairJobs = ({ repairs, users, onStatusChange }) => {
    const [openMenu, setOpenMenu] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleToggleMenu = (jobId) => {
        setOpenMenu(openMenu === jobId ? null : jobId);
    };

    const handleChangeStatus = (job, newStatus) => {
        onStatusChange(job.id, job.userId, job.device, newStatus);
        setOpenMenu(null); 
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Repair Jobs</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-500 font-semibold">
                            <th className="py-3 px-4">Customer Name</th>
                            <th className="py-3 px-4">Device</th>
                            <th className="py-3 px-4">Issue</th>
                            <th className="py-3 px-4">Submitted On</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {repairs.map(job => (
                            <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-4 px-4">{users[job.userId]?.displayName || 'N/A'}</td>
                                <td className="py-4 px-4">{job.device}</td>
                                <td className="py-4 px-4">{job.issue}</td>
                                <td className="py-4 px-4">{job.createdAt?.toDate().toLocaleDateString()}</td>
                                <td className="py-4 px-4">{getStatusChip(job.status)}</td>
                                <td className="py-4 px-4 text-center">
                                    <div className="relative inline-block text-left" ref={menuRef}>
                                        <button onClick={() => handleToggleMenu(job.id)} className="p-2 rounded-full hover:bg-gray-200">
                                            <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                                        </button>
                                        {openMenu === job.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                                                <div className="py-1">
                                                    {['Pending', 'In Progress', 'Completed'].map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleChangeStatus(job, status)}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                                            disabled={job.status === status}
                                                        >
                                                            Mark as {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SalesAndRevenue = () => (
    <div className="bg-gray-200 p-8">
        <h2 className="text-2xl font-bold">Sales & Revenue</h2>
        <p>This section is under construction.</p>
    </div>
);

const DashboardContent = ({ repairs, pendingJobs, jobStatusData, weeklyTrendData }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-amber-50 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
        <div className="p-4 bg-purple-200 rounded-full mb-4">
            <BanknotesIcon className="h-12 w-12 text-purple-600" />
        </div>
        <p className="text-lg font-semibold text-gray-700">Total Revenue</p>
        <p className="text-3xl font-bold text-gray-900">₹63,200</p>
      </div>
      <div className="bg-amber-50 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
         <div className="p-4 bg-blue-200 rounded-full mb-4">
            <BriefcaseIcon className="h-12 w-12 text-blue-600" />
        </div>
        <p className="text-lg font-semibold text-gray-700">Total Jobs</p>
        <p className="text-3xl font-bold text-gray-900">{repairs.length}</p>
      </div>
      <div className="bg-orange-400 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
         <div className="p-4 bg-orange-500 rounded-full mb-4">
            <ClockIcon className="h-12 w-12 text-white" />
        </div>
        <p className="text-lg font-semibold">Pending Jobs</p>
        <p className="text-3xl font-bold">{pendingJobs}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Current Job Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie data={jobStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                    {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Repair Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyTrendData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="New Requests" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
  </>
);

const PlaceholderContent = ({ title }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md text-gray-800">
    <h2 className="text-2xl font-bold">{title}</h2>
    <p className="mt-4">This section is under construction.</p>
  </div>
);

function AdminDashboard() {
  const [repairs, setRepairs] = useState([]);
  const [users, setUsers] = useState({});
  const [newRequestCount, setNewRequestCount] = useState(0);
  const [activeView, setActiveView] = useState('dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const notificationsMenuRef = useRef(null);

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
    const unsubscribeRepairs = onSnapshot(collection(db, 'repairs'), (snapshot) => {
      const repairsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRepairs(repairsData);

      const newRequests = snapshot.docChanges().filter(change => change.type === 'added');
      if (newRequests.length > 0) {
        setNewRequestCount(prevCount => prevCount + newRequests.length);
      }
    });

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const usersData = {};
        snapshot.forEach(doc => {
            usersData[doc.id] = doc.data();
        });
        setUsers(usersData);
    });

    return () => {
        unsubscribeRepairs();
        unsubscribeUsers();
    };
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/login');
    });
  };

  const handleStatusChange = async (jobId, userId, device, newStatus) => {
    const repairRef = doc(db, 'repairs', jobId);
    await updateDoc(repairRef, { status: newStatus });

    await addDoc(collection(db, 'notifications'), {
        userId: userId,
        type: 'info',
        title: 'Repair Status Updated',
        message: `The status of your repair for "${device}" is now "${newStatus}".`,
        read: false,
        createdAt: serverTimestamp(),
        relatedRepairId: jobId,
    });
  };

  const clearNewRequests = () => {
    setNewRequestCount(0);
  };

  const completedJobs = repairs.filter(r => r.status === 'Completed').length;
  const pendingJobs = repairs.filter(r => r.status !== 'Completed').length;

  const jobStatusData = [
    { name: 'Completed', value: completedJobs },
    { name: 'Pending', value: pendingJobs },
  ];

  const getDayOfWeek = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const processWeeklyData = (repairs) => {
    const weeklyData = {
        'Sun': { 'New Requests': 0 }, 'Mon': { 'New Requests': 0 }, 'Tue': { 'New Requests': 0 },
        'Wed': { 'New Requests': 0 }, 'Thu': { 'New Requests': 0 }, 'Fri': { 'New Requests': 0 }, 'Sat': { 'New Requests': 0 },
    };
    repairs.forEach(repair => {
        if (repair.createdAt && repair.createdAt.toDate) {
            const date = repair.createdAt.toDate();
            const day = getDayOfWeek(date);
            if (weeklyData[day]) { weeklyData[day]['New Requests']++; }
        }
    });
    const orderedDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return orderedDays.map(day => ({ name: day, 'New Requests': weeklyData[day] ? weeklyData[day]['New Requests'] : 0 }));
  };

  const weeklyTrendData = processWeeklyData(repairs);

  const renderContent = () => {
    const item = menuItems.find(i => i.id === activeView);
    switch (activeView) {
      case 'dashboard':
        return <DashboardContent {...{ repairs, pendingJobs, jobStatusData, weeklyTrendData }} />;
      case 'sales-revenue':
        return <SalesAndRevenue />;
      case 'repair-jobs':
        return <RepairJobs repairs={repairs} users={users} onStatusChange={handleStatusChange} />;
      case 'customers':
        return <Customers />;
      case 'promotions':
        return <Promotions />;
      case 'technicians':
        return <Technicians />;
      case 'inventory':
        return <Inventory />;
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications />;
      case 'support':
        return <Support />;
      default:
        return <PlaceholderContent title={item ? item.text : 'Page Not Found'} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-2">
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
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <button className="md:hidden mr-4" onClick={() => setIsSidebarOpen(true)}>
                  <Bars3Icon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">{(menuItems.find(i => i.id === activeView) || {}).text}</h2>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative" ref={notificationsMenuRef}>
                    <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                        <BellIcon className="h-6 w-6 text-gray-500" />
                    </button>
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-64 sm:w-80 bg-white rounded-lg shadow-lg p-4 z-10">
                            <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                            <p className_="text-gray-600 mt-2">No new notifications.</p>
                        </div>
                    )}
                </div>
                <div className="relative" ref={profileMenuRef}>
                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center">
                        <UserCircleIcon className="h-8 w-8 text-gray-500" />
                        <span className="hidden sm:inline ml-2 text-sm font-medium text-gray-700">Admin</span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-500 ml-1" />
                    </button>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <button
                                onClick={handleSignOut}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 bg-gray-50 overflow-y-auto">
          {renderContent()}
        </main>

        <Notification newRequestCount={newRequestCount} onClear={clearNewRequests} />
      </div>
    </div>
  );
}

export default AdminDashboard;
