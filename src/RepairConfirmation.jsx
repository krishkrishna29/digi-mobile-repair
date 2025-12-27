import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { QRCode } from 'react-qr-code';

const RepairConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { repairId, repairMode, otp } = location.state || {};

    if (!repairId) {
        return (
            <div className="bg-slate-800 p-8 rounded-xl shadow-lg max-w-lg mx-auto text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p>No repair ID found. Please submit a new request.</p>
                <Link to="/user-dashboard" className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    const handleViewOtp = () => {
        navigate('/otp-verification', { state: { otp, repairId } });
    };

    return (
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg max-w-lg mx-auto text-white text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Repair Request Submitted!</h2>
            <p className="text-gray-300 mb-6">Please present this QR code for in-store drop-off or to the technician for home pickup.</p>
            
            <div className="bg-white p-6 rounded-lg inline-block">
                <QRCode 
                    value={repairId}
                    size={256}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                />
            </div>

            <div className="mt-6">
                <p className="text-gray-400">Your Repair Job ID is:</p>
                <p className="text-2xl font-mono font-bold tracking-wider">{repairId}</p>
            </div>

            {repairMode === 'home-pickup' && otp && (
                <button 
                    onClick={handleViewOtp}
                    className="mt-8 bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors w-full">
                    View Handover OTP
                </button>
            )}

            <Link to="/user-dashboard" className="mt-4 inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
                Back to Dashboard
            </Link>
        </div>
    );
};

export default RepairConfirmation;
