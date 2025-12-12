import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaPlus, FaEllipsisH, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import useAxios from "../../components/hooks/useAxios";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const BookingList = () => {
  const AxiosInstance = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch bookings with server-side filtering
  const { data: bookings = [], isLoading, isError, error } = useQuery({
    queryKey: ['bookings', { search: debouncedSearch, status: statusFilter }],
    queryFn: async () => {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter !== "All") params.status = statusFilter;

      const res = await AxiosInstance.get('/bookings', { params });
      return res.data;
    }
  });
  console.log(bookings);
  

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      Success: "badge-success",
      Pending: "badge-warning",
      Failed: "badge-error",
    };
    return <div className={`badge ${styles[status] || "badge-ghost"} gap-2`}>{status}</div>;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card bg-base-100 shadow-xl mb-8 border-t-4 border-primary"
        >
          <div className="card-body flex-col md:flex-row justify-between items-center gap-4 py-4">
            <div>
              <h2 className="card-title text-2xl font-bold">Booking Management</h2>
              <p className="text-sm text-gray-500">Manage all your room reservations</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <label className="input input-bordered flex items-center gap-2 input-sm flex-1 md:w-64">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="opacity-70" />
              </label>

              {/* Filter Dropdown */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-sm btn-outline">
                  <FaFilter /> {statusFilter}
                </div>
                <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52">
                  {["All", "Success", "Pending", "Cancelled"].map((status) => (
                    <li key={status} onClick={() => setStatusFilter(status)}>
                      <a>{status}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add Button */}
              <Link to="/room-book" className="btn btn-primary btn-sm">
                <FaPlus /> New Booking
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Table Card */}
        <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-300">
          <div className="overflow-x-auto">
            <table className="table table-zebra table-lg">
              {/* head */}
              <thead className="bg-base-200">
                <tr>
                  <th>Customer</th>
                  <th>Room Info</th>
                  <th>Dates</th>
                  <th>Financials</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {isLoading && (
                    <tr>
                      <td colSpan="6">
                        <div className="flex flex-col gap-4 py-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4 items-center">
                              <div className="skeleton h-12 w-12 rounded-full shrink-0"></div>
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="skeleton h-4 w-1/4"></div>
                                <div className="skeleton h-4 w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                  {isError && (
                    <tr>
                      <td colSpan="6">
                        <div className="alert alert-error">
                          <span>Error loading bookings: {error?.message || 'Please try again later.'}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!isLoading && !isError && (
                    bookings.length > 0 ? (
                      bookings.map((booking) => (
                        <motion.tr
                          key={booking._id}
                          variants={itemVariants}
                          exit={{ opacity: 0, x: -20 }}
                          layout
                          className="hover"
                        >
                          {/* Customer Column */}
                          <td>
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-bold">{booking.customerDetails?.name}</div>
                                <div className="text-sm opacity-50">
                                  {booking.customerDetails?.customerCode}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Room Info */}
                          <td>
                            <span className="badge badge-ghost badge-sm">
                              {booking.roomDetails?.[0]?.roomType || "N/A"}
                            </span>
                            <br />
                            <span className="text-xs text-gray-500">
                              Room {booking.roomDetails?.[0]?.roomNo}
                            </span>
                          </td>

                          {/* Dates */}
                          <td>
                            <div className="flex flex-col text-sm">
                              <span className="font-medium">
                                In: {new Date(booking.dates?.checkInDate).toLocaleDateString()}
                              </span>
                              <span className="opacity-70">
                                Out: {new Date(booking.dates?.checkOutDate).toLocaleDateString()}
                              </span>
                            </div>
                          </td>

                          {/* Financials */}
                          <td>
                            <div className="flex flex-col gap-1">
                              <div className="badge badge-outline badge-success text-xs">
                                Paid: ${booking.billing?.calculations?.finalTotal} {/* Assuming this logic, verify field */}
                              </div>
                              {booking.billing?.calculations?.balanceDue > 0 && (
                                <div className="badge badge-outline badge-error text-xs">
                                  Due: ${booking.billing?.calculations?.balanceDue}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td>
                            <StatusBadge status={booking.paymentStatus || "Pending"} />
                          </td>

                          {/* Actions */}
                          <td>
                            <div className="dropdown dropdown-left">
                              <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                                <FaEllipsisH />
                              </div>
                              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                                <li>
                                  <Link to={`/booking-info/${booking._id}`}><FaEye /> View</Link>
                                </li>
                                <li>
                                  <Link to={`/update-booking/${booking._id}`}><FaEdit /> Edit</Link>
                                </li>
                                {/* <li><a className="text-error"><FaTrash /> Delete</a></li> */}
                              </ul>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <div className="flex flex-col items-center justify-center py-10 opacity-50">
                            <FaFilter className="text-4xl mb-2" />
                            <p>No bookings found matching your criteria.</p>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingList;
