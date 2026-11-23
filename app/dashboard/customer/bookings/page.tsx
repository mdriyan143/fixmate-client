"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, ClipboardList, CreditCard, Loader2, MapPin, Star, UserRound, X } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import StatusTracker from "@/components/StatusTracker";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import { api, getErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Booking } from "@/lib/types";

const starLabels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function MyBookings() {
  const { data, loading, reload } = useApi<Booking[]>("/api/bookings/my");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  // review window: which booking is being rated, the stars and the text
  const [reviewing, setReviewing] = useState<Booking | null>(null);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

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
    setSending(true);
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
    setSending(false);
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="skeleton h-12 w-64" />
        {[1, 2, 3].map((i) => <div key={i} className="skeleton h-56" />)}
      </div>
    );
  }
  if (!data?.length) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No bookings yet"
        text="Send a repair request to see it here."
        href="/services"
        cta="Browse Services"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)] sm:text-3xl">My Bookings</h1>
        <p className="mt-1 text-sm text-slate-500">Track every repair job and pay once it is completed.</p>
      </div>

      <div className="grid gap-5">
        {data.map((b) => {
          const finished = b.status === "completed" || b.paymentStatus === "paid";
          const price = finished ? b.finalAmount : b.basePrice;
          return (
            <div key={b._id} className="card-box overflow-hidden">
              {/* top: service, badges, price */}
              <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div className="flex min-w-0 items-center gap-4">
                  <img src={b.serviceImage} alt="" className="h-16 w-20 shrink-0 rounded-xl bg-slate-200 object-cover shadow-sm" />
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-[var(--navy)]">{b.serviceTitle}</h3>
                    <p className="text-xs text-slate-500">{b.category}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge value={b.status} />
                      <StatusBadge value={b.paymentStatus} />
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500">{finished ? "Final amount" : "Starting price"}</p>
                  <p className="text-2xl font-extrabold text-[var(--navy)]">${price}</p>
                </div>
              </div>

              {/* middle: details */}
              <div className="grid gap-3 border-t border-[var(--line)] px-5 py-4 text-sm text-slate-600 sm:grid-cols-3">
                <p className="flex items-center gap-2">
                  <UserRound size={16} aria-hidden="true" className="shrink-0 text-[var(--accent-ink)]" /> {b.technicianName}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDays size={16} aria-hidden="true" className="shrink-0 text-[var(--accent-ink)]" />
                  {new Date(b.preferredDate).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} aria-hidden="true" className="shrink-0 text-[var(--accent-ink)]" />
                  <span className="truncate">{b.address}</span>
                </p>
              </div>

              {/* bottom: tracker and actions */}
             <div className="flex flex-col gap-4 border-t border-[var(--line)] bg-[var(--sage-soft)]/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full min-w-0 sm:flex-1">
                 <StatusTracker booking={b} />
                </div>
                <div className="flex items-center gap-2 sm:shrink-0">
                  {b.status === "requested" && (
                    <button className="btn-danger btn-small" onClick={() => setCancelId(b._id)}>
                      <X size={14} aria-hidden="true" /> Cancel
                    </button>
                  )}
                  {b.status === "completed" && b.paymentStatus === "unpaid" && (
                    <button className="btn-main btn-small" disabled={payingId === b._id} onClick={() => pay(b._id)}>
                      {payingId === b._id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Opening...
                        </>
                      ) : (
                        <>
                          <CreditCard size={14} aria-hidden="true" /> Pay Now
                        </>
                      )}
                    </button>
                  )}
                  {b.paymentStatus === "paid" &&
                    (b.rating ? (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--navy)]">
                        <Star size={15} aria-hidden="true" className="fill-amber-400 text-amber-400" /> {b.rating} rated
                      </span>
                    ) : (
                      <button className="btn-ghost btn-small" onClick={() => setReviewing(b)}>
                        <Star size={14} aria-hidden="true" /> Rate
                      </button>
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
        <div>
          <span className="input-label">Your rating</span>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={stars === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setStars(n)}
                className="press p-1"
              >
                <Star size={34} aria-hidden="true" className={n <= stars ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
              </button>
            ))}
            <span className="ml-2 text-sm font-semibold text-slate-500">{starLabels[stars]}</span>
          </div>
        </div>
        <div>
          <label htmlFor="review-text" className="input-label">Short review</label>
          <textarea
            id="review-text"
            className="input-box resize-none"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="How was the repair?"
          />
        </div>
        <button className="btn-main w-full" onClick={sendReview} disabled={sending}>
          {sending ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Submitting...
            </>
          ) : (
            "Submit review"
          )}
        </button>
      </Modal>
    </div>
  );
}