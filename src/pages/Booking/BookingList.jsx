import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaPlus, FaEllipsisH, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import useAxios from "../../components/hooks/useAxios";
import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingList = () => {
  const AxiosInstance = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("checkIn_desc");
  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("2026");
  const [dateFilter, setDateFilter] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch bookings with infinite scroll and server-side filtering/sorting/pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: [
      "bookings",
      {
        search: debouncedSearch,
        status: statusFilter,
        sort: sortBy,
        month: monthFilter,
        year: yearFilter,
        date: dateFilter,
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        limit: 10,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter !== "All") params.status = statusFilter;
      if (sortBy) params.sort = sortBy;
      if (dateFilter) {
        params.date = dateFilter.toISOString();
      } else if (monthFilter !== "All") {
        params.month = monthFilter;
        params.year = yearFilter;
      }

      const res = await AxiosInstance.get("/bookings", { params });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
  });

  // Flatten the array of pages into a single bookings array
  const bookings = data ? data.pages.flatMap((page) => page.bookings || []) : [];

  // Automatic load more when scroll reaches bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // When user is within 150px of the bottom of the page
      if (scrollHeight - scrollTop - clientHeight < 150) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Debug log
  useEffect(() => {
    if (!isLoading && !isError) {
      console.log("Bookings Data loaded:", bookings);
    }
  }, [bookings, isLoading, isError]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const StatusBadge = ({ status }) => {
    // Normalize status to handle case sensitivity
    const normalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "";
    const styles = {
      Confirmed: "badge-success",
      Pending: "badge-warning",
      Cancelled: "badge-error",
      Postponed: "badge-info",
    };
    return <div className={`badge ${styles[normalizedStatus] || "badge-ghost"} gap-2`}>{normalizedStatus || "Unknown"}</div>;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Title and Action Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Booking Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage, sort, and filter all room reservations in one unified system.</p>
          </div>
          <Link
            to="/room-book"
            className="btn btn-primary btn-md shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5"
          >
            <FaPlus className="mr-2" /> New Booking
          </Link>
        </div>

        {/* Console Filters Toolbar Card */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="card bg-base-100 shadow-md border border-base-200 mb-8"
        >
          <div className="card-body p-5 space-y-4">
            {/* Top Row: Search and Status Segmented Control */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 pr-4 input-md focus:ring-2 focus:ring-primary/20"
                  placeholder="Search by customer name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              {/* Status Segmented controls */}
              <div className="join join-horizontal overflow-x-auto w-full lg:w-auto">
                {["All", "Success", "Pending", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`btn btn-md join-item flex-1 lg:flex-none px-5 ${
                      statusFilter === status
                        ? "btn-primary text-white"
                        : "btn-outline btn-ghost"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Row: Sort and Date Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-base-100">
              {/* Sort By Dropdown */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Sort List By</label>
                <select
                  className="select select-bordered select-md w-full text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="checkIn_desc">Newest Check-In</option>
                  <option value="checkIn_asc">Oldest Check-In</option>
                  <option value="booking_desc">Newest Booking</option>
                  <option value="booking_asc">Oldest Booking</option>
                </select>
              </div>

              {/* Month Dropdown */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Check-in Month</label>
                <select
                  className="select select-bordered select-md w-full text-sm"
                  value={monthFilter}
                  onChange={(e) => {
                    setMonthFilter(e.target.value);
                    if (e.target.value !== "All") {
                      setDateFilter(null);
                    }
                  }}
                >
                  <option value="All">All Months</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>

              {/* Year Dropdown */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Check-in Year</label>
                <select
                  className="select select-bordered select-md w-full text-sm"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  disabled={monthFilter === "All"}
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>

              {/* Specific Date Filter */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Specific Date</label>
                <div className="relative w-full">
                  <DatePicker
                    selected={dateFilter}
                    onChange={(date) => {
                      setDateFilter(date);
                      if (date) {
                        setMonthFilter("All");
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Filter by single day..."
                    isClearable
                    className="input input-bordered input-md w-full text-sm"
                  />
                </div>
              </div>
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
                  {/* <th>Room Info</th> */}
                  <th>Dates</th>
                  <th>Financials</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="show" // Ensure it's visible by default to prevent stuck hidden state
                animate="show"
              >
                {isLoading && (
                  <tr>
                    <td colSpan="6">
                      <div className="flex flex-col gap-4 py-4 px-4">
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
                      <div className="alert alert-error m-4">
                        <span>Error loading bookings: {error?.message || 'Please check your connection.'}</span>
                      </div>
                    </td>
                  </tr>
                )}

                <AnimatePresence mode="popLayout">
                  {!isLoading && !isError && (
                    bookings.length > 0 ? (
                      bookings.map((booking) => (
                        <motion.tr
                          key={booking._id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="show"
                          exit={{ opacity: 0, x: -20 }}
                          layout
                          className="hover"
                        >
                          {/* Customer Column */}
                          <td>
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-bold">{booking.customerDetails?.name || "Unknown"}</div>
                                <div className="text-sm opacity-50">
                                  {booking.customerDetails?.customerCode || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Room Info */}
                          {/* <td>
                            <span className="badge badge-ghost badge-sm font-semibold">
                              {booking.roomDetails?.[0]?.roomType || "N/A"}
                            </span>
                            <br />
                            <span className="text-xs text-gray-500">
                              Room {booking.roomDetails?.[0]?.roomNo || "N/A"}
                            </span>
                          </td> */}

                          {/* Dates */}
                          <td>
                            <div className="flex flex-col text-sm">
                              <span className="font-medium text-primary">
                                In: {booking.dates?.checkInDate 
                                  ? new Date(booking.dates.checkInDate).toLocaleDateString('en-GB') 
                                  : "-"}
                              </span>
                              <span className="opacity-70">
                                Out: {booking.dates?.checkOutDate 
                                  ? new Date(booking.dates.checkOutDate).toLocaleDateString('en-GB') 
                                  : "-"}
                              </span>
                              {booking.isB2B && (
                                <span className="badge badge-warning badge-sm mt-1">{booking.b2bText || "B2B"}</span>
                              )}
                            </div>
                          </td>

                          {/* Financials */}
                          <td>
                            <div className="flex flex-col gap-1">
                              <div className="badge badge-outline badge-success text-xs font-bold">
                                Total: RM {booking.billing?.totalAmountInput || 0}
                              </div>
                              {((Number(booking.billing?.totalAmountInput) || 0) - (Number(booking.billing?.advanceAmountInput) || 0)) > 0 && (
                                <div className="badge badge-outline badge-error text-xs font-bold">
                                  Due: RM {((Number(booking.billing?.totalAmountInput) || 0) - (Number(booking.billing?.advanceAmountInput) || 0)).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td>
                            <StatusBadge status={booking.billing?.paymentStatus || "UnAvalaible"} />
                          </td>

                          {/* Actions */}
                          <td className="print:hidden">
                            <div className="dropdown dropdown-left">
                              <div tabIndex={0} role="button" className="btn btn-ghost btn-outline btn-xs">
                                <FaEllipsisH />
                              </div>
                              <ul tabIndex={0} className="dropdown-content z-[2] menu p-2 shadow-2xl bg-base-100 rounded-box w-32 border border-base-300">
                                <li>
                                  <Link to={`/booking-info/${booking._id}`}><FaEye className="text-primary"/> View</Link>
                                </li>
                                <li>
                                  <Link to={`/update-booking/${booking._id}`}><FaEdit className="text-info"/> Edit</Link>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        key="no-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan="6" className="text-center py-16">
                          <div className="flex flex-col items-center justify-center opacity-40">
                            <FaFilter className="text-5xl mb-4" />
                            <p className="text-xl font-medium">No bookings found matching your criteria.</p>
                            <p className="text-sm">Try adjusting your filters or search term.</p>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  )}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </div>
        </div>
        
        {/* Load More indicator / button */}
        {(hasNextPage || isFetchingNextPage) && (
          <div className="flex justify-center my-6">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="btn btn-outline btn-primary btn-sm px-6"
            >
              {isFetchingNextPage ? (
                <span className="loading loading-spinner loading-xs mr-2"></span>
              ) : null}
              {isFetchingNextPage ? "Loading more..." : "Load More Bookings"}
            </button>
          </div>
        )}

        {!hasNextPage && bookings.length > 0 && (
          <p className="text-center text-sm text-gray-500 my-6">
            Showing all {bookings.length} bookings
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingList;
