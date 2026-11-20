"use client";
import { useState } from "react";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import ConfirmModal from "@/components/ConfirmModal";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import { api, getErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Booking, BookingStatus } from "@/lib/types";

const filters: [value: string, label: string][] = [
  ["all", "All"], ["requested", "Requested"], ["accepted", "Accepted"],
  ["in-progress", "In Progress"], ["completed", "Completed"],
];

export default function Requests() {
  const { data, loading, reload } = useApi<Booking[]>("/api/bookings/technician");
  const [filter, setFilter] = useState("all");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");

  async function setStatus(id: string, status: BookingStatus, extra: { finalAmount?: number } = {}) {
    try {
      await api(`/api/bookings/${id}/status`, { method: "PATCH", body: { status, ...extra } });
      toast.success(`Job marked as ${status}`);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  if (loading) return <div className="skeleton h-64" />;
  const list = (data || []).filter((b) => filter === "all" || b.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--navy)]">Manage Requests</h1>
        <select className="input-box w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {filters.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState icon="📭" title="No requests found" text="New repair requests will show up here." href="/dashboard/technician/my-services" cta="Manage My Services" />
      ) : (
        <div className="card-box table-box">
          <table>
            <thead>
              <tr><th>Customer</th><th>Address</th><th>Date</th><th>Problem</th><th>Service</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b._id}>
                  <td><p className="font-medium">{b.customerName}</p><p className="text-xs text-slate-500">{b.customerPhone}</p></td>
                  <td className="max-w-[160px]">{b.address}</td>
                  <td>{new Date(b.preferredDate).toLocaleDateString()}</td>
                  <td className="max-w-[200px]"><p className="line-clamp-2" title={b.problemDescription}>{b.problemDescription}</p></td>
                  <td>{b.serviceTitle}</td>
                  <td><StatusBadge value={b.status} /></td>
                  <td>
                    <div className="flex gap-2">
                      {b.status === "requested" && (
                        <>
                          <button className="btn-main btn-small" onClick={() => setStatus(b._id, "accepted")}>Accept</button>
                          <button className="btn-danger btn-small" onClick={() => setRejectId(b._id)}>Reject</button>
                        </>
                      )}
                      {b.status === "accepted" && (
                        <button className="btn-main btn-small" onClick={() => setStatus(b._id, "in-progress")}>Start Work</button>
                      )}
                      {b.status === "in-progress" && (
                        <button className="btn-main btn-small" onClick={() => { setCompleting(b); setAmount(String(b.basePrice)); }}>Mark Completed</button>
                      )}
                      {b.status === "completed" && <StatusBadge value={b.paymentStatus} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(rejectId)}
        title="Reject this request?"
        text="This is final and the customer will see it as rejected."
        confirmText="Yes, reject"
        onConfirm={() => { if (rejectId) setStatus(rejectId, "rejected"); setRejectId(null); }}
        onCancel={() => setRejectId(null)}
      />

      <Modal open={Boolean(completing)} onClose={() => setCompleting(null)} title="Mark job as completed">
        <label className="input-label">Final amount (USD)</label>
        <input type="number" min="1" step="0.01" className="input-box" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button
          className="btn-main mt-4 w-full"
          onClick={() => { if (completing) setStatus(completing._id, "completed", { finalAmount: Number(amount) }); setCompleting(null); }}
        >
          Complete Job
        </button>
      </Modal>
    </div>
  );
}
