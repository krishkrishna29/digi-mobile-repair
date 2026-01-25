import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Invoice from '../components/Invoice';

const RepairDetailsPage = () => {
    const { repairId } = useParams();
    const [repair, setRepair] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showInvoice, setShowInvoice] = useState(false);

    useEffect(() => {
        const fetchRepair = async () => {
            try {
                const repairRef = doc(db, 'repairs', repairId);
                const docSnap = await getDoc(repairRef);
                if (docSnap.exists()) {
                    setRepair({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such repair found!");
                }
            } catch (error) {
                console.error("Error fetching repair details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRepair();
    }, [repairId]);

    if (loading) {
        return <div className="text-center p-8">Loading repair details...</div>;
    }

    if (!repair) {
        return <div className="text-center p-8">Repair not found.</div>;
    }

    return (
        <div className="container mx-auto p-8">
            {showInvoice ? (
                <Invoice repair={repair} onBack={() => setShowInvoice(false)} />
            ) : (
                <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-white mb-6">Repair Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                        <p><strong className="text-gray-400">Customer:</strong> {repair.customerName}</p>
                        <p><strong className="text-gray-400">Device:</strong> {repair.device}</p>
                        <p><strong className="text-gray-400">Issue:</strong> {repair.issue}</p>
                        <p><strong className="text-gray-400">Status:</strong> <span className={`px-3 py-1 rounded-full text-sm font-semibold ${repair.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`}>{repair.status}</span></p>
                        <p><strong className="text-gray-400">Cost:</strong> ${repair.cost}</p>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <Link to="/admin/repairs" className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg">Back to List</Link>
                        <button onClick={() => setShowInvoice(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Generate Invoice
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RepairDetailsPage;
