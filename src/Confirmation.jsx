import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const Confirmation = () => {
    const location = useLocation();
    const { repairId, repairMode, otp } = location.state || {};

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <div className="bg-slate-800 p-10 rounded-2xl shadow-2xl max-w-lg w-full text-center">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-4xl font-extrabold text-white mb-4">Request Submitted!</h1>
                <p className="text-gray-300 text-lg mb-8">
                    Your repair request has been successfully submitted. 
                    You will receive an email shortly with the details.
                </p>
                <div className="bg-slate-700/50 p-6 rounded-lg space-y-4 mb-8">
                    <p className="text-lg">Your Repair ID is: <strong className="text-blue-400 font-mono">{repairId}</strong></p>
                    {repairMode === 'home-pickup' && otp && (
                        <p className="text-lg">Your OTP for home pickup is: <strong className="text-yellow-400 font-mono">{otp}</strong></p>
                    )}
                </div>
                <Link to="/dashboard" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Confirmation;
