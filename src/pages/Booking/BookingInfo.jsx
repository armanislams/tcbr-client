import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import useAxios from "../../components/hooks/useAxios";
import { Loader2 } from "lucide";

const BookingInfo = () => {
  const { id } = useParams();
  const AxiosInstance = useAxios();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // useEffect(() => {
    //      AxiosInstance.get("/bookings").then((data) => {
    //        setBooking(data.data);
    //      });
    // },[AxiosInstance])

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await AxiosInstance.get(`/bookings/${id}`);
        // Ensure booking is always an object, not an array
        // const data = Array.isArray(res.data) ? res.data[0] : res.data;
        const data = res.data
        console.log((data));
        
        if (!data) {
          setError("Booking not found.");
        } else {
          setBooking(data);
        }
      } catch (err) {
        console.error("Failed to load booking:", err);
        setError("Failed to fetch booking. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, AxiosInstance]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
            {/* <Loader2 className="animate-spin mr-2" /> Loading booking details... */}
            <h1>loading..</h1>
      </div>
    );

  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  if (!booking)
    return (
      <div className="text-center text-gray-500 mt-10">Booking not found.</div>
    );

    // const { customerDetails, roomDetails, dates, billing } = booking;
    const customerDetails = booking.customerDetails
    const roomDetails = booking.roomDetails;
    const dates = booking.dates;
    const billing = booking.billing;

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-MY", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "-";

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 my-10">
      {/* Customer Details */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Booking Details — {customerDetails?.name || "Unknown"}
      </h1>
      <hr className="mb-6" />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <p>
          <strong>Customer Code:</strong>{" "}
          <span className="font-semibold">
            {customerDetails?.customerCode || "-"}
          </span>
        </p>
        <p>
          <strong>Mobile:</strong> {customerDetails?.mobile || "-"}
        </p>
        <p>
          <strong>Email:</strong> {customerDetails?.email || "-"}
        </p>
        <p>
          <strong>Gender:</strong> {customerDetails?.gender || "-"}
        </p>
        <p>
          <strong>Nationality:</strong> {customerDetails?.nationality || "-"}
        </p>
      </div>

      {/* Room Details */}
      <h2 className="text-xl font-semibold mt-8 mb-3">Room Details</h2>
      {Array.isArray(roomDetails) && roomDetails.length ? (
        roomDetails.map((room, idx) => (
          <div key={idx} className="border p-4 rounded-md mb-4">
            <h3>
              <strong>Room No:</strong> {idx + 1}
            </h3>
            <p>
              <strong>Room Type:</strong> {room.roomType || "-"}
            </p>
            <p>
              <strong>Room No:</strong> {room.roomNo || "-"}
            </p>
            <p>
              <strong>Adults:</strong> {room.adults ?? "-"}
            </p>
            <p>
              <strong>Children:</strong> {room.children ?? "-"}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No room details available.</p>
      )}

      {/* Booking Dates */}
      <h2 className="text-xl font-semibold mt-8 mb-3">Booking Dates</h2>
      <div className="border p-4 rounded-md">
        <p>
          <strong>Check In:</strong> {formatDate(dates?.checkInDate)}
        </p>
        <p>
          <strong>Check Out:</strong> {formatDate(dates?.checkOutDate)}
        </p>
        <p>
          <strong>Booking Date:</strong> {formatDate(dates?.bookingDate)}
        </p>
      </div>

      {/* Billing */}
      <h2 className="text-xl font-semibold mt-8 mb-3">Billing</h2>
      <div className="border p-4 rounded-md">
        <p>
          <strong>Total Amount:</strong> RM{" "}
          {billing?.inputs?.totalAmountInput ?? 0}
        </p>
        <p>
          <strong>Advance Paid:</strong> RM{" "}
          {billing?.inputs?.advanceAmountInput ?? 0}
        </p>
        <p>
          <strong>Balance Due:</strong> RM{" "}
          {billing?.calculations?.balanceDue ?? 0}
        </p>
      </div>
      <button className="btn btn-primary">
        <Link to={`/update-booking/${id}`}>Update</Link>
      </button>
    </div>
  );
};

export default BookingInfo;




// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router';
// import useAxios from '../../components/hooks/useAxios';

// const BookingInfo = () => {
//   const { id } = useParams();
//     const [booking, setBooking] = useState(null);
//     const [customer, setCustomer]= useState({})

// const AxiosInstance = useAxios();
// useEffect(() => {
//     AxiosInstance.get(`/bookings/${id}`).then((data) => {
//         const bookingDetails = data.data
//         setBooking(bookingDetails);
//         const customer = bookingDetails.customerDetails
//         setCustomer(customer)
//         console.log(customer);

//     });
//   }, [AxiosInstance, id]);
//     return (
//         <div>
//             <h1>customer : { customer.name}</h1>
//         </div>
//     );
// };

// export default BookingInfo;