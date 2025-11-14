// import React from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { FaAngleDown, FaBook, FaCalendarAlt, FaCalendarCheck, FaInfinity, FaRegBookmark } from "react-icons/fa";
// import { FaCalendarDays, FaCalendarXmark } from "react-icons/fa6";


// const inputClasses =
//   "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
// const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

// const CustomDateInput = React.forwardRef(
//   ({ value, onClick, placeholder, icon: Icon }, ref) => (
//     <div className="relative">
//       <input
//         type="text"
//         className={inputClasses + " pl-10 cursor-pointer"}
//         onClick={onClick}
//         value={value || ""}
//         readOnly
//         ref={ref}
//         placeholder={placeholder}
//       />
//       <span className="absolute left-0 top-0 h-full flex items-center pl-3 pointer-events-none text-gray-400">
//         {Icon && <Icon className="w-4 h-4" />}
//       </span>
//       <span className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none text-gray-400">
//         <FaCalendarAlt className="w-4 h-4" />
//       </span>
//     </div>
//   )
// );

// // const FieldWrapper = ({ label, children, required = false }) => (
// //   <div className="flex-1 min-w-[180px]">
// //     <label className={labelClasses}>
// //       {label} {required && <span className="text-red-500">*</span>}
// //     </label>
// //     {children}
// //   </div>
// // );
// const FieldWrapper = ({ label, name, children, required = false }) => (
//   <div
//     className="flex-1 min-w-[180px]"
//     data-name={name}
//     data-required={required}
//   >
//     <label className={labelClasses}>
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     {children}
//   </div>
// );


// const BookingDate = ({ dates, setDates }) => {
//   const handleChange = (key, value) => {
//     setDates({ ...dates, [key]: value });
//   };



//   return (
//     <div className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-10 space-y-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-6">
//         Reservation Details
//       </h2>

//       {/* Dates Row */}
//       <div className="flex flex-col sm:flex-row gap-6">
//         <FieldWrapper label="Check In" required>
//           <DatePicker
//             selected={dates.checkInDate || null}
//             onChange={(date) => handleChange("checkInDate", date)}
//             dateFormat="dd/MM/yyyy"
//             placeholderText="dd/mm/yyyy"
//             required
//             customInput={
//               <CustomDateInput
//                 placeholder="dd/mm/yyyy"
//                 icon={FaCalendarCheck}
//               />
//             }
//             isClearable
//           />
//         </FieldWrapper>

//         <FieldWrapper label="Check Out" required>
//           <DatePicker
//             selected={dates.checkOutDate || null}
//             onChange={(date) => handleChange("checkOutDate", date)}
//             dateFormat="dd/MM/yyyy"
//             placeholderText="dd/mm/yyyy"
//             required
//             customInput={
//               <CustomDateInput
//                 placeholder="dd/mm/yyyy"
//                 icon={FaCalendarXmark}
//               />
//             }
//             isClearable
//           />
//         </FieldWrapper>

//         <FieldWrapper label="Booking Date">
//           <DatePicker
//             selected={ new Date()}
//             onChange={(date) => handleChange("bookingDate", date)}
//             dateFormat="dd/MM/yyyy"
//             placeholderText="dd/mm/yyyy"
//             customInput={
//               <CustomDateInput placeholder="dd/mm/yyyy" icon={FaCalendarDays} />
//             }
//             isClearable
//           />
//         </FieldWrapper>
//       </div>

//       {/* Booking Type, Reference, Purpose */}
//       <div className="grid md:grid-cols-3 gap-6">
//         <FieldWrapper label="Booking Type">
//           <div className="relative">
//             <select
//               className={inputClasses + " pl-10 appearance-none"}
//               value={dates.bookingType || ""}
//               onChange={(e) => handleChange("bookingType", e.target.value)}
//             >
//               <option value="" disabled>
//                 Choose Booking Type
//               </option>
//               <option value="online">Online</option>
//               <option value="call">Call</option>
//               <option value="event">Event</option>
//               <option value="walkin">Walk-In</option>
//             </select>
//             <FaBook className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
//             <FaAngleDown className="absolute right-0 top-0 h-full w-4 mr-3 text-gray-400 pointer-events-none" />
//           </div>
//         </FieldWrapper>

//         <FieldWrapper label="Booking Reference No">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Booking Reference No."
//               value={dates.bookingReference || ""}
//               onChange={(e) => handleChange("bookingReference", e.target.value)}
//               className={inputClasses + " pl-10"}
//             />
//             <FaRegBookmark className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
//           </div>
//         </FieldWrapper>

//         <FieldWrapper label="Purpose of Visit">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Purpose of Visit"
//               value={dates.purposeOfVisit || ""}
//               onChange={(e) => handleChange("purposeOfVisit", e.target.value)}
//               className={inputClasses + " pl-10"}
//             />
//             <FaInfinity className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
//           </div>
//         </FieldWrapper>
//       </div>

//       {/* Remarks */}
//       <div>
//         <label className={labelClasses}>Remarks</label>
//         <div className="relative">
//           <textarea
//             placeholder="Remarks"
//             rows="3"
//             value={dates.remarks || ""}
//             onChange={(e) => handleChange("remarks", e.target.value)}
//             className={inputClasses + " pl-10 resize-none"}
//           />
//           <FaRegBookmark className="absolute left-0 top-3 w-4 ml-3 text-gray-400 pointer-events-none" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingDate;

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

const FieldWrapper = ({ label, name, children, required = false }) => (
  <div
    className="flex-1 min-w-[180px]"
    data-name={name}
    data-required={required}
  >
    <label className={labelClasses}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const BookingDate = ({ dates, setDates }) => {
  const handleChange = (key, value) => {
    setDates({ ...dates, [key]: value });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-10 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Reservation Details
      </h2>

      {/* Dates Row */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Check-in */}
        <FieldWrapper label="Check In" name="checkInDate" required>
          <DatePicker
            selected={dates.checkInDate || null}
            onChange={(date) => handleChange("checkInDate", date)}
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
          {/* REAL INPUT FOR VALIDATION */}
          <input
            type="date"
            required
            hidden
            value={
              dates.checkInDate
                ? dates.checkInDate.toISOString().split("T")[0]
                : ""
            }
            onChange={() => {}}
          />
        </FieldWrapper>

        {/* Check-out */}
        <FieldWrapper label="Check Out" name="checkOutDate" required>
          <DatePicker
            selected={dates.checkOutDate || null}
            onChange={(date) => handleChange("checkOutDate", date)}
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
          {/* REAL INPUT FOR VALIDATION */}
          <input
            type="date"
            required
            hidden
            value={
              dates.checkOutDate
                ? dates.checkOutDate.toISOString().split("T")[0]
                : ""
            }
            onChange={() => {}}
          />
        </FieldWrapper>

        {/* Booking Date */}
        <FieldWrapper label="Booking Date" name="bookingDate">
          <DatePicker
            selected={dates.bookingDate || new Date()}
            onChange={(date) => handleChange("bookingDate", date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            customInput={
              <CustomDateInput placeholder="dd/mm/yyyy" icon={FaCalendarDays} />
            }
            isClearable
          />
        </FieldWrapper>
      </div>

      {/* Booking Type, Reference No, Purpose */}
      <div className="grid md:grid-cols-3 gap-6">
        <FieldWrapper label="Booking Type" name="bookingType">
          <div className="relative">
            <select
              className={inputClasses + " pl-10 appearance-none"}
              value={dates.bookingType || ""}
              onChange={(e) => handleChange("bookingType", e.target.value)}
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

        <FieldWrapper label="Booking Reference No">
          <div className="relative">
            <input
              type="text"
              placeholder="Booking Reference No."
              value={dates.bookingReference || ""}
              onChange={(e) => handleChange("bookingReference", e.target.value)}
              className={inputClasses + " pl-10"}
            />
            <FaRegBookmark className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </div>
        </FieldWrapper>

        <FieldWrapper label="Purpose of Visit">
          <div className="relative">
            <input
              type="text"
              placeholder="Purpose of Visit"
              value={dates.purposeOfVisit || ""}
              onChange={(e) => handleChange("purposeOfVisit", e.target.value)}
              className={inputClasses + " pl-10"}
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
            value={dates.remarks || ""}
            onChange={(e) => handleChange("remarks", e.target.value)}
            className={inputClasses + " pl-10 resize-none"}
          />
          <FaRegBookmark className="absolute left-0 top-3 w-4 ml-3 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default BookingDate;
