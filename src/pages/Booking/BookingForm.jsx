import BookingDate from '../../components/BookingDate';
import RoomDetails from '../../components/RoomDetails';
import CustomerDetails from '../../components/CustomerDetails';
import Billings from '../../components/Billings/Billings';
import { useState } from 'react';
import useAxios from '../../components/hooks/useAxios';
import { toast } from 'react-toastify';
import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'framer-motion';

const BookingForm = () => {
  const AxiosInstance = useAxios();
  const [saving, setSaving] = useState(false);

  // Initialize React Hook Form
  const methods = useForm({
    defaultValues: {
      // Dates
      checkInDate: null,
      checkOutDate: null,
      bookingDate: new Date(),
      bookingType: '',
      bookingReference: '',
      purposeOfVisit: '',
      remarks: '',

      // Rooms (Start with one empty room)
      rooms: [{ roomType: "", roomNo: "", adults: 0, children: 0 }],

      // Customer
      name: '',
      customerCode: '',
      mobile: '',
      email: '',
      gender: '',
      nationality: '',

      // Billing
      discountReason: "",
      discount: "",
      commission: "",
      paymentMode: "",
      totalAmountInput: "",
      advanceRemarks: "",
      advanceAmountInput: "",
      bookingChargeInput: "",
      extraCharges: [],
    },
    mode: 'onBlur' // Validate on blur
  });

  const onSubmit = async (data) => {
    setSaving(true);
    console.log("Form Data Submitted:", data);

    // Transform flat form data back to structured object if API expects it
    // Or keep it flat if that's what you prefer. matching old structure:
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
        paymentStatus: 'pending',
        totalAmountInput: data.totalAmountInput,
        advanceRemarks: data.advanceRemarks,
        advanceAmountInput: data.advanceAmountInput,
        bookingChargeInput: data.bookingChargeInput,
        extraCharges: data.extraCharges,
        // Note: Calculated values (subtotal, finalTotal etc) are usually re-calculated on backend 
        // or can be passed if trusted. For now, we send raw inputs.
      }
    };

    try {
      const res = await AxiosInstance.post("/bookings", bookingData);
      console.log(res);

      if (res.data.insertedId || res.status === 200) {
        toast.success("Booking added successfully!");
        methods.reset(); // Reset form
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save booking");
    } finally {
      setSaving(false);
    }
  };

  const onError = (errors) => {
    console.log("Validation Errors:", errors);
    toast.warn("Please fill required fields");
  };

  return (
    <FormProvider {...methods}>
      <form
        id='bookingForm'
        onSubmit={methods.handleSubmit(onSubmit, onError)}
        className="space-y-8 p-6 bg-gray-50 min-h-screen"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center text-indigo-700"
        >
          New Booking
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <BookingDate />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <RoomDetails />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CustomerDetails />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Billings />
        </motion.div>

        {/* --- Save Button --- */}
        <motion.div
          className="flex justify-center pt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 btn h-16 text-2xl text-white font-bold py-3 px-10 rounded-xl shadow-xl hover:bg-indigo-700 hover:shadow-2xl transition duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving...." : "Save Booking"}
          </button>
        </motion.div>
      </form>
    </FormProvider>
  );
};

export default BookingForm;