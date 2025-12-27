import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './firebase';

const Chat = ({ repairId, user, isAdmin }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (!repairId) return;

        const q = query(collection(db, `repairs/${repairId}/messages`), orderBy('createdAt'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() });
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [repairId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        await addDoc(collection(db, `repairs/${repairId}/messages`), {
            text: newMessage,
            senderId: user.uid,
            senderName: isAdmin ? 'Admin' : user.displayName || 'User',
            createdAt: serverTimestamp(),
        });

        setNewMessage('');
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-bold mb-4">Chat</h3>
            <div className="h-64 overflow-y-auto mb-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`p-2 my-2 rounded-lg ${msg.senderId === user.uid ? 'bg-blue-600 self-end' : 'bg-slate-700 self-start'}`}>
                        <p className="text-sm font-bold">{msg.senderName}</p>
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs text-gray-400 text-right">
                            {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString() : 'Sending...'}
                        </p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-slate-700 p-2 rounded-l-lg"
                    placeholder="Type a message..."
                />
                <button type="submit" className="bg-blue-600 px-4 rounded-r-lg">Send</button>
            </form>
        </div>
    );
};

export default Chat;
