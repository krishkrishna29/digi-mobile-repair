
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon,
  UserPlusIcon, ArrowDownTrayIcon, TrashIcon, WrenchScrewdriverIcon, CheckCircleIcon, 
  XCircleIcon, UsersIcon, PhoneIcon
} from '@heroicons/react/24/outline';

const Customers = ({ users: usersObj, repairs, handleDeleteUser, isLoading, onViewCustomer }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  
  const users = usersObj ? Object.values(usersObj) : [];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const getRepairStats = (userId) => {
    if (!repairs) return { completed: 0, pending: 0, total: 0 };
    const userRepairs = repairs.filter(repair => repair.userId === userId);
    const completed = userRepairs.filter(r => r.status === 'Completed').length;
    const pending = userRepairs.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').length;
    return { completed, pending, total: userRepairs.length };
  };

  const filteredUsers = users.filter(user => {
    const fullName = user.fullName || '';
    const email = user.email || '';
    const phone = user.phoneNumber || user.mobileNumber || '';
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
           email.toLowerCase().includes(lowerCaseSearchTerm) ||
           phone.includes(lowerCaseSearchTerm);
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const totalCustomers = users.length;
  const totalRepairs = repairs ? repairs.length : 0;
  const completedRepairs = repairs ? repairs.filter(r => r.status === 'Completed').length : 0;

  if (isLoading) {
      return <div className="flex justify-center items-center h-full"><p>Loading customers...</p></div>
  }

  return (
    <div className="bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Customer Management</h1>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 flex items-center transition-colors">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-purple-700 flex items-center transition-colors">
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/80">
          <p className="text-md font-semibold text-gray-600">Total Customers</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-5xl font-bold text-gray-900">{totalCustomers}</p>
            <div className="flex items-center text-green-500"><ArrowUpIcon className="h-5 w-5 mr-1" /><span className="font-semibold">10%</span></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/80">
          <p className="text-md font-semibold text-gray-600">Total Repairs</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-5xl font-bold text-gray-900">{totalRepairs}</p>
             <div className="flex items-center text-green-500"><ArrowUpIcon className="h-5 w-5 mr-1" /><span className="font-semibold">5%</span></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/80">
          <p className="text-md font-semibold text-gray-600">Completed Repairs</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-5xl font-bold text-gray-900">{completedRepairs}</p>
            <div className="flex items-center text-red-500"><ChevronDownIcon className="h-5 w-5 mr-1" /><span className="font-semibold">2%</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/80">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Customers ({filteredUsers.length})</h2>
            <p className="text-md text-gray-600 mt-1">Manage and view all customer repair requests.</p>
          </div>
          <div className="relative mt-4 sm:mt-0">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3.5" />
            <input type="text" placeholder="Search by name, email, or phone..." className="w-full sm:w-64 border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" value={searchTerm} onChange={handleSearchChange} />
          </div>
        </div>
        
        {currentUsers.length > 0 ? (
            <>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="text-xs font-semibold text-gray-600 bg-gray-100 uppercase tracking-wider"><th className="p-4">Customer</th><th className="p-4">Contact</th><th className="p-4 text-center">Repair Stats</th><th className="p-4 text-center">Actions</th></tr></thead>
                        <tbody className="divide-y divide-gray-200">
                        {currentUsers.map((user) => {
                            const stats = getRepairStats(user.id);
                            return (
                            <tr key={user.id} className="hover:bg-gray-50/80 text-gray-800 transition-colors duration-150 cursor-pointer" onClick={() => onViewCustomer(user.id)}>
                                <td className="p-4 whitespace-nowrap">
                                    <div className="font-semibold text-gray-900">{user.fullName || 'N/A'}</div>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <PhoneIcon className="h-4 w-4 mr-1.5 text-gray-400"/> 
                                        {user.phoneNumber || user.mobileNumber || 'N/A'}
                                    </div>
                                </td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{user.email}</td>
                                <td className="p-4 whitespace-nowrap text-center font-medium">
                                <div className="flex justify-center items-center space-x-4">
                                    <div className="flex items-center text-sm text-blue-600" title="Total Repairs"><WrenchScrewdriverIcon className="h-5 w-5 mr-1.5" /><span>{stats.total}</span></div>
                                    <div className="flex items-center text-sm text-green-600" title="Completed Repairs"><CheckCircleIcon className="h-5 w-5 mr-1.5" /><span>{stats.completed}</span></div>
                                    <div className="flex items-center text-sm text-red-600" title="Pending Repairs"><XCircleIcon className="h-5 w-5 mr-1.5" /><span>{stats.pending}</span></div>
                                </div>
                                </td>
                                <td className="p-4 whitespace-nowrap text-center"><button onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }} className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors"><TrashIcon className="h-5 w-5" /></button></td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-6 text-sm">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="flex items-center px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeftIcon className="h-5 w-5 mr-1" />Previous</button>
                    <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next<ChevronRightIcon className="h-5 w-5 ml-1" /></button>
                </div>
            </>
        ) : (
            <div className="text-center py-16">
                <UsersIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-800">No Customers Found</h3>
                <p className="mt-2 text-md text-gray-600">{searchTerm ? "No customers match your search." : "There are no customers to display."}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
