"use client";
import { CreditCard, Receipt, Wallet } from "lucide-react";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import { useApi } from "@/lib/useApi";
import type { Payment } from "@/lib/types";

export default function Transactions() {
  const { data, loading } = useApi<Payment[]>("/api/admin/payments");

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12 w-64" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => <div key={i} className="skeleton h-24" />)}
        </div>
        <div className="skeleton h-64" />
      </div>
    );
  }

  const payments = data || [];
  const revenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)] sm:text-3xl">Transactions</h1>
        <p className="mt-1 text-sm text-slate-500">All successful Stripe payments.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Revenue" value={`$${revenue.toFixed(2)}`} icon={Wallet} />
        <StatCard label="Transactions" value={payments.length} icon={Receipt} />
      </div>

      {payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No transactions yet" />
      ) : (
        <>
          {/* TABLE (tablet and desktop) */}
          <div className="card-box table-box hidden md:block">
            <table>
              <thead>
                <tr><th>Customer</th><th>Technician</th><th>Service</th><th>Amount</th><th>Transaction ID</th><th>Paid on</th></tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.customerName}</td>
                    <td>{p.technicianName}</td>
                    <td className="font-medium text-[var(--navy)]">{p.serviceTitle}</td>
                    <td className="font-bold text-[var(--navy)]">${p.amount}</td>
                    <td className="font-mono text-xs text-slate-500">{p.transactionId}</td>
                    <td className="whitespace-nowrap">{new Date(p.paidAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARDS (phones) */}
          <div className="grid gap-4 md:hidden">
            {payments.map((p) => (
              <div key={p._id} className="card-box p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-[var(--navy)]">{p.serviceTitle}</h3>
                  <p className="text-lg font-extrabold text-[var(--navy)]">${p.amount}</p>
                </div>
                <p className="mt-1 text-sm text-slate-600">{p.customerName} to {p.technicianName}</p>
                <p className="mt-2 break-all font-mono text-xs text-slate-500">{p.transactionId}</p>
                <p className="mt-1 text-xs text-slate-500">Paid on {new Date(p.paidAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}