// import React from 'react';

// const BillingSummary = ({ calculatedBillings, discount, advanceAmount }) => {

//     // Configuration constants (repeated here just for display context)
//     // Note: Tax is removed as per your last component update.
//     const CONFIG_SERVICE_CHARGE_RATE = 0.08;

//     // Destructure the final values from the calculated object
//     const {
//         subtotal,
//         bookingCharge,
//         serviceCharge,
//         finalTotal,
//         commissionAmount,
//         balanceDue
//     } = calculatedBillings;

//     return (
//         <div className="p-6 bg-white rounded-lg shadow-xl">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Billing Details</h2>

//             <div className="space-y-3">

//                 {/* Commission Amount */}
//                 <div className="flex justify-between border-b border-gray-100 pb-2">
//                     <span className="font-semibold text-gray-700">Commission Amount</span>
//                     <span className="font-medium text-gray-800">${commissionAmount.toFixed(2)}</span>
//                 </div>

//                 {/* Subtotal / Discounted Price */}
//                 <div className="flex justify-between border-b border-gray-100 pb-2">
//                     <span className="font-semibold text-gray-700">Subtotal (after {discount || 0}% discount)</span>
//                     <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
//                 </div>

//                 {/* Booking Charge (DYNAMIC) */}
//                 <div className="flex justify-between border-b border-gray-100 pb-2">
//                     <span className="font-semibold text-gray-700">Booking Charge (Fee)</span>
//                     <span className="font-medium text-gray-800">${bookingCharge.toFixed(2)}</span>
//                 </div>

//                 {/* Service Charge (DYNAMIC) */}
//                 <div className="flex justify-between border-b border-gray-100 pb-2">
//                     <span className="font-semibold text-gray-700">Service Charge ({CONFIG_SERVICE_CHARGE_RATE * 100}%)</span>
//                     <span className="font-medium text-gray-800">${serviceCharge.toFixed(2)}</span>
//                 </div>

//                 {/* Final Total */}
//                 <div className="flex justify-between pt-3 border-t-2 border-gray-200">
//                     <span className="text-lg font-bold text-gray-900">Final Total</span>
//                     <span className="text-lg font-bold text-gray-900">
//                         ${finalTotal.toFixed(2)}
//                     </span>
//                 </div>

//                 {/* Advance Payment */}
//                 <div className="flex justify-between border-b border-gray-100 pb-2">
//                     <span className="font-semibold text-red-600">(-) Advance Payment</span>
//                     <span className="font-medium text-red-600">${advanceAmount.toFixed(2)}</span>
//                 </div>

//                 {/* Balance Due (Highlighted) */}
//                 <div className="flex justify-between pt-3 border-t-2 border-indigo-400">
//                     <span className="text-xl font-bold text-gray-900">Balance Due</span>
//                     <span className="text-xl font-bold text-white bg-indigo-600 px-3 py-1 rounded">
//                         ${balanceDue.toFixed(2)}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BillingSummary;
import React from "react";

const BillingSummary = ({
  calculatedBillings,
  discount,
  advanceAmount,
  extraCharges = [],
}) => {
  const CONFIG_SERVICE_CHARGE_RATE = 0.08;
  const {
    subtotal,
    bookingCharge,
    serviceCharge,
    finalTotal,
    commissionAmount,
  } = calculatedBillings;

  // Sum of extra charges
  const totalExtraCharges = extraCharges.reduce(
    (sum, c) => sum + parseFloat(c.amount || 0),
    0
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Billing Details
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="font-semibold text-gray-700">Commission Amount</span>
          <span className="font-medium text-gray-800">
            ${commissionAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="font-semibold text-gray-700">
            Subtotal (after {discount || 0}% discount)
          </span>
          <span className="font-medium text-gray-800">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="font-semibold text-gray-700">Booking Charge</span>
          <span className="font-medium text-gray-800">
            ${bookingCharge.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="font-semibold text-gray-700">
            Service Charge ({CONFIG_SERVICE_CHARGE_RATE * 100}%)
          </span>
          <span className="font-medium text-gray-800">
            ${serviceCharge.toFixed(2)}
          </span>
        </div>

        {/* Extra Charges */}
        {extraCharges.map((c, idx) => (
          <div
            key={idx}
            className="flex justify-between border-b border-gray-100 pb-2"
          >
            <span className="font-semibold text-gray-700">
              {c.name || `Extra Charge ${idx + 1}`}
            </span>
            <span className="font-medium text-gray-800">
              ${parseFloat(c.amount || 0).toFixed(2)}
            </span>
          </div>
        ))}

        <div className="flex justify-between pt-3 border-t-2 border-gray-200">
          <span className="text-lg font-bold text-gray-900">Final Total</span>
          <span className="text-lg font-bold text-gray-900">
            ${(finalTotal + totalExtraCharges).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="font-semibold text-red-600">
            (-) Advance Payment
          </span>
          <span className="font-medium text-red-600">
            ${advanceAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between pt-3 border-t-2 border-indigo-400">
          <span className="text-xl font-bold text-gray-900">Balance Due</span>
          <span className="text-xl font-bold text-white bg-indigo-600 px-3 py-1 rounded">
            ${(finalTotal + totalExtraCharges - advanceAmount).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillingSummary;
