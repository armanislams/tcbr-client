import BookingDate from "../../components/BookingDate";
import RoomDetails from "../../components/RoomDetails";
import CustomerDetails from "../../components/CustomerDetails";
import Billings from "../../components/Billings/Billings";
import { useState, useEffect } from "react";
import useAxios from "../../components/hooks/useAxios";
import { toast } from "react-toastify";
import { useParams } from "react-router";

const UpdateBooking = () => {
  const { id } = useParams(); // booking id
  const AxiosInstance = useAxios();

  const [dates, setDates] = useState({});
  const [roomDetails, setRoomDetails] = useState({});
  const [customerDetails, setCustomerDetails] = useState({});
  const [billing, setBilling] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch existing booking data
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await AxiosInstance.get(`/bookings/${id}`);
          const data = res.data;
          console.log(data);
          

        // Prefill state
        setDates(data.dates || {});
        setRoomDetails(data.roomDetails || {});
        setCustomerDetails(data.customerDetails || {});
        setBilling(data.billing || {});
      } catch (err) {
        console.error("Failed to fetch booking", err);
        toast.error("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, AxiosInstance]);

  const handleUpdate = async () => {
    const bookingData = {
      dates,
      roomDetails,
      customerDetails,
      billing,
    };

    try {
      const res = await AxiosInstance.patch(`/bookings/${id}`, bookingData);
      if (res.status === 200) {
        toast.success("Booking updated successfully!");
      } else {
        toast.error("Failed to update booking!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating booking!");
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading booking data...</p>;

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-center">Update Booking</h2>

      <BookingDate setDates={setDates} dates={dates} />
      <RoomDetails roomDetails={roomDetails} setRoomDetails={setRoomDetails} />
      <CustomerDetails
        customerDetails={customerDetails}
        setCustomerDetails={setCustomerDetails}
      />
      <Billings billing={billing} setBilling={setBilling} />

      <div className="flex justify-end pt-4">
        <button
          onClick={handleUpdate}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150"
        >
          Update Booking
        </button>
      </div>
    </div>
  );
};

export default UpdateBooking;
