import React from "react";
import {
  FaPercent,
  FaDollarSign,
  FaCreditCard,
  FaTag,
  FaAngleDown,
  FaRegBookmark,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useFormContext, useFieldArray } from "react-hook-form";

const inputClasses =
  "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

// Reusable field wrapper
const FieldWithIcon = ({
  label,
  children,
  className = "flex flex-col flex-1",
  error
}) => (
  <div className={className}>
    <label className={labelClasses}>{label}</label>
    <div className="relative">{children}</div>
    {error && <span className="text-xs text-red-500 mt-1">{error.message}</span>}
  </div>
);

const BillingInputForm = ({ calculatedCommission }) => {
  const { register, control, formState: { errors }, watch } = useFormContext();
  const paymentMode = watch("paymentMode");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "extraCharges"
  });

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Discount Details */}
      <div className="p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Discount Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <FieldWithIcon label="Discount Reason" error={errors.discountReason}>
            <input
              type="text"
              placeholder="Discount Type"
              className={inputClasses + " pl-10"}
              {...register("discountReason")}
            />
            <FaTag className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </FieldWithIcon>

          <FieldWithIcon label="Discount (Max-100%)" error={errors.discount}>
            <input
              type="text"
              placeholder="Discount %"
              className={inputClasses + " pl-10"}
              {...register("discount", { pattern: { value: /^[0-9.]*$/, message: "Invalid number" } })}
            />
            <FaPercent className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </FieldWithIcon>

          <FieldWithIcon label="Commission (%)" error={errors.commission}>
            <input
              type="text"
              placeholder="Commission %"
              className={inputClasses + " pl-10"}
              {...register("commission", { pattern: { value: /^[0-9.]*$/, message: "Invalid number" } })}
            />
            <FaPercent className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </FieldWithIcon>

          <FieldWithIcon label="Commission Amount">
            <input
              type="text"
              readOnly
              value={`$ ${calculatedCommission.toFixed(2)}`}
              className={inputClasses + " pl-10 bg-gray-100 cursor-not-allowed"}
            />
            <FaDollarSign className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </FieldWithIcon>
        </div>
      </div>

      {/* Advance Details */}
      <div className="p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Payment Details
        </h2>
        <div className="grid lg:grid-cols-2 gap-4">
          <FieldWithIcon
            label="Payment Mode"
            className="col-span-2 lg:col-span-1"
            error={errors.paymentMode}
          >
            <select
              className={inputClasses + " pl-10 appearance-none"}
              {...register("paymentMode")}
            >
              <option value="" disabled>
                Select Mode
              </option>
              <option value="Card Payment">Card Payment</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Other">Other</option>
            </select>
            <FaCreditCard className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
            <FaAngleDown className="absolute right-0 top-0 h-full w-4 mr-3 text-gray-400 pointer-events-none" />
          </FieldWithIcon>

          {paymentMode === "Other" && (
            <FieldWithIcon
              label="Specify Payment Mode"
              className="col-span-2 lg:col-span-1"
              error={errors.customPaymentMode}
            >
              <input
                type="text"
                placeholder="Specify other mode"
                className={inputClasses + " pl-10"}
                {...register("customPaymentMode", { required: "Custom payment mode is required" })}
              />
              <FaCreditCard className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
            </FieldWithIcon>
          )}

          <FieldWithIcon
            label="Booking Status"
            className="col-span-2 lg:col-span-1"
            error={errors.paymentStatus}
          >
            <select
              className={inputClasses + " pl-10 appearance-none"}
              {...register("paymentStatus")}
            >
              <option value="pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Postponed">Postponed</option>
            </select>
            <FaRegBookmark className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
            <FaAngleDown className="absolute right-0 top-0 h-full w-4 mr-3 text-gray-400 pointer-events-none" />
          </FieldWithIcon>

          <FieldWithIcon
            label="Payment Reference"
            className="col-span-2 lg:col-span-1"
            error={errors.paymentRef}
          >
            <input
              type="text"
              placeholder="Payment Ref No. (e.g. TXN-1234)"
              className={inputClasses + " pl-10"}
              {...register("paymentRef")}
            />
            <FaRegBookmark className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </FieldWithIcon>

          <FieldWithIcon
            label="Total Amount (Base Price)"
            className="col-span-2 lg:col-span-1"
            error={errors.totalAmountInput}
          >
            <input
              type="text"
              placeholder="Total Amount"
              className={inputClasses + " pl-10"}
              {...register("totalAmountInput", {
                required: "Total Amount is required",
                pattern: { value: /^[0-9.]*$/, message: "Invalid number" }
              })}
            />
            <FaDollarSign className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </FieldWithIcon>

          <FieldWithIcon
            label="Booking Charge (Optional Fee)"
            className="col-span-2 lg:col-span-1"
            error={errors.bookingChargeInput}
          >
            <input
              type="text"
              placeholder="0.00"
              className={inputClasses + " pl-10"}
              {...register("bookingChargeInput", { pattern: { value: /^[0-9.]*$/, message: "Invalid number" } })}
            />
            <FaMoneyBillWave className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </FieldWithIcon>

          <FieldWithIcon
            label="Paid Amount"
            className="col-span-2 lg:col-span-1"
            error={errors.advanceAmountInput}
          >
            <input
              type="text"
              placeholder="Paid Amount"
              className={inputClasses + " pl-10"}
              {...register("advanceAmountInput", { pattern: { value: /^[0-9.]*$/, message: "Invalid number" } })}
            />
            <FaDollarSign className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </FieldWithIcon>

          <FieldWithIcon label="Payment Remarks" className="col-span-2" error={errors.advanceRemarks}>
            <input
              type="text"
              placeholder="Remarks"
              className={inputClasses + " pl-10"}
              {...register("advanceRemarks")}
            />
            <FaRegBookmark className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
          </FieldWithIcon>

          {/* Extra Charges */}
          <div className="col-span-2">
            <h3 className="font-semibold mb-2">Extra Charges</h3>
            {fields.map((charge, index) => (
              <div
                key={charge.id}
                className="grid grid-cols-2 gap-4 mb-2 items-center"
              >
                <input
                  type="text"
                  placeholder="Charge Name"
                  className={inputClasses + " pl-3"}
                  {...register(`extraCharges.${index}.name`)}
                />
                <input
                  type="text"
                  placeholder="Amount"
                  className={inputClasses + " pl-3"}
                  {...register(`extraCharges.${index}.amount`, {
                    pattern: { value: /^[0-9.]*$/, message: "Invalid amount" }
                  })}
                />

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ name: '', amount: '' })}
              className="btn mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add Extra Charge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingInputForm;
