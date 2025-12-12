
import React from "react";
import { useFormContext } from "react-hook-form";

const inputClasses =
  "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

const FieldWrapper = ({ label, children, required = false, error }) => (
  <div className="flex-1 min-w-[180px]">
    <label className={labelClasses}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <span className="text-xs text-red-500 mt-1">{error.message}</span>}
  </div>
);

const CustomerDetails = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-10 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Customer Details
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        <FieldWrapper label="Customer Name" required error={errors.name}>
          <input
            type="text"
            placeholder="Name"
            className={inputClasses}
            {...register("name", { required: "Customer Name is required" })}
          />
        </FieldWrapper>

        <FieldWrapper label="Customer Code" required error={errors.customerCode}>
          <input
            type="text"
            placeholder="Customer Code"
            className={inputClasses}
            {...register("customerCode", { required: "Customer Code is required" })}
          />
        </FieldWrapper>

        <FieldWrapper label="Mobile" required error={errors.mobile}>
          <input
            type="text"
            placeholder="Mobile"
            className={inputClasses}
            {...register("mobile", {
              required: "Mobile is required",
              pattern: { value: /^[0-9+-\s]*$/, message: "Invalid mobile number" }
            })}
          />
        </FieldWrapper>

        <FieldWrapper label="Email" required error={errors.email}>
          <input
            type="email"
            placeholder="Email"
            className={inputClasses}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
            })}
          />
        </FieldWrapper>

        <FieldWrapper label="Gender" error={errors.gender}>
          <select
            className={inputClasses}
            {...register("gender")}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </FieldWrapper>

        <FieldWrapper label="Nationality" error={errors.nationality}>
          <select
            className={inputClasses}
            {...register("nationality")}
          >
            <option value="" disabled>
              Select Nationality
            </option>
            <option value="Local">Local</option>
            <option value="Foreign">Foreigner</option>
          </select>
        </FieldWrapper>
      </div>
    </div>
  );
};

export default CustomerDetails;
