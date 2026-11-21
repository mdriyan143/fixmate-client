"use client";
import { CreditCard, Wallet } from "lucide-react";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import { useApi } from "@/lib/useApi";
import type { Payment } from "@/lib/types";

export default function Transactions() {
  const { data, loading } = useApi<Payment[]>("/api/admin/payments");
  if (loading) return <div className="skeleton h-64" />;

  const payments = data || [];
  const revenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--navy)]">Transactions</h1>
      <div className="max-w-xs">
        <StatCard label="Total Revenue" value={`$${revenue.toFixed(2)}`} icon={Wallet} />
      </div>

      {payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No transactions yet" />
      ) : (
        <div className="card-box table-box">
          <table>
            <thead>
              <tr><th>Customer</th><th>Technician</th><th>Service</th><th>Amount</th><th>Transaction ID</th><th>Paid on</th></tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.customerName}</td>
                  <td>{p.technicianName}</td>
                  <td className="font-medium">{p.serviceTitle}</td>
                  <td>${p.amount}</td>
                  <td className="font-mono text-xs">{p.transactionId}</td>
                  <td>{new Date(p.paidAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}