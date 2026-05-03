import BookingDate from "../../components/BookingDate";
import RoomDetails from "../../components/RoomDetails";
import CustomerDetails from "../../components/CustomerDetails";
import Billings from "../../components/Billings/Billings";
import PackageDetails from "../../components/PackageDetails";
import { useState, useEffect } from "react";
import useAxios from "../../components/hooks/useAxios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { useForm, FormProvider } from "react-hook-form";

const UpdateBooking = () => {
  const { id } = useParams(); // booking id
  const AxiosInstance = useAxios();
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
  useEffect(() => {
    const fetchBooking = async () => {
      try {
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
          paymentMode: data.billing?.paymentMode || "",
          paymentStatus: data.billing?.paymentStatus || "pending",
          totalAmountInput: data.billing?.totalAmountInput || "",
          advanceRemarks: data.billing?.advanceRemarks || "",
          advanceAmountInput: data.billing?.advanceAmountInput || "",
          bookingChargeInput: data.billing?.bookingChargeInput || "",
          extraCharges: data.billing?.extraCharges || [],
        });

      } catch (err) {
        console.error("Failed to fetch booking", err);
        toast.error("Failed to load booking");
      } finally {
        setLoading(false);
        navigate(`/bookings/${id}`)
      }
    };
    fetchBooking();
  }, [id, AxiosInstance, methods, navigate]);

  const onSubmit = async (data) => {
    setUpdating(true);
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
        paymentMode: data.paymentMode,
        paymentStatus: data.paymentStatus || 'pending',
        totalAmountInput: data.totalAmountInput,
        advanceRemarks: data.advanceRemarks,
        advanceAmountInput: data.advanceAmountInput,
        bookingChargeInput: data.bookingChargeInput,
        extraCharges: data.extraCharges,
      }
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
      const errMsg = err.response?.data?.error || "Error updating booking!";
      toast.error(errMsg);
    } finally {
      setUpdating(false);
    }
  };

  const onError = (errors) => {
    console.log("Validation Errors:", errors);
    toast.warn("Please fill required fields");
  };

  if (loading)
    return <p className="text-center mt-10">Loading booking data...</p>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)} className="space-y-8 p-6">
        <h2 className="text-2xl font-bold text-center">Update Booking</h2>

        <BookingDate />
        <RoomDetails />
        <CustomerDetails />
        <PackageDetails />
        <Billings />

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={updating}
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Booking"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UpdateBooking;
