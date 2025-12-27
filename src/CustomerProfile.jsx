
import React from 'react';
import { 
  UserCircleIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, 
  ArrowLeftIcon, WrenchScrewdriverIcon, CheckCircleIcon, 
  ClockIcon, XCircleIcon 
} from '@heroicons/react/24/outline';

const CustomerProfile = ({ user, repairs, onBack }) => {
  const userRepairs = repairs.filter(r => r.userId === user.id);
  
  const stats = {
    total: userRepairs.length,
    completed: userRepairs.filter(r => r.status === 'Completed').length,
    pending: userRepairs.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').length,
    cancelled: userRepairs.filter(r => r.status === 'Cancelled').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Customer Profile</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <UserCircleIcon className="h-16 w-16 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{user.fullName || 'Unknown Name'}</h3>
              <p className="text-gray-500 text-sm">Customer ID: {user.id}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <PhoneIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="text-sm">{user.phoneNumber || user.mobileNumber || 'N/A'}</span>
              </div>
              <div className="flex items-start text-gray-700">
                <MapPinIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <span className="text-sm">{user.address || 'No address provided'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-600 font-semibold uppercase">Total</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <p className="text-xs text-green-600 font-semibold uppercase">Done</p>
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <p className="text-xs text-yellow-600 font-semibold uppercase">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <p className="text-xs text-red-600 font-semibold uppercase">Cancelled</p>
                <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Repair History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-bold text-gray-800">Repair History</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Device</th>
                    <th className="px-6 py-4">Issue</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userRepairs.length > 0 ? (
                    userRepairs.map((repair) => (
                      <tr key={repair.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{repair.deviceBrand}</div>
                          <div className="text-sm text-gray-500">{repair.deviceModel}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {repair.issue || repair.subIssue}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(repair.status)}`}>
                            {repair.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-gray-500 italic">
                        No repair requests found for this customer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
