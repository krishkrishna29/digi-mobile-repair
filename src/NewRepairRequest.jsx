import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, serverTimestamp, doc, runTransaction, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import { Switch } from '@headlessui/react';
import { BuildingStorefrontIcon, TruckIcon, ShareIcon } from '@heroicons/react/24/outline';
import TimeSlotPicker from './components/TimeSlotPicker';

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
    const [issueCategory, setIssueCategory] = useState('');
    const [subIssue, setSubIssue] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [pickupAddress, setPickupAddress] = useState('');
    const [pickupCity, setPickupCity] = useState('');
    const [pickupPincode, setPickupPincode] = useState('');
    const [dropoffTime, setDropoffTime] = useState(null);
    const [locationUrl, setLocationUrl] = useState('');
    const [isLocationShared, setIsLocationShared] = useState(false);
    const [locationError, setLocationError] = useState('');

    const [loading, setLoading] = useState(false);

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
            await runTransaction(db, async (transaction) => {
                const slotRef = doc(db, "timeSlots", dropoffTime.id);
                const slotDoc = await transaction.get(slotRef);
                
                let newBookedCount = 1;
                let capacity = 2; // Default capacity
                
                if (slotDoc.exists()) {
                    const slotData = slotDoc.data();
                    newBookedCount = (slotData.booked || 0) + 1;
                    capacity = slotData.capacity || 2;

                    if (newBookedCount > capacity) {
                        throw new Error("This time slot is no longer available. Please select another one.");
                    }
                    
                    transaction.update(slotRef, { booked: newBookedCount });
                } else {
                    const [datePart, timePart] = dropoffTime.id.split('_');
                    const [year, month, day] = datePart.split('-').map(Number);
                    const [hour, minute] = timePart.split(':').map(Number);
                    // Note: The month is 0-indexed in JavaScript's Date, so we subtract 1.
                    const date = new Date(year, month - 1, day, hour, minute);

                    transaction.set(slotRef, { 
                        booked: newBookedCount,
                        capacity: capacity,
                        timestamp: Timestamp.fromDate(date),
                    });
                }
                
                // Create new repair document within the transaction
                const repairRef = doc(collection(db, 'repairs'));
                const repairData = {
                    userId: currentUser.uid,
                    repairMode,
                    deviceBrand,
                    deviceModel,
                    issueCategory,
                    subIssue,
                    issueDescription,
                    pickupAddress: repairMode === 'home-pickup' ? { address: pickupAddress, city: pickupCity, pincode: pickupPincode, locationUrl: locationUrl } : null,
                    preferredSlot: dropoffTime.id,
                    status: 'Requested',
                    createdAt: serverTimestamp(),
                    otp: otp,
                    statusHistory: [{ status: 'Requested', timestamp: serverTimestamp() }],
                };
                transaction.set(repairRef, repairData);

                // Create admin notification within the transaction
                const adminNotificationRef = doc(collection(db, 'admin_notifications'));
                const notificationData = {
                    type: 'repair_request_new',
                    title: 'New Repair Request',
                    message: `A new repair for a ${deviceBrand} ${deviceModel} has been submitted.`,
                    read: false,
                    createdAt: serverTimestamp(),
                    relatedRepairId: repairRef.id
                };
                transaction.set(adminNotificationRef, notificationData);

                // This navigation can't be inside the transaction, so we do it after.
                // We store the necessary info and use it after the transaction succeeds.
                return { repairId: repairRef.id, repairMode, otp };
            })
            .then(({repairId, repairMode, otp}) => {
                navigate('/confirmation', { state: { repairId, repairMode, otp } });
            });

        } catch (error) {
            console.error("Error during transaction: ", error);
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

                <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Select a Time Slot</h3>
                     <TimeSlotPicker selectedSlot={dropoffTime} onSlotSelect={setDropoffTime} isAdmin={false}/>
                    <p className="text-xs text-gray-400 mt-2">Booking a slot helps you avoid waiting in a queue.</p>
                </div>

                {repairMode === 'home-pickup' && (
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
