
import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const statusSteps = [
    'Pending',
    'Picked Up',
    'Diagnosed',
    'Repairing',
    'Ready',
    'Completed'
];

const RepairStatusTimeline = ({ history }) => {
    // We want to find the furthest reached status in our predefined steps
    const reachedStatuses = history.map(h => h.status);
    
    // Find the index of the furthest status in our statusSteps array
    let furthestIndex = -1;
    statusSteps.forEach((step, index) => {
        if (reachedStatuses.includes(step)) {
            furthestIndex = index;
        }
    });

    return (
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-white mb-8">Repair Progress</h3>
            <div className="relative flex items-center justify-between">
                {/* Connecting Line Background */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-700 -z-0"></div>
                
                {/* Active Connecting Line */}
                <div 
                    className="absolute top-5 left-0 h-0.5 bg-green-500 transition-all duration-500 -z-0"
                    style={{ width: `${(furthestIndex / (statusSteps.length - 1)) * 100}%` }}
                ></div>

                {statusSteps.map((status, index) => {
                    const isReached = reachedStatuses.includes(status);
                    const isCompleted = index <= furthestIndex;
                    
                    // Find the latest timestamp for this specific status
                    const statusEntry = [...history].reverse().find(h => h.status === status);
                    const timestamp = statusEntry?.timestamp?.toDate ? statusEntry.timestamp.toDate() : (statusEntry?.timestamp ? new Date(statusEntry.timestamp) : null);

                    return (
                        <div key={status} className="relative z-10 flex flex-col items-center group">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                    isCompleted 
                                        ? 'bg-green-500 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                                        : 'bg-slate-800 border-slate-600'
                                }`}
                            >
                                {isCompleted ? (
                                    <CheckIcon className="h-6 w-6 text-white" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                                )}
                            </div>
                            
                            <div className="absolute top-12 w-32 text-center">
                                <p className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                                    isCompleted ? 'text-white' : 'text-gray-500'
                                }`}>
                                    {status}
                                </p>
                                {timestamp && (
                                     <p className="text-[10px] text-gray-500 mt-1 font-mono">
                                        {timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                     </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Legend or extra info space */}
            <div className="mt-20"></div>
        </div>
    );
};

export default RepairStatusTimeline;
