import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, onSnapshot, query, where, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, writeBatch, arrayUnion } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from './AuthContext';
import { useNotifications } from './useNotifications';
import {
  ChartBarSquareIcon, WrenchScrewdriverIcon, TicketIcon, UserGroupIcon, BriefcaseIcon, 
  ArchiveBoxIcon, DocumentChartBarIcon, BellIcon, LifebuoyIcon, CalendarDaysIcon, 
  UserCircleIcon, Bars3Icon, BanknotesIcon, ClockIcon, EllipsisVerticalIcon, 
  EyeIcon, UserPlusIcon, TrashIcon, CheckCircleIcon, XCircleIcon, PencilIcon, MapPinIcon,
  SparklesIcon,
  LinkIcon,
  ChatBubbleLeftRightIcon,
  CogIcon // Import CogIcon for settings
} from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Import Components
import Notification from './Notification';
import Customers from './Customers';
import Promotions from './Promotions';
import Technicians from './Technicians';
import Inventory from './Inventory';
import Reports from './Reports';
import Notifications from './Notifications';
import Support from './Support';
import ConfirmationModal from './ConfirmationModal';
import AssignJobModal from './AssignJobModal';
import UpdateStatusModal from './UpdateStatusModal';
import Chat from './Chat';
import ChatSupport from './ChatSupport';
import CustomerProfile from './CustomerProfile';
import InvoiceSettings from './InvoiceSettings'; // Import the new component

const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#00C49F'];

const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: ChartBarSquareIcon },
    { id: 'repair-jobs', text: 'Repair Requests', icon: WrenchScrewdriverIcon },
    { id: 'sales-revenue', text: 'Sales & Revenue', icon: TicketIcon },
    { id: 'customers', text: 'Customers', icon: UserGroupIcon },
    { id: 'technicians', text: 'Technician Management', icon: BriefcaseIcon },
    { id: 'inventory', text: 'Inventory', icon: ArchiveBoxIcon },
    { id: 'reports', text: 'Reports & Analytics', icon: DocumentChartBarIcon },
    { id: 'notifications', text: 'Notifications', icon: BellIcon },
    { id: 'support', text: 'Support', icon: LifebuoyIcon },
    { id: 'promotions', text: 'Offers & Promotions', icon: SparklesIcon },
    { id: 'chat-support', text: 'Chat Support', icon: ChatBubbleLeftRightIcon },
];

const getStatusChip = (status) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center shadow-sm";
    switch (status) {
        case 'In Progress':
        case 'Repairing':
        case 'Picked Up':
        case 'Diagnosed':
            return <span className={`${baseClasses} bg-blue-100 text-blue-800`}><ClockIcon className="h-4 w-4 mr-1.5" />{status}</span>;
        case 'Completed':
        case 'Ready':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircleIcon className="h-4 w-4 mr-1.5" />{status}</span>;
        case 'Pending':
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><SparklesIcon className="h-4 w-4 mr-1.5" />{status}</span>;
        case 'Cancelled':
            return <span className={`${baseClasses} bg-red-100 text-red-800`}><XCircleIcon className="h-4 w-4 mr-1.5" />{status}</span>;
        default:
            return <span className={`${baseClasses} bg-gray-200 text-gray-800`}><ClockIcon className="h-4 w-4 mr-1.5" />{status}</span>;
    }
};

const RepairJobs = ({ repairs, users, onDeleteJob, onAssignClick, onUpdateStatusClick, onViewCustomer }) => {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('All');
    const jobsPerPage = 10;
    const [selectedRepairId, setSelectedRepairId] = useState(null);

    const handleToggleDetails = (repairId) => {
        setSelectedRepairId(selectedRepairId === repairId ? null : repairId);
    };

    const filteredJobs = repairs.filter(job => {
        if (filterStatus === 'All') return true;
        if (filterStatus === 'In Progress') {
            return ['In Progress', 'Picked Up', 'Diagnosed', 'Repairing'].includes(job.status);
        }
        return job.status === filterStatus;
    });

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getRowStyle = (status) => {
        if (status === 'Pending') return 'bg-yellow-50/50';
        if (['In Progress', 'Picked Up', 'Diagnosed', 'Repairing'].includes(status)) return 'bg-blue-50/50';
        return '';
    };

    const filterButtons = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">All Repair Requests</h2>
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                        {filterButtons.map(status => (
                            <button 
                                key={status} 
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filterStatus === status ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 font-semibold uppercase text-sm border-b border-gray-200">
                                <th className="py-4 px-4">Customer</th>
                                <th className="py-4 px-4">Device & Issue</th>
                                <th className="py-4 px-4">Phone</th>
                                <th className="py-4 px-4">Address/Location</th>
                                <th className="py-4 px-4">Submitted</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentJobs.map((job, index) => (
                          <React.Fragment key={job.id}>
                            <tr key={job.id} className={`border-b border-gray-100 hover:bg-gray-100 ${getRowStyle(job.status)}`}>
                                <td className="py-4 px-4 font-medium text-gray-800 whitespace-nowrap">
                                  <button onClick={() => onViewCustomer(job.userId)} className="hover:text-blue-600 hover:underline">
                                    {users[job.userId]?.fullName || 'N/A'}
                                  </button>
                                </td>
                                <td className="py-4 px-4 text-gray-600"><div>{job.deviceBrand} {job.deviceModel}</div><div className='text-xs text-gray-400'>{job.subIssue}</div></td>
                                <td className="py-4 px-4 text-gray-600">{users[job.userId]?.mobileNumber || 'N/A'}</td>
                                <td className="py-4 px-4 text-gray-600">
                                    {job.repairMode === 'home-pickup' ? (
                                        <a href={job.pickupAddress.locationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                                            <LinkIcon className="h-5 w-5 mr-2" />
                                            Open Location
                                        </a>
                                    ) : (users[job.userId]?.address || 'In-Store Drop-off')}
                                </td>
                                <td className="py-4 px-4 text-gray-600">{job.createdAt?.toDate().toLocaleDateString()}</td>
                                <td className="py-4 px-4">{getStatusChip(job.status)}</td>
                                <td className="py-4 px-4 text-center">
                                    <div className="relative inline-block text-left">
                                        <button onClick={() => setOpenMenu(openMenu === job.id ? null : job.id)} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><EllipsisVerticalIcon className="h-5 w-5 text-gray-500" /></button>
                                        {openMenu === job.id && (
                                        <div className={`absolute right-0 z-50 w-56 bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 ${index > currentJobs.length - 3 ? 'bottom-full mb-2' : 'mt-2'}`}>
                                            <div className="p-2">
                                                <button onClick={() => { onUpdateStatusClick(job); setOpenMenu(null); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"><PencilIcon className="h-4 w-4 mr-3"/>Update Status</button>
                                                <button onClick={() => { onAssignClick(job); setOpenMenu(null); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"><UserPlusIcon className="h-4 w-4 mr-3"/>Assign Tech</button>
                                                <Link to={`/admin/repair/${job.id}`} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"><EyeIcon className="h-4 w-4 mr-3"/>View Details</Link>
                                                <button onClick={() => { onDeleteJob(job.id); setOpenMenu(null); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"><TrashIcon className="h-4 w-4 mr-3"/>Delete</button>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            {selectedRepairId === job.id && (
                                <tr className="bg-gray-50">
                                    <td colSpan="7" className="p-4">
                                        <Chat repairId={job.id} />
                                    </td>
                                </tr>
                            )}
                          </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="py-4 flex justify-end">
                    <nav className="block">
                        <ul className="flex pl-0 rounded list-none flex-wrap">
                            <li><button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 ml-0 rounded-l hover:bg-gray-200">Previous</button></li>
                            <li><button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastJob >= filteredJobs.length} className="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 rounded-r hover:bg-gray-200">Next</button></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

const SalesAndRevenue = () => (
    <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">Sales & Revenue</h2>
        <p className="mt-4">This section is under construction.</p>
    </div>
);

const DashboardContent = ({ repairs, pendingJobs, jobStatusData, weeklyTrendData, totalRevenue }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
        <div className="p-4 bg-white/50 rounded-full mb-4 ring-2 ring-purple-200"><BanknotesIcon className="h-12 w-12 text-purple-600" /></div>
        <p className="text-lg font-semibold text-gray-700">Total Revenue</p>
        <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
         <div className="p-4 bg-white/50 rounded-full mb-4 ring-2 ring-blue-200"><BriefcaseIcon className="h-12 w-12 text-blue-600" /></div>
        <p className="text-lg font-semibold text-gray-700">Total Requests</p>
        <p className="text-3xl font-bold text-gray-900">{repairs.length}</p>
      </div>
      <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
         <div className="p-4 bg-white/20 rounded-full mb-4 ring-2 ring-orange-300"><ClockIcon className="h-12 w-12 text-white" /></div>
        <p className="text-lg font-semibold">Pending Requests</p>
        <p className="text-3xl font-bold">{pendingJobs}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Request Status</h3>
            <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={jobStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} fill="#8884d8" labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => { const radius = innerRadius + (outerRadius - innerRadius) * 0.5; const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180)); const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180)); return (<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">{`${(percent * 100).toFixed(0)}%`}</text>);}}>{jobStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /><Legend iconSize={12} /></PieChart></ResponsiveContainer>
        </div>
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Repair Trend</h3>
            <ResponsiveContainer width="100%" height={300}><LineChart data={weeklyTrendData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="New Requests" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer>
        </div>
    </div>
  </>
);

function AdminDashboard({users, repairs, setUsers}) {
  const { unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [jobToAssign, setJobToAssign] = useState(null);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [jobToUpdateStatus, setJobToUpdateStatus] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const notificationsMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setIsProfileMenuOpen(false);
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target)) setIsNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const qTechs = query(collection(db, "users"), where("role", "==", "technician"));
    const unsubscribeTechnicians = onSnapshot(qTechs, (querySnapshot) => {
        setTechnicians(querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    });
    return () => unsubscribeTechnicians();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => navigate('/login'));
  };

  const handleDeleteRequest = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };
  
  const handleDeleteJob = (jobId) => {
    setJobToDelete(jobId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
        if (userToDelete) {
            await deleteDoc(doc(db, 'users', userToDelete));
        } else if (jobToDelete) {
            await deleteDoc(doc(db, 'repairs', jobToDelete));
        }
    } catch (error) {
        console.error("Error deleting item:", error);
    } finally {
        setIsModalOpen(false);
        setUserToDelete(null);
        setJobToDelete(null);
    }
  };

  const handleStatusChange = async (job, updateData) => {
    try {
        if (!job || !updateData || typeof updateData !== 'object') return;
        
        const repairRef = doc(db, 'repairs', job.id);
        await updateDoc(repairRef, updateData);

        // Create a notification in the user's subcollection
        const notificationRef = collection(db, 'users', job.userId, 'notifications');
        await addDoc(notificationRef, {
            type: 'status_update',
            title: 'Repair Status Updated',
            message: `The status of your repair for the ${job.deviceBrand} ${job.deviceModel} has been updated to ${updateData.status}`,
            read: false,
            createdAt: serverTimestamp(),
            relatedRepairId: job.id
        });

    } catch (error) {
        console.error('Error updating status:', error);
        alert(`Error updating status: ${error.message}`);
    } finally {
        setIsUpdateStatusModalOpen(false);
        setJobToUpdateStatus(null);
    }
  };
  
  const handleAssignClick = (job) => {
    setJobToAssign(job);
    setIsAssignModalOpen(true);
  };

  const handleAssignJob = async (jobId, techId) => {
    const repairRef = doc(db, 'repairs', jobId);
    const job = repairs.find(r => r.id === jobId);
    
    await updateDoc(repairRef, { 
        assignedTo: techId, 
        status: 'In Progress',
        statusHistory: arrayUnion({
            status: 'In Progress',
            timestamp: new Date(),
            notes: 'Technician assigned to the job.'
        })
    });
    
    // Create a notification for the technician
    const techNotificationRef = collection(db, 'users', techId, 'notifications');
    await addDoc(techNotificationRef, {
        type: 'info', 
        title: 'New Job Assigned',
        message: `A new repair job for "${job?.deviceBrand} ${job?.deviceModel}" has been assigned to you.`,
        read: false, 
        createdAt: serverTimestamp(), 
        relatedRepairId: jobId,
    });

    setIsAssignModalOpen(false);
    setJobToAssign(null);
  };

  const handleUpdateStatusClick = (job) => {
    setJobToUpdateStatus(job);
    setIsUpdateStatusModalOpen(true);
  };
  
  const handleNotificationClick = (notification) => {
      if (notification.relatedRepairId) {
          setActiveView('repair-jobs');
      }
      if (!notification.read) {
          markAsRead(notification.id);
      }
  };

  const handleViewCustomerProfile = (userId) => {
    setSelectedCustomerId(userId);
    setActiveView('customer-profile');
  };

  const completedJobs = repairs.filter(r => r.status === 'Completed').length;
  const pendingJobs = repairs.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').length;
  const totalRevenue = repairs
    .filter(r => r.status === 'Completed')
    .reduce((acc, curr) => {
        const amount = curr.totalAmount || curr.cost || 0;
        return acc + (typeof amount === 'number' ? amount : parseFloat(amount) || 0);
    }, 0);
    
  const jobStatusData = [{ name: 'Completed', value: completedJobs }, { name: 'Pending', value: pendingJobs }];

  const processWeeklyData = (repairs) => {
    const weeklyData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].reduce((acc, day) => ({...acc, [day]: {'New Requests': 0}}), {});
    repairs.forEach(repair => {
        if (repair.createdAt?.toDate) {
            const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][repair.createdAt.toDate().getDay()];
            if (weeklyData[day]) weeklyData[day]['New Requests']++;
        }
    });
    return Object.entries(weeklyData).map(([day, data]) => ({name: day, ...data}));
  };
  const weeklyTrendData = processWeeklyData(repairs);

  const renderContent = () => {
    const props = {
      repairs, 
      users, 
      onStatusChange: handleStatusChange, 
      onDeleteJob: handleDeleteJob, 
      onAssignClick: handleAssignClick, 
      onUpdateStatusClick: handleUpdateStatusClick, 
      handleDeleteUser: handleDeleteRequest, 
      onViewCustomer: handleViewCustomerProfile,
      pendingJobs, 
      jobStatusData, 
      weeklyTrendData, 
      totalRevenue
    };

    const viewMap = {
        'dashboard': <DashboardContent {...props} />,
        'sales-revenue': <SalesAndRevenue />,
        'repair-jobs': <RepairJobs {...props} />,
        'customers': <Customers {...props} />,
        'promotions': <Promotions />,
        'technicians': <Technicians />,
        'inventory': <Inventory />,
        'reports': <Reports />,
        'notifications': <Notifications />,
        'support': <Support />,
        'chat-support': <ChatSupport />,
        'invoice-settings': <InvoiceSettings />,
        'customer-profile': selectedCustomerId ? (
          <CustomerProfile 
            user={users[selectedCustomerId]} 
            repairs={repairs} 
            onBack={() => setActiveView('customers')} 
          />
        ) : null
    };
    const component = viewMap[activeView];
    return component || <div className="p-6">Page not found</div>;
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50 font-sans">
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 md:flex md:flex-col`}>
          <div className="p-4 border-b border-slate-700 flex justify-between items-center"><h1 className="text-2xl font-bold">Admin Panel</h1><button className="md:hidden" onClick={() => setIsSidebarOpen(false)}><Bars3Icon className="h-6 w-6" /></button></div>
          <nav className="flex-1 p-4 overflow-y-auto"><ul>{menuItems.map((item) => (<li key={item.id} className="mb-2"><button onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }} className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === item.id ? 'bg-slate-900' : 'hover:bg-slate-700'}`}><item.icon className="h-6 w-6 mr-3" />{item.text}</button></li>))}</ul></nav>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-between items-center p-4 bg-white/60 backdrop-blur-lg border-b border-gray-200 z-30">
              <div className="flex items-center"><button className="md:hidden mr-4" onClick={() => setIsSidebarOpen(true)}><Bars3Icon className="h-6 w-6" /></button><h2 className="text-xl font-bold text-gray-800">{menuItems.find(i => i.id === activeView)?.text || 'Customer Profile'}</h2></div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="relative">
                      <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className='p-2 rounded-full hover:bg-gray-200 relative'>
                          <BellIcon className="h-6 w-6 text-gray-500" />
                          {unreadCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unreadCount}</span>}
                      </button>
                      {isNotificationsOpen && <div ref={notificationsMenuRef} className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl p-4 z-50"><h3 className="text-lg font-bold text-gray-800">Recent Notifications</h3><p className="text-gray-600 mt-2">Check the floating icon for detailed notifications.</p></div>}
                  </div>
                  <div className="relative">
                      <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center p-2 rounded-full hover:bg-gray-200"><UserCircleIcon className="h-8 w-8 text-gray-500" /></button>
                      {isProfileMenuOpen && <div ref={profileMenuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50"><button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Out</button>
                      <button onClick={() => { setActiveView('invoice-settings'); setIsProfileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Invoice Settings</button></div>}
                  </div>
              </div>
          </header>

          <main className="flex-1 bg-gray-100/50 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </main>

        </div>
      </div>
      <Notification 
        onViewAll={() => setActiveView('notifications')}
        onNotificationClick={handleNotificationClick}
      />
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmDelete} title={jobToDelete ? "Delete Job" : "Delete User"} message={jobToDelete ? "Are you sure you want to delete this job?" : "Are you sure you want to delete this user?"}/>
      <AssignJobModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} onAssign={handleAssignJob} technicians={technicians} job={jobToAssign}/>
      <UpdateStatusModal isOpen={isUpdateStatusModalOpen} onClose={() => setIsUpdateStatusModalOpen(false)} onUpdateStatus={handleStatusChange} job={jobToUpdateStatus}/>
    </>
  );
}

export default AdminDashboard;
