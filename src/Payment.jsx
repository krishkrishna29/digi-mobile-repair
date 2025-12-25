import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const Payment = () => {
    const { repairId } = useParams();
    const navigate = useNavigate();
    const [repair, setRepair] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(() => {
        const fetchRepair = async () => {
            try {
                const repairRef = doc(db, 'repairs', repairId);
                const repairSnap = await getDoc(repairRef);

                if (repairSnap.exists()) {
                    setRepair({ id: repairSnap.id, ...repairSnap.data() });
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (repairId) {
            fetchRepair();
        }
    }, [repairId]);

    const handlePayment = async () => {
        try {
            const repairRef = doc(db, 'repairs', repairId);
            await updateDoc(repairRef, {
                paymentStatus: 'paid'
            });
            setPaymentStatus('success');
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (error) {
            console.error("Error updating document: ", error);
            setPaymentStatus('error');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!repair) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-900 text-white">
                <h2 className="text-2xl">Repair not found.</h2>
            </div>
        );
    }

    if (paymentStatus === 'success') {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-900 text-white text-center">
                <CheckCircleIcon className="h-24 w-24 text-green-500 mb-4" />
                <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-lg">You will be redirected to your dashboard shortly.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800 shadow-xl rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Bill Summary</h2>
                <div className="space-y-4 text-white">
                    <div className="flex justify-between">
                        <span className="font-semibold text-slate-400">Repair ID:</span>
                        <span className="font-mono text-sm">{repair.id.substring(0, 10)}...</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-slate-400">Device:</span>
                        <span>{repair.device}</span>
                    </div>
                    <div className="border-t border-slate-700 my-4"></div>
                    <div className="flex justify-between text-2xl font-bold">
                        <span className="text-slate-300">Total Amount:</span>
                        <span className="text-green-400">₹{repair.totalAmount?.toFixed(2)}</span>
                    </div>
                </div>
                <div className="mt-8">
                    <button 
                        onClick={handlePayment}
                        className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Pay Now
                    </button>
                    {paymentStatus === 'error' && (
                        <p className="text-red-400 text-center mt-4">Payment failed. Please try again.</p>
                    )}
                </div>
                 <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full mt-4 bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Payment;
