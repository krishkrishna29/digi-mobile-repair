
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OTPVerification = () => {
    const location = useLocation();
    const { otp, repairId } = location.state || {};

    if (!otp) {
        return (
            <div className="bg-slate-800 p-8 rounded-xl shadow-lg max-w-lg mx-auto text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p>No OTP found for this repair. Please check your repair details.</p>
                <Link to="/user-dashboard" className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg max-w-lg mx-auto text-white text-center">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">Secure Handover OTP</h2>
            <p className="text-gray-300 mb-6">Please share this One-Time Password with the pickup executive to verify the handover.</p>
            
            <div className="bg-slate-900 p-6 rounded-lg inline-block border-2 border-dashed border-orange-400">
                <p className="text-5xl font-mono font-bold tracking-widest text-white">{otp}</p>
            </div>

            <div className="mt-6">
                <p className="text-gray-400">For Repair Job ID:</p>
                <p className="text-lg font-mono font-semibold tracking-wider">{repairId}</p>
            </div>

            <div className="mt-8 text-sm text-gray-500">
                <p>This OTP is valid for this pickup only. Do not share it with anyone other than the authorized pickup personnel.</p>
            </div>

            <Link to="/user-dashboard" className="mt-8 inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Back to Dashboard
            </Link>
        </div>
    );
};

export default OTPVerification;
