import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const InvoiceSettings = () => {
    const { currentUser, loading: authLoading } = useAuth(); 
    const [settings, setSettings] = useState({
        shopName: '',
        address: '',
        email: '',
        phone: '',
        warrantyInfo: ''
    });
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const fetchAndCreateSettings = async () => {
            if (authLoading) return; // Wait for authentication to be resolved
            if (!currentUser) {
                setPageLoading(false);
                return; // No user, no settings to fetch
            }

            const settingsRef = doc(db, 'settings', 'invoice');
            try {
                const docSnap = await getDoc(settingsRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data());
                } else {
                    // If the document doesn't exist, create it with default values.
                    // This makes the app self-healing.
                    console.log("Invoice settings not found, creating with default values.");
                    const defaultSettings = {
                        shopName: "Your Shop Name",
                        address: "123 Tech Street, Suite 101",
                        email: "contact@yourshop.com",
                        phone: "(555) 123-4567",
                        warrantyInfo: "All repairs include a 90-day warranty on parts and labor."
                    };
                    await setDoc(settingsRef, defaultSettings);
                    setSettings(defaultSettings);
                }
            } catch (error) {
                console.error("Error fetching or creating invoice settings:", error);
                toast.error("Couldn't load invoice settings.");
            } finally {
                setPageLoading(false);
            }
        };

        fetchAndCreateSettings();
    }, [currentUser, authLoading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error("You must be logged in to save settings.");
            return;
        }

        const toastId = toast.loading('Saving settings...');
        try {
            const settingsRef = doc(db, 'settings', 'invoice');
            await setDoc(settingsRef, settings, { merge: true });
            toast.success('Settings saved successfully!', { id: toastId });
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error(`Failed to save settings: ${error.message}`, { id: toastId });
        }
    };

    if (authLoading || pageLoading) {
        return <div className="flex justify-center items-center h-full p-8"><p>Loading settings...</p></div>;
    }

    if (!currentUser) {
        return <div className="text-center p-8 text-red-500">Please log in to manage invoice settings.</div>
    }

    return (
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Edit Invoice Details</h2>
            <form onSubmit={handleSave} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="shopName" className="block text-sm font-medium text-gray-300 mb-2">Shop Name</label>
                        <input
                            type="text"
                            name="shopName"
                            id="shopName"
                            value={settings.shopName}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Support Phone</label>
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={settings.phone}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Support Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={settings.email}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">Shop Address</label>
                    <textarea
                        name="address"
                        id="address"
                        rows="3"
                        value={settings.address}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="warrantyInfo" className="block text-sm font-medium text-gray-300 mb-2">Warranty Information</label>
                    <textarea
                        name="warrantyInfo"
                        id="warrantyInfo"
                        rows="4"
                        value={settings.warrantyInfo}
                        onChange={handleChange}
                        placeholder="e.g., All repairs come with a 90-day warranty on parts and labor."
                        className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceSettings;
