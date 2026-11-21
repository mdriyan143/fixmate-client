"use client";
import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { useApi } from "@/lib/useApi";
import type { Booking } from "@/lib/types";
import { Inbox } from "lucide-react";

const filters: [value: string, label: string][] = [
  ["all", "All"], ["requested", "Requested"], ["accepted", "Accepted"], ["in-progress", "In Progress"],
  ["completed", "Completed"], ["rejected", "Rejected"], ["cancelled", "Cancelled"],
];

export default function AllBookings() {
  const [filter, setFilter] = useState("all");
  const { data, loading } = useApi<Booking[]>(`/api/admin/bookings${filter === "all" ? "" : `?status=${filter}`}`);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--navy)]">All Bookings</h1>
        <select className="input-box w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {filters.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="skeleton h-64" />
      ) : !data?.length ? (
        <EmptyState icon={Inbox} title="No bookings found" />
      ) : (
        <div className="card-box table-box">
          <table>
            <thead>
              <tr><th>Service</th><th>Customer</th><th>Technician</th><th>Date</th><th>Status</th><th>Payment</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {data.map((b) => (
                <tr key={b._id}>
                  <td className="font-medium">{b.serviceTitle}</td>
                  <td>{b.customerName}</td>
                  <td>{b.technicianName}</td>
                  <td>{new Date(b.preferredDate).toLocaleDateString()}</td>
                  <td><StatusBadge value={b.status} /></td>
                  <td><StatusBadge value={b.paymentStatus} /></td>
                  <td>${b.status === "completed" ? b.finalAmount : b.basePrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
