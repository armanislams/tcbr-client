import { Link, useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../components/hooks/useAxios";
// eslint-disable-next-line no-unused-vars
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
  FaBox,
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
  FaRegBookmark,
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

  // Confirm Booking Mutation
  const markAsPaidMutation = useMutation({
    mutationFn: async () => {
      const updatedBooking = {
        ...booking,
        billing: {
          ...booking.billing,
          paymentStatus: "Confirmed",
        }
      };
      const res = await AxiosInstance.patch(`/bookings/${id}`, updatedBooking);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["booking", id]);
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking confirmed successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to confirm booking: ${error.message}`);
    },
  });

  // Postpone Booking Mutation
  const postponeBookingMutation = useMutation({
    mutationFn: async () => {
      const updatedBooking = {
        ...booking,
        billing: {
          ...booking.billing,
          paymentStatus: "Postponed",
        }
      };
      const res = await AxiosInstance.patch(`/bookings/${id}`, updatedBooking);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["booking", id]);
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking postponed successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to postpone booking: ${error.message}`);
    },
  });

  // Delete Booking Mutation
  const deleteBookingMutation = useMutation({
    mutationFn: async () => {
      // Note: Backend doesn't have DELETE endpoint yet
      // Using PATCH to mark as cancelled for now
      const updatedBooking = {
        ...booking,
        billing: {
          ...booking.billing,
          paymentStatus: "Cancelled",
        }
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

  // Update Payment Mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async ({ amountPaid, mode, ref }) => {
      const currentAdvance = Number(billing?.advanceAmountInput) || 0;
      const newAdvance = currentAdvance + amountPaid;
      
      const newBalance = getBalanceDue(billing) - amountPaid;
      const newPaymentStatus = newBalance <= 0.01 ? "Confirmed" : billing.paymentStatus;

      const updatedBooking = {
        ...booking,
        billing: {
          ...booking.billing,
          advanceAmountInput: String(newAdvance),
          paymentStatus: newPaymentStatus,
          paymentMode: mode || booking.billing?.paymentMode || "",
          paymentRef: ref || booking.billing?.paymentRef || ""
        }
      };
      
      const res = await AxiosInstance.patch(`/bookings/${id}`, updatedBooking);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["booking", id]);
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Payment recorded successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to record payment: ${error.message}`);
    },
  });

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("en-GB") : "-";

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || amount === "") return "RM 0.00";
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return "RM 0.00";
    return `RM ${numAmount.toFixed(2)}`;
  };

  const getBalanceDue = (billing) => {
    if (billing?.calculations?.balanceDue !== undefined) {
      return billing.calculations.balanceDue;
    }
    const total = Number(billing?.totalAmountInput) || 0;
    const advance = Number(billing?.advanceAmountInput) || 0;
    return total - advance;
  };

  const getFinalTotal = (billing) => {
    const base = Number(billing?.totalAmountInput) || 0;
    const disc = Number(billing?.discount) || 0;
    const discounted = base * (1 - disc / 100);
    const charge = Number(billing?.bookingChargeInput) || 0;
    
    let extra = 0;
    if (Array.isArray(billing?.extraCharges)) {
      extra = billing.extraCharges.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    }
    return discounted + charge + extra;
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "";
    const badges = {
      Confirmed: { class: "badge-success", icon: FaCheckCircle },
      Pending: { class: "badge-warning", icon: FaClock },
      Cancelled: { class: "badge-error", icon: FaTimesCircle },
      Postponed: { class: "badge-info", icon: FaClock },
    };
    const badge = badges[normalizedStatus] || badges.Pending;
    const Icon = badge.icon;
    return (
      <div className={`badge ${badge.class} gap-2 px-4 py-3`}>
        <Icon /> {normalizedStatus || "Unknown"}
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirm = async () => {
    const result = await Swal.fire({
      title: "Confirm Booking?",
      text: "Are you sure you want to confirm this booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      markAsPaidMutation.mutate();
    }
  };

  const handlePostpone = async () => {
    const result = await Swal.fire({
      title: "Postpone Booking?",
      text: "Are you sure you want to postpone this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, postpone it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      postponeBookingMutation.mutate();
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

  const handleUpdatePayment = async () => {
    const balanceDue = getBalanceDue(billing);
    const currentMode = billing?.paymentMode || "Cash";
    const isStandardMode = ["Cash", "Card Payment", "Bank Transfer"].includes(currentMode);
    
    const { value: formValues } = await Swal.fire({
      title: "Record Payment",
      html: `
        <div class="text-left space-y-4">
          <p class="text-sm text-gray-500 mb-4">
            Current Balance Due: <strong>RM ${balanceDue.toFixed(2)}</strong>
          </p>
          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold">Select Action</span></label>
            <select id="payment-action" class="select select-bordered w-full">
              <option value="pay-off">Pay Off Full Balance (RM ${balanceDue.toFixed(2)})</option>
              <option value="custom">Pay Custom Amount</option>
            </select>
          </div>
          <div id="custom-amount-wrapper" class="form-control w-full hidden mt-3">
            <label class="label"><span class="label-text font-semibold">Amount to Collect (RM)</span></label>
            <input id="payment-amount" type="number" step="0.01" min="0.01" max="${balanceDue}" class="input input-bordered w-full" placeholder="0.00">
          </div>
          <div class="form-control w-full mt-3">
            <label class="label"><span class="label-text font-semibold">Payment Method</span></label>
            <select id="payment-mode" class="select select-bordered w-full">
              <option value="Cash" ${currentMode === "Cash" ? "selected" : ""}>Cash</option>
              <option value="Card Payment" ${currentMode === "Card Payment" ? "selected" : ""}>Card Payment</option>
              <option value="Bank Transfer" ${currentMode === "Bank Transfer" ? "selected" : ""}>Bank Transfer</option>
              <option value="Other" ${!isStandardMode ? "selected" : ""}>Other</option>
            </select>
          </div>
          <div id="custom-mode-wrapper" class="form-control w-full ${!isStandardMode ? "" : "hidden"} mt-3">
            <label class="label"><span class="label-text font-semibold">Specify Payment Method</span></label>
            <input id="payment-custom-mode" type="text" class="input input-bordered w-full" placeholder="Specify method" value="${!isStandardMode ? currentMode : ""}">
          </div>
          <div class="form-control w-full mt-3">
            <label class="label"><span class="label-text font-semibold">Payment Reference (Optional)</span></label>
            <input id="payment-ref" type="text" class="input input-bordered w-full" placeholder="e.g. TXN-1234, Receipt No.">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Record",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      didOpen: () => {
        const actionSelect = document.getElementById("payment-action");
        const customWrapper = document.getElementById("custom-amount-wrapper");
        actionSelect.addEventListener("change", (e) => {
          if (e.target.value === "custom") {
            customWrapper.classList.remove("hidden");
          } else {
            customWrapper.classList.add("hidden");
          }
        });

        const modeSelect = document.getElementById("payment-mode");
        const modeWrapper = document.getElementById("custom-mode-wrapper");
        modeSelect.addEventListener("change", (e) => {
          if (e.target.value === "Other") {
            modeWrapper.classList.remove("hidden");
          } else {
            modeWrapper.classList.add("hidden");
          }
        });
      },
      preConfirm: () => {
        const action = document.getElementById("payment-action").value;
        const modeSelectVal = document.getElementById("payment-mode").value;
        const customModeVal = document.getElementById("payment-custom-mode").value.trim();
        const mode = modeSelectVal === "Other" ? customModeVal : modeSelectVal;
        const ref = document.getElementById("payment-ref").value.trim();
        
        if (modeSelectVal === "Other" && !customModeVal) {
          Swal.showValidationMessage("Please specify the custom payment method");
          return false;
        }

        if (action === "pay-off") {
          return { action, amount: balanceDue, mode, ref };
        } else {
          const customAmount = parseFloat(document.getElementById("payment-amount").value);
          if (isNaN(customAmount) || customAmount <= 0) {
            Swal.showValidationMessage("Please enter a valid amount greater than 0");
            return false;
          }
          if (customAmount > balanceDue) {
            Swal.showValidationMessage(`Amount cannot exceed the balance due of RM ${balanceDue.toFixed(2)}`);
            return false;
          }
          return { action, amount: customAmount, mode, ref };
        }
      }
    });

    if (formValues) {
      updatePaymentMutation.mutate({
        amountPaid: formValues.amount,
        mode: formValues.mode,
        ref: formValues.ref
      });
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

  const { customerDetails, roomDetails, packageDetails, dates, billing } = booking;

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 print:bg-white print:p-0">
      {/* Screen View (hidden when printing) */}
      <div className="max-w-6xl mx-auto p-6 print:hidden">
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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                  <p>
                    Booking ID: <span className="font-mono font-semibold">{id}</span>
                  </p>
                  {dates?.bookingReference && (
                    <>
                      <span className="hidden md:inline opacity-30">|</span>
                      <p>
                        Reference No: <span className="font-mono font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded select-all">{dates.bookingReference}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(billing?.paymentStatus)}
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

            {/* Package Details */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="card bg-base-100 shadow-lg border border-base-300"
            >
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <FaBox className="text-primary" />
                  Package Details
                </h2>
                <div className="divider my-2"></div>
                {Array.isArray(packageDetails) && packageDetails.length ? (
                  <div className="space-y-4">
                    {packageDetails.map((pkg, idx) => (
                      <div
                        key={idx}
                        className="bg-base-200 rounded-lg p-4 border-l-4 border-primary"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Package Type</p>
                            <p className="font-semibold">{pkg.packageType || "-"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">No. Pax</p>
                            <p className="font-semibold">{pkg.noPax || "-"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p className="font-semibold">{pkg.packageQuantity || "-"}</p>
                          </div>
                          {/* <div>
                            <p className="text-xs text-gray-500">Total Price</p>
                            <p className="font-semibold">{pkg.price ? `RM ${pkg.price}` : "-"}</p>
                          </div> */}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No package details available.</p>
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

            {/* Booking Details / Notes */}
            {(dates?.bookingType || dates?.purposeOfVisit || dates?.remarks) && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="card bg-base-100 shadow-lg border border-base-300"
              >
                <div className="card-body">
                  <h2 className="card-title text-xl flex items-center gap-2">
                    <FaRegBookmark className="text-primary" />
                    Additional Info
                  </h2>
                  <div className="divider my-2"></div>
                  <div className="space-y-3">
                    {dates?.bookingType && (
                      <div>
                        <p className="text-xs text-gray-500">Booking Type</p>
                        <p className="font-semibold capitalize">{dates.bookingType}</p>
                      </div>
                    )}
                    {dates?.purposeOfVisit && (
                      <div>
                        <p className="text-xs text-gray-500">Purpose of Visit</p>
                        <p className="font-semibold">{dates.purposeOfVisit}</p>
                      </div>
                    )}
                    {dates?.remarks && (
                      <div>
                        <p className="text-xs text-gray-500">Remarks</p>
                        <p className="text-sm bg-base-200 p-2.5 rounded-lg border border-base-300 italic whitespace-pre-wrap mt-0.5">
                          "{dates.remarks}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

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
                  {billing?.paymentMode && (
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Payment Mode</span>
                      <span className="font-medium">{billing.paymentMode}</span>
                    </div>
                  )}
                  {billing?.paymentRef && (
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Payment Reference</span>
                      <span className="font-medium font-mono bg-base-200 px-1.5 py-0.5 rounded text-xs select-all">
                        {billing.paymentRef}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Paid Amount</span>
                    <span className="font-semibold text-success">
                      {formatCurrency(billing?.advanceAmountInput)}
                    </span>
                  </div>
                  <div className="divider my-1"></div>
                  <div className="flex justify-between items-center bg-primary bg-opacity-10 p-3 rounded-lg">
                    <span className="font-bold text-white">Balance Due</span>
                    <span className="font-bold text-xl text-white">
                      {formatCurrency(getBalanceDue(billing))}
                    </span>
                  </div>
                  {getBalanceDue(billing) > 0 && (
                    <button
                      onClick={handleUpdatePayment}
                      disabled={updatePaymentMutation.isPending}
                      className="btn btn-outline btn-primary btn-sm btn-block mt-3 gap-2"
                    >
                      {updatePaymentMutation.isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Recording...
                        </>
                      ) : (
                        <>
                          <FaMoneyBillWave /> Record Payment
                        </>
                      )}
                    </button>
                  )}
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

                  {billing?.paymentStatus?.toLowerCase() !== "confirmed" && (
                    <button
                      onClick={handleConfirm}
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
                          <FaCheck /> Confirm Booking
                        </>
                      )}
                    </button>
                  )}

                  {billing?.paymentStatus?.toLowerCase() !== "postponed" && (
                    <button
                      onClick={handlePostpone}
                      disabled={postponeBookingMutation.isPending}
                      className="btn btn-info btn-block gap-2 text-white"
                    >
                      {postponeBookingMutation.isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaClock /> Postpone Booking
                        </>
                      )}
                    </button>
                  )}

                  <button onClick={handlePrint} className="btn btn-outline btn-block gap-2">
                    <FaPrint /> Print Details
                  </button>

                  {billing?.paymentStatus?.toLowerCase() !== "cancelled" && (
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
      </div> {/* ends print:hidden screen view wrapper */}

      {/* Premium Print-Only Invoice Voucher */}
      <div className="hidden print:block text-black p-8 font-sans max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-300 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">TCBR</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">TCBR Resort & Villas</p>
            <p className="text-xs text-gray-400">info@tcbr.com | +60 12-345 6789</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800 tracking-wide uppercase">Booking Voucher</h2>
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              <p><span className="font-semibold">Reference No:</span> <span className="font-mono text-sm font-bold bg-gray-100 px-1 py-0.5 rounded">{dates?.bookingReference || "N/A"}</span></p>
              <p><span className="font-semibold">Booking ID:</span> <span className="font-mono">{id}</span></p>
              <p><span className="font-semibold">Date:</span> {formatDate(dates?.bookingDate)}</p>
              <p>
                <span className="font-semibold">Status:</span> 
                <span className={`ml-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  billing?.paymentStatus?.toLowerCase() === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {billing?.paymentStatus || "Pending"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Grid: Guest & Stay Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Guest Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold uppercase text-gray-700 tracking-wider mb-3 pb-1 border-b border-gray-100">Guest Information</h3>
            <table className="text-xs w-full text-left space-y-2">
              <tbody>
                <tr>
                  <td className="font-semibold text-gray-500 py-1 w-24">Full Name</td>
                  <td className="text-gray-900 font-medium py-1">{customerDetails?.name || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-500 py-1">Code</td>
                  <td className="text-gray-900 font-mono py-1">{customerDetails?.customerCode || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-500 py-1">Mobile</td>
                  <td className="text-gray-900 py-1">{customerDetails?.mobile || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-500 py-1">Email</td>
                  <td className="text-gray-900 py-1 break-all">{customerDetails?.email || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-500 py-1">Nationality</td>
                  <td className="text-gray-900 py-1">{customerDetails?.nationality || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Stay Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold uppercase text-gray-700 tracking-wider mb-3 pb-1 border-b border-gray-100">Stay Information</h3>
            <table className="text-xs w-full text-left space-y-2">
              <tbody>
                <tr>
                  <td className="font-semibold text-gray-500 py-1 w-24">Check In</td>
                  <td className="text-gray-900 font-medium text-success py-1">{formatDate(dates?.checkInDate)}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-500 py-1">Check Out</td>
                  <td className="text-gray-900 font-medium text-warning py-1">{formatDate(dates?.checkOutDate)}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-500 py-1">Total Stay</td>
                  <td className="text-gray-900 py-1">
                    {dates?.checkInDate && dates?.checkOutDate 
                      ? `${Math.ceil((new Date(dates.checkOutDate) - new Date(dates.checkInDate)) / 86400000)} Nights` 
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-500 py-1">Booking Type</td>
                  <td className="text-gray-900 capitalize py-1">{dates?.bookingType || "-"}</td>
                </tr>
                {dates?.purposeOfVisit && (
                  <tr>
                    <td className="font-semibold text-gray-500 py-1">Purpose</td>
                    <td className="text-gray-900 py-1">{dates.purposeOfVisit}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Room Details Table */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase text-gray-700 tracking-wider mb-3">Room Information</h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 font-semibold text-gray-700">Room Type</th>
                <th className="p-3 font-semibold text-gray-700">Room Number</th>
                <th className="p-3 font-semibold text-gray-700 text-center">Adults</th>
                <th className="p-3 font-semibold text-gray-700 text-center">Children</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(roomDetails) && roomDetails.length ? (
                roomDetails.map((room, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-900">{room.roomType || "-"}</td>
                    <td className="p-3 font-mono text-gray-900">{room.roomNo || "-"}</td>
                    <td className="p-3 text-center text-gray-900">{room.adults ?? 0}</td>
                    <td className="p-3 text-center text-gray-900">{room.children ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">No rooms selected</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Package Details (if present) */}
        {Array.isArray(packageDetails) && packageDetails.length > 0 && packageDetails.some(pkg => pkg.packageType) && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase text-gray-700 tracking-wider mb-3">Package Information</h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 font-semibold text-gray-700">Package Type</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">No. Pax</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {packageDetails.map((pkg, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-900">{pkg.packageType || "-"}</td>
                    <td className="p-3 text-center text-gray-900">{pkg.noPax || "-"}</td>
                    <td className="p-3 text-center text-gray-900">{pkg.packageQuantity || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Financial Details (Billing Summary) */}
        <div className="grid grid-cols-2 gap-8 mb-8 items-start">
          {/* Left side: payment info and remarks */}
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
              <h3 className="text-xs font-bold uppercase text-gray-600 tracking-wider mb-2">Payment Details</h3>
              <table className="text-xs w-full text-left space-y-1">
                <tbody>
                  <tr>
                    <td className="text-gray-500 py-1 w-28">Payment Mode</td>
                    <td className="text-gray-900 font-semibold py-1">{billing?.paymentMode || "Unspecified"}</td>
                  </tr>
                  {billing?.paymentRef && (
                    <tr>
                      <td className="text-gray-500 py-1">Payment Reference</td>
                      <td className="text-gray-900 font-mono py-1">{billing.paymentRef}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {dates?.remarks && (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                <h4 className="text-xs font-bold uppercase text-gray-600 tracking-wider mb-2">Remarks / Notes</h4>
                <p className="text-xs text-gray-700 italic whitespace-pre-wrap">"{dates.remarks}"</p>
              </div>
            )}
          </div>

          {/* Right side: billing breakdown */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-bold uppercase text-gray-700 tracking-wider mb-4 pb-1 border-b border-gray-200 font-semibold">Charges Summary</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Room Charges (Base Price)</span>
                <span>{formatCurrency(billing?.totalAmountInput)}</span>
              </div>
              
              {billing?.bookingChargeInput && Number(billing.bookingChargeInput) > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Booking Charge</span>
                  <span>{formatCurrency(billing.bookingChargeInput)}</span>
                </div>
              )}
              
              {billing?.discount && Number(billing.discount) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount ({billing.discount}%)</span>
                  <span>-{formatCurrency((Number(billing.totalAmountInput) || 0) * (Number(billing.discount) / 100))}</span>
                </div>
              )}

              {Array.isArray(billing?.extraCharges) && billing.extraCharges.length > 0 && (
                <div className="border-t border-gray-200 pt-2 space-y-1">
                  {billing.extraCharges.map((charge, idx) => (
                    <div key={idx} className="flex justify-between text-gray-600">
                      <span>{charge.name || "Extra Charge"}</span>
                      <span>{formatCurrency(charge.amount)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-gray-900 text-sm">
                <span>Final Total</span>
                <span>{formatCurrency(getFinalTotal(billing))}</span>
              </div>

              <div className="flex justify-between font-semibold text-green-700 pt-1">
                <span>(-) Paid Amount</span>
                <span>{formatCurrency(billing?.advanceAmountInput)}</span>
              </div>

              <div className="border-t-2 border-double border-gray-400 pt-2 flex justify-between font-extrabold text-indigo-900 text-base">
                <span>Balance Due</span>
                <span>{formatCurrency(getBalanceDue(billing))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Signature Section */}
        <div className="mt-16 text-[10px] text-gray-500 border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="font-bold uppercase mb-2">Terms & Conditions</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Please present this voucher along with official ID card at check-in.</li>
                <li>Standard Check-In time is 2:00 PM and Check-Out time is 12:00 PM.</li>
                <li>This reservation is non-transferable and non-refundable.</li>
              </ul>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-center w-36">
                <div className="border-b border-gray-400 h-10 w-full mb-1"></div>
                <p className="font-semibold text-gray-600">Guest Signature</p>
              </div>
              <div className="text-center w-36">
                <div className="border-b border-gray-400 h-10 w-full mb-1"></div>
                <p className="font-semibold text-gray-600">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInfo;