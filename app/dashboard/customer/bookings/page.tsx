"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, MapPin, Star, User } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import StatusTracker from "@/components/StatusTracker";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import { api, getErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Booking } from "@/lib/types";

export default function MyBookings() {
  const { data, loading, reload } = useApi<Booking[]>("/api/bookings/my");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  // review window: which booking is being rated, the stars and the text
  const [reviewing, setReviewing] = useState<Booking | null>(null);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");

  async function cancel() {
    try {
      await api(`/api/bookings/${cancelId}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled");
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setCancelId(null);
  }

  async function pay(id: string) {
    setPayingId(id);
    try {
      const { url } = await api<{ url: string }>("/api/payments/create-checkout-session", { method: "POST", body: { bookingId: id } });
      window.location.href = url; // Stripe Checkout
    } catch (err) {
      toast.error(getErrorMessage(err));
      setPayingId(null);
    }
  }

  async function sendReview() {
    if (!reviewing) return;
    try {
      await api(`/api/bookings/${reviewing._id}/review`, { method: "PATCH", body: { rating: stars, review: text } });
      toast.success("Thanks for your review");
      setReviewing(null);
      setStars(5);
      setText("");
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  if (loading) return <div className="skeleton h-64" />;
  if (!data?.length) {
    return <EmptyState title="No bookings yet" text="Send a repair request to see it here." href="/services" cta="Browse Services" />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--navy)]">My Bookings</h1>
        <p className="text-sm text-slate-500">Track every repair job and pay once it is completed.</p>
      </div>

      <div className="grid gap-5">
        {data.map((b) => {
          const price = b.status === "completed" || b.paymentStatus === "paid" ? b.finalAmount : b.basePrice;
          return (
            <div key={b._id} className="card-box overflow-hidden">
              {/* top: service, badges, price */}
              <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div className="flex min-w-0 items-center gap-4">
                  <img src={b.serviceImage} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-[var(--navy)]">{b.serviceTitle}</h3>
                    <p className="text-xs text-slate-500">{b.category}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge value={b.status} />
                      <StatusBadge value={b.paymentStatus} />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{b.status === "completed" || b.paymentStatus === "paid" ? "Final amount" : "Starting price"}</p>
                  <p className="text-2xl font-extrabold text-[var(--navy)]">${price}</p>
                </div>
              </div>

              {/* middle: details */}
              <div className="grid gap-3 border-t border-[var(--line)] px-5 py-4 text-sm text-slate-600 sm:grid-cols-3">
                <p className="flex items-center gap-2"><User size={16} className="shrink-0 text-[var(--accent-ink)]" /> {b.technicianName}</p>
                <p className="flex items-center gap-2"><CalendarDays size={16} className="shrink-0 text-[var(--accent-ink)]" /> {new Date(b.preferredDate).toLocaleDateString()}</p>
                <p className="flex items-center gap-2"><MapPin size={16} className="shrink-0 text-[var(--accent-ink)]" /> <span className="truncate">{b.address}</span></p>
              </div>

              {/* bottom: tracker and actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] bg-[var(--sage-soft)]/40 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <StatusTracker booking={b} />
                </div>
                <div className="flex items-center gap-2">
                  {b.status === "requested" && (
                    <button className="btn-danger btn-small" onClick={() => setCancelId(b._id)}>Cancel</button>
                  )}
                  {b.status === "completed" && b.paymentStatus === "unpaid" && (
                    <button className="btn-main btn-small" disabled={payingId === b._id} onClick={() => pay(b._id)}>
                      {payingId === b._id ? "Opening..." : "Pay Now"}
                    </button>
                  )}
                  {b.paymentStatus === "paid" &&
                    (b.rating ? (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent-ink)]">
                        <Star size={14} className="fill-current" /> {b.rating} rated
                      </span>
                    ) : (
                      <button className="btn-ghost btn-small" onClick={() => setReviewing(b)}>Rate</button>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={Boolean(cancelId)}
        title="Cancel this booking?"
        text="The technician will no longer see this request."
        confirmText="Yes, cancel it"
        onConfirm={cancel}
        onCancel={() => setCancelId(null)}
      />

      <Modal open={Boolean(reviewing)} onClose={() => setReviewing(null)} title="Rate this service">
        <label className="input-label">Stars</label>
        <select className="input-box" value={stars} onChange={(e) => setStars(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
          ))}
        </select>
        <label className="input-label mt-3">Short review</label>
        <textarea className="input-box" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="How was the repair?" />
        <button className="btn-main mt-4 w-full" onClick={sendReview}>Submit review</button>
      </Modal>
    </div>
  );
}