import React, { useState, useEffect } from 'react';
import { arrayUnion, serverTimestamp } from 'firebase/firestore';

const UpdateStatusModal = ({ isOpen, onClose, onUpdateStatus, job }) => {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Online Payment');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (job) {
            setSelectedStatus(job.status || '');
            setAmount(job.totalAmount || '');
            setPaymentMethod(job.paymentMethod || 'Online Payment');
        }
    }, [job]);

    if (!isOpen || !job) {
        return null;
    }

    const handleUpdate = () => {
        if (!selectedStatus) {
            alert('A valid status must be selected.');
            return;
        }

        const dataToUpdate = {
            status: selectedStatus,
            statusHistory: arrayUnion({
                status: selectedStatus,
                timestamp: new Date(),
                notes: notes || `Status updated to ${selectedStatus}`
            })
        };

        if (selectedStatus === 'Completed') {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                alert('A valid positive amount is required when status is Completed.');
                return;
            }
            dataToUpdate.totalAmount = parsedAmount;
            dataToUpdate.paymentMethod = paymentMethod;
            dataToUpdate.paymentStatus = 'pending';
        }

        onUpdateStatus(job, dataToUpdate);
        onClose();
    };

    const statuses = ['Pending', 'Picked Up', 'Diagnosed', 'Repairing', 'Ready', 'Completed', 'Cancelled'];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto p-6 border w-full max-w-lg shadow-xl rounded-2xl bg-white">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">Update Repair Status</h3>
                    <div className="mt-4 space-y-4 text-left p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Device</p>
                                <p className="text-sm font-semibold text-gray-800">{job.deviceBrand} {job.deviceModel}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Current Status</p>
                                <p className="text-sm font-semibold text-gray-800">{job.status}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                        <div className="text-left">
                            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-2">Select New Status</label>
                            <select
                                id="status-select"
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="" disabled>Select a status</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div className="text-left">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Status Notes (Optional)</label>
                            <textarea
                                id="notes"
                                rows="2"
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add some notes about this update..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {selectedStatus === 'Completed' && (
                        <div className="mt-4 space-y-4 text-left p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 text-left mb-2">Final Invoice Amount</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                                    <input
                                        id="amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full p-3 pl-7 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter amount"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 text-left mb-2">Payment Method</label>
                                <select
                                    id="paymentMethod"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Online Payment">Online Payment</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col space-y-3">
                        <button
                            onClick={handleUpdate}
                            disabled={!selectedStatus || (selectedStatus === 'Completed' && !amount)}
                            className="w-full px-4 py-3 bg-blue-600 text-white text-base font-bold rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform active:scale-95"
                        >
                            Confirm Update
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-3 bg-gray-100 text-gray-600 text-base font-semibold rounded-xl hover:bg-gray-200 transition-colors"
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