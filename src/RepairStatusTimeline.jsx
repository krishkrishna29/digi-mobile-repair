
import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const statusSteps = [
    'Requested',
    'Picked Up',
    'Diagnosed',
    'Repairing',
    'Ready',
    'Delivered'
];

const RepairStatusTimeline = ({ history }) => {
    // Create a map of status to the latest timestamp for that status
    const statusTimestamps = history.reduce((acc, entry) => {
        acc[entry.status] = entry.timestamp?.toDate();
        return acc;
    }, {});
    
    const currentStatusIndex = statusSteps.indexOf(Object.keys(statusTimestamps).pop());

    return (
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6">Repair Progress</h3>
            <div className="flex items-center">
                {statusSteps.map((status, index) => {
                    const isCompleted = status in statusTimestamps;
                    const isActive = index === currentStatusIndex;
                    const timestamp = statusTimestamps[status];

                    return (
                        <React.Fragment key={status}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                        isCompleted ? 'bg-green-500 border-green-500' : 'bg-slate-700 border-slate-600'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckIcon className="h-6 w-6 text-white" />
                                    ) : (
                                        <span className="text-gray-400">{index + 1}</span>
                                    )}
                                </div>
                                <p className={`mt-2 text-xs text-center ${isCompleted ? 'text-white font-semibold' : 'text-gray-400'}`}>
                                    {status}
                                </p>
                                {timestamp && (
                                     <p className="text-xs text-gray-500 mt-1">{timestamp.toLocaleDateString()}</p>
                                )}
                            </div>
                            {index < statusSteps.length - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-2 ${
                                        isCompleted ? 'bg-green-500' : 'bg-slate-600'
                                    }`}
                                ></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default RepairStatusTimeline;
