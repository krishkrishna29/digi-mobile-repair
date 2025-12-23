import React, { useState } from 'react';

const UpdateStatusModal = ({ isOpen, onClose, onUpdateStatus, job }) => {
    const [selectedStatus, setSelectedStatus] = useState(job?.status || '');

    if (!isOpen) {
        return null;
    }

    const handleUpdate = () => {
        if (selectedStatus && job) {
            onUpdateStatus(job.id, job.userId, job.device, selectedStatus);
            onClose();
        }
    };

    const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-black">Update Repair Status</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-black">
                            Update the status for device "{job?.device}".
                        </p>
                        <select
                            className="mt-4 w-full p-2 border border-gray-300 rounded-md text-gray-700"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="" className="text-gray-700">Select Status</option>
                            {statuses.map((status) => (
                                <option key={status} value={status} className="text-gray-700">{status}</option>
                            ))}
                        </select>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={handleUpdate}
                            disabled={!selectedStatus || selectedStatus === job?.status}
                            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
                        >
                            Update Status
                        </button>
                        <button
                            onClick={onClose}
                            className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
