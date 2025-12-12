import React from 'react';
import { FaHome, FaAngleDown, FaUsers, FaUser, FaPlus, FaTimes } from 'react-icons/fa';
import { useFieldArray, useFormContext } from 'react-hook-form';

const RoomDetails = () => {
  const { control, register, formState: { errors } } = useFormContext();

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "rooms"
  });

  // Common styling
  const inputClasses =
    "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
  const labelClasses = "text-sm font-medium text-gray-700 mb-1";

  // Helper to create a new room object structure
  const newRoomTemplate = {
    roomType: "",
    roomNo: "",
    adults: 0,
    children: 0,
  };

  const addRoomAfter = (index, currentRoomData) => {
    // Clone field logic: insert a copy of the current room after it
    insert(index + 1, { ...currentRoomData });
  };

  // --- Reusable Input/Select Field Wrapper ---
  const FieldWithIcon = ({
    label,
    children,
    required = false,
    className = "flex flex-col flex-1 min-w-0",
    error
  }) => (
    <div className={className}>
      <label className={labelClasses}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">{children}</div>
      {error && <span className="text-xs text-red-500 mt-1">{error.message}</span>}
    </div>
  );

  // --- Component JSX ---
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Room Details</h2>

        {/* Global Add Button */}
        <button
          type="button"
          title="Add a new room"
          onClick={() => append(newRoomTemplate)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none text-sm font-semibold"
        >
          <FaPlus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Rooms Container */}
      <div className="rooms-container space-y-6">
        {fields.map((field, index) => {
          // Error handling for specific field
          const roomErrors = errors.rooms?.[index] || {};

          return (
            <div
              key={field.id}
              className="room-item p-6 rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
            >
              {/* Room Header and Actions */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                <strong className="text-lg text-gray-800">
                  Room {index + 1}
                </strong>
                <div className="flex items-center gap-2">
                  {/* Duplicate Button */}
                  <button
                    type="button"
                    title="Duplicate this room"
                    // Note: we need to get current values to clone them properly
                    onClick={() => {
                      // We can't easily get current values from 'field' because 'field' is the default value or initial value 
                      // unless we watch it. For simplicity, let's just insert a blank or shallow clone if needed.
                      // If deep cloning is needed, we should use getValues(`rooms.${index}`)
                      const currentValues = control._formValues.rooms[index] || newRoomTemplate;
                      addRoomAfter(index, currentValues);
                    }}
                    className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition duration-150"
                  >
                    <FaPlus className="h-4 w-4" />
                  </button>

                  {/* Remove Button */}
                  <button
                    type="button"
                    title="Remove this room"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className={`p-1.5 ${fields.length === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                      } rounded-full transition duration-150`}
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Room Fields Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 1. Room Type Select */}
                <FieldWithIcon
                  label="Room Type"
                  required={true}
                  className="flex flex-col flex-1 min-w-[150px]"
                  error={roomErrors.roomType}
                >
                  <select
                    className={inputClasses + " pl-10 appearance-none"}
                    {...register(`rooms.${index}.roomType`, { required: "Room Type is required" })}
                  >
                    <option value="">Choose Room Type</option>
                    <option value="Sea View Villa">Sea View Villa</option>
                    <option value="HillSide Villa">HillSide Villa</option>
                    <option value="BeachFront Deluxe">BeachFront Deluxe</option>
                    <option value="BeachFront Chalet">BeachFront Chalet</option>
                    <option value="BayView Chalet">BayView Chalet</option>
                    <option value="Standard Room">Standard Room</option>
                  </select>
                  <FaHome className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                  <FaAngleDown className="absolute right-0 top-0 h-full w-4 mr-3 text-gray-400 pointer-events-none" />
                </FieldWithIcon>

                {/* 2. Room No Select */}
                <FieldWithIcon
                  label="Room No"
                  required={true}
                  className="flex flex-col flex-1 min-w-[120px]"
                  error={roomErrors.roomNo}
                >
                  <select
                    className={inputClasses + " pl-10 appearance-none"}
                    {...register(`rooms.${index}.roomNo`, { required: "Room No is required" })}
                  >
                    <option value="">Choose Room No</option>
                    {Array.from({ length: 10 }, (_, i) => 101 + i).map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <FaHome className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                  <FaAngleDown className="absolute right-0 top-0 h-full w-4 mr-3 text-gray-400 pointer-events-none" />
                </FieldWithIcon>

                {/* 3. Adults Counter */}
                <div className='flex gap-5'>
                  <FieldWithIcon
                    label="Adults"
                    className="flex flex-col lg:w-20"
                    required
                    error={roomErrors.adults}
                  >
                    <input
                      type="number"
                      className={inputClasses + " pl-10"}
                      min="0"
                      {...register(`rooms.${index}.adults`, { min: 0, valueAsNumber: true })}
                    />
                    <FaUsers className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                  </FieldWithIcon>

                  {/* 4. Children Counter */}
                  <FieldWithIcon label="Children" className="flex flex-col lg:w-20">
                    <input
                      type="number"
                      className={inputClasses + " pl-10"}
                      min="0"
                      {...register(`rooms.${index}.children`, { min: 0, valueAsNumber: true })}
                    />
                    <FaUser className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                  </FieldWithIcon>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomDetails;