import React, { useEffect } from 'react';
import { FaBox, FaUsers, FaHashtag, FaDollarSign, FaPlus, FaTimes } from 'react-icons/fa';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

const inputClasses = "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
const labelClasses = "text-sm font-medium text-gray-700 mb-1 block";

const FieldWithIcon = ({ label, children, required = false, className = "flex flex-col flex-1 min-w-0", error }) => (
  <div className={className}>
    <label className={labelClasses}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">{children}</div>
    {error && <span className="text-xs text-red-500 mt-1">{error.message}</span>}
  </div>
);

const PackageDetails = () => {
  const { control, register, setValue, formState: { errors } } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "packages"
  });



  const newPackageTemplate = {
    packageType: "",
    noPax: "",
    packageQuantity: "",
    price: "",
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Package Details</h2>
        <button
          type="button"
          title="Add a new package"
          onClick={() => append(newPackageTemplate)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none text-sm font-semibold"
        >
          <FaPlus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => {
          const packageErrors = errors.packages?.[index] || {};

          return (
            <div key={field.id} className="p-6 rounded-lg border border-gray-200 bg-gray-50 shadow-sm relative">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                <strong className="text-lg text-gray-800">Package {index + 1}</strong>
                <button
                  type="button"
                  title="Remove this package"
                  onClick={() => remove(index)}
                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition duration-150"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <FieldWithIcon label="Package Type" className="flex flex-col flex-[2] min-w-[150px]" error={packageErrors.packageType}>
                  <input
                    type="text"
                    placeholder="Enter Package Type"
                    className={inputClasses + " pl-10"}
                    {...register(`packages.${index}.packageType`, { required: "Package Type is required" })}
                  />
                  <FaBox className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                </FieldWithIcon>

                <FieldWithIcon label="No. Pax" className="flex flex-col flex-1" error={packageErrors.noPax}>
                  <input
                    type="number"
                    placeholder="Number of pax"
                    className={inputClasses + " pl-10"}
                    {...register(`packages.${index}.noPax`)}
                  />
                  <FaUsers className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                </FieldWithIcon>

                <FieldWithIcon label="Package Quantity" className="flex flex-col flex-1" error={packageErrors.packageQuantity}>
                  <input
                    type="text"
                    placeholder="Quantity"
                    className={inputClasses + " pl-10"}
                    {...register(`packages.${index}.packageQuantity`)}
                  />
                  <FaHashtag className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                </FieldWithIcon>

                <FieldWithIcon label="Price" className="flex flex-col flex-1" error={packageErrors.price}>
                  <input
                    type="text"
                    placeholder="Total Price"
                    className={inputClasses + " pl-10"}
                    {...register(`packages.${index}.price`, { pattern: { value: /^[0-9.]*$/, message: "Invalid amount" }})}
                  />
                  <FaDollarSign className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                </FieldWithIcon>
              </div>
            </div>
          );
        })}
        {fields.length === 0 && (
          <p className="text-gray-500 text-center italic py-4">No packages added.</p>
        )}
      </div>
    </div>
  );
};

export default PackageDetails;
