import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const Customers = ({ users, repairs, handleDeleteUser }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const getRepairStats = (userId) => {
    const userRepairs = repairs.filter(repair => repair.userId === userId);
    const completed = userRepairs.filter(r => r.status === 'Completed').length;
    const pending = userRepairs.length - completed;
    return { completed, pending, total: userRepairs.length };
  };

  const filteredUsers = users.filter(user => {
    const fullName = user.fullName || '';
    const email = user.email || '';
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase());
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
  const totalRepairs = repairs.length;
  const completedRepairs = repairs.filter(r => r.status === 'Completed').length;

  return (
    <div className="bg-gray-100 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 sm:mb-0">Customer Management</h1>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 flex items-center">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 flex items-center">
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-md font-semibold text-gray-600">Total Customers</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-5xl font-bold text-gray-900">{totalCustomers}</p>
            <div className="flex items-center text-green-500">
              <ArrowUpIcon className="h-5 w-5 mr-1" />
              <span className="font-semibold">10%</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-md font-semibold text-gray-600">Total Repairs</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-5xl font-bold text-gray-900">{totalRepairs}</p>
            <div className="flex items-center text-green-500">
              <ArrowUpIcon className="h-5 w-5 mr-1" />
              <span className="font-semibold">5%</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-md font-semibold text-gray-600">Completed Repairs</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-5xl font-bold text-gray-900">{completedRepairs}</p>
            <div className="flex items-center text-red-500">
              <ChevronDownIcon className="h-5 w-5 mr-1" />
              <span className="font-semibold">2%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Customers ({filteredUsers.length})</h2>
            <p className="text-md text-gray-600">Manage and view all customer repair requests.</p>
          </div>
          <button className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 flex items-center mt-4 sm:mt-0">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download All
          </button>
        </div>

        <div className="relative mb-4">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm font-semibold text-gray-600 bg-gray-100 uppercase">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Repairs</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentUsers.map(user => {
                const stats = getRepairStats(user.uid);
                return (
                  <tr key={user.uid} className="hover:bg-gray-50 text-gray-800 cursor-pointer" onClick={() => navigate(`/user/${user.uid}`)}>
                    <td className="p-4 whitespace-nowrap font-medium">{user.fullName}</td>
                    <td className="p-4 whitespace-nowrap text-gray-600">{user.email}</td>
                    <td className="p-4 whitespace-nowrap text-center font-semibold">
                      <div className="flex justify-center space-x-4">
                        <div className="flex items-center text-blue-600">
                            <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
                            <span>Total: {stats.total}</span>
                        </div>
                        <div className="flex items-center text-green-600">
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            <span>Completed: {stats.completed}</span>
                        </div>
                        <div className="flex items-center text-red-600">
                            <XCircleIcon className="h-5 w-5 mr-2" />
                            <span>Pending: {stats.pending}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.uid); }} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-gray-200">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
                <ChevronLeftIcon className="h-5 w-5 mr-2" />
                Previous
            </button>
            <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
                Next
                <ChevronRightIcon className="h-5 w-5 ml-2" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Customers;
