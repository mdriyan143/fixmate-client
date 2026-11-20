"use client";
import { useState } from "react";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { api, getErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Service } from "@/lib/types";

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--navy)]">Service Approval</h1>
        <select className="input-box w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton h-64" />
      ) : !data?.length ? (
        <EmptyState icon="🎉" title="Nothing here" text="No services match this filter." />
      ) : (
        <div className="card-box table-box">
          <table>
            <thead>
              <tr><th>Service</th><th>Technician</th><th>Category</th><th>Price</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={s.image} alt="" className="h-10 w-14 rounded object-cover" />
                      <span className="font-medium">{s.title}</span>
                    </div>
                  </td>
                  <td>{s.technicianName}</td>
                  <td>{s.category}</td>
                  <td>${s.basePrice}</td>
                  <td><StatusBadge value={s.approvalStatus} /></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-main btn-small" disabled={s.approvalStatus === "approved"} onClick={() => decide(s._id, "approved")}>Approve</button>
                      <button className="btn-danger btn-small" disabled={s.approvalStatus === "rejected"} onClick={() => decide(s._id, "rejected")}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
