"use client";
import { useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Check, X } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { api, getErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Service } from "@/lib/types";

const tabs: [value: string, label: string][] = [
  ["pending", "Pending"],
  ["approved", "Approved"],
  ["rejected", "Rejected"],
  ["all", "All"],
];

export default function ServiceApproval() {
  const [filter, setFilter] = useState("pending"); // pending services first
  const { data, loading, reload } = useApi<Service[]>(`/api/admin/services${filter === "all" ? "" : `?status=${filter}`}`);

  async function decide(id: string, status: "approved" | "rejected") {
    try {
      await api(`/api/admin/services/${id}/approval`, { method: "PATCH", body: { status } });
      toast.success(`Service ${status}`);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  // the same buttons are used by the table and the mobile cards
  const actions = (s: Service) => (
    <div className="flex gap-2">
      <button className="btn-main btn-small" disabled={s.approvalStatus === "approved"} onClick={() => decide(s._id, "approved")}>
        <Check size={14} aria-hidden="true" /> Approve
      </button>
      <button className="btn-danger btn-small" disabled={s.approvalStatus === "rejected"} onClick={() => decide(s._id, "rejected")}>
        <X size={14} aria-hidden="true" /> Reject
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)] sm:text-3xl">Service Approval</h1>
        <p className="mt-1 text-sm text-slate-500">Only approved services are visible to customers.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by approval status">
        {tabs.map(([value, label]) => (
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
        <EmptyState icon={BadgeCheck} title="Nothing here" text="No services match this filter." />
      ) : (
        <>
          {/* TABLE (tablet and desktop) */}
          <div className="card-box table-box hidden md:block">
            <table>
              <thead>
                <tr><th>Service</th><th>Technician</th><th>Category</th><th>Price</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {data.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={s.image} alt="" className="h-10 w-14 rounded-lg bg-slate-200 object-cover" />
                        <span className="font-medium text-[var(--navy)]">{s.title}</span>
                      </div>
                    </td>
                    <td>{s.technicianName}</td>
                    <td>{s.category}</td>
                    <td className="font-bold text-[var(--navy)]">${s.basePrice}</td>
                    <td><StatusBadge value={s.approvalStatus} /></td>
                    <td>{actions(s)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARDS (phones) */}
          <div className="grid gap-4 md:hidden">
            {data.map((s) => (
              <div key={s._id} className="card-box overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <img src={s.image} alt="" className="h-16 w-20 shrink-0 rounded-xl bg-slate-200 object-cover" />
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-[var(--navy)]">{s.title}</h3>
                    <p className="truncate text-xs text-slate-500">{s.technicianName} · {s.category}</p>
                    <p className="text-lg font-extrabold text-[var(--navy)]">${s.basePrice}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--sage-soft)]/50 px-4 py-3">
                  <StatusBadge value={s.approvalStatus} />
                  {actions(s)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}