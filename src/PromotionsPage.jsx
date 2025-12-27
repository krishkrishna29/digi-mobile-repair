import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { TicketIcon } from '@heroicons/react/24/solid';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const promotionsQuery = query(
      collection(db, 'promotions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(promotionsQuery, (snapshot) => {
      const promos = snapshot.docs.map(doc => {
        const data = doc.data();
        const expiryDate = data.expiryDate ? data.expiryDate.toDate() : null;
        return { id: doc.id, ...data, expiryDate };
      });

      const now = new Date();
      const activePromos = promos.filter(p => !p.expiryDate || p.expiryDate > now);
      
      setPromotions(activePromos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 flex items-center justify-center">
          <TicketIcon className="h-10 w-10 mr-4 text-yellow-400" />
          Special Offers & Promotions
        </h1>

        {loading ? (
          <div className="text-center">
            <p className="text-xl">Loading promotions...</p>
          </div>
        ) : promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map(promo => (
              <div key={promo.id} className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg shadow-lg p-6 flex flex-col justify-between transform hover:-translate-y-2 transition-transform duration-300">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{promo.title}</h2>
                  <p className="text-gray-300 mb-4">{promo.description}</p>
                </div>
                <div className="mt-4">
                  <p className="text-yellow-400 font-bold text-lg">Code: {promo.promoCode}</p>
                  {promo.expiryDate && (
                    <p className="text-gray-400 text-sm mt-1">
                      Expires on: {promo.expiryDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl">No active promotions at the moment. Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;
