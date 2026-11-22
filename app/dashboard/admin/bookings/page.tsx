"use client";
import { useState } from "react";
import { CalendarDays, Inbox, UserRound, Wrench } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { useApi } from "@/lib/useApi";
import type { Booking } from "@/lib/types";

const filters: [value: string, label: string][] = [
  ["all", "All"], ["requested", "Requested"], ["accepted", "Accepted"], ["in-progress", "In Progress"],
  ["completed", "Completed"], ["rejected", "Rejected"], ["cancelled", "Cancelled"],
];

export default function AllBookings() {
  const [filter, setFilter] = useState("all");
  const { data, loading } = useApi<Booking[]>(`/api/admin/bookings${filter === "all" ? "" : `?status=${filter}`}`);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)] sm:text-3xl">All Bookings</h1>
        <p className="mt-1 text-sm text-slate-500">Every repair job on the platform.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {filters.map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={filter === value ? "btn-main btn-small" : "btn-ghost btn-small"}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton h-64" />
      ) : !data?.length ? (
        <EmptyState icon={Inbox} title="No bookings found" />
      ) : (
        <>
          {/* TABLE (tablet and desktop) */}
          <div className="card-box table-box hidden md:block">
            <table>
              <thead>
                <tr><th>Service</th><th>Customer</th><th>Technician</th><th>Date</th><th>Status</th><th>Payment</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {data.map((b) => (
                  <tr key={b._id}>
                    <td className="font-medium text-[var(--navy)]">{b.serviceTitle}</td>
                    <td>{b.customerName}</td>
                    <td>{b.technicianName}</td>
                    <td className="whitespace-nowrap">{new Date(b.preferredDate).toLocaleDateString()}</td>
                    <td><StatusBadge value={b.status} /></td>
                    <td><StatusBadge value={b.paymentStatus} /></td>
                    <td className="font-bold text-[var(--navy)]">${b.status === "completed" ? b.finalAmount : b.basePrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARDS (phones) */}
          <div className="grid gap-4 md:hidden">
            {data.map((b) => (
              <div key={b._id} className="card-box p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-[var(--navy)]">{b.serviceTitle}</h3>
                  <p className="text-lg font-extrabold text-[var(--navy)]">${b.status === "completed" ? b.finalAmount : b.basePrice}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge value={b.status} />
                  <StatusBadge value={b.paymentStatus} />
                </div>
                <div className="mt-3 space-y-1.5 border-t border-[var(--line)] pt-3 text-sm text-slate-600">
                  <p className="flex items-center gap-2"><UserRound size={14} aria-hidden="true" className="text-[var(--accent-ink)]" /> {b.customerName}</p>
                  <p className="flex items-center gap-2"><Wrench size={14} aria-hidden="true" className="text-[var(--accent-ink)]" /> {b.technicianName}</p>
                  <p className="flex items-center gap-2"><CalendarDays size={14} aria-hidden="true" className="text-[var(--accent-ink)]" /> {new Date(b.preferredDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}