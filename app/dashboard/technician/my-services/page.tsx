"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Wrench } from "lucide-react";
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12 w-64" />
        <div className="skeleton h-72" />
      </div>
    );
  }
  if (!data?.length) {
    return (
      <EmptyState
        icon={Wrench}
        title="No services yet"
        text="Add your first repair service."
        href="/dashboard/technician/add-service"
        cta="Add Service"
      />
    );
  }

  // the same switch and buttons are used by the table (desktop) and the cards (mobile)
  const availability = (s: Service) => (
    <button
      role="switch"
      aria-checked={s.isAvailable}
      onClick={() => toggle(s)}
      aria-label={`${s.title} is ${s.isAvailable ? "available" : "hidden"}`}
      className={`press relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
        s.isAvailable ? "bg-[image:var(--grad-brand)]" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
          s.isAvailable ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
  const rowActions = (s: Service) => (
    <div className="flex gap-2">
      <button className="btn-ghost btn-small" onClick={() => setEditing(s)}>
        <Pencil size={14} aria-hidden="true" /> Edit
      </button>
      <button className="btn-danger btn-small" onClick={() => setDeleting(s._id)}>
        <Trash2 size={14} aria-hidden="true" /> Delete
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--navy)] sm:text-3xl">My Services</h1>
          <p className="mt-1 text-sm text-slate-500">{data.length} service(s). Edited services go back for approval.</p>
        </div>
        <Link href="/dashboard/technician/add-service" className="btn-main">
          <Plus size={16} aria-hidden="true" /> Add Service
        </Link>
      </div>

      {/* TABLE (tablet and desktop) */}
      <div className="card-box table-box hidden md:block">
        <table>
          <thead>
            <tr><th>Service</th><th>Category</th><th>Price</th><th>Approval</th><th>Available</th><th>Actions</th></tr>
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
                <td>{s.category}</td>
                <td className="font-bold text-[var(--navy)]">${s.basePrice}</td>
                <td><StatusBadge value={s.approvalStatus} /></td>
                <td>{availability(s)}</td>
                <td>{rowActions(s)}</td>
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
                <p className="text-xs text-slate-500">{s.category}</p>
                <p className="text-lg font-extrabold text-[var(--navy)]">${s.basePrice}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] px-4 py-3">
              <StatusBadge value={s.approvalStatus} />
              <div className="flex items-center gap-2 text-xs text-slate-500">
                Available {availability(s)}
              </div>
            </div>
            <div className="border-t border-[var(--line)] bg-[var(--sage-soft)]/50 px-4 py-3">{rowActions(s)}</div>
          </div>
        ))}
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