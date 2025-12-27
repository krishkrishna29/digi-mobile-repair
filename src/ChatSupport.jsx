import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import Chat from './Chat';

const ChatSupport = () => {
    const { currentUser, isAdmin } = useAuth();
    const [repairs, setRepairs] = useState([]);
    const [selectedRepair, setSelectedRepair] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        let repairsQuery;
        if (isAdmin) {
            // Admin can see all chats
            repairsQuery = query(collection(db, 'repairs'));
        } else {
            // User can only see their own chats
            repairsQuery = query(collection(db, 'repairs'), where('userId', '==', currentUser.uid));
        }

        const unsubscribe = onSnapshot(repairsQuery, (snapshot) => {
            const repairsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRepairs(repairsData);
            if (repairsData.length > 0) {
                setSelectedRepair(repairsData[0]);
            }
        });

        return () => unsubscribe();
    }, [currentUser, isAdmin]);

    return (
        <div className="flex h-screen bg-slate-900 text-white">
            <div className="w-1/3 bg-slate-800 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">My Chats</h2>
                <ul>
                    {repairs.map(repair => (
                        <li key={repair.id} onClick={() => setSelectedRepair(repair)} className={`p-2 rounded-lg cursor-pointer ${selectedRepair?.id === repair.id ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                            <p className="font-bold">{repair.deviceBrand} {repair.deviceModel}</p>
                            <p className="text-sm text-gray-400">{repair.id.substring(0, 10)}...</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/3 p-4">
                {selectedRepair ? (
                    <Chat repairId={selectedRepair.id} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p>Select a chat to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSupport;
