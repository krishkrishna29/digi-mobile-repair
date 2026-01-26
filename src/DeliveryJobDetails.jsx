
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { PhoneIcon, MapPinIcon } from '@heroicons/react/24/solid';

const DeliveryJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jobRef = doc(db, 'repairs', jobId);
    const unsubscribe = onSnapshot(jobRef, (doc) => {
      if (doc.exists()) {
        setJob({ id: doc.id, ...doc.data() });
      } else {
        // Handle case where job doesn't exist
        navigate('/delivery');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [jobId, navigate]);

  const handleStatusUpdate = async (newStatus) => {
    const jobRef = doc(db, 'repairs', jobId);
    await updateDoc(jobRef, { 
      status: newStatus,
      statusHistory: [...(job.statusHistory || []), { status: newStatus, timestamp: new Date() }]
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div>Loading job details...</div></div>;
  }

  const renderActionButtons = () => {
    switch (job.status) {
      case 'Pending':
        return <button onClick={() => handleStatusUpdate('Picked Up')} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">Confirm Pickup</button>;
      case 'Ready for Delivery':
        return <button onClick={() => handleStatusUpdate('Out for Delivery')} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">Start Delivery</button>;
      case 'Out for Delivery':
        return <button onClick={() => handleStatusUpdate('Completed')} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-300">Complete Delivery</button>;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto p-4 flex items-center">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900 mr-4">
            &larr; Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Job Details</h1>
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="text-lg font-semibold text-gray-900">{job.customerName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Status</p>
              <p className={`text-lg font-bold ${job.status === 'Completed' ? 'text-green-600' : 'text-blue-600'}`}>{job.status}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Device</p>
            <p className="text-gray-800">{job.deviceBrand} {job.deviceModel}</p>
            <p className="text-sm text-gray-500 mt-1">Issue: {job.issueDescription}</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-800">{job.pickupAddress?.address || 'N/A'}</p>
                </div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${job.pickupAddress?.address}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                    <MapPinIcon className="h-6 w-6 mr-2" />
                    Navigate
                </a>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="text-gray-800">{job.customerPhone}</p>
              </div>
              <a href={`tel:${job.customerPhone}`} className="flex items-center text-blue-600 hover:underline">
                <PhoneIcon className="h-6 w-6 mr-2"/>
                Call Customer
              </a>
            </div>
          </div>
          
          {job.totalAmount > 0 && (
             <div className="border-t border-gray-200 pt-4">
                 <p className="text-sm text-gray-500">Payment</p>
                 <p className="text-lg font-bold text-gray-900">Amount to Collect: ₹{job.totalAmount}</p>
                 <p className="text-sm text-gray-600">Method: Cash on Delivery</p>
             </div>
          )}

          <div className="mt-8">
            {renderActionButtons()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeliveryJobDetails;
