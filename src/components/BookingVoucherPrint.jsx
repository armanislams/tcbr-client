import React from "react";

const BookingVoucherPrint = ({ booking }) => {
  if (!booking) return null;

  const { customerDetails, roomDetails, packageDetails, dates, billing } = booking;

  // Local helper functions for printing
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("en-GB") : "-";

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || amount === "") return "0.00";
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return "0.00";
    return numAmount.toFixed(2);
  };

  const getBalanceDue = (billing) => {
    if (billing?.calculations?.balanceDue !== undefined) {
      return billing.calculations.balanceDue;
    }
    const total = Number(billing?.totalAmountInput) || 0;
    const advance = Number(billing?.advanceAmountInput) || 0;
    return total - advance;
  };

  const getFinalTotal = (billing) => {
    const base = Number(billing?.totalAmountInput) || 0;
    const disc = Number(billing?.discount) || 0;
    const discounted = base * (1 - disc / 100);
    const charge = Number(billing?.bookingChargeInput) || 0;
    
    let extra = 0;
    if (Array.isArray(billing?.extraCharges)) {
      extra = billing.extraCharges.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    }
    return discounted + charge + extra;
  };

  const getNights = () => {
    if (!dates?.checkInDate || !dates?.checkOutDate) return 0;
    const diffTime = Math.ceil(new Date(dates.checkOutDate) - new Date(dates.checkInDate));
    return Math.max(0, Math.ceil(diffTime / 86400000));
  };

  // Generates the human-friendly stay dates matching the P.O.# format: "10th-13th October 2025"
  const formatStayDates = () => {
    if (!dates?.checkInDate || !dates?.checkOutDate) return "-";
    const cin = new Date(dates.checkInDate);
    const cout = new Date(dates.checkOutDate);
    
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const cinDay = getOrdinal(cin.getDate());
    const coutDay = getOrdinal(cout.getDate());
    const cinMonth = months[cin.getMonth()];
    const coutMonth = months[cout.getMonth()];
    const cinYear = cin.getFullYear();
    const coutYear = cout.getFullYear();

    if (cinYear !== coutYear) {
      return `${cinDay} ${cinMonth} ${cinYear} - ${coutDay} ${coutMonth} ${coutYear}`;
    }
    if (cinMonth !== coutMonth) {
      return `${cinDay} ${cinMonth} - ${coutDay} ${coutMonth} ${cinYear}`;
    }
    return `${cinDay}-${coutDay} ${cinMonth} ${cinYear}`;
  };

  // Build rows for the Zoho Invoice table
  const tableRows = [];
  let itemCounter = 1;

  // 1. Room Row
  if (Array.isArray(roomDetails) && roomDetails.length > 0) {
    const hasIndividualPrices = roomDetails.some(r => r.price && Number(r.price) > 0);

    if (hasIndividualPrices) {
      roomDetails.forEach((room) => {
        const roomPrice = Number(room.price) || 0;
        tableRows.push({
          index: itemCounter++,
          title: `(ROOM STAY) ${room.roomType}`,
          descriptions: [
            `Room ${room.roomNo} - ${room.adults ?? 0} Adults, ${room.children ?? 0} Children`,
            `${getNights()} Nights Stay (${formatDate(dates?.checkInDate)} to ${formatDate(dates?.checkOutDate)})`
          ],
          qty: "1.00",
          rate: roomPrice,
          amount: roomPrice
        });
      });
    } else {
      const roomDescriptions = [];
      roomDetails.forEach((room) => {
        roomDescriptions.push(
          `Room ${room.roomNo} (${room.roomType}) - ${room.adults ?? 0} Adults, ${room.children ?? 0} Children`
        );
      });

      tableRows.push({
        index: itemCounter++,
        title: `(ROOM STAY) ${roomDetails[0].roomType}`,
        descriptions: [
          ...roomDescriptions,
          `${getNights()} Nights Stay (${formatDate(dates?.checkInDate)} to ${formatDate(dates?.checkOutDate)})`
        ],
        qty: "1.00",
        rate: Number(billing?.totalAmountInput) || 0,
        amount: Number(billing?.totalAmountInput) || 0
      });
    }
  }

  // 2. Package Rows
  if (Array.isArray(packageDetails) && packageDetails.length > 0) {
    packageDetails.forEach((pkg) => {
      if (pkg.packageType) {
        const qty = parseFloat(pkg.packageQuantity) || 1.00;
        const rate = parseFloat(pkg.price) || 0;
        const amount = qty * rate;

        tableRows.push({
          index: itemCounter++,
          title: `(PACKAGE) ${pkg.packageType}`,
          descriptions: [
            `Quantity: ${pkg.packageQuantity} unit(s)`,
            `Pax Count: ${pkg.noPax || "-"}`
          ],
          qty: qty.toFixed(2),
          rate: rate,
          amount: amount > 0 ? amount : 0
        });
      }
    });
  }

  // 3. Extra Charges
  if (Array.isArray(billing?.extraCharges) && billing.extraCharges.length > 0) {
    billing.extraCharges.forEach((charge) => {
      if (charge.name && charge.amount) {
        const amount = parseFloat(charge.amount) || 0;
        tableRows.push({
          index: itemCounter++,
          title: `Extra Charge: ${charge.name}`,
          descriptions: [],
          qty: "1.00",
          rate: amount,
          amount: amount
        });
      }
    });
  }

  // 4. Booking Charge
  if (billing?.bookingChargeInput && Number(billing.bookingChargeInput) > 0) {
    const amount = parseFloat(billing.bookingChargeInput);
    tableRows.push({
      index: itemCounter++,
      title: "Booking Charge",
      descriptions: [],
      qty: "1.00",
      rate: amount,
      amount: amount
    });
  }

  // Financial calculations
  const subtotalBeforeDiscount = tableRows.reduce((sum, row) => sum + row.amount, 0);
  const discountVal = (Number(billing?.totalAmountInput) || 0) * ((Number(billing?.discount) || 0) / 100);
  const finalTotal = getFinalTotal(billing);

  const sstRate = 0.08;
  const subTotalExcludingSST = finalTotal / (1 + sstRate);
  const sstAmount = finalTotal - subTotalExcludingSST;
  const balanceDue = getBalanceDue(billing);

  return (
    <>
      {/* PAGE 1: Zoho Invoice Layout */}
      <div className="hidden print:block text-gray-800 bg-white p-8 font-sans max-w-4xl mx-auto print-voucher leading-relaxed">
        
        {/* Top Header Section */}
        <div className="flex justify-between items-start mb-6">
          
          {/* Logo & Company Address */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <svg className="w-16 h-10" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 30 C 30 10, 70 10, 90 25 C 100 20, 105 15, 110 10 C 108 20, 108 30, 110 40 C 105 35, 100 30, 90 25 C 70 45, 30 45, 10 30 Z" fill="#00a896" />
                <path d="M50 20 C 55 12, 65 12, 60 20 Z" fill="#028090" />
                <path d="M60 38 C 65 45, 75 45, 70 38 Z" fill="#028090" />
                <circle cx="35" cy="25" r="1.5" fill="white" />
                <circle cx="45" cy="23" r="1.5" fill="white" />
                <circle cx="55" cy="24" r="1.5" fill="white" />
                <circle cx="65" cy="26" r="1.5" fill="white" />
                <circle cx="75" cy="28" r="1.5" fill="white" />
                <circle cx="40" cy="30" r="1.5" fill="white" />
                <circle cx="50" cy="31" r="1.5" fill="white" />
                <circle cx="60" cy="29" r="1.5" fill="white" />
                <circle cx="70" cy="31" r="1.5" fill="white" />
              </svg>
              <div className="text-left">
                <div className="text-[13px] font-black tracking-[0.25em] text-[#00a896] uppercase leading-none">TENGGOL</div>
                <div className="text-[9px] font-bold tracking-[0.18em] text-[#028090] uppercase mt-0.5 leading-none">CORAL BEACH</div>
                <div className="text-[7px] font-semibold tracking-[0.35em] text-[#02c39a] uppercase mt-0.5 leading-none">RESORT</div>
              </div>
            </div>
            
            <div className="text-[10.5px] text-gray-500 leading-relaxed font-normal">
              <p className="font-bold text-gray-800 text-[12px]">Tenggol Coral Beach Resort</p>
              <p className="text-[9.5px] text-gray-400">(Dimiliki oleh : Ocean Xperience Sdn Bhd)</p>
              <p>Lot 7, Jalan Ampang Utama 2/2 Off Jalan Ampang,</p>
              <p>Ampang Selangor 68000</p>
              <p>Malaysia</p>
              <p className="mt-1 text-gray-700">603 4251 8332</p>
              <p className="text-gray-700">account@tenggol.com.my</p>
              <p className="text-gray-700">www.tenggol.com.my</p>
            </div>
          </div>

          {/* Invoice Header Details */}
          <div className="text-right">
            <h1 className="text-[34px] font-light text-gray-700 tracking-wide leading-none">Invoice</h1>
            <p className="text-xs text-gray-600 font-bold mt-1.5 font-mono">
              # {dates?.bookingReference || booking._id?.substring(0, 8).toUpperCase()}
            </p>
            
            <div className="mt-6 bg-gray-50 border-r-4 border-slate-500 py-2.5 px-4 inline-block text-right">
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Balance Due</span>
              <span className="text-xl font-bold text-gray-900 mt-1 block">
                MYR {formatCurrency(balanceDue)}
              </span>
            </div>
          </div>

        </div>

        {/* Bill To & Dates Metadata Section */}
        <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-6">
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Bill To</span>
            <p className="font-bold text-gray-900 text-[13px]">{customerDetails?.name || "-"}</p>
            {customerDetails?.mobile && <p className="text-[11px] text-gray-500 mt-0.5">Tel: {customerDetails.mobile}</p>}
            {customerDetails?.email && <p className="text-[11px] text-gray-500">{customerDetails.email}</p>}
          </div>

          {/* Invoice Dates info list */}
          <div className="text-right text-[11px] space-y-1.5 w-64">
            <div className="flex justify-between">
              <span className="text-gray-400">Invoice Date :</span>
              <span className="font-semibold text-gray-800">{formatDate(dates?.bookingDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Terms :</span>
              <span className="font-semibold text-gray-800">Due on Receipt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Due Date :</span>
              <span className="font-semibold text-gray-800">{formatDate(dates?.checkInDate || dates?.bookingDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">P.O.# :</span>
              <span className="font-semibold text-gray-800">{formatStayDates()}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full text-left border-collapse text-[11px] mt-2">
            <thead>
              <tr className="bg-[#3d3d3d] text-white">
                <th className="p-2.5 text-center w-10 font-bold">#</th>
                <th className="p-2.5 font-bold">Item & Description</th>
                <th className="p-2.5 text-right w-16 font-bold">Qty</th>
                <th className="p-2.5 text-right w-24 font-bold">Rate</th>
                <th className="p-2.5 text-right w-24 font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="p-2.5 text-center align-top text-gray-400">{row.index}</td>
                  <td className="p-2.5 align-top">
                    <p className="font-bold text-gray-800">{row.title}</p>
                    {row.descriptions.map((desc, i) => (
                      <p key={i} className="text-gray-400 mt-0.5 text-[10px] leading-relaxed font-normal">{desc}</p>
                    ))}
                  </td>
                  <td className="p-2.5 text-right align-top text-gray-800">{row.qty}</td>
                  <td className="p-2.5 text-right align-top text-gray-800">{formatCurrency(row.rate)}</td>
                  <td className="p-2.5 text-right align-top text-gray-800 font-medium">{formatCurrency(row.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations Section */}
        <div className="flex justify-end mt-4">
          <div className="w-72 text-[11px] space-y-2 border-b border-gray-200 pb-4">
            <div className="flex justify-between text-gray-500">
              <span>Sub Total</span>
              <span className="font-medium text-gray-800">{formatCurrency(subTotalExcludingSST)}</span>
            </div>
            
            <div className="flex justify-between text-gray-500">
              <span>SST (8%)</span>
              <span className="font-medium text-gray-800">{formatCurrency(sstAmount)}</span>
            </div>

            {Number(billing?.discount) > 0 && (
              <div className="flex justify-between text-rose-700 font-medium">
                <span>Discount ({billing.discount}%)</span>
                <span>-{formatCurrency(discountVal)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-150 pt-2 text-[12px]">
              <span>Total</span>
              <span>MYR {formatCurrency(finalTotal)}</span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>Payment Made</span>
              <span className="text-red-600 font-medium">(-) {formatCurrency(billing?.advanceAmountInput || 0)}</span>
            </div>

            <div className="flex justify-between font-bold text-gray-950 bg-gray-100 p-2.5 rounded text-[13px] items-center">
              <span>Balance Due</span>
              <span>MYR {formatCurrency(balanceDue)}</span>
            </div>
          </div>
        </div>

        {/* Notes, Payment Options & Footer Terms */}
        <div className="mt-8 text-[10.5px] text-gray-500 space-y-5 leading-normal">
          <div>
            <h4 className="font-bold text-gray-700">Notes</h4>
            <p className="mt-0.5 text-gray-400">Thanks for your business. This is a computer-generated document. No signature is required.</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-700 flex items-center gap-1">
              💳 Payment Options
            </h4>
            <p className="mt-0.5 text-gray-400">
              Please Bank in to: Account Name: <strong className="text-gray-600">Ocean Xperience Sdn Bhd</strong>. Public Bank Bank A/C: <strong className="text-gray-600">3212 87 3322</strong> Swift Code: <strong className="text-gray-600">PBBEMYKL</strong> * All banks' charges to be borne by sender.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-700">Terms & Conditions</h4>
            <ol className="list-decimal pl-4 mt-0.5 text-gray-400 space-y-0.5">
              <li>Charges of 8% SST is included in the above quotation.</li>
              <li>Packages included accommodation, meals, 2 way boat transfer & boat dives/snorkeling trips.</li>
            </ol>
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="mt-12 text-center text-[9px] text-gray-400 border-t border-gray-100 pt-3">
          <p>Crafted with ease using <strong className="text-gray-400">Zoho Invoice</strong></p>
          <p className="mt-0.5">Visit zoho.com/invoice to create truly professional invoices</p>
        </div>

      </div>

      {/* PAGE 2: Full Terms & Conditions Page */}
      <div className="hidden print:block text-gray-800 bg-white p-8 font-sans max-w-4xl mx-auto print-voucher leading-relaxed" style={{ pageBreakBefore: "always", breakBefore: "page" }}>
        
        <div className="space-y-4 text-[10.5px] text-gray-500 leading-normal">
          <ol className="space-y-2 text-gray-700 list-none pl-0">
            <li>3. 50% deposit payment is required to book your reservation. Booking is not confirmed until payment deposit is made and is acknowledge received. (Subject to first come first serve basis)</li>
            <li>4. Balance payment should be settle 30 days before departure date.</li>
            <li>5. Any form of deposit or payment for booking is not refundable for any reason.</li>
            <li>6. Diving equipment rental are not included. (For leisure diving package). Full set rental at RM 90/pax/day</li>
            <li>7. Snorkeling equipment rental is included in the package. A deposit of RM 50.00 is require once you collec the snorkeling equipment, the deposit will be return once the snorkeling equipment is returned.</li>
            <li>8. School holiday surcharge RM 30/pax , Public Holiday surcharge RM 60/pax</li>
            <li>9. Cancellation and No-Show is non refundable in part or in full.</li>
            <li>10. Date are not valid to change once reservation is confirmed.</li>
            <li>11. No refund for any part of package or activities not utilized for any reason.</li>
            <li>12. Booking is not confirmed until payment is acknowledge received.</li>
            <li>13. No refund or reduction will be given for accommodation, meal, snorkeling and diving trip due to weather condition or unforeseen circumstance(Act of Nature) or if guest(s) did not proceed with any part of their package.</li>
            <li>14. If guest(s) detected positive COVID, would require to provide us with PCR Test Result before proceeding to postpone the trip for the individual pax. No refund will be provided.</li>
            <li>15. Age 45 and above or with any sickness/illness require doctor's letter to proceed with Scuba Diving Courses.</li>
          </ol>

          <p className="mt-4 font-semibold text-gray-800">
            By making a payment (either deposit or full amount), you are deemed to have accepted all the terms and conditions stated in this quotation.
          </p>

          <div className="mt-5 border border-gray-200 rounded p-4 bg-gray-50/50 space-y-1.5 max-w-lg">
            <p className="font-bold text-gray-800">Please Bank in to:</p>
            <table className="w-full text-left text-[10.5px] space-y-1">
              <tbody>
                <tr>
                  <td className="text-gray-400 w-32 py-0.5 font-semibold">Account Name:</td>
                  <td className="text-gray-900 font-bold py-0.5">Ocean Xperience Sdn Bhd.</td>
                </tr>
                <tr>
                  <td className="text-gray-400 py-0.5 font-semibold">Bank Name & A/C:</td>
                  <td className="text-gray-900 font-bold py-0.5">Public Bank Bank A/C: 3212 87 3322</td>
                </tr>
                <tr>
                  <td className="text-gray-400 py-0.5 font-semibold">Swift Code:</td>
                  <td className="text-gray-900 font-mono py-0.5 font-semibold">PBBEMYKL</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[9.5px] text-gray-400 italic mt-1">* All banks' charges to be borne by sender.</p>
          </div>

          <p className="mt-4 text-gray-600">
            Kindly share the payment slip with us via WhatsApp for our records and to ensure that your payment is acknowledged promptly. Thank you.
          </p>

          <p className="mt-4 font-bold text-gray-800 text-[11px]">Thank You And Have A Nice Day!</p>

          <div className="mt-6 border-t border-gray-200 pt-4 text-[9.5px] text-gray-400 space-y-1 font-normal">
            <p>* Cheque payment should be crossed and made payable to "OCEAN XPERIENCE SDN BHD."</p>
            <p>* Kindly indicate our invoice number on your remittance.</p>
            <p>* Please report any discrepancies within 7 days from the receipt of the invoice.</p>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="mt-16 text-center text-[9px] text-gray-400 border-t border-gray-100 pt-3">
          <p>Crafted with ease using <strong className="text-gray-400">Zoho Invoice</strong></p>
          <p className="mt-0.5">Visit zoho.com/invoice to create truly professional invoices</p>
        </div>

      </div>
    </>
  );
};

export default BookingVoucherPrint;
