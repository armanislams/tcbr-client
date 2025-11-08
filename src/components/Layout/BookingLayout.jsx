// BookingLayout.js

import React, { useState } from 'react';
// Assuming these paths are correct for your project structure
import BookingForm from '../../pages/Booking/BookingForm'; 
import BookingList from '../../pages/Booking/BookingList';

const BookingLayout = () => {
    const [bookings, setBookings] = useState([]);
    
    // FIX 2: UNCOMMENT AND KEEP THE VIEW STATE
    const [currentView, setCurrentView] = useState('form'); 
    
    // Use console.log to confirm the list size changes on save
    console.log(`Bookings in Layout: ${bookings.length}`, bookings);

    const handleSaveNewBooking = (newBooking) => {
        // FIX 1: Use the functional update to prevent stale closures
        setBookings(prevBookings => [...prevBookings, newBooking]); 
        
        // Ensure the list view is shown after saving
        setCurrentView('list'); 
        console.log('Successfully saved and switched to list view:', newBooking);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            
            {/* --- Navigation Buttons (Add these back for proper functionality) --- */}
            <div className="max-w-7xl mx-auto flex justify-center mb-6 space-x-4 p-4 bg-white shadow rounded-lg">
                <button
                    onClick={() => setCurrentView('list')}
                    className={`px-6 py-2 rounded-lg font-semibold ${currentView === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    Booking List ({bookings.length})
                </button>
                <button
                    onClick={() => setCurrentView('form')}
                    className={`px-6 py-2 rounded-lg font-semibold ${currentView === 'form' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    Create New Booking
                </button>
            </div>
            
            <div className="py-4">
                {currentView === 'form' && (
                    // FIX 3: Ensure BookingForm receives the prop. 
                    // Make sure BookingForm passes this prop down to Billings.
                    <BookingForm handleSaveNewBooking={handleSaveNewBooking} /> 
                )}

                {currentView === 'list' && (
                    <BookingList bookings={bookings} />
                )}
            </div>
        </div>
    );
};

export default BookingLayout;