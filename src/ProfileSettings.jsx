
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const ProfileSettings = () => {
    const { currentUser } = useAuth();
    const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
    const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
    const [address, setAddress] = useState(currentUser?.address || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Update Firebase Auth profile
            await updateProfile(currentUser, { displayName });

            // Update Firestore user document
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, { 
                fullName: displayName, 
                phoneNumber,
                address
            });
            
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile: ", error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={currentUser?.email || ''}
                        disabled
                        className="w-full bg-slate-700/50 border-slate-600 rounded-lg p-3 text-gray-400 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                    <textarea
                        id="address"
                        rows="3"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 transition"
                    ></textarea>
                </div>
                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400 disabled:cursor-wait">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
                {message && <p className={`mt-4 text-center text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
            </form>
        </div>
    );
};

export default ProfileSettings;
