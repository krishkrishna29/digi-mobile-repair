import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Invoice = ({ repair, onBack }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settingsRef = doc(db, 'settings', 'invoice');
                const docSnap = await getDoc(settingsRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching invoice settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="text-center p-8">Loading invoice...</div>;
    }

    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl mx-auto font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">{settings?.shopName || 'Your Company'}</h1>
                    <p className="text-gray-600">{settings?.address}</p>
                    <p className="text-gray-600">{settings?.email}</p>
                    <p className="text-gray-600">{settings?.phone}</p>
                </div>
                <h2 className="text-5xl font-light text-gray-700">INVOICE</h2>
            </div>

            {/* Customer & Invoice Details */}
            <div className="flex justify-between mb-12">
                <div>
                    <h3 className="font-bold text-gray-800 mb-2">BILL TO</h3>
                    <p>{repair.customerName}</p>
                    {/* Add more customer details if available */}
                </div>
                <div className="text-right">
                    <p><strong className="font-semibold">Invoice #:</strong> {repair.id.substring(0, 8)}</p>
                    <p><strong className="font-semibold">Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-8">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="text-left p-3">Description</th>
                        <th className="text-right p-3">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b">
                        <td className="p-3">Repair for {repair.device} - {repair.issue}</td>
                        <td className="text-right p-3">${repair.cost.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end mb-12">
                <div className="text-right">
                    <p className="text-2xl font-bold">Total: ${repair.cost.toFixed(2)}</p>
                </div>
            </div>

            {/* Footer & Warranty */}
            <div className="border-t pt-8 text-gray-600 text-sm">
                <h4 className="font-bold mb-2">Warranty Information</h4>
                <p>{settings?.warrantyInfo}</p>
                <p className="mt-4 text-center text-xs">Thank you for your business!</p>
            </div>

            {/* Action Buttons (No Print) */}
            <div className="mt-8 flex justify-end gap-4 print:hidden">
                <button onClick={onBack} className="text-white bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg">Back</button>
                <button onClick={handlePrint} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                    Print Invoice
                </button>
            </div>
        </div>
    );
};

export default Invoice;
