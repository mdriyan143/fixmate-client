import type { Metadata } from "next";
import Link from "next/link";
import { STEPS } from "@/lib/constants";

export const metadata: Metadata = { title: "How It Works | FixMate" };

const roles: [title: string, list: string[]][] = [
  ["Customers", ["Browse approved services", "Send a repair request", "Track the job step by step", "Pay online after completion"]],
  ["Technicians", ["List your repair services", "Accept or reject requests", "Update the job status", "Set the final amount"]],
  ["Admins", ["Approve or reject services", "Manage users and roles", "Monitor every job", "Track Stripe revenue"]],
];

export default function AboutPage() {
  return (
    <div className="page-wrap section-gap">
      <h1 className="section-title">How FixMate Works</h1>
      <p className="section-sub">Finding a trustworthy repair technician should be easy. Every job on FixMate has a clear status, and payment happens only after the work is delivered.</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(([icon, title, text], i) => (
          <div key={title} className="card-box p-6 text-center">
            <div className="text-4xl">{icon}</div>
            <p className="mt-2 text-xs font-bold text-[var(--accent-ink)]">STEP {i + 1}</p>
            <h3 className="font-bold text-[var(--navy)]">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {roles.map(([title, list]) => (
          <div key={title} className="card-box p-6">
            <h3 className="mb-3 text-lg font-bold text-[var(--navy)]">For {title}</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {list.map((item) => <li key={item}>✅ {item}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/services" className="btn-main">Browse Services</Link>
      </div>
    </div>
  );
}
