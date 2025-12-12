import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaAngleDown,
  FaBook,
  FaCalendarAlt,
  FaCalendarCheck,
  FaInfinity,
  FaRegBookmark,
} from "react-icons/fa";
import { FaCalendarDays, FaCalendarXmark } from "react-icons/fa6";
import { useFormContext, Controller } from "react-hook-form";

const inputClasses =
  "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

const CustomDateInput = React.forwardRef(
  ({ value, onClick, placeholder, icon: Icon }, ref) => (
    <div className="relative">
      <input
        type="text"
        className={inputClasses + " pl-10 cursor-pointer"}
        onClick={onClick}
        value={value || ""}
        readOnly
        ref={ref}
        placeholder={placeholder}
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

const FieldWrapper = ({ label, children, required = false, error }) => (
  <div className="flex-1 min-w-[180px]">
    <label className={labelClasses}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <span className="text-xs text-red-500 mt-1">{error.message}</span>}
  </div>
);

const BookingDate = () => {
  const { control, register, formState: { errors } } = useFormContext();

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-10 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Reservation Details
      </h2>

      {/* Dates Row */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Check-in */}
        <Controller
          control={control}
          name="checkInDate"
          rules={{ required: "Check-in date is required" }}
          render={({ field }) => (
            <FieldWrapper label="Check In" required error={errors.checkInDate}>
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
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
          )}
        />

        {/* Check-out */}
        <Controller
          control={control}
          name="checkOutDate"
          rules={{ required: "Check-out date is required" }}
          render={({ field }) => (
            <FieldWrapper label="Check Out" required error={errors.checkOutDate}>
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
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
          )}
        />

        {/* Booking Date */}
        <Controller
          control={control}
          name="bookingDate"
          render={({ field }) => (
            <FieldWrapper label="Booking Date" error={errors.bookingDate}>
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                customInput={
                  <CustomDateInput placeholder="dd/mm/yyyy" icon={FaCalendarDays} />
                }
                isClearable
              />
            </FieldWrapper>
          )}
        />
      </div>

      {/* Booking Type, Reference No, Purpose */}
      <div className="grid md:grid-cols-3 gap-6">
        <FieldWrapper label="Booking Type" error={errors.bookingType}>
          <div className="relative">
            <select
              className={inputClasses + " pl-10 appearance-none"}
              {...register("bookingType")}
            >
              <option value="" disabled>
                Choose Booking Type
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

        <FieldWrapper label="Booking Reference No" error={errors.bookingReference}>
          <div className="relative">
            <input
              type="text"
              placeholder="Booking Reference No."
              className={inputClasses + " pl-10"}
              {...register("bookingReference")}
            />
            <FaRegBookmark className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </div>
        </FieldWrapper>

        <FieldWrapper label="Purpose of Visit" error={errors.purposeOfVisit}>
          <div className="relative">
            <input
              type="text"
              placeholder="Purpose of Visit"
              className={inputClasses + " pl-10"}
              {...register("purposeOfVisit")}
            />
            <FaInfinity className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </div>
        </FieldWrapper>
      </div>

      {/* Remarks */}
      <div>
        <label className={labelClasses}>Remarks</label>
        <div className="relative">
          <textarea
            placeholder="Remarks"
            rows="3"
            className={inputClasses + " pl-10 resize-none"}
            {...register("remarks")}
          />
          <FaRegBookmark className="absolute left-0 top-3 w-4 ml-3 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default BookingDate;
