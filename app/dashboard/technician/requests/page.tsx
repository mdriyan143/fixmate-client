"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, LayoutGrid, List, MapPin, Phone, User } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import ConfirmModal from "@/components/ConfirmModal";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import { api, getErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Booking, BookingStatus } from "@/lib/types";

const filters: [value: string, label: string][] = [
  ["all", "All"],
  ["requested", "Requested"],
  ["accepted", "Accepted"],
  ["in-progress", "In Progress"],
  ["completed", "Completed"],
];

// coloured left edge of each card, same colour idea as the status badges
const edge: Record<string, string> = {
  requested: "border-l-blue-400",
  accepted: "border-l-indigo-400",
  "in-progress": "border-l-amber-400",
  completed: "border-l-green-500",
  rejected: "border-l-red-400",
  cancelled: "border-l-slate-400",
};

export default function Requests() {
  const { data, loading, reload } = useApi<Booking[]>("/api/bookings/technician");
  const [filter, setFilter] = useState("all");
  // cards first (nicer to use). Switch to "table" if you want the table to open first.
  const [view, setView] = useState<"table" | "cards">("cards");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");

  async function setStatus(
    id: string,
    status: BookingStatus,
    extra: { finalAmount?: number } = {}
  ) {
    try {
      await api(`/api/bookings/${id}/status`, { method: "PATCH", body: { status, ...extra } });
      toast.success(`Job marked as ${status}`);
      reload();
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return false;
    }
  }

  async function completeJob() {
    if (!completing) return;
    if (!(Number(amount) > 0)) return toast.error("Enter a final amount above 0");
    const ok = await setStatus(completing._id, "completed", { finalAmount: Number(amount) });
    if (ok) setCompleting(null); // stays open on error so the technician can fix the amount
  }

  if (loading) return <div className="skeleton h-64" />;

  const all = data || [];
  const countOf = (value: string) =>
    value === "all" ? all.length : all.filter((b) => b.status === value).length;
  const list = all.filter((b) => filter === "all" || b.status === filter);
  const date = (d: string) => new Date(d).toLocaleDateString();

  // only the valid buttons for each status (used by the table AND the cards)
  const actions = (b: Booking) => (
    <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
      {b.status === "requested" && (
        <>
          <button className="btn-main btn-small" onClick={() => setStatus(b._id, "accepted")}>
            Accept
          </button>
          <button className="btn-danger btn-small" onClick={() => setRejectId(b._id)}>
            Reject
          </button>
        </>
      )}
      {b.status === "accepted" && (
        <button className="btn-main btn-small" onClick={() => setStatus(b._id, "in-progress")}>
          Start Work
        </button>
      )}
      {b.status === "in-progress" && (
        <button
          className="btn-main btn-small"
          onClick={() => {
            setCompleting(b);
            setAmount(String(b.basePrice));
          }}
        >
          Mark Completed
        </button>
      )}
      {b.status === "completed" && <StatusBadge value={b.paymentStatus} />}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* header: title and view switch */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--navy)]">Manage Requests</h1>
          <p className="text-sm text-slate-500">Move each job forward one step at a time.</p>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => setView("table")}
            className={view === "table" ? "btn-main btn-small" : "btn-ghost btn-small"}
          >
            <List size={16} /> Table
          </button>
          <button
            onClick={() => setView("cards")}
            className={view === "cards" ? "btn-main btn-small" : "btn-ghost btn-small"}
          >
            <LayoutGrid size={16} /> Cards
          </button>
        </div>
      </div>

      {/* status tabs with counts */}
      <div className="flex flex-wrap gap-2">
        {filters.map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={filter === value ? "btn-main btn-small" : "btn-ghost btn-small"}
          >
            {label} <span className="ml-1 opacity-70">{countOf(value)}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="No requests found"
          text="New repair requests will show up here."
          href="/dashboard/technician/my-services"
          cta="Manage My Services"
        />
      ) : (
        <>
          {/* TABLE (desktop only, the layout the assignment asks for) */}
          <div className={`card-box table-box ${view === "table" ? "hidden md:block" : "hidden"}`}>
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Problem</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((b) => (
                  <tr key={b._id}>
                    <td className="whitespace-nowrap">
                      <p className="font-medium">{b.customerName}</p>
                      <p className="text-xs text-slate-500">{b.customerPhone}</p>
                    </td>
                    <td className="max-w-[160px]">{b.address}</td>
                    <td>{date(b.preferredDate)}</td>
                    <td className="min-w-[220px] max-w-[320px]">
                      <p className="whitespace-pre-wrap break-words">{b.problemDescription}</p>
                    </td>
                    <td>{b.serviceTitle}</td>
                    <td>
                      <StatusBadge value={b.status} />
                    </td>
                    <td>{actions(b)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARDS (always on mobile, optional on desktop) */}
          <div className={view === "cards" ? "grid gap-4" : "grid gap-4 md:hidden"}>
            {list.map((b) => (
              <div
                key={b._id}
                className={`card-box grid overflow-hidden border-l-4 md:grid-cols-[1fr_260px] ${edge[b.status]}`}
              >
                {/* left: job details */}
                <div className="min-w-0 space-y-3 p-5">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--navy)]">{b.serviceTitle}</h3>
                    <p className="text-sm text-slate-500">
                      Requested {date(b.createdAt ?? b.preferredDate)} · Preferred{" "}
                      {date(b.preferredDate)}
                    </p>
                  </div>

                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <p className="flex items-center gap-2 text-slate-600">
                      <User size={16} className="shrink-0 text-[var(--accent-ink)]" />
                      Customer:{" "}
                      <span className="font-semibold text-[var(--navy)]">{b.customerName}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-600">
                      <Phone size={16} className="shrink-0 text-[var(--accent-ink)]" />
                      Phone:{" "}
                      <span className="font-semibold text-[var(--navy)]">{b.customerPhone}</span>
                    </p>
                    <p className="flex items-start gap-2 text-slate-600 sm:col-span-2">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--accent-ink)]" />
                      Address:{" "}
                      <span className="font-semibold text-[var(--navy)]">{b.address}</span>
                    </p>
                  </div>

                  <p className="whitespace-pre-wrap break-words rounded-lg bg-[var(--sage-soft)] p-3 text-sm text-[var(--navy)]">
                    {b.problemDescription}
                  </p>
                </div>

                {/* right: job number, status, price, actions */}
                <div className="flex flex-col gap-3 border-t border-[var(--line)] bg-[var(--sage-soft)]/40 p-5 md:border-l md:border-t-0">
                  <p className="font-mono text-xs text-slate-500">
                    Job #{b._id.slice(-4).toUpperCase()}
                  </p>
                  <div>
                    <StatusBadge value={b.status} />
                  </div>
                  <p className="text-3xl font-extrabold text-[var(--navy)]">
                    ${b.status === "completed" ? b.finalAmount : b.basePrice}
                  </p>
                  <div className="mt-auto">{actions(b)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmModal
        open={Boolean(rejectId)}
        title="Reject this request?"
        text="This is final and the customer will see it as rejected."
        confirmText="Yes, reject"
        onConfirm={() => {
          if (rejectId) setStatus(rejectId, "rejected");
          setRejectId(null);
        }}
        onCancel={() => setRejectId(null)}
      />

      <Modal
        open={Boolean(completing)}
        onClose={() => setCompleting(null)}
        title="Mark job as completed"
      >
        <label className="input-label">Final amount (USD)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          className="input-box"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn-main mt-4 w-full" onClick={completeJob}>
          Complete Job
        </button>
      </Modal>
    </div>
  );
}