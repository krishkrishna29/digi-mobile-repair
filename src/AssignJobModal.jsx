import React, { useState } from 'react';

const AssignJobModal = ({ isOpen, onClose, onAssign, technicians, job }) => {
    const [selectedTechnician, setSelectedTechnician] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleAssign = () => {
        if (selectedTechnician) {
            onAssign(job.id, selectedTechnician);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Repair Job</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">
                            Assign job for device "{job?.device}" to a technician.
                        </p>
                        <select
                            className="mt-4 w-full p-2 border border-gray-300 rounded-md"
                            value={selectedTechnician}
                            onChange={(e) => setSelectedTechnician(e.target.value)}
                        >
                            <option value="">Select Technician</option>
                            {technicians.map((tech) => (
                                <option key={tech.id} value={tech.id}>{tech.fullName || tech.email}</option>
                            ))}
                        </select>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={handleAssign}
                            disabled={!selectedTechnician}
                            className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300"
                        >
                            Assign
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

export default AssignJobModal;
