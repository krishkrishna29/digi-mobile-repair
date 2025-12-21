import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
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
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
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

const repairJobsData = [
    { id: 'MRJ-001', customer: { name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }, email: 'alex.j@email.com', device: 'iPhone 12 Pro', status: 'In Progress', technician: 'John Brown' },
    { id: 'MRJ-002', customer: { name: 'Sarah Smith', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }, email: 'sarahs@email.com', device: 'iPhone 11', status: 'Completed', technician: 'Kevin Wilson' },
    { id: 'MRJ-003', customer: { name: 'Michael Lee', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' }, email: 'michael@email.com', device: 'Samsung Galaxy S21', status: 'Pending', technician: 'Joshua Davis' },
    { id: 'MRJ-004', customer: { name: 'Emma Garcia', avatar: 'https://randomuser.me/api/portraits/women/47.jpg' }, email: 'emma.g@email.com', device: 'Google Pixel 5', status: 'In Progress', technician: 'Linda Martinez' },
    { id: 'MRJ-005', customer: { name: 'Daniel Rodriguez', avatar: 'https://randomuser.me/api/portraits/men/35.jpg' }, email: 'daniel.r@email.com', device: 'iPhone XR', status: 'Completed', technician: 'John Brown' },
];

const getStatusChip = (status) => {
    switch (status) {
        case 'In Progress':
            return <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">{status}</span>;
        case 'Completed':
            return <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">{status}</span>;
        case 'Pending':
            return <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full">{status}</span>;
        default:
            return null;
    }
};

const RepairJobs = () => (
    <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Repair Jobs</h2>
            <div className="flex items-center space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">New Repair Job</button>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold flex items-center"><FunnelIcon className="h-5 w-5 mr-2"/>Filter</button>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold flex items-center">Export <ChevronDownIcon className="h-5 w-5 ml-2"/></button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-500 font-semibold">
                        <th className="py-3 px-4">Repair ID</th>
                        <th className="py-3 px-4">Customer Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Device</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Technician</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {repairJobsData.map(job => (
                        <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-4 px-4">{job.id}</td>
                            <td className="py-4 px-4 flex items-center">
                                <img src={job.customer.avatar} alt={job.customer.name} className="h-8 w-8 rounded-full mr-3"/>
                                <span>{job.customer.name}</span>
                            </td>
                            <td className="py-4 px-4">{job.email}</td>
                            <td className="py-4 px-4">{job.device}</td>
                            <td className="py-4 px-4">{getStatusChip(job.status)}</td>
                            <td className="py-4 px-4">{job.technician}</td>
                            <td className="py-4 px-4 flex space-x-2">
                                <PencilIcon className="h-5 w-5 text-gray-400 cursor-pointer"/>
                                <TrashIcon className="h-5 w-5 text-gray-400 cursor-pointer"/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const SalesAndRevenue = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4">Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4">Recent Transactions</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-500">
                            <th className="pb-2">ID</th>
                            <th className="pb-2">Customer</th>
                            <th className="pb-2">Amount</th>
                            <th className="pb-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[].map((transaction, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-2">{transaction.id}</td>
                                <td className="py-2">{transaction.customer}</td>
                                <td className="py-2">{transaction.amount}</td>
                                <td className="py-2">
                                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800">
                                        {transaction.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-200 rounded-full mr-4">
                        <span className="text-purple-600 font-bold text-xl">S</span>
                    </div>
                    <div>
                        <p className="text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold">$65,000</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-200 rounded-full mr-4">
                        <TicketIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold">120</p>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 flex">
                     <div className="bg-green-500 h-2.5 rounded-l-full" style={{ width: '70%' }}></div>
                    <div className="bg-yellow-400 h-2.5 rounded-r-full" style={{ width: '30%' }}></div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4">Revenue by Category</h3>
                 <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-gray-700">Screen Repair</span>
                            <span className="text-sm font-medium text-gray-700">$25,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-gray-700">Battery Replace.</span>
                            <span className="text-sm font-medium text-gray-700">$15,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-gray-700">Other</span>
                            <span className="text-sm font-medium text-gray-700">$10,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-teal-400 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


const DashboardContent = ({ repairs, pendingJobs, jobStatusData, weeklyTrendData }) => (
  <>
    {/* Summary Cards */}
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

    {/* Charts */}
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
    const unsubscribe = onSnapshot(collection(db, 'repairs'), (snapshot) => {
      const repairsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRepairs(repairsData);

      const newRequests = snapshot.docChanges().filter(change => change.type === 'added');
      if (newRequests.length > 0) {
        setNewRequestCount(prevCount => prevCount + newRequests.length);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/login');
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
        return <RepairJobs />;
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
      {/* Sidebar */}
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
                            <p className="text-gray-600 mt-2">No new notifications.</p>
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
