import React, { useMemo, useEffect } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import BillingInputForm from "./BillingInputForm";
import BillingSummary from "./BillingSummary";

const Billings = () => {
  const { setValue } = useFormContext();

  // Watch rooms and packages to auto-calculate base price total
  const roomsWatch = useWatch({ name: "rooms" });
  const packagesWatch = useWatch({ name: "packages" });

  useEffect(() => {
    let roomsTotal = 0;
    let hasPrices = false;
    if (Array.isArray(roomsWatch) && roomsWatch.length > 0) {
      roomsWatch.forEach(room => {
        const price = parseFloat(room.price);
        if (!isNaN(price)) {
          roomsTotal += price;
          hasPrices = true;
        }
      });
    }

    let packagesTotal = 0;
    if (Array.isArray(packagesWatch) && packagesWatch.length > 0) {
      packagesWatch.forEach(pkg => {
        const price = parseFloat(pkg.price);
        if (!isNaN(price)) {
          packagesTotal += price;
          hasPrices = true;
        }
      });
    }

    if (hasPrices) {
      const grandTotal = roomsTotal + packagesTotal;
      setValue('totalAmountInput', grandTotal.toString(), { shouldValidate: true, shouldDirty: true });
    }
  }, [roomsWatch, packagesWatch, setValue]);

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
