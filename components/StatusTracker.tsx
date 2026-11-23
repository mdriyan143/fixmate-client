import { Check } from "lucide-react";
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

  // a paid booking counts as the last step
  const current = steps.indexOf(booking.paymentStatus === "paid" ? "paid" : booking.status);
  const dateOf = (step: string) => booking.statusHistory?.find((h) => h.status === step)?.changedAt;

  return (
    <ol className="flex w-full max-w-md" aria-label="Booking progress">
      {steps.map((step, i) => {
        const done = i <= current;
        const date = dateOf(step);
        return (
          <li
            key={step}
            className="relative flex-1 text-center"
            title={date ? new Date(date).toLocaleString() : undefined}
            aria-current={i === current ? "step" : undefined}
          >
            {/* line to the next step */}
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-2.5 h-0.5 w-full transition-colors ${
                  i < current ? "bg-[#2f6df0]" : "bg-slate-200"
                }`}
              />
            )}
            {/* circle */}
            <span
              className={`relative z-10 mx-auto grid h-5 w-5 place-items-center rounded-full transition-all ${
                done ? "bg-[image:var(--grad-brand)] text-white" : "bg-slate-200"
              } ${i === current ? "ring-4 ring-[#2f6df0]/20" : ""}`}
            >
              {done && <Check size={12} strokeWidth={3} aria-hidden="true" />}
            </span>
            <p className={`mt-1.5 text-[10px] leading-tight ${done ? "font-semibold text-[var(--navy)]" : "text-slate-400"}`}>
              {names[step]}
            </p>
            {/* date only under the current step; hover any step to see its time */}
            {i === current && date && (
              <p className="text-[10px] text-slate-400">{new Date(date).toLocaleDateString()}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}