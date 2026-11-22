import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { CircleCheck, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { STEPS } from "@/lib/constants";

export const metadata: Metadata = { title: "How It Works | FixMate" };

const roles: [title: string, icon: LucideIcon, list: string[]][] = [
  ["Customers", UserRound, ["Browse approved services", "Send a repair request", "Track the job step by step", "Pay online after completion"]],
  ["Technicians", Wrench, ["List your repair services", "Accept or reject requests", "Update the job status", "Set the final amount"]],
  ["Admins", ShieldCheck, ["Approve or reject services", "Manage users and roles", "Monitor every job", "Track Stripe revenue"]],
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-hero">
        <div className="page-wrap py-16 text-center sm:py-20">
          <span className="section-eyebrow animate-fade-up">About FixMate</span>
          <h1 className="animate-fade-up anim-delay-1 mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-[var(--navy)] sm:text-5xl">
            How FixMate <span className="hl">works</span>
          </h1>
          <p className="animate-fade-up anim-delay-2 mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Finding a trustworthy repair technician should be easy. Every job on FixMate has a clear status, and payment happens only after the work is delivered.
          </p>
        </div>
      </section>

      <div className="page-wrap section-gap">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([Icon, title, text], i) => (
            <div key={title} className="card-box card-hover p-6 text-center">
              <div className="relative mx-auto w-fit">
                <span className="icon-tile h-16 w-16 rounded-full">
                  <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-[#0f1e4a] text-xs font-bold text-white ring-2 ring-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-bold text-[var(--navy)]">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {roles.map(([title, Icon, list]) => (
            <div key={title} className="card-box card-hover p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="icon-tile h-11 w-11 rounded-xl">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-[var(--navy)]">For {title}</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {list.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CircleCheck size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--accent-ink)]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-deep relative mt-16 overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#2f6df0]/30 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#14b8a6]/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Ready to get your device fixed?</h2>
            <p className="mx-auto mt-2 max-w-md text-blue-100/80">Browse approved services and send your first request today.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/services" className="btn-ghost">Browse Services</Link>
              <Link href="/sign-up" className="btn-main">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}