
"use client";

import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import { useApi } from "@/lib/useApi";
import type { Payment } from "@/lib/types";

export default function PaymentHistory() {
  const { data, loading } = useApi<Payment[]>("/api/payments/my");

  if (loading) return <div className="skeleton h-64" />;

  if (!data?.length) {
    return (
      <EmptyState
        icon="💳"
        title="No payments yet"
        text="Paid jobs will appear here."
        href="/dashboard/customer/bookings"
        cta="Go to My Bookings"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--navy)]">
        Payment History
      </h1>

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
                <td className="font-medium">{p.serviceTitle}</td>
                <td>{p.technicianName}</td>
                <td>${p.amount}</td>
                <td className="font-mono text-xs">{p.transactionId}</td>
                <td>{new Date(p.paidAt).toLocaleDateString()}</td>
                <td>
                  <Link
                    href={`/dashboard/customer/invoices/${p.bookingId}`}
                    className="btn-ghost btn-small"
                  >
                    Invoice
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
