// import React, { useState, useMemo, useEffect } from 'react';
// import BillingInputForm from './BillingInputForm';
// import BillingSummary from './BillingSummary';

// // --- FIX IS HERE: Set onSaveBooking to a default empty function ---
// const Billings = ({ setBilling = () => {} }) => {
//   // --- Master State (Single Source of Truth) ---
//   const [billingData, setBillingData] = useState({
//     discountReason: "",
//     discount: "",
//     commission: "",
//     paymentMode: "",
//     totalAmountInput: "",
//     advanceRemarks: "",
//     advanceAmountInput: "",
//     bookingChargeInput: "",
//   });

//   // --- Configuration (Rates remain constants) ---
//   const CONFIG_SERVICE_CHARGE_RATE = 0.08;

//   // --- Parsed Input Values ---
//   const parsedBaseAmount = parseFloat(billingData.totalAmountInput) || 0;
//   const discountRate = parseFloat(billingData.discount) / 100 || 0;
//   const commissionRate = parseFloat(billingData.commission) / 100 || 0;
//   const parsedAdvanceAmount = parseFloat(billingData.advanceAmountInput) || 0;
//   const parsedBookingCharge = parseFloat(billingData.bookingChargeInput) || 0;

//   // --- Calculated Values (Memoized) ---
//   const calculatedBillings = useMemo(() => {
//     const discountedSubtotal = parsedBaseAmount * (1 - discountRate);
//     const serviceChargeAmount = discountedSubtotal * CONFIG_SERVICE_CHARGE_RATE;

//     // Final Total (Tax is excluded)
//     const finalTotal =
//       discountedSubtotal + parsedBookingCharge + serviceChargeAmount;

//     // Commission Amount
//     const commissionAmount = parsedBaseAmount * commissionRate;

//     // Balance Due
//     const balanceDue = finalTotal - parsedAdvanceAmount;

//     return {
//       subtotal: discountedSubtotal,
//       bookingCharge: parsedBookingCharge,
//       serviceCharge: serviceChargeAmount,
//       finalTotal: finalTotal,
//       commissionAmount: commissionAmount,
//       balanceDue: balanceDue,
//     };
//   }, [
//     parsedBaseAmount,
//     discountRate,
//     commissionRate,
//     parsedAdvanceAmount,
//     parsedBookingCharge,
//   ]);

//   const handleCommitData = (key, value) => {
//     setBillingData((prev) => ({ ...prev, [key]: value }));
//   };

//   // forward billing data and calculations to parent whenever they change
//   useEffect(() => {
//     setBilling({
//       inputs: billingData,
//       calculations: calculatedBillings,
//     });
//   }, [billingData, calculatedBillings, setBilling]);
//   return (
//     <div className="max-w-4xl mx-auto my-10 space-y-8">
//       <BillingInputForm
//         initialData={billingData}
//         onCommit={handleCommitData}
//         calculatedCommission={calculatedBillings.commissionAmount}
//       />

//       <BillingSummary
//         calculatedBillings={calculatedBillings}
//         discount={billingData.discount}
//         advanceAmount={parsedAdvanceAmount}
//       />
//     </div>
//   );
// };

// export default Billings;

import React, { useState, useMemo, useEffect } from "react";
import BillingInputForm from "./BillingInputForm";
import BillingSummary from "./BillingSummary";

const Billings = ({ setBilling = () => {} }) => {
  const [billingData, setBillingData] = useState({
    discountReason: "",
    discount: "",
    commission: "",
    paymentMode: "",
    totalAmountInput: "",
    advanceRemarks: "",
    advanceAmountInput: "",
    bookingChargeInput: "",
    extraCharges: [],
  });

  const CONFIG_SERVICE_CHARGE_RATE = 0.08;
  const parsedBaseAmount = parseFloat(billingData.totalAmountInput) || 0;
  const discountRate = parseFloat(billingData.discount) / 100 || 0;
  const commissionRate = parseFloat(billingData.commission) / 100 || 0;
  const parsedAdvanceAmount = parseFloat(billingData.advanceAmountInput) || 0;
  const parsedBookingCharge = parseFloat(billingData.bookingChargeInput) || 0;

  const calculatedBillings = useMemo(() => {
    const discountedSubtotal = parsedBaseAmount * (1 - discountRate);
    const serviceChargeAmount = discountedSubtotal * CONFIG_SERVICE_CHARGE_RATE;
    const finalTotal =
      discountedSubtotal + parsedBookingCharge + serviceChargeAmount;
    const commissionAmount = parsedBaseAmount * commissionRate;
    const balanceDue = finalTotal - parsedAdvanceAmount;

    return {
      subtotal: discountedSubtotal,
      bookingCharge: parsedBookingCharge,
      serviceCharge: serviceChargeAmount,
      finalTotal,
      commissionAmount,
      balanceDue,
    };
  }, [
    parsedBaseAmount,
    discountRate,
    commissionRate,
    parsedAdvanceAmount,
    parsedBookingCharge,
  ]);

  const handleCommitData = (key, value) =>
    setBillingData((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    setBilling({ inputs: billingData, calculations: calculatedBillings });
  }, [billingData, calculatedBillings, setBilling]);

  return (
    <div className="max-w-4xl mx-auto my-10 space-y-8">
      <BillingInputForm
        initialData={billingData}
        onCommit={handleCommitData}
        calculatedCommission={calculatedBillings.commissionAmount}
      />
      <BillingSummary
        calculatedBillings={calculatedBillings}
        discount={billingData.discount}
        advanceAmount={parseFloat(billingData.advanceAmountInput) || 0}
        extraCharges={billingData.extraCharges}
      />
    </div>
  );
};

export default Billings;
