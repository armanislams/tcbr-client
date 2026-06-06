import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#333333',
    lineHeight: 1.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  logoImage: {
    width: 140,
    height: 40,
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 8,
    color: '#666666',
    marginTop: 2,
  },
  companyName: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
  },
  companySub: {
    fontSize: 7.5,
    color: '#94a3b8',
    marginBottom: 2,
  },
  invoiceTitleContainer: {
    width: 200,
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  invoiceTitle: {
    fontSize: 22,
    color: '#444444',
    textAlign: 'right',
    lineHeight: 1.2,
  },
  invoiceNo: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#555555',
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.2,
  },
  balanceBox: {
    backgroundColor: '#f8fafc',
    borderRightWidth: 4,
    borderRightColor: '#64748b',
    borderRightStyle: 'solid',
    padding: '4 8',
    marginTop: 6,
    alignItems: 'flex-end',
  },
  balanceBoxLabel: {
    fontSize: 7,
    color: '#94a3b8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  balanceBoxValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Helvetica-Bold',
    marginTop: 1,
    textAlign: 'right',
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    paddingBottom: 6,
    marginBottom: 10,
  },
  billToContainer: {
    width: '50%',
  },
  metaLabel: {
    fontSize: 7,
    color: '#94a3b8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  billToName: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Helvetica-Bold',
  },
  billToDetail: {
    fontSize: 8.5,
    color: '#64748b',
    marginTop: 1,
  },
  metaDetails: {
    width: '45%',
    alignItems: 'end',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 1,
  },
  metaRowLabel: {
    color: '#94a3b8',
    fontSize: 8,
  },
  metaRowValue: {
    fontWeight: 'bold',
    color: '#334155',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  table: {
    width: '100%',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3d3d3d',
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    padding: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    padding: '4 4',
  },
  colIndex: { width: '5%', textAlign: 'center' },
  colDesc: { width: '55%' },
  colQty: { width: '10%', textAlign: 'right' },
  colRate: { width: '15%', textAlign: 'right' },
  colAmount: { width: '15%', textAlign: 'right' },
  rowTitle: {
    fontWeight: 'bold',
    color: '#1e293b',
    fontFamily: 'Helvetica-Bold',
  },
  rowDesc: {
    fontSize: 7,
    color: '#94a3b8',
    marginTop: 1,
  },
  calcSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  calcContainer: {
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    paddingBottom: 3,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  calcLabel: {
    color: '#64748b',
    fontSize: 8,
  },
  calcValue: {
    color: '#1e293b',
    fontSize: 8,
  },
  calcRowDiscount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  calcLabelDiscount: {
    color: '#be123c',
    fontSize: 8,
  },
  calcValueDiscount: {
    color: '#be123c',
    fontSize: 8,
  },
  calcRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    borderTopStyle: 'solid',
    paddingTop: 3,
    marginBottom: 3,
  },
  calcLabelTotal: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
  },
  calcValueTotal: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
  },
  calcRowBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    padding: '3 6',
    borderRadius: 2,
    marginTop: 3,
  },
  calcLabelBalance: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
  },
  calcValueBalance: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
  },
  notesSection: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 10,
  },
  notesHeading: {
    fontWeight: 'bold',
    color: '#475569',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  notesContent: {
    color: '#94a3b8',
    marginBottom: 4,
  },
  termsList: {
    marginTop: 2,
  },
  termsItem: {
    flexDirection: 'row',
    marginBottom: 1.5,
  },
  termsBullet: {
    width: 10,
    color: '#94a3b8',
  },
  termsText: {
    flex: 1,
    color: '#94a3b8',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    borderTopStyle: 'solid',
    paddingTop: 4,
    alignItems: 'center',
    fontSize: 7,
    color: '#94a3b8',
    marginTop: 10,
  },
  footerBold: {
    fontWeight: 'bold',
    color: '#94a3b8',
    fontFamily: 'Helvetica-Bold',
  },
  
  // Page 2 specific styles
  page2List: {
    marginTop: 5,
  },
  page2ListItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  page2ListText: {
    flex: 1,
    color: '#475569',
    fontSize: 8.5,
  },
  termsTableContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    borderRadius: 3,
    padding: 8,
    backgroundColor: '#fafafa',
    marginTop: 10,
    width: '280',
  },
  termsTableTitle: {
    fontWeight: 'bold',
    color: '#1e293b',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    fontSize: 8.5,
  },
  termsTableRow: {
    flexDirection: 'row',
    marginBottom: 2.5,
  },
  termsTableColLabel: {
    width: 90,
    color: '#64748b',
    fontSize: 8,
  },
  termsTableColValue: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  termsTableNote: {
    fontSize: 7.5,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 2,
  },
});

const BookingVoucherPDF = ({ booking }) => {
  if (!booking) return null;

  const { customerDetails, roomDetails, packageDetails, dates, billing } = booking;

  // Local helper functions for formatting
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("en-GB") : "-";

  const formatCurrency = (amount) => {
    const numAmount = Number(amount || 0);
    return numAmount.toFixed(2);
  };

  const getNights = () => {
    if (!dates?.checkInDate || !dates?.checkOutDate) return 0;
    const diffTime = Math.ceil(new Date(dates.checkOutDate) - new Date(dates.checkInDate));
    return Math.max(0, Math.ceil(diffTime / 86400000));
  };

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

  // Build rows for the table
  const tableRows = [];
  let itemCounter = 1;

  // 1. Rooms
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

  // 2. Packages
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
  const base = Number(billing?.totalAmountInput) || 0;
  const disc = Number(billing?.discount) || 0;
  const discountVal = base * (disc / 100);
  const discountedSubtotal = base * (1 - disc / 100);
  
  const charge = Number(billing?.bookingChargeInput) || 0;
  let extra = 0;
  if (Array.isArray(billing?.extraCharges)) {
    extra = billing.extraCharges.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  }
  
  const subTotalBeforeDiscountAndSST = base + charge + extra;
  const sstAmount = discountedSubtotal * 0.08;
  const finalTotal = discountedSubtotal + sstAmount + charge + extra;
  const balanceDue = finalTotal - (Number(billing?.advanceAmountInput) || 0);

  return (
    <Document>
      {/* PAGE 1: Invoice details */}
      <Page size="A4" style={styles.page}>
        
        {/* Top Header Section */}
        <View style={styles.header}>
          
          {/* Logo & Company Address */}
          <View>
            <Image style={styles.logoImage} src="/tcb-logo.png" />
            
            <View style={styles.companyDetails}>
              <Text style={styles.companyName}>Tenggol Coral Beach Resort</Text>
              <Text style={styles.companySub}>(Dimiliki oleh : Ocean Xperience Sdn Bhd)</Text>
              <Text>Lot 7, Jalan Ampang Utama 2/2 Off Jalan Ampang,</Text>
              <Text>Ampang Selangor 68000</Text>
              <Text>Malaysia</Text>
              <Text style={{ marginTop: 2, color: '#475569' }}>603 4251 8332</Text>
              <Text style={{ color: '#475569' }}>account@tenggol.com.my</Text>
              <Text style={{ color: '#475569' }}>www.tenggol.com.my</Text>
            </View>
          </View>

          {/* Invoice Header Details */}
          <View style={styles.invoiceTitleContainer}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceNo}>
              # {dates?.bookingReference || booking._id?.substring(0, 8).toUpperCase()}
            </Text>
            
            <View style={styles.balanceBox}>
              <Text style={styles.balanceBoxLabel}>{balanceDue < 0 ? "Extra Paid" : "Balance Due"}</Text>
              <Text style={styles.balanceBoxValue}>
                MYR {formatCurrency(balanceDue < 0 ? Math.abs(balanceDue) : balanceDue)}
              </Text>
            </View>
          </View>

        </View>

        {/* Bill To & Dates Metadata Section */}
        <View style={styles.metaSection}>
          <View style={styles.billToContainer}>
            <Text style={styles.metaLabel}>Bill To</Text>
            <Text style={styles.billToName}>{customerDetails?.name || "-"}</Text>
            {customerDetails?.mobile && <Text style={styles.billToDetail}>Tel: {customerDetails.mobile}</Text>}
            {customerDetails?.email && <Text style={styles.billToDetail}>{customerDetails.email}</Text>}
          </View>

          {/* Invoice Dates info list */}
          <View style={styles.metaDetails}>
            <View style={styles.metaRow}>
              <Text style={styles.metaRowLabel}>Invoice Date :</Text>
              <Text style={styles.metaRowValue}>{formatDate(dates?.bookingDate)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaRowLabel}>Terms :</Text>
              <Text style={styles.metaRowValue}>Due on Receipt</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaRowLabel}>Due Date :</Text>
              <Text style={styles.metaRowValue}>{formatDate(dates?.checkInDate || dates?.bookingDate)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaRowLabel}>P.O.# :</Text>
              <Text style={styles.metaRowValue}>{formatStayDates()}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colIndex]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Item & Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
          </View>

          {/* Table Rows */}
          {tableRows.map((row, idx) => (
            <View key={idx} style={styles.tableRow} wrap={false}>
              <Text style={[styles.colIndex, { color: '#94a3b8' }]}>{row.index}</Text>
              <View style={styles.colDesc}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                {row.descriptions.map((desc, i) => (
                  <Text key={i} style={styles.rowDesc}>{desc}</Text>
                ))}
              </View>
              <Text style={styles.colQty}>{row.qty}</Text>
              <Text style={styles.colRate}>{formatCurrency(row.rate)}</Text>
              <Text style={[styles.colAmount, { fontFamily: 'Helvetica-Bold' }]}>{formatCurrency(row.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Calculations Section */}
        <View style={styles.calcSection}>
          <View style={styles.calcContainer}>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Sub Total</Text>
              <Text style={styles.calcValue}>{formatCurrency(subTotalBeforeDiscountAndSST)}</Text>
            </View>

            {Number(billing?.discount) > 0 && (
              <View style={styles.calcRowDiscount}>
                <Text style={styles.calcLabelDiscount}>Discount ({billing.discount}%)</Text>
                <Text style={styles.calcValueDiscount}>-{formatCurrency(discountVal)}</Text>
              </View>
            )}
            
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>SST (8%)</Text>
              <Text style={styles.calcValue}>{formatCurrency(sstAmount)}</Text>
            </View>

            <View style={styles.calcRowTotal}>
              <Text style={styles.calcLabelTotal}>Total</Text>
              <Text style={styles.calcValueTotal}>MYR {formatCurrency(finalTotal)}</Text>
            </View>

            <View style={styles.calcRow}>
              <Text style={[styles.calcLabel, { color: '#94a3b8' }]}>Payment Made</Text>
              <Text style={[styles.calcValue, { color: '#be123c', fontFamily: 'Helvetica-Bold' }]}>(-) {formatCurrency(billing?.advanceAmountInput || 0)}</Text>
            </View>

            <View style={styles.calcRowBalance}>
              <Text style={styles.calcLabelBalance}>{balanceDue < 0 ? "Extra Paid" : "Balance Due"}</Text>
              <Text style={styles.calcValueBalance}>MYR {formatCurrency(balanceDue < 0 ? Math.abs(balanceDue) : balanceDue)}</Text>
            </View>
          </View>
        </View>

        {/* Notes, Payment Options & Footer Terms */}
        <View style={styles.notesSection}>
          <View style={{ marginBottom: 5 }}>
            <Text style={styles.notesHeading}>Notes</Text>
            <Text style={styles.notesContent}>Thanks for your business. This is a computer-generated document. No signature is required.</Text>
          </View>

          <View style={{ marginBottom: 5 }}>
            <Text style={styles.notesHeading}>💳 Payment Options</Text>
            <Text style={styles.notesContent}>
              Please Bank in to: Account Name: Ocean Xperience Sdn Bhd. Public Bank Bank A/C: 3212 87 3322 Swift Code: PBBEMYKL * All banks' charges to be borne by sender.
            </Text>
          </View>

          <View>
            <Text style={styles.notesHeading}>Terms & Conditions</Text>
            <View style={styles.termsList}>
              <View style={styles.termsItem}>
                <Text style={styles.termsBullet}>1.</Text>
                <Text style={styles.termsText}>Charges of 8% SST is not included in the above quotation.</Text>
              </View>
              <View style={styles.termsItem}>
                <Text style={styles.termsBullet}>2.</Text>
                <Text style={styles.termsText}>Packages included accommodation, meals, 2 way boat transfer & boat dives/snorkeling trips.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Page Footer */}
        <View style={styles.footer}>
          <Text>Crafted with ease using <Text style={styles.footerBold}>Zoho Invoice</Text></Text>
          <Text style={{ marginTop: 1 }}>Visit zoho.com/invoice to create truly professional invoices</Text>
        </View>

      </Page>

      {/* PAGE 2: Full Terms & Conditions Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.termsPageTitle}>Terms & Conditions (Continued)</Text>
        
        <View style={styles.page2List}>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>3.</Text>
            <Text style={styles.page2ListText}>50% deposit payment is required to book your reservation. Booking is not confirmed until payment deposit is made and is acknowledge received. (Subject to first come first serve basis)</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>4.</Text>
            <Text style={styles.page2ListText}>Balance payment should be settle 30 days before departure date.</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>5.</Text>
            <Text style={styles.page2ListText}>Any form of deposit or payment for booking is not refundable for any reason.</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>6.</Text>
            <Text style={styles.page2ListText}>Diving equipment rental are not included. (For leisure diving package). Full set rental at RM 90/pax/day</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>7.</Text>
            <Text style={styles.page2ListText}>Snorkeling equipment rental is included in the package. A deposit of RM 50.00 is require once you collec the snorkeling equipment, the deposit will be return once the snorkeling equipment is returned.</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>8.</Text>
            <Text style={styles.page2ListText}>School holiday surcharge RM 30/pax , Public Holiday surcharge RM 60/pax</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>9.</Text>
            <Text style={styles.page2ListText}>Cancellation and No-Show is non refundable in part or in full.</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>10.</Text>
            <Text style={styles.page2ListText}>Date are not valid to change once reservation is confirmed.</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>11.</Text>
            <Text style={styles.page2ListText}>No refund for any part of package or activities not utilized for any reason.</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>12.</Text>
            <Text style={styles.page2ListText}>Booking is not confirmed until payment is acknowledge received.</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>13.</Text>
            <Text style={styles.page2ListText}>No refund or reduction will be given for accommodation, meal, snorkeling and diving trip due to weather condition or unforeseen circumstance(Act of Nature) or if guest(s) did not proceed with any part of their package.</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>14.</Text>
            <Text style={styles.page2ListText}>If guest(s) detected positive COVID, would require to provide us with PCR Test Result before proceeding to postpone the trip for the individual pax. No refund will be provided.</Text>
          </View>
          <View style={styles.page2ListItem}>
            <Text style={[styles.termsBullet, { fontSize: 8.5 }]}>15.</Text>
            <Text style={styles.page2ListText}>Age 45 and above or with any sickness/illness require doctor's letter to proceed with Scuba Diving Courses.</Text>
          </View>
        </View>

        <Text style={[styles.page2ListText, { fontWeight: 'bold', fontFamily: 'Helvetica-Bold', marginTop: 10 }]}>
          By making a payment (either deposit or full amount), you are deemed to have accepted all the terms and conditions stated in this quotation.
        </Text>

        <View style={styles.termsTableContainer}>
          <Text style={styles.termsTableTitle}>Please Bank in to:</Text>
          <View style={styles.termsTableRow}>
            <Text style={styles.termsTableColLabel}>Account Name:</Text>
            <Text style={styles.termsTableColValue}>Ocean Xperience Sdn Bhd.</Text>
          </View>
          <View style={styles.termsTableRow}>
            <Text style={styles.termsTableColLabel}>Bank Name & A/C:</Text>
            <Text style={styles.termsTableColValue}>Public Bank A/C: 3212 87 3322</Text>
          </View>
          <View style={styles.termsTableRow}>
            <Text style={styles.termsTableColLabel}>Swift Code:</Text>
            <Text style={styles.termsTableColValue}>PBBEMYKL</Text>
          </View>
          <Text style={styles.termsTableNote}>* All banks' charges to be borne by sender.</Text>
        </View>

        <Text style={[styles.page2ListText, { color: '#64748b', marginTop: 8 }]}>
          Kindly share the payment slip with us via WhatsApp for our records and to ensure that your payment is acknowledged promptly. Thank you.
        </Text>

        <Text style={[styles.page2ListText, { fontWeight: 'bold', fontFamily: 'Helvetica-Bold', color: '#1e293b', marginTop: 8, fontSize: 9.5 }]}>
          Thank You And Have A Nice Day!
        </Text>

        <View style={{ borderTopWidth: 1, borderTopColor: '#e2e8f0', borderTopStyle: 'solid', paddingTop: 6, marginTop: 10, fontSize: 8, color: '#94a3b8' }}>
          <Text>* Cheque payment should be crossed and made payable to "OCEAN XPERIENCE SDN BHD."</Text>
          <Text>* Kindly indicate our invoice number on your remittance.</Text>
          <Text>* Please report any discrepancies within 7 days from the receipt of the invoice.</Text>
        </View>

        {/* Page Footer */}
        <View style={styles.footer}>
          <Text>Crafted with ease using <Text style={styles.footerBold}>Zoho Invoice</Text></Text>
          <Text style={{ marginTop: 1 }}>Visit zoho.com/invoice to create truly professional invoices</Text>
        </View>

      </Page>
    </Document>
  );
};

export default BookingVoucherPDF;
