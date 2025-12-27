import React, { useState } from 'react';
import TimeSlotPicker from './components/TimeSlotPicker';

const TimeSlotManager = () => {
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleSlotSelect = (slotId) => {
        // In the future, we can add logic here for admins to manage slots,
        // such as viewing who booked it, or manually overriding a booking.
        console.log("Admin selected slot:", slotId);
        setSelectedSlot(slotId);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Time Slots</h2>
            <p className="mb-6 text-gray-600">View all available and booked time slots. As an admin, you can see the full schedule and booking counts for each slot.</p>
            <TimeSlotPicker 
                isAdmin={true} 
                selectedSlot={selectedSlot} 
                onSlotSelect={handleSlotSelect} 
            />
        </div>
    );
};

export default TimeSlotManager;
