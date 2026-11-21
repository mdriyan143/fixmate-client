"use client";
import { useState } from "react";
import { toast } from "sonner";
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--navy)]">My Bookings</h1>
      <div className="card-box table-box">
        <table>
          <thead>
            <tr><th>Service</th><th>Technician</th><th>Date</th><th>Price</th><th>Status</th><th>Payment</th><th>Action</th></tr>
          </thead>
          <tbody>
            {data.map((b) => (
              <tr key={b._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={b.serviceImage} alt="" className="h-10 w-14 rounded object-cover" />
                    <span className="font-medium">{b.serviceTitle}</span>
                  </div>
                  <StatusTracker booking={b} />
                </td>
                <td>{b.technicianName}</td>
                <td>{new Date(b.preferredDate).toLocaleDateString()}</td>
                <td>${b.status === "completed" ? b.finalAmount : b.basePrice}</td>
                <td><StatusBadge value={b.status} /></td>
                <td><StatusBadge value={b.paymentStatus} /></td>
                <td>
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
                      <span className="text-sm font-semibold text-[var(--accent-ink)]">★ {b.rating}</span>
                    ) : (
                      <button className="btn-ghost btn-small" onClick={() => setReviewing(b)}>Rate</button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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