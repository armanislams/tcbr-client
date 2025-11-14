
import React from "react";

const inputClasses =
  "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

const FieldWrapper = ({ label, children, required = false }) => (
  <div className="flex-1 min-w-[180px]">
    <label className={labelClasses}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const CustomerDetails = ({ customerDetails, setCustomerDetails }) => {
  const handleChange = (key, value) => {
    setCustomerDetails({ ...customerDetails, [key]: value });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-10 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Customer Details
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        <FieldWrapper label="Customer Name" required>
          <input
            type="text"
            required
            value={customerDetails.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Name"
            className={inputClasses}
          />
        </FieldWrapper>

        <FieldWrapper label="Customer Code" required>
          <input
            required
            type="text"
            value={customerDetails.customerCode || ""}
            onChange={(e) => handleChange("customerCode", e.target.value)}
            placeholder="Customer Code"
            className={inputClasses}
          />
        </FieldWrapper>

        <FieldWrapper label="Mobile" required>
          <input
            required
            type="text"
            value={customerDetails.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
            placeholder="Mobile"
            className={inputClasses}
          />
        </FieldWrapper>

        <FieldWrapper label="Email" required>
          <input
            required
            type="email"
            value={customerDetails.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
            className={inputClasses}
          />
        </FieldWrapper>

        <FieldWrapper label="Gender">
          <select
            value={customerDetails.gender || ""}
            onChange={(e) => handleChange("gender", e.target.value)}
            className={inputClasses}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </FieldWrapper>

        <FieldWrapper label="Nationality">
          <input
            type="text"
            value={customerDetails.nationality ?? ""}
            onChange={(e) => handleChange("nationality", e.target.value)}
            placeholder="Nationality (default: Local)"
            className={inputClasses}
          />
        </FieldWrapper>
      </div>
    </div>
  );
};

export default CustomerDetails;
