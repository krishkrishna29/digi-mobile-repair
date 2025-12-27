import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { startOfDay, addDays, format, setHours, setMinutes, isBefore, isEqual, addMinutes } from 'date-fns';
import './TimeSlotPicker.css';

const TimeSlotPicker = ({ isAdmin, selectedSlot, onSlotSelect }) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));

    const workingHours = { start: 10, end: 19 }; // 10:00 to 19:00 (7 PM)
    const slotInterval = 30; // minutes
    const slotCapacity = 2; // Max bookings per slot

    useEffect(() => {
        const fetchAndGenerateSlots = async () => {
            setLoading(true);
            setError(null);
            try {
                const generatedSlots = generateTimeSlotsForDate(selectedDate);
                const slotsFromDB = await getSlotsFromFirestore(selectedDate);

                const mergedSlots = generatedSlots.map(genSlot => {
                    const dbSlot = slotsFromDB.find(s => s.id === genSlot.id);
                    const bookedCount = dbSlot ? dbSlot.booked : 0;
                    const isBooked = bookedCount >= slotCapacity;

                    return {
                        ...genSlot,
                        bookedCount,
                        isBooked,
                    };
                });

                setSlots(mergedSlots);
            } catch (err) {
                setError("Failed to load time slots.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAndGenerateSlots();
    }, [selectedDate]);

    const generateTimeSlotsForDate = (date) => {
        const slots = [];
        let currentTime = setMinutes(setHours(date, workingHours.start), 0);
        const endTime = setMinutes(setHours(date, workingHours.end), 0);
        const now = new Date();

        while (isBefore(currentTime, endTime)) {
            const slotId = format(currentTime, 'yyyy-MM-dd_HH:mm');
            const isPast = isBefore(currentTime, now) && !isEqual(currentTime, now);

            if (isAdmin || !isPast) {
                slots.push({
                    id: slotId,
                    timeLabel: format(currentTime, 'h:mm a'),
                    timestamp: Timestamp.fromDate(currentTime),
                    isPast: isPast,
                    capacity: slotCapacity,
                    bookedCount: 0,
                    isBooked: false,
                });
            }
            currentTime = addMinutes(currentTime, slotInterval);
        }
        return slots;
    };

    const getSlotsFromFirestore = async (date) => {
        const start = startOfDay(date);
        const end = addDays(start, 1);

        const q = query(
            collection(db, 'timeSlots'),
            where('timestamp', '>=', Timestamp.fromDate(start)),
            where('timestamp', '<', Timestamp.fromDate(end))
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const handleSlotClick = (slot) => {
        if (slot.isBooked && !isAdmin) {
            alert("This slot is full and cannot be selected.");
            return;
        }
        onSlotSelect(slot);
    };
    
    const handleDateChange = (days) => {
        setSelectedDate(prevDate => addDays(prevDate, days));
    };

    const isToday = (date) => {
        return startOfDay(date).getTime() === startOfDay(new Date()).getTime();
    };

    const filteredSlots = isAdmin ? slots : slots.filter(slot => !slot.isBooked && !slot.isPast);

    return (
        <div className="time-slot-picker">
            <div className="date-navigation">
                <button onClick={() => handleDateChange(-1)} disabled={isToday(selectedDate)}>Previous Day</button>
                <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
                <button onClick={() => handleDateChange(1)}>Next Day</button>
            </div>

            {loading && <p>Loading available slots...</p>}
            {error && <p className="error">{error}</p>}

            <div className="slots-container">
                {filteredSlots.length > 0 ? filteredSlots.map(slot => (
                    <button
                        key={slot.id}
                        className={`slot ${selectedSlot?.id === slot.id ? 'selected' : ''} ${slot.isBooked ? 'booked' : ''}`}
                        onClick={() => handleSlotClick(slot)}
                        disabled={slot.isPast || (slot.isBooked && !isAdmin)}
                    >
                        {slot.timeLabel}
                        {isAdmin && <span>({slot.bookedCount}/{slot.capacity})</span>}
                    </button>
                )) : <p>No available slots for this day.</p>}
            </div>
        </div>
    );
};

export default TimeSlotPicker;
