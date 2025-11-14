import React, { useEffect, useState } from "react";
import { FaSort, FaPlus, FaFilter } from "react-icons/fa";
import { Link } from "react-router";
import useAxios from "../../components/hooks/useAxios";

const BookingList = () => {
  const AxiosInstance = useAxios();
  const [bookings, setBookings] = useState([]);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await AxiosInstance.get("/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };
    fetchBookings();
  }, [AxiosInstance]);

  const thClasses =
    "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer";
  const tdClasses = "px-4 py-4 whitespace-nowrap text-sm text-gray-900";

  const StatusBadge = ({ status }) => {
    const color =
      status === "Success"
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800";
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-7xl mx-auto my-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Room Booking List</h1>
        <div className="flex flex-col lg:flex-row space-x-3 items-center">
          <div className="flex gap-3 py-5">
            <button className="flex items-center text-red-500 hover:text-red-700">
              <FaFilter className="mr-1" /> Filter
            </button>
            <button className="flex items-center text-red-500 hover:text-red-700">
              <FaPlus className="mr-1" /> Add
            </button>
          </div>
          <Link to={"/room-book"}>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-700">
              Room Book
            </button>
          </Link>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Show</span>
          <select className="border border-gray-300 rounded-md p-1 text-sm">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>entries</span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md p-1.5 pl-3 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { label: "No", hideOnMobile: true },
                { label: "Customer Code" },
                { label: "Name" },
                { label: "Room Type", hideOnMobile: true },
                { label: "Check In" },
                { label: "Check Out", hideOnMobile: true },
                { label: "Paid Amount", hideOnMobile: true },
                { label: "Due Amount", hideOnMobile: true },
                { label: "Payment Status", hideOnMobile: true },
                { label: "Action" },
              ].map((header) => (
                <th
                  key={header.label}
                  className={
                    thClasses +
                    (header.hideOnMobile ? " hidden md:table-cell" : "")
                  }
                >
                  {header.label}
                  <FaSort className="inline ml-1 w-3 h-3 text-gray-400" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking, index) => {
                const room = booking.roomDetails?.[0] || {};
                return (
                  <tr key={booking._id || index} className="hover:bg-gray-50">
                    <td className={tdClasses}>{index + 1}</td>
                    <td className={tdClasses}>
                      {booking.customerDetails?.customerCode}
                    </td>
                    <td className={tdClasses}>
                      <Link to={`/booking-info/${booking._id}`}>
                        {booking.customerDetails?.name}
                      </Link>
                    </td>
                    <td className={tdClasses}>{room.roomType}</td>
                    <td className={tdClasses}>
                      {new Date(
                        booking.dates?.checkInDate
                      ).toLocaleDateString()}
                    </td>
                    <td className={tdClasses}>
                      {new Date(
                        booking.dates?.checkOutDate
                      ).toLocaleDateString()}
                    </td>
                    <td className={tdClasses}>
                      ${booking.billing?.calculations?.finalTotal}
                    </td>
                    <td className={tdClasses}>
                      ${booking.billing?.calculations?.balanceDue}
                    </td>
                    <td className={tdClasses}>
                      <StatusBadge
                        status={booking.paymentStatus || "Pending"}
                      />
                    </td>
                    <td className={tdClasses}>
                      <Link to={`/booking-info/${booking._id}`}>
                        <button className="btn btn-primary">
                          View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No room bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;
