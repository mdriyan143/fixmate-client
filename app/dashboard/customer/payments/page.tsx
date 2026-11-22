"use client";

import Link from "next/link";
import { CreditCard, FileText, Receipt, Wallet } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import StatCard from "@/components/StatCard";
import { useApi } from "@/lib/useApi";
import type { Payment } from "@/lib/types";

export default function PaymentHistory() {
  const { data, loading } = useApi<Payment[]>("/api/payments/my");

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="skeleton h-12 w-64" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => <div key={i} className="skeleton h-24" />)}
        </div>
        <div className="skeleton h-64" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No payments yet"
        text="Paid jobs will appear here."
        href="/dashboard/customer/bookings"
        cta="Go to My Bookings"
      />
    );
  }

  const total = data.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)] sm:text-3xl">Payment History</h1>
        <p className="mt-1 text-sm text-slate-500">Every payment you have made, with its invoice.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Paid" value={`$${total.toFixed(2)}`} icon={Wallet} />
        <StatCard label="Payments Made" value={data.length} icon={Receipt} />
      </div>

      <div className="card-box table-box">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Technician</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Paid on</th>
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p) => (
              <tr key={p._id}>
                <td className="font-medium text-[var(--navy)]">{p.serviceTitle}</td>
                <td>{p.technicianName}</td>
                <td className="font-bold text-[var(--navy)]">${p.amount}</td>
                <td className="font-mono text-xs text-slate-500">{p.transactionId}</td>
                <td className="whitespace-nowrap">{new Date(p.paidAt).toLocaleDateString()}</td>
                <td>
                  <Link href={`/dashboard/customer/invoices/${p.bookingId}`} className="btn-ghost btn-small">
                    <FileText size={14} aria-hidden="true" /> Invoice
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}