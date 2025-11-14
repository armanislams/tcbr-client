import React, { useEffect, useState } from 'react';
import { FaHome, FaAngleDown, FaUsers, FaUser, FaPlus, FaTimes } from 'react-icons/fa';

const RoomDetails = ({ roomDetails, setRoomDetails }) => {
  // --- Room State Logic ---
  const newRoom = () => ({
    roomType: "",
    roomNo: "",
    adults: 0,
    children: 0,
  });

  const [rooms, setRooms] = useState([newRoom()]);
  // Add useEffect to update parent component whenever rooms change
  useEffect(() => {
    setRoomDetails(rooms);
  }, [rooms, setRoomDetails]);

  // Common styling
  const inputClasses =
    "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
  const labelClasses = "text-sm font-medium text-gray-700 mb-1";

  // Helper to create a room, optionally cloning values from an existing room
  const makeRoom = (template = {}) => ({
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    roomType: template.roomType || "",
    roomNo: template.roomNo || "",
    adults: typeof template.adults === "number" ? template.adults : 0,
    children: typeof template.children === "number" ? template.children : 0,
  });

  // Function to add a room (cloning the current one)
  const addRoomAfter = (afterId) => {
    setRooms((prev) => {
      const idx = prev.findIndex((r) => r.id === afterId);
      const copy = [...prev];
      // Clone the current room's values
      const template = prev[idx] || {};
      copy.splice(idx + 1, 0, makeRoom(template));
      return copy;
    });
  };

  // Function to remove a room
  const removeRoom = (id) => {
    setRooms((prev) => {
      if (prev.length === 1) return prev; // keep at least one
      return prev.filter((r) => r.id !== id);
    });
  };

  // Function to update a field in a room
  const updateRoom = (id, field, value) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // --- Reusable Input/Select Field Wrapper ---
  // The default className now supports the flex row layout with proper spacing and sizing
  const FieldWithIcon = ({
    label,
    children,
    required = false,
    className = "flex flex-col flex-1 min-w-0",
  }) => (
    <div className={className}>
      <label className={labelClasses}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">{children}</div>
    </div>
  );

  // --- Component JSX ---
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Room Details</h2>

        {/* Global Add Button (Adds a new room instance at the end) */}
        <button
          type="button"
          title="Add a new room"
          onClick={() => setRooms((prev) => [...prev, newRoom()])}
          className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none text-sm font-semibold"
        >
          <FaPlus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Rooms Container */}
      <div className="rooms-container space-y-6" data-repeatable>
        {rooms.map((room, index) => (
          <div
            key={index}
            className="room-item p-6 rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
          >
            {/* Room Header and Actions */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
              <strong className="text-lg text-gray-800">
                Room {index + 1}
              </strong>
              <div className="flex items-center gap-2">
                {/* Duplicate Button (Clones the current room) */}
                <button
                  type="button"
                  title="Duplicate this room"
                  onClick={() => addRoomAfter(room.id)}
                  className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition duration-150"
                >
                  <FaPlus className="h-4 w-4" />
                </button>

                {/* Remove Button */}
                <button
                  type="button"
                  title="Remove this room"
                  onClick={() => removeRoom(room.id)}
                  disabled={rooms.length === 1}
                  className={`p-1.5 ${
                    rooms.length === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  } rounded-full transition duration-150`}
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Room Fields Row: Changed from grid to flex */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 1. Room Type Select */}
              <FieldWithIcon
                label="Room Type"
                required={true}
                className="flex flex-col flex-1 min-w-[150px]"
              >
                <select
                  required
                  className={inputClasses + " pl-10 appearance-none"}
                  value={room.roomType}
                  onChange={(e) =>
                    updateRoom(room.id, "roomType", e.target.value)
                  }
                >
                  <option value="">Choose Room Type</option>
                  <option value="Sea View Villa">Sea View Villa</option>
                  <option value="HillSide Villa">HillSide Villa</option>
                  <option value="BeachFront Deluxe">BeachFront Deluxe</option>
                  <option value="BeachFront Chalet">BeachFront Chalet</option>
                  <option value="BayView Chalet">BayView Chalet</option>
                  <option value="Standard Room">Standard Room</option>
                  {/* Add other options */}
                </select>
                <FaHome className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                <FaAngleDown className="absolute right-0 top-0 h-full w-4 mr-3 text-gray-400 pointer-events-none" />
              </FieldWithIcon>

              {/* 2. Room No Select */}
              <FieldWithIcon
                label="Room No"
                required={true}
                className="flex flex-col flex-1 min-w-[120px]"
              >
                <select
                  required
                  className={inputClasses + " pl-10 appearance-none"}
                  value={room.roomNo}
                  onChange={(e) =>
                    updateRoom(room.id, "roomNo", e.target.value)
                  }
                >
                  <option value="">Choose Room No</option>
                  {/* Emmet generated 101-110 options */}
                  <option value="101">101</option>
                  <option value="102">102</option>
                  <option value="103">103</option>
                  <option value="104">104</option>
                  <option value="105">105</option>
                  <option value="106">106</option>
                  <option value="107">107</option>
                  <option value="108">108</option>
                  <option value="109">109</option>
                  <option value="110">110</option>
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
                >
                  <input
                    type="number"
                    required
                    value={room.adults}
                    onChange={(e) =>
                      updateRoom(
                        room.id,
                        "adults",
                        Math.max(0, parseInt(e.target.value) || 0)
                      )
                    }
                    className={inputClasses + " pl-10"}
                    min="0"
                  />
                  <FaUsers className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                </FieldWithIcon>

                {/* 4. Children Counter */}
                <FieldWithIcon label="Children" className="flex flex-col lg:w-20">
                  <input
                    type="number"
                    value={room.children}
                    onChange={(e) =>
                      updateRoom(
                        room.id,
                        "children",
                        Math.max(0, parseInt(e.target.value) || 0)
                      )
                    }
                    className={inputClasses + " pl-10"}
                    min="0"
                  />
                  <FaUser className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                </FieldWithIcon>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomDetails;