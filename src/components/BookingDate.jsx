import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Essential CSS
import { FaCalendarAlt, FaAngleDown, FaBook, FaInfinity, FaRegBookmark } from 'react-icons/fa';
import { FaCalendarCheck, FaCalendarXmark, FaCalendarDays } from 'react-icons/fa6'; // Using FaCalendarDays for the new field


 // Common styling for the input fields
  const inputClasses =
    "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  // Custom Input for DatePicker to match the design
  const CustomDateInput = React.forwardRef(
    ({ value, onClick, placeholder, icon: Icon }, ref) => (
      <div className="relative">
        <input
          type="text"
          className={inputClasses + " pl-10 cursor-pointer"}
          onClick={onClick}
          value={value || placeholder}
          readOnly
          ref={ref}
        />
        <span className="absolute left-0 top-0 h-full flex items-center pl-3 pointer-events-none text-gray-400">
          {Icon && <Icon className="w-4 h-4" />}
        </span>
        <span className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none text-gray-400">
          <FaCalendarAlt className="w-4 h-4" />
        </span>
      </div>
    )
);
  
const BookingDate = ({dates, setDates}) => {
  // State for the date pickers
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [bookingType, setBookingType] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [remarks, setRemarks] = useState("");

  // Debounced update function
  useEffect(() => {
    const id = setTimeout(() => {
      setDates({
        checkInDate,
        checkOutDate,
        bookingDate,
        bookingType,
        bookingReference, // value comes from local state set via setBookingReference
        purposeOfVisit,
        remarks,
      });
    }, 300); // debounce delay

    return () => clearTimeout(id);
  }, [
    checkInDate,
    checkOutDate,
    bookingDate,
    bookingType,
    bookingReference,
    purposeOfVisit,
    remarks,
    setDates,
  ]);

 

  // Reusable Field Wrapper
  const FieldWrapper = ({ label, children, required = false }) => (
    <div className="flex-1 min-w-[180px]">
      {" "}
      {/* Adjusted for horizontal spacing */}
      <label className={labelClasses}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-10"
    >
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Reservation Details
      </h2>

      {/* Top Row: Check In, Check Out, Booking Date */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        {/* 1. Check In Date */}
        <FieldWrapper label="Check In" required={true}>
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            customInput={
              <CustomDateInput
                placeholder="dd/mm/yyyy"
                icon={FaCalendarCheck}
              />
            }
            isClearable
          />
        </FieldWrapper>

        {/* 2. Check Out Date */}
        <FieldWrapper label="Check Out" required={true}>
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            customInput={
              <CustomDateInput
                placeholder="dd/mm/yyyy"
                icon={FaCalendarXmark}
              />
            }
            isClearable
          />
        </FieldWrapper>

        {/* 3. Booking Date ( defaults to today) */}
        <FieldWrapper label="Booking Date" required={false}>
          <DatePicker
            selected={bookingDate}
            onChange={(date) => setBookingDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            customInput={
              <CustomDateInput placeholder="dd/mm/yyyy" icon={FaCalendarDays} />
            }
            isClearable
          />
        </FieldWrapper>
      </div>

      {/* Second Row: Booking Type, Booking Reference No, Purpose of Visit */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* 4. Booking Type */}
        <FieldWrapper label="Booking Type">
          <div className="relative">
            <select
              className={inputClasses + " pl-10 appearance-none"}
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
            >
              <option value="" disabled>
                Choose Booking Reference
              </option>
              <option value="online">Online</option>
              <option value="call">Call</option>
              <option value="event">Event</option>
              <option value="walkin">Walk-In</option>
            </select>
            <FaBook className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
            <FaAngleDown className="absolute right-0 top-0 h-full w-4 mr-3 text-gray-400 pointer-events-none" />
          </div>
        </FieldWrapper>

        {/* 5. Booking Reference No */}
        <FieldWrapper label="Booking Reference No">
          <div className="relative">
            <input
              type="text"
              placeholder="Booking Reference No."
              value={bookingReference}
              onChange={(e) => setBookingReference(e.target.value)}
              className={inputClasses + " pl-10"}
            />
            <FaRegBookmark className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </div>
        </FieldWrapper>

        {/* 6. Purpose of Visit */}
        <FieldWrapper label="Purpose of Visit (if have any)">
          <div className="relative">
            <input
              type="text"
              placeholder="Purpose of Visit"
              value={purposeOfVisit}
              onChange={(e) => setPurposeOfVisit(e.target.value)}
              className={inputClasses + " pl-10"}
            />
            <FaInfinity className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </div>
        </FieldWrapper>
      </div>

      {/* 7. Remarks (Full Width) */}
      <div className="mt-6">
        <label className={labelClasses}>Remarks</label>
        <div className="relative">
          <textarea
            placeholder="Remarks"
            rows="3"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className={inputClasses + " pl-10 resize-none"}
          ></textarea>
          <FaRegBookmark className="absolute left-0 top-3 w-4 ml-3 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </form>
  );
};

export default BookingDate;