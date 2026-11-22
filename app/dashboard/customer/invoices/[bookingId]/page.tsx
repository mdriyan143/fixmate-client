"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CircleCheck, Download, FileText } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { useApi } from "@/lib/useApi";
import type { Payment } from "@/lib/types";
import { downloadInvoice } from "@/lib/invoicePdf";

export default function InvoicePage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { data, loading } = useApi<Payment[]>("/api/payments/my");

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-96" />
      </div>
    );
  }

  const payment = data?.find((p) => p.bookingId === bookingId);
  if (!payment) {
    return (
      <EmptyState
        icon={FileText}
        title="Invoice not found"
        text="We could not find an invoice for this booking."
        href="/dashboard/customer/payments"
        cta="Back to Payment History"
      />
    );
  }

  const rows: [string, string][] = [
    ["Service", payment.serviceTitle],
    ["Customer", `${payment.customerName} (${payment.customerEmail})`],
    ["Technician", payment.technicianName],
    ["Transaction ID", payment.transactionId],
    ["Paid on", new Date(payment.paidAt).toLocaleDateString()],
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        href="/dashboard/customer/payments"
        className="press inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-ink)] hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to payments
      </Link>

      <div className="card-box relative overflow-hidden p-6 pt-8 sm:p-8 sm:pt-10">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-[image:var(--grad-brand)]" />

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--navy)]">FixMate Invoice</h1>
            <p className="mt-1 font-mono text-xs text-slate-500">INV-{payment.bookingId.slice(-8).toUpperCase()}</p>
          </div>
          <span className="badge badge-paid gap-1.5">
            <CircleCheck size={13} aria-hidden="true" /> Paid
          </span>
        </div>

        <dl className="mt-6">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-[var(--line)] py-3 text-sm">
              <dt className="shrink-0 text-slate-500">{label}</dt>
              <dd className="break-all text-right font-medium text-[var(--navy)]">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-[var(--accent-ink)]/5 px-5 py-4">
          <span className="font-semibold text-slate-600">Total</span>
          <span className="text-gradient text-3xl font-extrabold">${payment.amount}</span>
        </div>
      </div>

      <button onClick={() => downloadInvoice(payment)} className="btn-main">
        <Download size={16} aria-hidden="true" /> Download PDF
      </button>
    </div>
  );
}