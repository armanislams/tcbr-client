import React, { useEffect, useRef, useState } from 'react';
import { 
    FaMobileAlt, FaEnvelope, FaLocationArrow, FaBuilding, 
    FaMapPin, FaRegUser, FaBriefcase, FaCalendarAlt, 
    FaMale, FaFemale, FaAddressCard
} from 'react-icons/fa';
import { FaUserTag } from 'react-icons/fa6';


const CustomerDetails = ({
  customerDetails = {},
  setCustomerDetails = () => {},
}) => {
  const [gender, setGender] = useState(customerDetails.gender || "Male");
  const [isVIP, setIsVIP] = useState(customerDetails.isVIP || false);
  const [customerCode, setCustomerCode] = useState(
    customerDetails.customerCode || ""
  );
  const [name, setName] = useState(customerDetails.name || "");
  const [mobile, setMobile] = useState(customerDetails.mobile || "");
  const [email, setEmail] = useState(customerDetails.email || "");
  const [nationality, setNationality] = useState(
    customerDetails.nationality || "Local"
  );

  // refs for inputs to restore focus if parent re-renders
  const nameRef = useRef(null);
  const mobileRef = useRef(null);
  const emailRef = useRef(null);
  const codeRef = useRef(null);

  // remember which field had focus
  const focusedFieldRef = useRef(null);

  // sync local state when parent provides new customerDetails (only when values actually change)
  useEffect(() => {
    if (customerDetails) {
      if (customerDetails.gender !== undefined)
        setGender(customerDetails.gender);
      if (customerDetails.isVIP !== undefined) setIsVIP(customerDetails.isVIP);
      if (customerDetails.customerCode !== undefined)
        setCustomerCode(customerDetails.customerCode);
      if (customerDetails.name !== undefined) setName(customerDetails.name);
      if (customerDetails.mobile !== undefined)
        setMobile(customerDetails.mobile);
      if (customerDetails.email !== undefined) setEmail(customerDetails.email);
      if (customerDetails.nationality !== undefined)
        setNationality(customerDetails.nationality);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    customerDetails?.customerCode,
    customerDetails?.name,
    customerDetails?.mobile,
    customerDetails?.email,
    customerDetails?.gender,
    customerDetails?.isVIP,
    customerDetails?.nationality,
  ]);

  // report back to parent (debounced)
  useEffect(() => {
    const id = setTimeout(() => {
      setCustomerDetails({
        customerCode,
        name,
        mobile,
        email,
        gender,
        nationality,
        isVIP,
      });
    }, 250);
    return () => clearTimeout(id);
  }, [
    customerCode,
    name,
    mobile,
    email,
    gender,
    nationality,
    isVIP,
    setCustomerDetails,
  ]);

  // restore focus to the previously focused input after updates
  useEffect(() => {
    const field = focusedFieldRef.current;
    if (!field) return;
    const map = {
      name: nameRef,
      mobile: mobileRef,
      email: emailRef,
      code: codeRef,
    };
    const ref = map[field];
    if (ref?.current) {
      // small timeout to ensure DOM has updated
      requestAnimationFrame(() => ref.current.focus());
    }
  });

  // common styling
  const inputClasses =
    "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  // focus handlers store last focused field
  const onFocusField = (fieldName) => () => {
    focusedFieldRef.current = fieldName;
  };
  const onBlurField = () => {
    /* keep last focused until another focus occurs */
  };

  // Custom Input for DatePicker
  const CustomDateInput = React.forwardRef(
    ({ value, onClick, placeholder }, ref) => (
      <div className="relative">
        <input
          type="text"
          className={inputClasses + " pl-3 cursor-pointer"}
          onClick={onClick}
          value={value || placeholder}
          readOnly
          ref={ref}
        />
        <span className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none text-gray-400">
          <FaCalendarAlt className="w-4 h-4" />
        </span>
      </div>
    )
  );

  // Reusable Input/Select/Date Field Wrapper
  const FieldWrapper = ({ label, children, colSpan = 1, required = false }) => (
    <div className={`col-span-${colSpan}`}>
      <label className={labelClasses}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">{children}</div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Customer Details
      </h2>

      {/* Main Grid: Split into two primary columns */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* === LEFT COLUMN: GUEST DETAILS ( starts with Name) === */}
        <div className="p-4 border border-gray-100 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Guest Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Customer Code  */}
            <FieldWrapper label="Customer Code" required={true}>
              <input
                type="text"
                placeholder="Customer Code"
                className={inputClasses + " pl-10"}
                value={customerCode}
                ref={codeRef}
                onFocus={onFocusField("code")}
                onBlur={onBlurField}
                onChange={(e) => setCustomerCode(e.target.value)}
              />
              <FaAddressCard className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
            </FieldWrapper>
            {/* Name  */}
            <FieldWrapper label="Name" required={true}>
              <input
                type="text"
                placeholder="Name"
                ref={nameRef}
                className={inputClasses + " pl-10"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={onFocusField("name")}
                onBlur={onBlurField}
              />
              <FaRegUser className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
            </FieldWrapper>

            {/* Gender*/}
            <div className="col-span-2 mx-auto text-center">
              <FieldWrapper label="Gender">
                <div className="flex items-center space-x-4 h-10 mt-1">
                  <label className="flex items-center text-sm text-gray-700">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio text-blue-600 h-4 w-4"
                    />
                    <FaMale className="ml-1 mr-0.5 text-blue-600 w-4 h-4" />{" "}
                    Male
                  </label>
                  <label className="flex items-center text-sm text-gray-700">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio text-pink-600 h-4 w-4"
                    />
                    <FaFemale className="ml-1 mr-0.5 text-pink-600 w-4 h-4" />{" "}
                    Female
                  </label>
                </div>
              </FieldWrapper>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: CONTACT DETAILS */}
        <div className="p-4 border border-gray-100 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Contact Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Mobile No. */}
            <FieldWrapper label="Mobile No." required={true}>
              <input
                type="text"
                ref={mobileRef}
                placeholder="Mobile No."
                className={inputClasses + " pl-10"}
                value={mobile}
                onFocus={onFocusField("mobile")}
                onBlur={onBlurField}
                onChange={(e) => setMobile(e.target.value)}
              />
              <FaMobileAlt className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
            </FieldWrapper>

            {/* Email */}
            <FieldWrapper label="Email" required={true}>
              <input
                type="email"
                name="email"
                id="email"
                ref={emailRef}
                placeholder="example@email.com"
                className={inputClasses + " pl-10"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onInput={(e) => setEmail(e.target.value)}
                onFocus={onFocusField("email")}
                onBlur={onBlurField}
                autoComplete="email"
              />
              <FaEnvelope className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
            </FieldWrapper>

            {/* Nationality (Select: Local / Foreigner) */}
            <FieldWrapper label="Nationality">
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className={inputClasses + " pl-10"}
              >
                <option value="Local">Local</option>
                <option value="Foreigner">Foreigner</option>
              </select>
              <FaUserTag className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
            </FieldWrapper>
            <div className="flex items-end h-full">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={isVIP}
                  onChange={(e) => setIsVIP(e.target.checked)}
                  className="form-checkbox text-blue-600 h-4 w-4 rounded"
                />
                <span className="ml-2">VIP?</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;