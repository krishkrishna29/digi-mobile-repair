import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';

const PromotionModal = ({ isOpen, onClose, onSave, promotion }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [expiry, setExpiry] = useState('');

    useEffect(() => {
        if (promotion) {
            setTitle(promotion.title || '');
            setDescription(promotion.description || '');
            setCode(promotion.code || '');
            setExpiry(promotion.expiry ? promotion.expiry.toDate().toISOString().split('T')[0] : '');
        } else {
            setTitle('');
            setDescription('');
            setCode('');
            setExpiry('');
        }
    }, [promotion]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ 
            title,
            description,
            code,
            expiry: expiry ? new Date(expiry) : null 
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{promotion ? 'Edit' : 'Create'} Promotion</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <XMarkIcon className="h-6 w-6 text-gray-600" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows="3" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">Discount Code</label>
                        <input type="text" id="code" value={code} onChange={e => setCode(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry Date (Optional)</label>
                        <div className="relative mt-1">
                            <input type="date" id="expiry" value={expiry} onChange={e => setExpiry(e.target.value)} className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10" />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md">Save Promotion</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Promotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPromotion, setCurrentPromotion] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'promotions'), (snapshot) => {
            const promoData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPromotions(promoData);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (promoData) => {
        try {
            if (currentPromotion) {
                await updateDoc(doc(db, 'promotions', currentPromotion.id), { ...promoData, updatedAt: serverTimestamp() });
            } else {
                await addDoc(collection(db, 'promotions'), { ...promoData, createdAt: serverTimestamp() });
            }
            setIsModalOpen(false);
            setCurrentPromotion(null);
        } catch (error) {
            console.error("Error saving promotion:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this promotion?")) {
            try {
                await deleteDoc(doc(db, 'promotions', id));
            } catch (error) {
                console.error("Error deleting promotion:", error);
            }
        }
    };

    const handleEdit = (promotion) => {
        setCurrentPromotion(promotion);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setCurrentPromotion(null);
        setIsModalOpen(true);
    };
    
    const isExpired = (expiry) => expiry && expiry.toDate() < new Date();

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Offers & Promotions</h1>
                <button onClick={handleCreate} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Promotion
                </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Promotions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promotions.filter(p => !isExpired(p.expiry)).map(promo => (
                        <div key={promo.id} className="bg-gradient-to-tr from-blue-50 to-indigo-100 p-6 rounded-lg shadow-md relative">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-gray-900">{promo.title}</h3>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleEdit(promo)} className="p-2 rounded-full hover:bg-white/50"><PencilIcon className="h-5 w-5 text-gray-600" /></button>
                                    <button onClick={() => handleDelete(promo.id)} className="p-2 rounded-full hover:bg-white/50"><TrashIcon className="h-5 w-5 text-red-500" /></button>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-2">{promo.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-lg font-mono bg-gray-200 px-3 py-1 rounded-md text-gray-700">{promo.code}</p>
                                <p className="text-sm text-gray-500">Expires: {promo.expiry ? promo.expiry.toDate().toLocaleDateString() : 'Never'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Expired Promotions</h2>
                <div className="space-y-4">
                     {promotions.filter(p => isExpired(p.expiry)).map(promo => (
                        <div key={promo.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-500">{promo.title}</h3>
                                <p className="text-gray-400 text-sm">Code: {promo.code}</p>
                            </div>
                            <p className="text-sm text-gray-400">Expired on: {promo.expiry.toDate().toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            <PromotionModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setCurrentPromotion(null); }}
                onSave={handleSave}
                promotion={currentPromotion}
            />
        </div>
    );
};

export default Promotions;
