import React, { useMemo } from "react";
import { useWatch } from "react-hook-form";
import BillingInputForm from "./BillingInputForm";
import BillingSummary from "./BillingSummary";

const Billings = () => {
  // Watch all relevant fields for calculation
  const watchedValues = useWatch({
    name: [
      "totalAmountInput",
      "discount",
      "commission",
      "advanceAmountInput",
      "bookingChargeInput",
      "extraCharges"
    ]
  });

  const [
    totalAmountInput,
    discount,
    commission,
    advanceAmountInput,
    bookingChargeInput,
    extraCharges
  ] = watchedValues;

  const CONFIG_SERVICE_CHARGE_RATE = 0.08;

  const parsedBaseAmount = parseFloat(totalAmountInput) || 0;
  const discountRate = parseFloat(discount) / 100 || 0;
  const commissionRate = parseFloat(commission) / 100 || 0;
  const parsedAdvanceAmount = parseFloat(advanceAmountInput) || 0;
  const parsedBookingCharge = parseFloat(bookingChargeInput) || 0;

  const calculatedBillings = useMemo(() => {
    const discountedSubtotal = parsedBaseAmount * (1 - discountRate);
    const serviceChargeAmount = discountedSubtotal * CONFIG_SERVICE_CHARGE_RATE;
    const finalTotal =
      discountedSubtotal + parsedBookingCharge + serviceChargeAmount;
    const commissionAmount = parsedBaseAmount * commissionRate;

    // Total including extra charges (calculated in Summary, but good to have here if needed)
    // For now, we follow original logic where balanceDue included extra charges in summary but here we calculate core billing
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

  return (
    <div className="max-w-4xl mx-auto my-10 space-y-8">
      <BillingInputForm
        calculatedCommission={calculatedBillings.commissionAmount}
      />
      <BillingSummary
        calculatedBillings={calculatedBillings}
        discount={discount}
        advanceAmount={parsedAdvanceAmount}
        extraCharges={extraCharges}
      />
    </div>
  );
};

export default Billings;
