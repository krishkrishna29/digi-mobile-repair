import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/solid';

const UserProfile = ({ users, repairs }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = users.find(u => u.uid === userId);
  const userRepairs = repairs.filter(repair => repair.userId === userId);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl text-gray-500">User not found.</p>
      </div>
    );
  }

  const getStatusChip = (status) => {
    const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
    switch (status) {
      case 'In Progress':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{status}</span>;
      case 'Completed':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
      case 'Pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{status}</span>;
      default:
        return <span className={`${baseClasses} bg-gray-200 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6 font-semibold">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Customers
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col items-center">
                <img 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg mb-4"
                  src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`}
                  alt="User profile"
                />
                <h1 className="text-3xl font-extrabold text-gray-900">{user.fullName}</h1>
                <p className="text-md text-gray-500 mt-1">{user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                
                <div className="w-full text-left mt-8 space-y-4 text-gray-700">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-6 w-6 mr-3 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-6 w-6 mr-3 text-gray-400" />
                    <span>{user.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-6 w-6 mr-3 text-gray-400" />
                    <span>{user.address || 'Not provided'}</span>
                  </div>
                </div>

                <button className="mt-8 w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 flex items-center justify-center font-semibold">
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Repair History ({userRepairs.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-800">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-sm font-semibold">
                      <th className="py-3 px-4">Device</th>
                      <th className="py-3 px-4">Issue</th>
                      <th className="py-3 px-4">Submitted On</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userRepairs.map(job => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium">{job.device}</td>
                        <td className="py-4 px-4">{job.issue}</td>
                        <td className="py-4 px-4 text-gray-600">{job.createdAt?.toDate().toLocaleDateString()}</td>
                        <td className="py-4 px-4 text-center">{getStatusChip(job.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
