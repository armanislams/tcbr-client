import { useEffect } from "react";
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
import BookingVoucherPrint from "../../components/BookingVoucherPrint";

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

  // Set tab title to the booking reference / invoice number
  useEffect(() => {
    if (booking) {
      const invNo = booking.dates?.bookingReference || booking._id?.substring(0, 8).toUpperCase() || "Invoice";
      document.title = invNo;
    }
    return () => {
      document.title = "tcbr-project";
    };
  }, [booking]);

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

  const getBillingCalculations = (billing) => {
    const base = Number(billing?.totalAmountInput) || 0;
    const disc = Number(billing?.discount) || 0;
    const discounted = base * (1 - disc / 100);
    const charge = Number(billing?.bookingChargeInput) || 0;
    const sst = discounted * 0.08;
    
    let extra = 0;
    if (Array.isArray(billing?.extraCharges)) {
      extra = billing.extraCharges.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    }
    
    const finalTotal = discounted + charge + sst + extra;
    const paid = Number(billing?.advanceAmountInput) || 0;
    const balanceDue = finalTotal - paid;
    
    return {
      discountVal: base * (disc / 100),
      bookingCharge: charge,
      sstVal: sst,
      extraChargesSum: extra,
      finalTotal,
      balanceDue
    };
  };

  const getBalanceDue = (billing) => {
    return getBillingCalculations(billing).balanceDue;
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

  const { customerDetails, roomDetails, packageDetails, dates, billing, modificationHistory } = booking;

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
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                          <div>
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="font-semibold text-primary">{formatCurrency(room.price)}</p>
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
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Base Amount</span>
                    <span className="font-semibold text-gray-700">
                      {formatCurrency(billing?.totalAmountInput)}
                    </span>
                  </div>

                  {getBillingCalculations(billing).discountVal > 0 && (
                    <div className="flex justify-between items-center text-sm text-rose-500">
                      <span>Discount ({billing.discount}%)</span>
                      <span className="font-semibold">
                        -{formatCurrency(getBillingCalculations(billing).discountVal)}
                      </span>
                    </div>
                  )}

                  {getBillingCalculations(billing).bookingCharge > 0 && (
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Booking Charge</span>
                      <span className="font-semibold text-gray-700">
                        +{formatCurrency(getBillingCalculations(billing).bookingCharge)}
                      </span>
                    </div>
                  )}

                  {getBillingCalculations(billing).extraChargesSum > 0 && (
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Extra Charges</span>
                      <span className="font-semibold text-gray-700">
                        +{formatCurrency(getBillingCalculations(billing).extraChargesSum)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-500 border-b border-gray-100 pb-2">
                    <span>SST (8%)</span>
                    <span className="font-semibold text-gray-700">
                      +{formatCurrency(getBillingCalculations(billing).sstVal)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Final Total</span>
                    <span className="font-bold text-lg text-primary">
                      {formatCurrency(getBillingCalculations(billing).finalTotal)}
                    </span>
                  </div>

                  {billing?.paymentMode && (
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Payment Mode</span>
                      <span className="font-medium text-gray-700">{billing.paymentMode}</span>
                    </div>
                  )}
                  {billing?.paymentRef && (
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Payment Reference</span>
                      <span className="font-medium font-mono bg-base-200 px-1.5 py-0.5 rounded text-xs select-all text-gray-700">
                        {billing.paymentRef}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-gray-100 pt-2">
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

        {/* Modification History Logs (Admin Audits) */}
        {Array.isArray(modificationHistory) && modificationHistory.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="card bg-base-100 shadow-lg border border-base-300 mt-6"
          >
            <div className="card-body">
              <h2 className="card-title text-xl flex items-center gap-2 text-primary">
                <FaRegBookmark />
                Modification History Log
              </h2>
              <div className="divider my-2"></div>
              
              <div className="space-y-4">
                {modificationHistory.map((history, idx) => (
                  <div key={idx} className="border-l-4 border-info bg-base-200 p-4 rounded-r-lg space-y-2 text-sm">
                    <div className="flex justify-between items-center text-xs text-gray-500 font-semibold">
                      <span>Modified by: <span className="text-gray-800 font-bold">{history.modifiedBy}</span></span>
                      <span>{new Date(history.modifiedAt).toLocaleString("en-GB")}</span>
                    </div>
                    
                    {/* Render specific details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-base-100 p-3 rounded border border-base-300 mt-2">
                      {history.changes?.dates && (
                        <div>
                          <p className="font-bold text-primary mb-1">Timeline Dates Updated</p>
                          <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                            {Object.entries(history.changes.dates).map(([key, val]) => (
                              <li key={key}>
                                <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>{" "}
                                <span className="line-through text-red-500">{val.old || "-"}</span>{" "}
                                <span className="text-gray-400 font-bold">➔</span>{" "}
                                <span className="text-success font-semibold">{val.new || "-"}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {history.changes?.billing && (
                        <div>
                          <p className="font-bold text-primary mb-1">Billing Details Updated</p>
                          <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                            {Object.entries(history.changes.billing).map(([key, val]) => (
                              <li key={key}>
                                <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>{" "}
                                <span className="line-through text-red-500">{val.old || "-"}</span>{" "}
                                <span className="text-gray-400 font-bold">➔</span>{" "}
                                <span className="text-success font-semibold">{val.new || "-"}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {history.changes?.rooms && (
                        <div className="md:col-span-2 border-t border-base-200 pt-2 mt-2">
                          <p className="font-bold text-primary mb-1">Room Setup Modified</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                            <div className="bg-base-200/50 p-2 rounded">
                              <p className="text-xs text-gray-500 font-bold mb-1">Old Setup:</p>
                              <ul className="list-disc pl-4 text-gray-600 space-y-0.5">
                                {history.changes.rooms.old?.map((r, i) => (
                                  <li key={i}>{r.roomNo} ({r.roomType}) - Price: RM {r.price || 0}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-success/5 p-2 rounded border border-success/15">
                              <p className="text-xs text-success font-bold mb-1">New Setup:</p>
                              <ul className="list-disc pl-4 text-success font-semibold space-y-0.5">
                                {history.changes.rooms.new?.map((r, i) => (
                                  <li key={i}>{r.roomNo} ({r.roomType}) - Price: RM {r.price || 0}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div> {/* ends print:hidden screen view wrapper */}

      {/* Premium Print-Only Invoice Voucher */}
      <BookingVoucherPrint booking={booking} />
    </div>
  );
};

export default BookingInfo;