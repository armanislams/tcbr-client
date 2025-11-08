import React from 'react';

const BookingForm2 = () => {
    return (
        <div>
             <div className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-10">
                        {/* Header */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Reservation Details</h2>
            
                        {/* Top Row: Check In, Check Out, Booking Date */}
                        <div className="flex flex-col sm:flex-row gap-6 mb-6">
                            
                            {/* 1. Check In Date */}
                            <FieldWrapper label="Check In" required={true}>
                                <DatePicker
                                    selected={checkInDate}
                                    onChange={(date) => setCheckInDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="dd/mm/yyyy"
                                    customInput={<CustomDateInput placeholder="dd/mm/yyyy" icon={FaCalendarCheck} />}
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
                                    customInput={<CustomDateInput placeholder="dd/mm/yyyy" icon={FaCalendarXmark} />}
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
                                    customInput={<CustomDateInput placeholder="dd/mm/yyyy" icon={FaCalendarDays} />}
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
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Choose Booking Reference</option>
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
                                        className={inputClasses + " pl-10"}
                                    />
                                    <FaRegBookmark className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                                </div>
                            </FieldWrapper>
            
                            {/* 6. Purpose of Visit */}
                            <FieldWrapper label="Purpose of Visit">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Purpose of Visit"
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
                                    className={inputClasses + " pl-10 resize-none"}
                                ></textarea>
                                <FaRegBookmark className="absolute left-0 top-3 w-4 ml-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
        </div>
    );
};

export default BookingForm2;