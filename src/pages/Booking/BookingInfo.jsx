import { Link, useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../components/hooks/useAxios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaGlobe,
  FaBed,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaEdit,
  FaPrint,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUsers,
  FaChild,
  FaTrash,
  FaCheck,
} from "react-icons/fa";

const BookingInfo = () => {
  const { id } = useParams();
  const AxiosInstance = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch booking with TanStack Query
  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const res = await AxiosInstance.get(`/bookings/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Mark as Paid Mutation
  const markAsPaidMutation = useMutation({
    mutationFn: async () => {
      const updatedBooking = {
        ...booking,
        paymentStatus: "Success",
      };
      const res = await AxiosInstance.patch(`/bookings/${id}`, updatedBooking);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["booking", id]);
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking marked as paid successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to mark as paid: ${error.message}`);
    },
  });

  // Delete Booking Mutation
  const deleteBookingMutation = useMutation({
    mutationFn: async () => {
      // Note: Backend doesn't have DELETE endpoint yet
      // Using PATCH to mark as cancelled for now
      const updatedBooking = {
        ...booking,
        paymentStatus: "Cancelled",
      };
      const res = await AxiosInstance.patch(`/bookings/${id}`, updatedBooking);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking cancelled successfully!");
      setTimeout(() => navigate("/booking-list"), 1500);
    },
    onError: (error) => {
      toast.error(`Failed to cancel booking: ${error.message}`);
    },
  });

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      : "-";

  const formatCurrency = (amount) => {
    const numAmount = Number(amount);
    return `RM ${numAmount?.toFixed(2) || "0.00"}`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      Success: { class: "badge-success", icon: FaCheckCircle },
      Pending: { class: "badge-warning", icon: FaClock },
      Cancelled: { class: "badge-error", icon: FaTimesCircle },
    };
    const badge = badges[status] || badges.Pending;
    const Icon = badge.icon;
    return (
      <div className={`badge ${badge.class} gap-2 px-4 py-3`}>
        <Icon /> {status || "not found"}
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMarkAsPaid = async () => {
    const result = await Swal.fire({
      title: "Mark as Paid?",
      text: "Are you sure you want to mark this booking as paid?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, mark as paid!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      markAsPaidMutation.mutate();
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking? This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      deleteBookingMutation.mutate();
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <FaTimesCircle className="text-2xl" />
          <div>
            <h3 className="font-bold">Error Loading Booking</h3>
            <div className="text-sm">{error?.message || "Please try again later."}</div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!booking) {
    return (
      <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="alert alert-warning max-w-md">
          <div>
            <h3 className="font-bold">Booking Not Found</h3>
            <div className="text-sm">The booking you're looking for doesn't exist.</div>
          </div>
        </div>
      </div>
    );
  }

  const { customerDetails, roomDetails, dates, billing, paymentStatus } = booking;

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 print:bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 print:hidden"
        >
          <Link to="/booking-list" className="btn btn-ghost btn-sm gap-2 mb-4">
            <FaArrowLeft /> Back to Bookings
          </Link>
        </motion.div>

        {/* Title Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card bg-base-100 shadow-xl mb-6 border-t-4 border-primary"
        >
          <div className="card-body">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary">Booking Details</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Booking ID: <span className="font-mono font-semibold">{id}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(paymentStatus)}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Room Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card bg-base-100 shadow-lg border border-base-300"
            >
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <FaUser className="text-primary" />
                  Customer Information
                </h2>
                <div className="divider my-2"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <FaUser className="text-primary mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-semibold">{customerDetails?.name || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaIdCard className="text-primary mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Customer Code</p>
                      <p className="font-semibold font-mono">{customerDetails?.customerCode || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaPhone className="text-primary mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Mobile</p>
                      <p className="font-semibold">{customerDetails?.mobile || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-primary mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-sm break-all">{customerDetails?.email || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaUser className="text-primary mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Gender</p>
                      <p className="font-semibold">{customerDetails?.gender || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaGlobe className="text-primary mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Nationality</p>
                      <p className="font-semibold">{customerDetails?.nationality || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Room Details */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card bg-base-100 shadow-lg border border-base-300"
            >
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <FaBed className="text-primary" />
                  Room Details
                </h2>
                <div className="divider my-2"></div>
                {Array.isArray(roomDetails) && roomDetails.length ? (
                  <div className="space-y-4">
                    {roomDetails.map((room, idx) => (
                      <div
                        key={idx}
                        className="bg-base-200 rounded-lg p-4 border-l-4 border-primary"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Room Type</p>
                            <p className="font-semibold">{room.roomType || "-"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Room Number</p>
                            <p className="font-semibold">{room.roomNo || "-"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <FaUsers className="text-sm" /> Adults
                            </p>
                            <p className="font-semibold">{room.adults ?? "-"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <FaChild className="text-sm" /> Children
                            </p>
                            <p className="font-semibold">{room.children ?? "-"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No room details available.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Dates & Billing */}
          <div className="space-y-6">
            {/* Booking Dates */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card bg-base-100 shadow-lg border border-base-300"
            >
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" />
                  Booking Timeline
                </h2>
                <div className="divider my-2"></div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="badge badge-primary badge-sm mt-1">1</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Booking Date</p>
                      <p className="font-semibold">{formatDate(dates?.bookingDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-success badge-sm mt-1">2</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Check In</p>
                      <p className="font-semibold text-success">{formatDate(dates?.checkInDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-warning badge-sm mt-1">3</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Check Out</p>
                      <p className="font-semibold text-warning">{formatDate(dates?.checkOutDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Billing Summary */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card bg-base-100 shadow-lg border border-base-300"
            >
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <FaMoneyBillWave className="text-primary" />
                  Billing Summary
                </h2>
                <div className="divider my-2"></div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold text-lg">
                      {formatCurrency(billing?.totalAmountInput)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Advance Paid</span>
                    <span className="font-semibold text-success">
                      {formatCurrency(billing?.advanceAmountInput)}
                    </span>
                  </div>
                  <div className="divider my-1"></div>
                  <div className="flex justify-between items-center bg-primary bg-opacity-10 p-3 rounded-lg">
                    <span className="font-bold text-primary">Balance Due</span>
                    <span className="font-bold text-xl text-primary">
                      {formatCurrency(billing?.calculations?.balanceDue)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="card bg-base-100 shadow-lg border border-base-300 print:hidden"
            >
              <div className="card-body">
                <h3 className="font-semibold mb-2">Actions</h3>
                <div className="space-y-2">
                  <Link
                    to={`/update-booking/${id}`}
                    className="btn btn-primary btn-block gap-2"
                  >
                    <FaEdit /> Edit Booking
                  </Link>

                  {paymentStatus !== "Success" && (
                    <button
                      onClick={handleMarkAsPaid}
                      disabled={markAsPaidMutation.isPending}
                      className="btn btn-success btn-block gap-2"
                    >
                      {markAsPaidMutation.isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaCheck /> Mark as Paid
                        </>
                      )}
                    </button>
                  )}

                  <button onClick={handlePrint} className="btn btn-outline btn-block gap-2">
                    <FaPrint /> Print Details
                  </button>

                  {paymentStatus !== "Cancelled" && (
                    <button
                      onClick={handleDelete}
                      disabled={deleteBookingMutation.isPending}
                      className="btn btn-error btn-outline btn-block gap-2"
                    >
                      {deleteBookingMutation.isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <FaTrash /> Cancel Booking
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInfo;