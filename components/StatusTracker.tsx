import type { Booking } from "@/lib/types";

const steps = ["requested", "accepted", "in-progress", "completed", "paid"];
const names: Record<string, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  paid: "Paid",
};

export default function StatusTracker({ booking }: { booking: Booking }) {
  // rejected and cancelled already have a badge, so no tracker
  if (booking.status === "rejected" || booking.status === "cancelled") return null;

  // how far the job has come: a paid booking counts as the last step
  const current = steps.indexOf(booking.paymentStatus === "paid" ? "paid" : booking.status);
  const dateOf = (step: string) => booking.statusHistory?.find((h) => h.status === step)?.changedAt;

  return (
    <div className="mt-2 flex w-64 items-start gap-1">
      {steps.map((step, i) => (
        <div key={step} className="flex-1 text-center">
          <div className={`mx-auto h-2 rounded-full ${i <= current ? "bg-green-500" : "bg-slate-200"}`} />
          <p className={`mt-1 text-[10px] ${i <= current ? "font-semibold text-[var(--navy)]" : "text-slate-400"}`}>
            {names[step]}
          </p>
          {dateOf(step) && (
            <p className="text-[10px] text-slate-400">{new Date(dateOf(step)!).toLocaleDateString()}</p>
          )}
        </div>
      ))}
    </div>
  );
}