"use client";
import { useState } from "react";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import StatusTracker from "@/components/StatusTracker";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import { api, getErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Booking } from "@/lib/types";

export default function MyBookings() {
  const { data, loading, reload } = useApi<Booking[]>("/api/bookings/my");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

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
                  {b.paymentStatus === "paid" && <StatusBadge value="paid" />}
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
    </div>
  );
}