import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import { Switch } from '@headlessui/react';
import { BuildingStorefrontIcon, TruckIcon, ShareIcon } from '@heroicons/react/24/outline';
import TimeSlotPicker from './TimeSlotPicker';

const issueCategories = {
    "Screen": ["Cracked screen", "Flickering display", "Unresponsive touch"],
    "Battery": ["Not charging", "Drains quickly", "Swollen battery"],
    "Software": ["Stuck on logo", "App crashing", "System slow"],
    "Camera": ["Blurry photos", "Camera app not opening"],
};

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const NewRepairRequest = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const [repairMode, setRepairMode] = useState('in-store');
    const [deviceBrand, setDeviceBrand] = useState('');
    const [deviceModel, setDeviceModel] = useState('');
    const [imei, setImei] = useState('');
    const [issueCategory, setIssueCategory] = useState('');
    const [subIssue, setSubIssue] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [pickupAddress, setPickupAddress] = useState('');
    const [pickupCity, setPickupCity] = useState('');
    const [pickupPincode, setPickupPincode] = useState('');
    const [dropoffTime, setDropoffTime] = useState('');
    const [locationUrl, setLocationUrl] = useState('');
    const [isLocationShared, setIsLocationShared] = useState(false);
    const [locationError, setLocationError] = useState('');

    const [loading, setLoading] = useState(false);
    const [imeiWarning, setImeiWarning] = useState('');

    useEffect(() => {
        setSubIssue('');
    }, [issueCategory]);

    const handleShareLocation = () => {
        setLocationError('');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    setLocationUrl(url);
                    setIsLocationShared(true);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    setLocationError("Could not get your location. Please check your browser/OS settings and grant permission.");
                    setIsLocationShared(false);
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
        }
    };
    
    const checkImei = async (imeiValue) => {
        if (imeiValue.length < 15) {
            setImeiWarning('');
            return;
        }
        
        const repairsRef = collection(db, "repairs");
        const q = query(repairsRef, where("imei", "==", imeiValue));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            setImeiWarning("Warning: A device with this IMEI/Serial already exists.");
        } else {
            setImeiWarning("");
        }
    };
    
    const handleImeiChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if(value.length <= 15) {
            setImei(value);
            checkImei(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser || !dropoffTime) {
            alert("Please select a time slot before submitting.");
            return;
        }
        if (repairMode === 'home-pickup' && !isLocationShared) {
            alert("Home pickup requires a shared location. Please click the 'Share Current Location' button before submitting.");
            return;
        }

        setLoading(true);
        let otp = null;
        if (repairMode === 'home-pickup') {
            otp = generateOtp();
        }

        try {
            const repairData = {
                userId: currentUser.uid,
                repairMode,
                deviceBrand,
                deviceModel,
                imei,
                issueCategory,
                subIssue,
                issueDescription,
                pickupAddress: repairMode === 'home-pickup' ? { address: pickupAddress, city: pickupCity, pincode: pickupPincode, locationUrl: locationUrl } : null,
                preferredSlot: dropoffTime, // Use the dropoffTime string directly
                status: 'Requested',
                createdAt: serverTimestamp(),
                otp: otp,
                statusHistory: [], // Initialize as an empty array
            };

            const docRef = await addDoc(collection(db, 'repairs'), repairData);
            
            const repairDocRef = doc(db, 'repairs', docRef.id);
            await updateDoc(repairDocRef, {
                statusHistory: arrayUnion({ status: 'Requested', timestamp: serverTimestamp() })
            });

            navigate('/confirmation', { state: { repairId: docRef.id, repairMode, otp } });

            try {
                await addDoc(collection(db, 'notifications'), {
                    userId: 'admin',
                    type: 'repair_request_new',
                    title: 'New Repair Request',
                    message: `A new repair for a ${deviceBrand} ${deviceModel} has been submitted by a customer.`,
                    read: false,
                    createdAt: serverTimestamp(),
                    relatedRepairId: docRef.id
                });
            } catch (notificationError) {
                console.error("Error sending notification:", notificationError);
            }

        } catch (error) {
            console.error("Error adding document: ", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg max-w-4xl mx-auto text-white">
            <h2 className="text-2xl font-bold mb-6">Submit a New Repair Request</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-center items-center space-x-4 bg-slate-700/50 p-2 rounded-lg">
                    <BuildingStorefrontIcon className={`h-6 w-6 ${repairMode === 'in-store' ? 'text-blue-400' : 'text-gray-400'}`} />
                    <span className={`${repairMode === 'in-store' ? 'text-white' : 'text-gray-400'}`}>In-Store Drop-off</span>
                    <Switch
                        checked={repairMode === 'home-pickup'}
                        onChange={() => setRepairMode(repairMode === 'in-store' ? 'home-pickup' : 'in-store')}
                        className={`${repairMode === 'home-pickup' ? 'bg-blue-600' : 'bg-slate-600'} relative inline-flex h-7 w-14 items-center rounded-full transition-colors`}>
                        <span className="sr-only">Enable Home Pickup</span>
                        <span className={`${repairMode === 'home-pickup' ? 'translate-x-8' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}/>
                    </Switch>
                    <span className={`${repairMode === 'home-pickup' ? 'text-white' : 'text-gray-400'}`}>Home Pickup</span>
                    <TruckIcon className={`h-6 w-6 ${repairMode === 'home-pickup' ? 'text-blue-400' : 'text-gray-400'}`} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Device Brand</label>
                        <input type="text" value={deviceBrand} onChange={e => setDeviceBrand(e.target.value)} required minLength="2" maxLength="50" className="w-full bg-slate-700 p-3 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Device Model</label>
                        <input type="text" value={deviceModel} onChange={e => setDeviceModel(e.target.value)} required minLength="2" maxLength="50" className="w-full bg-slate-700 p-3 rounded-lg" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">IMEI / Serial Number (15 digits)</label>
                    <input type="text" value={imei} onChange={handleImeiChange} placeholder="Enter 15-digit IMEI to check device history" className="w-full bg-slate-700 p-3 rounded-lg" />
                    {imeiWarning && <p className="text-yellow-400 text-xs mt-2">{imeiWarning}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Issue Category</label>
                        <select value={issueCategory} onChange={e => setIssueCategory(e.target.value)} required className="w-full bg-slate-700 p-3 rounded-lg">
                            <option value="">Select Category</option>
                            {Object.keys(issueCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Specific Issue</label>
                        <select value={subIssue} onChange={e => setSubIssue(e.target.value)} required disabled={!issueCategory} className="w-full bg-slate-700 p-3 rounded-lg disabled:opacity-50">
                            <option value="">Select Issue</option>
                            {issueCategory && issueCategories[issueCategory].map(issue => <option key={issue} value={issue}>{issue}</option>)}
                        </select>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Detailed Description (Optional)</label>
                    <textarea value={issueDescription} onChange={e => setIssueDescription(e.target.value)} rows="3" className="w-full bg-slate-700 p-3 rounded-lg"></textarea>
                </div>

                {repairMode === 'in-store' ? (
                    <div className="border-t border-slate-700 pt-6">
                        <h3 className="text-lg font-semibold mb-4">In-Store Drop-off</h3>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Drop-off Time Slot</label>
                        <TimeSlotPicker selectedSlot={dropoffTime} setSelectedSlot={setDropoffTime} />
                        <p className="text-xs text-gray-400 mt-2">Booking a slot helps you avoid waiting in a queue.</p>
                    </div>
                ) : (
                    <div className="space-y-6 border-t border-slate-700 pt-6">
                        <h3 className="text-lg font-semibold">Home Pickup & Delivery</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Pickup Address</label>
                            <input type="text" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} required className="w-full bg-slate-700 p-3 rounded-lg" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                                <input type="text" value={pickupCity} onChange={e => setPickupCity(e.target.value)} required className="w-full bg-slate-700 p-3 rounded-lg" />
                           </div>
                           <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Pincode</label>
                                <input type="text" value={pickupPincode} onChange={e => setPickupPincode(e.target.value)} required className="w-full bg-slate-700 p-3 rounded-lg" />
                           </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Select Pickup Time Slot</label>
                             <TimeSlotPicker selectedSlot={dropoffTime} setSelectedSlot={setDropoffTime} />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Pickup Location <span className="text-red-400 font-bold">*</span></label>
                            <button 
                                type="button" 
                                onClick={handleShareLocation}
                                disabled={isLocationShared}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:bg-slate-500 disabled:cursor-not-allowed"
                            >
                                <ShareIcon className="h-5 w-5" />
                                {isLocationShared ? 'Location Shared!' : 'Share Current Location'}
                            </button>
                            {isLocationShared && <p className="text-green-400 text-xs mt-2 text-center">Location URL has been successfully generated.</p>}
                             {!isLocationShared && <p className="text-amber-400 text-xs mt-2 text-center">A shared location is required for home pickup.</p>}
                            {locationError && <p className="text-red-400 text-xs mt-2 text-center">{locationError}</p>}
                        </div>
                    </div>
                )}

                <div className="text-center border-t border-slate-700 pt-6">
                    <p className="text-gray-400 text-sm mb-4">Estimates are preliminary and subject to final diagnosis. <br/> (Est. Cost: ₹2,000-₹5,000, Est. Time: 2-4 Days)</p>
                    <button type="submit" disabled={loading || !dropoffTime || (repairMode === 'home-pickup' && !isLocationShared)} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md w-full md:w-auto disabled:opacity-50">
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                    {repairMode === 'home-pickup' && !isLocationShared && <p className="text-red-400 text-sm mt-2">Please share your location before submitting.</p>}
                </div>
            </form>
        </div>
    );
};

export default NewRepairRequest;
