import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './firebase';

const TimeSlotPicker = ({ selectedSlot, setSelectedSlot }) => {
    const [availability, setAvailability] = useState({});

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'timeSlots'), (snapshot) => {
            const slotsData = {};
            snapshot.forEach(doc => {
                slotsData[doc.id] = doc.data();
            });
            setAvailability(slotsData);
        });

        return () => unsubscribe();
    }, []);

    const slots = Object.keys(availability);

    return (
        <div className="relative">
            <select 
                value={selectedSlot} 
                onChange={e => setSelectedSlot(e.target.value)}
                className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 transition appearance-none"
            >
                <option value="">Select an available time slot</option>
                {slots.map(slot => {
                    const slotData = availability[slot];
                    const isFull = slotData.booked >= slotData.total;
                    return (
                        <option key={slot} value={slot} disabled={isFull}>
                            {slot} ({isFull ? 'Full' : `${slotData.total - slotData.booked} available`})
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default TimeSlotPicker;
