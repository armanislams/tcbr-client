import BookingDate from '../../components/BookingDate';
import RoomDetails from '../../components/RoomDetails';
import CustomerDetails from '../../components/CustomerDetails';
import Billings from '../../components/Billings/Billings';
import { useState } from 'react';
import useAxios from '../../components/hooks/useAxios';
import { toast } from 'react-toastify';

const BookingForm = () => {
  const AxiosInstance = useAxios()
    const [bookingDetail, setBookingDetail] = useState({})
    const [dates, setDates] = useState({});
    const [roomDetails, setRoomDetails] = useState({});
    const [customerDetails, setCustomerDetails] = useState({});
  const [billing, setBilling] = useState({});
  const [saving, setSaving] = useState(false)
//   console.log('room details',roomDetails,'dates', dates,'customer',customerDetails,'bill', billing);
  
  console.log("Final booking data:", bookingDetail);
  const resetForm = () => {
    setDates({});
    setRoomDetails({});
    setCustomerDetails({});
    setBilling({});
  };
  const handleFinalSubmit = async () => {
    // Find all required fields from FieldWrapper
      const form = document.getElementById("bookingForm");

      if (!form.reportValidity()) {
        // Browser automatically highlights the missing fields
        toast.warn("Please fill required fields");
        return;
      }


    setSaving(true);
    const bookingData = {
      dates,
      roomDetails,
      customerDetails,
      billing,
    };
    if (!bookingData) {
      toast.warning("PLease Fill Up Required Form");
    }
    console.log(bookingData);
    
    const res = await AxiosInstance.post("/bookings", bookingData);
    console.log(res);

    if (res.data.insertedId || res.status === 200) {
      toast.success("Booking added successfully!");
      setBookingDetail(bookingData);
      resetForm();
    } else {
      toast.error("Something went wrong!");
    }
    setSaving(false);
  }

    return (
      <form id='bookingForm' className="space-y-8 p-6">
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
        <div className="flex justify-center">
          <button
            disabled={saving}
            onClick={handleFinalSubmit}
            className="bg-indigo-600 btn h-15 text-2xl text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150"
          >
            {saving ? "Saving...." : "Save Booking"}
          </button>
        </div>
      </form>
    );
};

export default BookingForm;