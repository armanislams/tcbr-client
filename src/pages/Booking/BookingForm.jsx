import BookingDate from '../../components/BookingDate';
import RoomDetails from '../../components/RoomDetails';
import CustomerDetails from '../../components/CustomerDetails';
import Billings from '../../components/Billings/Billings';
import { useState } from 'react';

const BookingForm = () => {
    const [bookingDetail, setBookingDetail] = useState({})
    const [dates, setDates] = useState({});
    const [roomDetails, setRoomDetails] = useState({});
    const [customerDetails, setCustomerDetails] = useState({});
    const [billing, setBilling] = useState({});
//   console.log('room details',roomDetails,'dates', dates,'customer',customerDetails,'bill', billing);
  
  console.log("Final booking data:", bookingDetail);
    const handleFinalSubmit = () => {
        const bookingData = {
          dates,
          roomDetails,
          customerDetails,
          billing,
        };
        setBookingDetail(bookingData)
    }
    return (
      <div className="space-y-8 p-6">
        <h2 className="text-2xl font-bold text-center">New Booking</h2>
        <BookingDate setDates={setDates} dates={dates} />
        <RoomDetails
          roomDetails={roomDetails}
          setRoomDetails={setRoomDetails}
        />
        <CustomerDetails
          customerDetails={customerDetails}
          setCustomerDetails={setCustomerDetails}
        />
        <Billings setBilling={setBilling} />
        {/* --- Save Button --- */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleFinalSubmit}
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150"
          >
            Save Booking
          </button>
        </div>
      </div>
    );
};

export default BookingForm;