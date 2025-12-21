import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { 
  ChartPieIcon, 
  ClipboardDocumentListIcon, 
  PlusCircleIcon, 
  MagnifyingGlassCircleIcon, 
  ShieldCheckIcon, 
  CreditCardIcon, 
  BellIcon, 
  Cog6ToothIcon, 
  GiftIcon,
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { text: 'Dashboard', icon: ChartPieIcon },
  { text: 'My Repairs', icon: ClipboardDocumentListIcon },
  { text: 'New Repair Request', icon: PlusCircleIcon },
  { text: 'Track Repair Status', icon: MagnifyingGlassCircleIcon },
  { text: 'Service Plans & Warranty', icon: ShieldCheckIcon },
  { text: 'Payment & Billing', icon: CreditCardIcon },
  { text: 'Notifications', icon: BellIcon },
  { text: 'Support', icon: Cog6ToothIcon },
  { text: 'Offers & Promotions', icon: GiftIcon },
];

const Dashboard = () => {
  const [activeRepairs, setActiveRepairs] = useState([]);
  const [completedRepairs, setCompletedRepairs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'repairs'), (snapshot) => {
      const repairs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActiveRepairs(repairs.filter(repair => repair.status !== 'Completed'));
      setCompletedRepairs(repairs.filter(repair => repair.status === 'Completed'));
    });

    return () => unsubscribe();
  }, []);

  return (
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Dashboard</h2>
            <div className="flex items-center self-end sm:self-center">
                <BellIcon className="h-6 w-6 text-gray-400 mr-4 sm:mr-6" />
                <div className="flex items-center">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    <span className="hidden sm:inline ml-2 text-sm font-medium">John Doe</span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-400 ml-1" />
                </div>
            </div>
        </header>

        {/* Hero Section */}
        <div className="bg-gray-800 text-white p-6 sm:p-8 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
                <h3 className="text-2xl sm:text-4xl font-bold">Track, Repair, Relax</h3>
                <p className="text-base sm:text-lg mt-2">Leave your smartphone problems to us.</p>
            </div>
            <button onClick={() => navigate('/new-repair-request')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-blue-500/50 self-start sm:self-center">Request a Repair</button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <p className="text-lg text-gray-400">Active Repairs</p>
                <p className="text-3xl font-bold">{activeRepairs.length}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <p className="text-lg text-gray-400">Completed Repairs</p>
                <p className="text-3xl font-bold">{completedRepairs.length}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <p className="text-lg text-gray-400">Pending Payments</p>
                <p className="text-3xl font-bold">2</p>
            </div>
        </div>

        {/* Repair History */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Repair History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                          <th className="py-3 px-4">Device</th>
                          <th className="py-3 px-4 hidden sm:table-cell">Issue</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 hidden md:table-cell">Date Submitted</th>
                      </tr>
                  </thead>
                  <tbody>
                      {[...activeRepairs, ...completedRepairs].map(repair => (
                          <tr key={repair.id} className="border-b border-gray-700">
                              <td className="py-4 px-4">{repair.device}</td>
                              <td className="py-4 px-4 hidden sm:table-cell">{repair.issue}</td>
                              <td className="py-4 px-4">
                                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${repair.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                      {repair.status}
                                  </span>
                              </td>
                              <td className="py-4 px-4 hidden md:table-cell">{new Date(repair.submittedDate?.toDate()).toLocaleDateString()}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            </div>
        </div>
      </div>
  );
};

export default Dashboard;
