"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Modal from "./Modal";
import { authClient } from "@/lib/auth-client";
import { api, getErrorMessage } from "@/lib/api";

export default function RequestRepair({ service }: { service: { _id: string; title: string } }) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  // local date (not UTC), so Dhaka users can pick today even after midnight
  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];

  if (isPending) return <button className="btn-main w-full" disabled>Loading...</button>;

  // logged out: go to sign in, then come back here
  if (!user) {
    return (
      <button className="btn-main w-full" onClick={() => router.push(`/sign-in?redirect=/services/${service._id}`)}>
        Request Repair
      </button>
    );
  }

  // technician or admin
  if (user.role !== "customer") {
    return (
      <div>
        <button className="btn-main w-full" disabled>Request Repair</button>
        <p className="mt-2 text-sm text-slate-500">Only customers can request a repair</p>
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
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setBusy(false);
  }

  return (
    <>
      <button className="btn-main w-full" onClick={() => setOpen(true)}>Request Repair</button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Request: ${service.title}`}>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="input-label">Name</label>
            <input className="input-box bg-slate-100" value={user.name} readOnly />
          </div>
          <div>
            <label className="input-label">Email</label>
            <input className="input-box bg-slate-100" value={user.email} readOnly />
          </div>
          <div>
            <label className="input-label">Phone</label>
            <input name="customerPhone" className="input-box" required placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label className="input-label">Address</label>
            <input name="address" className="input-box" required placeholder="House, road, area" />
          </div>
          <div>
            <label className="input-label">Preferred Date</label>
            <input name="preferredDate" type="date" min={today} className="input-box" required />
          </div>
          <div>
            <label className="input-label">Problem Description (min 20 characters)</label>
            <textarea name="problemDescription" rows={3} minLength={20} className="input-box" required placeholder="What is wrong with the device?" />
          </div>
          <button className="btn-main w-full" disabled={busy}>{busy ? "Sending..." : "Send Request"}</button>
        </form>
      </Modal>
    </>
  );
}
