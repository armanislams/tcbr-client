import React, { useState, useEffect } from 'react';
import { 
    FaPercent, FaDollarSign, FaCreditCard, 
    FaTag, FaAngleDown, FaRegBookmark, FaMoneyBillWave 
} from 'react-icons/fa';

// Reusable Input/Select Field Wrapper and common styling
const inputClasses = "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

const FieldWithIcon = ({ label, children, className = "flex flex-col flex-1" }) => (
    <div className={className}>
        <label className={labelClasses}>
            {label}
        </label>
        <div className="relative">
            {children}
        </div>
    </div>
);

// --- Component Definition ---

const BillingInputForm = ({ initialData, onCommit, calculatedCommission }) => {

    // --- Local States for Input (Smooth Typing) ---
    const [discountReason, setDiscountReason] = useState(initialData.discountReason || '');
    const [discount, setDiscount] = useState(initialData.discount || ''); 
    const [commission, setCommission] = useState(initialData.commission || ''); 
    const [paymentMode, setPaymentMode] = useState(initialData.paymentMode || '');
    const [totalAmountInput, setTotalAmountInput] = useState(initialData.totalAmountInput || ''); 
    const [advanceRemarks, setAdvanceRemarks] = useState(initialData.advanceRemarks || '');
    const [advanceAmountInput, setAdvanceAmountInput] = useState(initialData.advanceAmountInput || '');
    const [bookingChargeInput, setBookingChargeInput] = useState(initialData.bookingChargeInput || ''); 
    
    // Sync local state when initialData changes 
    useEffect(() => {
        setDiscount(initialData.discount || '');
        setCommission(initialData.commission || '');
        setTotalAmountInput(initialData.totalAmountInput || '');
        setBookingChargeInput(initialData.bookingChargeInput || '');
        setAdvanceAmountInput(initialData.advanceAmountInput || '');
    }, [initialData]);

    // --- Input Handlers ---

    // Generic handler for smooth typing and cleaning the input
    const handleTypingChange = (e, setState) => {
        let value = e.target.value;
        value = value.replace(/[^0-9.]/g, ''); 
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        setState(value);
    };

    // Generic handler to commit a value to the parent state (on blur/enter/tab)
    const handleCommit = (localValue, key, setLocalState) => {
        // Clean the value one last time for safety before committing
        let cleanedValue = localValue.toString().replace(/[^0-9.]/g, ''); 
        const parts = cleanedValue.split('.');
        if (parts.length > 2) {
            cleanedValue = parts[0] + '.' + parts.slice(1).join('');
        }
        setLocalState(cleanedValue);

        // Commit the key/value pair to the parent
        onCommit(key, cleanedValue);
    };

    return (
        <div className="grid grid-cols-2 gap-8">
            
            {/* === 1. Payment Details Card === */}
            <div className="p-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Details</h2>

                <div className="grid grid-cols-2 gap-4">
                    
                    {/* Discount Reason */}
                    <FieldWithIcon label="Discount Reason">
                        <input
                            type="text"
                            placeholder="Discount Type"
                            value={discountReason}
                            onChange={(e) => { setDiscountReason(e.target.value); onCommit('discountReason', e.target.value); }}
                            className={inputClasses + " pl-10"}
                        />
                        <FaTag className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                    </FieldWithIcon>

                    {/* Discount (Max-100%) */}
                    <FieldWithIcon label="Discount (Max-100%)">
                        <input
                            type="text"
                            placeholder="Discount %"
                            value={discount}
                            onChange={(e) => handleTypingChange(e, setDiscount)}
                            onBlur={() => handleCommit(discount, 'discount', setDiscount)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Tab') handleCommit(discount, 'discount', setDiscount); }}
                            className={inputClasses + " pl-10"}
                        />
                        <FaPercent className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                    </FieldWithIcon>

                    {/* Commission (%) */}
                    <FieldWithIcon label="Commission (%)">
                        <input
                            type="text"
                            placeholder="Commission %"
                            value={commission}
                            onChange={(e) => handleTypingChange(e, setCommission)}
                            onBlur={() => handleCommit(commission, 'commission', setCommission)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Tab') handleCommit(commission, 'commission', setCommission); }}
                            className={inputClasses + " pl-10"}
                        />
                        <FaPercent className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                    </FieldWithIcon>
                    
                    {/* Commission Amount (CALCULATED from parent) */}
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

            {/* === 2. Advance Details Card === */}
            <div className="p-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Advance Details</h2>

                <div className="grid grid-cols-2 gap-4">

                    {/* Payment Mode */}
                    <FieldWithIcon label="Payment Mode">
                        <select
                            className={inputClasses + " pl-10 appearance-none"}
                            value={paymentMode}
                            onChange={(e) => { setPaymentMode(e.target.value); onCommit('paymentMode', e.target.value); }}
                        >
                            <option value="" disabled>Select Mode</option>
                            <option value="Card Payment">Card Payment</option>
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                        <FaCreditCard className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                        <FaAngleDown className="absolute right-0 top-0 h-full w-4 mr-3 text-gray-400 pointer-events-none" />
                    </FieldWithIcon>

                    {/* Total Amount (Base Price Input) */}
                    <FieldWithIcon label="Total Amount (Base Price)">
                        <input
                            type="text" 
                            placeholder="Total Amount"
                            value={totalAmountInput}
                            onChange={(e) => handleTypingChange(e, setTotalAmountInput)} 
                            onBlur={() => handleCommit(totalAmountInput, 'totalAmountInput', setTotalAmountInput)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Tab') handleCommit(totalAmountInput, 'totalAmountInput', setTotalAmountInput); }}
                            className={inputClasses + " pl-10"}
                        />
                        <FaDollarSign className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                    </FieldWithIcon>
                    
                    {/* Booking Charge */}
                    <FieldWithIcon label="Booking Charge (Optional Fee)">
                        <input
                            type="text" 
                            placeholder="0.00"
                            value={bookingChargeInput}
                            onChange={(e) => handleTypingChange(e, setBookingChargeInput)}
                            onBlur={() => handleCommit(bookingChargeInput, 'bookingChargeInput', setBookingChargeInput)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Tab') handleCommit(bookingChargeInput, 'bookingChargeInput', setBookingChargeInput); }}
                            className={inputClasses + " pl-10"}
                        />
                        <FaMoneyBillWave className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                    </FieldWithIcon>

                    {/* Advance Amount */}
                    <FieldWithIcon label="Advance Amount">
                        <input
                            type="text" 
                            placeholder="Advance Amount"
                            value={advanceAmountInput}
                            onChange={(e) => handleTypingChange(e, setAdvanceAmountInput)}
                            onBlur={() => handleCommit(advanceAmountInput, 'advanceAmountInput', setAdvanceAmountInput)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Tab') handleCommit(advanceAmountInput, 'advanceAmountInput', setAdvanceAmountInput); }}
                            className={inputClasses + " pl-10"}
                        />
                        <FaDollarSign className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                    </FieldWithIcon>

                    {/* Advance Remarks */}
                    <FieldWithIcon label="Advance Remarks" className="col-span-2">
                        <input
                            type="text"
                            placeholder="Remarks"
                            value={advanceRemarks}
                            onChange={(e) => { setAdvanceRemarks(e.target.value); onCommit('advanceRemarks', e.target.value); }}
                            className={inputClasses + " pl-10"}
                        />
                        <FaRegBookmark className="absolute left-0 top-0 h-full w-4 ml-3 text-gray-400 pointer-events-none" />
                    </FieldWithIcon>

                </div>
            </div>
        </div>
    );
};

export default BillingInputForm;