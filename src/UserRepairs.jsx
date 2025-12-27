import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import RepairStatusTimeline from './RepairStatusTimeline';
import Chat from './Chat'; // Import the Chat component
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const getStatusChip = (status) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center";
    switch (status) {
        case 'Completed':
            return <span className={`${baseClasses} bg-green-500/20 text-green-300`}>{status}</span>;
        case 'Repairing':
        case 'In Progress':
            return <span className={`${baseClasses} bg-blue-500/20 text-blue-300`}>{status}</span>;
        case 'Pending':
        case 'Diagnosed': // Awaiting customer approval
             return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-300`}>{status}</span>;
        case 'Cancelled':
             return <span className={`${baseClasses} bg-red-500/20 text-red-300`}>{status}</span>;
        default:
            return <span className={`${baseClasses} bg-gray-500/20 text-gray-300`}>{status}</span>;
    }
};

const UserRepairs = ({ repairs, onPayNow }) => {
    const navigate = useNavigate();
    const [selectedRepairId, setSelectedRepairId] = useState(null);

    const handleToggleDetails = (repairId) => {
        setSelectedRepairId(selectedRepairId === repairId ? null : repairId);
    };

    const handleCostApproval = async (repairId, isApproved) => {
        const confirmationMessage = isApproved
            ? "Are you sure you want to approve this cost? The repair process will begin."
            : "Are you sure you want to decline this cost? The repair request will be cancelled.";

        if (!window.confirm(confirmationMessage)) {
            return;
        }

        const repairRef = doc(db, 'repairs', repairId);
        const newStatus = isApproved ? 'Repairing' : 'Cancelled';
        
        try {
            await updateDoc(repairRef, {
                status: newStatus,
                statusHistory: arrayUnion({
                    status: newStatus,
                    timestamp: serverTimestamp(),
                    notes: isApproved ? 'Customer approved the estimated cost.' : 'Customer declined the estimated cost.'
                })
            });
            alert(`Repair has been ${isApproved ? 'approved and moved to repairing' : 'cancelled'}.`);
            setSelectedRepairId(null);
        } catch (error) {
            console.error("Error updating status: ", error);
            alert(`Failed to update status: ${error.message}`);
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">My Repair History</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 font-semibold uppercase text-sm border-b border-slate-700">
                            <th className="py-3 px-4">Repair ID</th>
                            <th className="py-3 px-4">Device</th>
                            <th className="py-3 px-4">Issue</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Date Submitted</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {repairs && repairs.map(repair => (
                            <React.Fragment key={repair.id}>
                                <tr className="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="py-4 px-4 font-mono text-sm">{repair.id.substring(0, 10)}...</td>
                                    <td className="py-4 px-4">{repair.deviceModel} ({repair.deviceBrand})</td>
                                    <td className="py-4 px-4">{repair.issueCategory}</td>
                                    <td className="py-4 px-4">{getStatusChip(repair.status)}</td>
                                    <td className="py-4 px-4">{repair.createdAt?.toDate().toLocaleDateString()}</td>
                                    <td className="py-4 px-4 text-center">
                                        {(repair.status === 'Completed' || repair.status === 'Payment Pending') && (
                                            <button 
                                                onClick={() => onPayNow(repair)} 
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md">
                                                Pay Now
                                            </button>
                                        )}
                                        <button onClick={() => handleToggleDetails(repair.id)} className="ml-4 inline-flex items-center">
                                            {selectedRepairId === repair.id ? <ChevronUpIcon className="h-5 w-5"/> : <ChevronDownIcon className="h-5 w-5"/>}
                                        </button>
                                    </td>
                                </tr>
                                {selectedRepairId === repair.id && (
                                    <tr className="bg-slate-800/50">
                                        <td colSpan="6" className="p-6 border-b-2 border-slate-700">
                                            <RepairStatusTimeline history={repair.statusHistory || [{ status: repair.status, timestamp: repair.createdAt }]} />
                                            
                                            {repair.status === 'Diagnosed' && (
                                                <div className="mt-6 bg-slate-700/50 p-6 rounded-lg text-center ring-1 ring-yellow-500/50">
                                                    <h4 className="font-bold text-lg text-white">Action Required: Cost Approval</h4>
                                                    <p className="text-gray-300 my-2">Our technicians have diagnosed the issue. The revised estimated cost is <span className="font-bold text-xl text-yellow-400">₹{repair.estimatedCost || '1,800'}</span>.</p>
                                                    <p className="text-gray-400 text-sm mb-4">Please approve to proceed with the repair. This decision is final.</p>
                                                    <div className="flex justify-center space-x-4">
                                                        <button 
                                                            onClick={() => handleCostApproval(repair.id, true)} 
                                                            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                                            Approve Cost
                                                        </button>
                                                        <button 
                                                            onClick={() => handleCostApproval(repair.id, false)} 
                                                            className="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                                            Decline & Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            <Chat repairId={repair.id} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserRepairs;
