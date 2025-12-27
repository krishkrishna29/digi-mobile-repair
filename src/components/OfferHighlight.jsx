import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/solid';

const OfferHighlight = () => {
    const [hasActivePromo, setHasActivePromo] = useState(false);

    useEffect(() => {
        const promotionsQuery = query(
            collection(db, 'promotions'),
            orderBy('createdAt', 'desc'),
            limit(1)
        );

        const unsubscribe = onSnapshot(promotionsQuery, (snapshot) => {
            if (!snapshot.empty) {
                const promoDoc = snapshot.docs[0];
                const promoData = { id: promoDoc.id, ...promoDoc.data() };

                const now = new Date();
                if (!promoData.expiryDate || promoData.expiryDate.toDate() > now) {
                    setHasActivePromo(true);
                } else {
                    setHasActivePromo(false);
                }
            } else {
                setHasActivePromo(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!hasActivePromo) return null;

    return (
        <Link 
            to="/promotions" 
            className="fixed bottom-8 right-8 z-[1000] group"
            title="View Special Offers"
        >
            <div className="relative flex items-center justify-center">
                {/* Pulsing glow effect */}
                <div className="absolute w-16 h-16 bg-red-500 rounded-full animate-ping-slow opacity-70"></div>
                
                {/* The button itself */}
                <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <SparklesIcon className="h-10 w-10 text-white" />
                </div>

                {/* Text Label */}
                <span className="absolute -top-6 -left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                    OFFER!
                </span>
            </div>
        </Link>
    );
};

export default OfferHighlight;
