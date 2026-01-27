import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AssignDeliveryModal = ({ isOpen, repair, onClose, onAssign }) => {
    const [deliveryPartners, setDeliveryPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchDeliveryPartners = async () => {
                try {
                    const q = query(collection(db, 'users'), where('role', '==', 'delivery'));
                    const querySnapshot = await getDocs(q);
                    const partners = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setDeliveryPartners(partners);
                } catch (error) {
                    toast.error("Failed to fetch delivery partners.");
                }
            };
            fetchDeliveryPartners();
        }
    }, [isOpen]);

    const handleAssign = () => {
        if (!selectedPartner) {
            toast.error('Please select a delivery partner.');
            return;
        }
        const partner = deliveryPartners.find(p => p.id === selectedPartner);
        onAssign(repair.id, partner);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-lg">
                <h2 className="text-3xl font-bold mb-6 text-white text-center">Assign Delivery Partner</h2>
                <div className="mb-6">
                    <label htmlFor="partner" className="block text-lg font-medium text-gray-300 mb-2">
                        Select Delivery Partner
                    </label>
                    <select
                        id="partner"
                        value={selectedPartner}
                        onChange={(e) => setSelectedPartner(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    >
                        <option value="" disabled>-- Choose a Partner --</option>
                        {deliveryPartners.map(partner => (
                            <option key={partner.id} value={partner.id}>
                                {partner.fullName} ({partner.email})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors text-base font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-base font-semibold"
                    >
                        Confirm Assignment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignDeliveryModal;
