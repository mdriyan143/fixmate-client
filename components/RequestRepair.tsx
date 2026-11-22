"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Lock, Send, Wrench } from "lucide-react";
import Modal from "./Modal";
import { authClient } from "@/lib/auth-client";
import { api, getErrorMessage } from "@/lib/api";

export default function RequestRepair({ service }: { service: { _id: string; title: string } }) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [descLength, setDescLength] = useState(0); // only used for the live character counter
  // local date (not UTC), so Dhaka users can pick today even after midnight
  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];

  if (isPending) {
    return (
      <button className="btn-main w-full" disabled>
        <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Loading...
      </button>
    );
  }

  // logged out: go to sign in, then come back here
  if (!user) {
    return (
      <button className="btn-main w-full" onClick={() => router.push(`/sign-in?redirect=/services/${service._id}`)}>
        <Wrench size={18} aria-hidden="true" /> Request Repair
      </button>
    );
  }

  // technician or admin
  if (user.role !== "customer") {
    return (
      <div>
        <button className="btn-main w-full" disabled>
          <Wrench size={18} aria-hidden="true" /> Request Repair
        </button>
        <p className="mt-2 text-center text-sm text-slate-500">Only customers can request a repair</p>
      </div>
    );
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const form = Object.fromEntries(new FormData(e.currentTarget));
      await api("/api/bookings", { method: "POST", body: { serviceId: service._id, ...form } });
      toast.success("Repair request sent!", {
        action: { label: "My Bookings", onClick: () => router.push("/dashboard/customer/bookings") },
      });
      setOpen(false);
      setDescLength(0);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setBusy(false);
  }

  const readOnlyClass = "input-box cursor-default bg-slate-100 text-slate-500";

  return (
    <>
      <button className="btn-main w-full" onClick={() => setOpen(true)}>
        <Wrench size={18} aria-hidden="true" /> Request Repair
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Request: ${service.title}`}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rr-name" className="input-label">Name</label>
              <input id="rr-name" className={readOnlyClass} value={user.name} readOnly />
            </div>
            <div>
              <label htmlFor="rr-email" className="input-label">Email</label>
              <input id="rr-email" className={readOnlyClass} value={user.email} readOnly />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rr-phone" className="input-label">Phone</label>
              <input
                id="rr-phone"
                name="customerPhone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="input-box"
                required
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <label htmlFor="rr-date" className="input-label">Preferred Date</label>
              <input id="rr-date" name="preferredDate" type="date" min={today} className="input-box" required />
            </div>
          </div>

          <div>
            <label htmlFor="rr-address" className="input-label">Address</label>
            <input
              id="rr-address"
              name="address"
              autoComplete="street-address"
              className="input-box"
              required
              placeholder="House, road, area"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="rr-problem" className="input-label">Problem Description</label>
              <span className={`mb-1.5 text-xs font-semibold ${descLength >= 20 ? "text-emerald-600" : "text-slate-400"}`}>
                {descLength}/20 min
              </span>
            </div>
            <textarea
              id="rr-problem"
              name="problemDescription"
              rows={3}
              minLength={20}
              className="input-box resize-none"
              required
              placeholder="What is wrong with the device?"
              onChange={(e) => setDescLength(e.target.value.length)}
            />
          </div>

          <button className="btn-main w-full" disabled={busy}>
            {busy ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending...
              </>
            ) : (
              <>
                <Send size={16} aria-hidden="true" /> Send Request
              </>
            )}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Lock size={12} aria-hidden="true" /> You pay only after the job is completed.
          </p>
        </form>
      </Modal>
    </>
  );
}