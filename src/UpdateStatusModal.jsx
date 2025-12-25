import React, { useState, useEffect } from 'react';

const UpdateStatusModal = ({ isOpen, onClose, onUpdateStatus, job }) => {
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        if (job?.status) {
            setSelectedStatus(job.status);
        }
    }, [job]);

    if (!isOpen || !job) {
        return null;
    }

    const handleUpdate = () => {
        if (selectedStatus) {
            onUpdateStatus(job.id, job.userId, job.device, selectedStatus);
            onClose();
        }
    };

    const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-6 border w-full max-w-lg shadow-xl rounded-2xl bg-white">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">Update Repair Status</h3>
                    <div className="mt-4 space-y-4 text-left p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Device</p>
                            <p className="text-md font-semibold text-gray-800">{job.device}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Customer Phone</p>
                            <p className="text-md font-semibold text-gray-800">{job.customerPhone || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Service Address</p>
                            <p className="text-md font-semibold text-gray-800 whitespace-pre-wrap">{job.serviceAddress || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 text-left mb-2">Select New Status</label>
                        <select
                            id="status-select"
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-6 flex flex-col space-y-2">
                        <button
                            onClick={handleUpdate}
                            disabled={!selectedStatus || selectedStatus === job.status}
                            className="w-full px-4 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Update Status
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-3 bg-gray-200 text-gray-800 text-base font-semibold rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateStatusModal;
