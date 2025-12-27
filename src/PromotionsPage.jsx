import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase';

const PromotionsPage = () => {
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'promotions'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const promos = [];
            querySnapshot.forEach((doc) => {
                promos.push({ id: doc.id, ...doc.data() });
            });
            setPromotions(promos);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-purple-400">Offers & Promotions</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {promotions.map((promo) => (
                        <div key={promo.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            <img src={promo.imageUrl || 'https://via.placeholder.com/400x200'} alt={promo.title} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-2 text-purple-300">{promo.title}</h2>
                                <p className="text-gray-400 mb-4">{promo.description}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        <p>Coupon: <span className="font-bold text-yellow-400">{promo.couponCode}</span></p>
                                        {promo.expiryDate && (
                                            <p>Expires on: <span className="font-semibold">{new Date(promo.expiryDate.seconds * 1000).toLocaleDateString()}</span></p>
                                        )}
                                    </div>
                                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                                        Claim Offer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PromotionsPage;
