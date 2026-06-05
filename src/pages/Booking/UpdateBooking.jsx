import BookingDate from "../../components/BookingDate";
import RoomDetails from "../../components/RoomDetails";
import CustomerDetails from "../../components/CustomerDetails";
import Billings from "../../components/Billings/Billings";
import PackageDetails from "../../components/PackageDetails";
// import { useState, useEffect } from "react";
import useAxios from "../../components/hooks/useAxios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const UpdateBooking = () => {
  const { id } = useParams(); // booking id
  const AxiosInstance = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const methods = useForm({
    defaultValues: {
      checkInDate: null,
      checkOutDate: null,
      bookingDate: new Date(),
      bookingType: '',
      bookingReference: '',
      purposeOfVisit: '',
      remarks: '',
      rooms: [{ roomType: "", roomNo: "", adults: 0, children: 0 }],
      packages: [{ packageType: "", noPax: "", packageQuantity: "", price: "" }],
      name: '',
      customerCode: '',
      mobile: '',
      email: '',
      gender: '',
      nationality: '',
      discountReason: "",
      discount: "",
      commission: "",
      paymentMode: "",
      customPaymentMode: "",
      paymentRef: "",
      paymentStatus: "pending",
      totalAmountInput: "",
      advanceRemarks: "",
      advanceAmountInput: "",
      bookingChargeInput: "",
      extraCharges: [],
    },
    mode: 'onBlur'
  });

  // Fetch existing booking data
  const { isLoading: loading, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await AxiosInstance.get(`/bookings/${id}`);
      const data = res.data;
      console.log("Fetched booking:", data);

      methods.reset({
        checkInDate: data.dates?.checkInDate ? new Date(data.dates.checkInDate) : null,
        checkOutDate: data.dates?.checkOutDate ? new Date(data.dates.checkOutDate) : null,
        bookingDate: data.dates?.bookingDate ? new Date(data.dates.bookingDate) : new Date(),
        bookingType: data.dates?.bookingType || "",
        bookingReference: data.dates?.bookingReference || "",
        purposeOfVisit: data.dates?.purposeOfVisit || "",
        remarks: data.dates?.remarks || "",

        rooms: data.roomDetails?.length ? data.roomDetails : [{ roomType: "", roomNo: "", adults: 0, children: 0 }],
        packages: data.packageDetails?.length ? data.packageDetails : [{ packageType: "", noPax: "", packageQuantity: "", price: "" }],

        name: data.customerDetails?.name || "",
        customerCode: data.customerDetails?.customerCode || "",
        mobile: data.customerDetails?.mobile || "",
        email: data.customerDetails?.email || "",
        gender: data.customerDetails?.gender || "",
        nationality: data.customerDetails?.nationality || "",

        discountReason: data.billing?.discountReason || "",
        discount: data.billing?.discount || "",
        commission: data.billing?.commission || "",
        paymentMode: (["Cash", "Card Payment", "Bank Transfer"].includes(data.billing?.paymentMode || "") || !(data.billing?.paymentMode)) ? (data.billing?.paymentMode || "") : "Other",
        customPaymentMode: (["Cash", "Card Payment", "Bank Transfer"].includes(data.billing?.paymentMode || "") || !(data.billing?.paymentMode)) ? "" : (data.billing?.paymentMode || ""),
        paymentRef: data.billing?.paymentRef || "",
        paymentStatus: data.billing?.paymentStatus || "pending",
        totalAmountInput: data.billing?.totalAmountInput || "",
        advanceRemarks: data.billing?.advanceRemarks || "",
        advanceAmountInput: data.billing?.advanceAmountInput || "",
        bookingChargeInput: data.billing?.bookingChargeInput || "",
        extraCharges: data.billing?.extraCharges || [],
      });
      return data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false, // Don't refetch automatically to prevent wiping form state
  });

  const updateMutation = useMutation({
    mutationFn: async (bookingData) => {
      const res = await AxiosInstance.patch(`/bookings/${id}`, bookingData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Booking updated successfully!");
      queryClient.invalidateQueries(["booking", id]);
      queryClient.invalidateQueries(["bookings"]);
      // Navigate to booking-info after successful update
      navigate(`/booking-info/${id}`);
    },
    onError: (err) => {
      console.error(err);
      const errMsg = err.response?.data?.error || "Error updating booking!";
      toast.error(errMsg);
    }
  });

  const onSubmit = (data) => {
    const bookingData = {
      dates: {
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        bookingDate: data.bookingDate,
        bookingType: data.bookingType,
        bookingReference: data.bookingReference,
        purposeOfVisit: data.purposeOfVisit,
        remarks: data.remarks
      },
      roomDetails: data.rooms,
      packageDetails: data.packages,
      customerDetails: {
        name: data.name,
        customerCode: data.customerCode,
        mobile: data.mobile,
        email: data.email,
        gender: data.gender,
        nationality: data.nationality
      },
      billing: {
        discountReason: data.discountReason,
        discount: data.discount,
        commission: data.commission,
        paymentMode: data.paymentMode === "Other" ? data.customPaymentMode : data.paymentMode,
        paymentRef: data.paymentRef || "",
        paymentStatus: data.paymentStatus || 'pending',
        totalAmountInput: data.totalAmountInput,
        advanceRemarks: data.advanceRemarks,
        advanceAmountInput: data.advanceAmountInput,
        bookingChargeInput: data.bookingChargeInput,
        extraCharges: data.extraCharges,
      }
    };

    updateMutation.mutate(bookingData);
  };

  const onError = (errors) => {
    console.log("Validation Errors:", errors);
    toast.warn("Please fill required fields");
  };

  if (loading) return <p className="text-center mt-10">Loading booking data...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Error loading booking data</p>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)} className="space-y-8 p-6">
        <h2 className="text-2xl font-bold text-center">Update Booking</h2>

        <BookingDate isEdit={true} />
        <RoomDetails />
        <CustomerDetails />
        <PackageDetails />
        <Billings />

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
          >
            {updateMutation.isPending ? "Updating..." : "Update Booking"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UpdateBooking;
