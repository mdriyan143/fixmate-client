"use client";
import { useParams } from "next/navigation";
import { useApi } from "@/lib/useApi";
import type { Payment } from "@/lib/types";
import { downloadInvoice } from "@/lib/invoicePdf";
 
export default function InvoicePage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { data, loading } = useApi<Payment[]>("/api/payments/my");
  if (loading) return <div className="skeleton h-64" />;
 
  const payment = data?.find((p) => p.bookingId === bookingId);
  if (!payment) return <p className="text-slate-500">Invoice not found.</p>;
 
  const rows: [string, string][] = [
    ["Service", payment.serviceTitle],
    ["Customer", `${payment.customerName} (${payment.customerEmail})`],
    ["Technician", payment.technicianName],
    ["Transaction ID", payment.transactionId],
    ["Paid on", new Date(payment.paidAt).toLocaleDateString()],
  ];
 
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="card-box space-y-4 p-8">
        <h1 className="text-2xl font-bold text-[var(--navy)]">FixMate Invoice</h1>
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-[var(--line)] pb-2 text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="break-all text-right font-medium">{value}</span>
          </div>
        ))}
        <p className="text-right text-2xl font-extrabold text-[var(--accent-ink)]">Total: ${payment.amount}</p>
      </div>
    <button onClick={() => downloadInvoice(payment)} className="btn-main">Download PDF</button>
    </div>
  );
}
