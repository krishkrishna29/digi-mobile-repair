import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
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
  EyeIcon,
  UserPlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
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
import ConfirmationModal from './ConfirmationModal';
import AssignJobModal from './AssignJobModal';
import UpdateStatusModal from './UpdateStatusModal';

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
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center shadow-sm";
    switch (status) {
        case 'In Progress':
            return <span className={`${baseClasses} bg-blue-100 text-blue-800`}><ClockIcon className="h-4 w-4 mr-1.5" />{status}</span>;
        case 'Completed':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircleIcon className="h-4 w-4 mr-1.5" />{status}</span>;
        case 'Pending':
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><ClockIcon className="h-4 w-4 mr-1.5" />{status}</span>;
        case 'Cancelled':
            return <span className={`${baseClasses} bg-red-100 text-red-800`}><XCircleIcon className="h-4 w-4 mr-1.5" />{status}</span>;
        default:
            return <span className={`${baseClasses} bg-gray-200 text-gray-800`}><ClockIcon className="h-4 w-4 mr-1.5" />{status}</span>;
    }
};

const RepairJobs = ({ repairs, users, onStatusChange, onDeleteJob, onAssignClick, onUpdateStatusClick }) => {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(10);

    const handleToggleMenu = (jobId) => {
        setOpenMenu(openMenu === jobId ? null : jobId);
    };

    const handleDelete = (jobId) => {
        onDeleteJob(jobId);
        setOpenMenu(null);
    };


    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = repairs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const actionRequiredJobs = repairs.filter(job => job.status === 'Pending' || job.status === 'In Progress' || job.status === 'Cancelled');

    const getActionRowStyle = (status) => {
        switch(status) {
            case 'In Progress': return 'bg-blue-50/50';
            case 'Pending': return 'bg-yellow-50/50';
            case 'Cancelled': return 'bg-red-50/50';
            default: return 'bg-white';
        }
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Repair Jobs</h2>
                <div className="">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 font-semibold uppercase text-sm border-b border-gray-200">
                                <th className="py-4 px-4">Customer</th>
                                <th className="py-4 px-4">Device & Issue</th>
                                <th className="py-4 px-4">Submitted On</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentJobs.map((job, index) => (
  <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50/50">
    <td className="py-4 px-4 font-medium text-gray-800">
      {users[job.userId]?.fullName || 'N/A'}
    </td>
    <td className="py-4 px-4 text-gray-600">
      <div>{job.device}</div>
      <div className='text-xs text-gray-400'>{job.issue}</div>
    </td>
    <td className="py-4 px-4 text-gray-600">
      {job.createdAt?.toDate().toLocaleDateString()}
    </td>
    <td className="py-4 px-4">
      {getStatusChip(job.status)}
    </td>
    <td className="py-4 px-4 text-center">
      <div className="relative inline-block text-left">
        <button 
          onClick={() => handleToggleMenu(job.id)} 
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
        </button>

        {openMenu === job.id && (
          <div 
            className={`absolute right-0 z-50 w-56 bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none 
            ${index > currentJobs.length - 3 ? 'bottom-full mb-2' : 'mt-2'}`}
          >
            <div className="p-2">
              <div className='px-2 py-2 border-b border-gray-200'>
                <p className='text-xs font-semibold text-gray-500'>Actions</p>
              </div>
              
              <div className="py-2">
                {/* Note the explicit text-gray-900 for visibility */}
                <button 
                  onClick={() => { onUpdateStatusClick(job); setOpenMenu(null); }} 
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-3 text-gray-500"/>
                  Update Status
                </button>
                <button 
                  onClick={() => { onAssignClick(job); setOpenMenu(null); }} 
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <UserPlusIcon className="h-4 w-4 mr-3 text-gray-500"/>
                  Assign Tech
                </button>
              </div>

              <div className='px-2 py-2 border-t border-gray-200'>
                <button 
                  onClick={() => handleDelete(job.id)} 
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-3 text-red-500"/>
                  Delete Job
                </button>
              </div>
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
                <div className="py-4 flex justify-end">
                    <nav className="block">
                        <ul className="flex pl-0 rounded list-none flex-wrap">
                            <li>
                                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 ml-0 rounded-l hover:bg-gray-200">Previous</button>
                            </li>
                            <li>
                                <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastJob >= repairs.length} className="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 rounded-r hover:bg-gray-200">Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Action Required</h2>
                <div className="overflow-x-auto rounded-lg">
                    <table className="w-full text-left text-gray-800">
                        <thead className='bg-gray-100/70'>
                            <tr className="text-gray-600 font-semibold uppercase text-sm">
                                <th className="py-4 px-5">Customer Name</th>
                                <th className="py-4 px-5">Status</th>
                                <th className="py-4 px-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {actionRequiredJobs.map(job => (
                                <tr key={job.id} className={`${getActionRowStyle(job.status)} hover:bg-gray-100/50 transition-colors`}>
                                    <td className="py-4 px-5 font-medium">{users[job.userId]?.fullName || 'N/A'}</td>
                                    <td className="py-4 px-5">{getStatusChip(job.status)}</td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                                            <button onClick={() => navigate(`/user/${job.userId}`)} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-colors"><EyeIcon className="h-5 w-5 mr-1.5"/>View</button>
                                            <button onClick={() => onAssignClick(job)} className="flex items-center text-sm font-medium text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-100 transition-colors"><UserPlusIcon className="h-5 w-5 mr-1.5"/>Assign</button>
                                            <button onClick={() => onDeleteJob(job.id)} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"><TrashIcon className="h-5 w-5 mr-1.5"/>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

const DashboardContent = ({ repairs, pendingJobs, jobStatusData, weeklyTrendData }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
        <div className="p-4 bg-white/50 rounded-full mb-4 ring-2 ring-purple-200">
            <BanknotesIcon className="h-12 w-12 text-purple-600" />
        </div>
        <p className="text-lg font-semibold text-gray-700">Total Revenue</p>
        <p className="text-3xl font-bold text-gray-900">₹63,200</p>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
         <div className="p-4 bg-white/50 rounded-full mb-4 ring-2 ring-blue-200">
            <BriefcaseIcon className="h-12 w-12 text-blue-600" />
        </div>
        <p className="text-lg font-semibold text-gray-700">Total Jobs</p>
        <p className="text-3xl font-bold text-gray-900">{repairs.length}</p>
      </div>
      <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
         <div className="p-4 bg-white/20 rounded-full mb-4 ring-2 ring-orange-300">
            <ClockIcon className="h-12 w-12 text-white" />
        </div>
        <p className="text-lg font-semibold">Pending Jobs</p>
        <p className="text-3xl font-bold">{pendingJobs}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Job Status</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie data={jobStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} fill="#8884d8" labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => { const radius = innerRadius + (outerRadius - innerRadius) * 0.5; const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180)); const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180)); return (<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">{`${(percent * 100).toFixed(0)}%`}</text>);}}>
                    {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={12} />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Repair Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyTrendData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="New Requests" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
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

function AdminDashboard({users, repairs, setUsers}) {
  const [newRequestCount, setNewRequestCount] = useState(0);
  const [activeView, setActiveView] = useState('dashboard');
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
  const [allNotifications, setAllNotifications] = useState([]);
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
        snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
                const newRepair = { id: change.doc.id, ...change.doc.data() };
                // Ensure we don't create multiple notifications for the same repair
                // We'll use a type 'repair_request_new'
                // This is just a basic implementation. Ideally, this should be handled by a Cloud Function.
                // But for IDX/Studio purposes, we can do it here for now.
                
                // Add unread notification for Admin
                await addDoc(collection(db, 'notifications'), {
                    title: 'New Repair Request',
                    message: `A new repair request for "${newRepair.device}" has been submitted.`,
                    type: 'repair_request_new',
                    read: false,
                    createdAt: serverTimestamp(),
                    relatedRepairId: newRepair.id
                });
            }
        });
    });
    
    // Listen to ALL unread notifications for the count
    const qNotifications = query(
        collection(db, 'notifications'),
        where('read', '==', false)
    );
    const unsubscribeNotificationsCount = onSnapshot(qNotifications, (snapshot) => {
        setNewRequestCount(snapshot.size);
    });

    const qTechs = query(collection(db, "users"), where("role", "==", "technician"));
    const unsubscribeTechnicians = onSnapshot(qTechs, (querySnapshot) => {
        const techs = [];
        querySnapshot.forEach((doc) => {
            techs.push({id: doc.id, ...doc.data()});
        });
        setTechnicians(techs);
    });

    return () => {
        unsubscribeRepairs();
        unsubscribeNotificationsCount();
        unsubscribeTechnicians();
    };
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/login');
    });
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
    if (userToDelete) {
      try {
        await deleteDoc(doc(db, 'users', userToDelete));
        setIsModalOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else if (jobToDelete) {
        try {
            await deleteDoc(doc(db, 'repairs', jobToDelete));
            setIsModalOpen(false);
            setJobToDelete(null);
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    }
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
    setIsUpdateStatusModalOpen(false); // Close the status update modal after action
    setJobToUpdateStatus(null);
  };
  
  const handleAssignClick = (job) => {
    setJobToAssign(job);
    setIsAssignModalOpen(true);
  };

  const handleAssignJob = async (jobId, techId) => {
    const repairRef = doc(db, 'repairs', jobId);
    await updateDoc(repairRef, { assignedTo: techId, status: 'In Progress' });
    
    const job = repairs.find(r => r.id === jobId);
    
    await addDoc(collection(db, 'notifications'), {
        userId: techId,
        type: 'info',
        title: 'New Job Assigned',
        message: `A new repair job for "${job?.device}" has been assigned to you.`,
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

  const clearNewRequests = () => {
    // This is now handled in the Notification component itself
  };
  
  const handleNotificationClick = (notification) => {
      if (notification.relatedRepairId) {
          setActiveView('repair-jobs');
          // Optional: Scroll to the job or highlight it
      }
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
        return <RepairJobs repairs={repairs} users={users} onStatusChange={handleStatusChange} onDeleteJob={handleDeleteJob} onAssignClick={handleAssignClick} onUpdateStatusClick={handleUpdateStatusClick} />;
      case 'customers':
        return <Customers users={Object.values(users)} repairs={repairs} handleDeleteUser={handleDeleteRequest} />;
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
    <>
    <div className="flex h-screen bg-gray-50">
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white/50 backdrop-blur-lg border-b border-gray-200 z-20">
            <div className="flex items-center">
              <button className="md:hidden mr-4" onClick={() => setIsSidebarOpen(true)}>
                  <Bars3Icon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">{(menuItems.find(i => i.id === activeView) || {}).text}</h2>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative">
                    <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className='p-2 rounded-full hover:bg-gray-200 relative'>
                        <BellIcon className="h-6 w-6 text-gray-500" />
                        {newRequestCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                {newRequestCount}
                            </span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div ref={notificationsMenuRef} className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl p-4 z-30">
                            <h3 className="text-lg font-bold text-gray-800">Recent Notifications</h3>
                            {/* This is a simple list. Ideally, this should also fetch from Firestore like the Notification component */}
                            <p className="text-gray-600 mt-2">Check the floating icon for detailed notifications.</p>
                        </div>
                    )}
                </div>
                <div className="relative">
                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center p-2 rounded-full hover:bg-gray-200">
                        <UserCircleIcon className="h-8 w-8 text-gray-500" />
                    </button>
                    {isProfileMenuOpen && (
                        <div ref={profileMenuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-30">
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

        <main className="flex-1 bg-gray-100/50 overflow-y-auto">
          {renderContent()}
        </main>

        <Notification 
            newRequestCount={newRequestCount} 
            onClear={clearNewRequests} 
            onNotificationClick={handleNotificationClick}
        />
      </div>
    </div>
    <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title={jobToDelete ? "Delete Job" : "Delete User"}
        message={jobToDelete ? "Are you sure you want to delete this job? This action cannot be undone." : "Are you sure you want to delete this user? This action cannot be undone."}
    />
    <AssignJobModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignJob}
        technicians={technicians}
        job={jobToAssign}
    />
    <UpdateStatusModal
        isOpen={isUpdateStatusModalOpen}
        onClose={() => setIsUpdateStatusModalOpen(false)}
        onUpdateStatus={handleStatusChange}
        job={jobToUpdateStatus}
    />
    </>
  );
}

export default AdminDashboard;