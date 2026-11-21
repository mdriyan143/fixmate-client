import type { Payment } from "./types";

type RGB = [number, number, number];
const INK: RGB = [43, 45, 49];
const ORANGE: RGB = [242, 140, 40];
const SAGE_SOFT: RGB = [232, 238, 226];
const GREY: RGB = [107, 114, 128];
const LINE: RGB = [228, 224, 212];
const GREEN: RGB = [21, 128, 61];

// builds a real A4 PDF and downloads it (no print dialog)
export async function downloadInvoice(p: Payment) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 18;
  const R = W - M;

  const invoiceNo = `INV-${p.bookingId.slice(-8).toUpperCase()}`;
  const date = new Date(p.paidAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const money = `$${Number(p.amount).toFixed(2)}`;

  // header band
  doc.setFillColor(...INK);
  doc.rect(0, 0, W, 44, "F");
  doc.setFillColor(...ORANGE);
  doc.roundedRect(M, 14, 16, 16, 3, 3, "F");
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("F", M + 8, 25, { align: "center" });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("FixMate", M + 21, 24);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Device & Home Appliance Repair", M + 21, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("INVOICE", R, 26, { align: "right" });

  // meta row
  const label = (t: string, x: number, y: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...GREY);
    doc.text(t, x, y);
  };
  const value = (t: string, x: number, y: number, size = 11) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...INK);
    doc.text(t, x, y);
  };

  label("INVOICE NO", M, 58);
  value(invoiceNo, M, 64);
  label("DATE PAID", 85, 58);
  value(date, 85, 64);
  label("STATUS", R - 22, 58);
  doc.setFillColor(...GREEN);
  doc.roundedRect(R - 22, 60, 22, 7, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PAID", R - 11, 65, { align: "center" });

  doc.setDrawColor(...LINE);
  doc.line(M, 74, R, 74);

  // billed to / provider
  label("BILLED TO", M, 84);
  value(p.customerName, M, 91, 12);
  doc.setFontSize(10);
  doc.setTextColor(...GREY);
  doc.text(p.customerEmail, M, 97);

  label("SERVICE PROVIDER", 110, 84);
  value(p.technicianName, 110, 91, 12);
  doc.setFontSize(10);
  doc.setTextColor(...GREY);
  doc.text("Verified FixMate technician", 110, 97);

  // items table
  doc.setFillColor(...SAGE_SOFT);
  doc.rect(M, 112, R - M, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text("DESCRIPTION", M + 4, 118.5);
  doc.text("AMOUNT", R - 4, 118.5, { align: "right" });

  value(p.serviceTitle, M + 4, 133, 12);
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  doc.text("Repair service, paid after completion", M + 4, 139);
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text(money, R - 4, 133, { align: "right" });
  doc.line(M, 146, R, 146);

  // total
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GREY);
  doc.text("Subtotal", 130, 158);
  doc.text(money, R - 4, 158, { align: "right" });
  doc.setFillColor(...ORANGE);
  doc.roundedRect(120, 165, R - 120, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text("TOTAL PAID", 126, 174);
  doc.setFontSize(14);
  doc.text(money, R - 4, 174, { align: "right" });

  // payment details
  label("PAYMENT DETAILS", M, 198);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text("Method: Card via Stripe", M, 205);
  doc.text("Currency: USD", M, 211);
  doc.text("Transaction ID:", M, 217);
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.text(p.transactionId, M + 28, 217);

  // footer
  doc.setDrawColor(...LINE);
  doc.line(M, 272, R, 272);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text("Thank you for using FixMate!", W / 2, 279, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text("This is a computer-generated invoice and needs no signature.  support@fixmate.com", W / 2, 285, { align: "center" });

  doc.save(`FixMate-${invoiceNo}.pdf`);
}