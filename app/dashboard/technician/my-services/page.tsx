"use client";
import { useState } from "react";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import ServiceForm from "@/components/ServiceForm";
import ConfirmModal from "@/components/ConfirmModal";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import { api, getErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Service, ServiceFormValues } from "@/lib/types";

export default function MyServices() {
  const { data, loading, reload } = useApi<Service[]>("/api/services/mine");
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function toggle(s: Service) {
    try {
      await api(`/api/services/${s._id}/availability`, { method: "PATCH", body: { isAvailable: !s.isAvailable } });
      toast.success(s.isAvailable ? "Service hidden from public pages" : "Service is live again");
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function update(form: ServiceFormValues) {
    if (!editing) return;
    await api(`/api/services/${editing._id}`, { method: "PATCH", body: form });
    toast.success("Service updated and sent for approval again");
    setEditing(null);
    reload();
  }

  async function remove() {
    try {
      await api(`/api/services/${deleting}`, { method: "DELETE" });
      toast.success("Service deleted");
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setDeleting(null);
  }

  if (loading) return <div className="skeleton h-64" />;
  if (!data?.length) {
    return <EmptyState title="No services yet" text="Add your first repair service." href="/dashboard/technician/add-service" cta="Add Service" />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--navy)]">My Services</h1>
      <div className="card-box table-box">
        <table>
          <thead>
            <tr><th>Service</th><th>Category</th><th>Price</th><th>Approval</th><th>Available</th><th>Actions</th></tr>
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
                <td>{s.category}</td>
                <td>${s.basePrice}</td>
                <td><StatusBadge value={s.approvalStatus} /></td>
                <td>
                  <button
                    onClick={() => toggle(s)}
                    aria-label="Toggle availability"
                    className={`relative h-6 w-11 rounded-full transition ${s.isAvailable ? "bg-green-500" : "bg-slate-300"}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${s.isAvailable ? "left-5" : "left-0.5"}`} />
                  </button>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-ghost btn-small" onClick={() => setEditing(s)}>Edit</button>
                    <button className="btn-danger btn-small" onClick={() => setDeleting(s._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit service">
        {editing && <ServiceForm initial={editing} onSubmit={update} submitText="Save Changes" />}
      </Modal>
      <ConfirmModal
        open={Boolean(deleting)}
        title="Delete this service?"
        text="This cannot be undone. Old bookings keep their own copy of the service details."
        confirmText="Yes, delete"
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
