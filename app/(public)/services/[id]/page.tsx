import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, ArrowLeft, BadgeCheck, Clock, House, Lock, MapPin, Star, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import RequestRepair from "@/components/RequestRepair";
import RatingLine from "@/components/RatingLine";
import { getJSON } from "@/lib/server-api";
import type { Service } from "@/lib/types";

type PublicReview = { _id: string; customerName: string; rating: number; review?: string; reviewedAt: string };

// short reassurance lines next to the price (all true for this platform)
const assurances: [LucideIcon, string][] = [
  [Lock, "Pay only after the job is done"],
  [BadgeCheck, "Service approved by FixMate admins"],
  [Activity, "Track every status update"],
];

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getJSON<Service>(`/api/services/${id}`);
  if (!s) notFound(); // missing, not approved or not available
  const reviews = (await getJSON<PublicReview[]>(`/api/services/${id}/reviews`)) ?? [];

  const tech = s.technician;
  const ModeIcon = s.serviceMode === "Home Visit" ? House : Store;
  const facts: [LucideIcon, string, string][] = [
    [Clock, "Duration", s.estimatedDuration],
    [ModeIcon, "Service mode", s.serviceMode],
    [MapPin, "Service area", s.serviceArea],
  ];

  return (
    <div className="page-wrap section-gap max-sm:px-4">
      <Link
        href="/services"
        className="press mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-ink)] hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to services
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ---------- main column ---------- */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-3xl bg-slate-200 shadow-[0_24px_48px_-24px_rgb(30_63_207/0.5)] ring-4 ring-white/70 dark:ring-white/10">
            <img
              src={s.image}
              alt={s.title}
              decoding="async"
              className="h-72 w-full object-cover sm:h-96"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#1e3fcf] shadow-sm backdrop-blur">
              {s.category}
            </span>
            <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#0f1e4a]/80 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <ModeIcon size={13} aria-hidden="true" /> {s.serviceMode}
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold leading-tight text-[var(--navy)] sm:text-4xl">{s.title}</h1>
          <div className="mt-2">
            <RatingLine avg={s.avgRating} count={s.reviewCount} showEmpty />
          </div>
          <p className="mt-4 leading-relaxed text-slate-600">{s.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {facts.map(([Icon, label, value]) => (
              <div key={label} className="card-box flex items-center gap-3 p-4">
                <span className="icon-tile h-10 w-10 shrink-0 rounded-xl">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="truncate font-semibold text-[var(--navy)]">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ---------- customer reviews ---------- */}
          <section className="mt-10" aria-labelledby="reviews-title">
            <h2 id="reviews-title" className="text-xl font-extrabold text-[var(--navy)]">Customer reviews</h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No reviews yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {reviews.map((r) => (
                  <li key={r._id} className="card-box p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-semibold text-[var(--navy)]">{r.customerName}</p>
                      <span className="flex shrink-0 items-center gap-0.5" aria-label={`${r.rating} out of 5`}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={14}
                            aria-hidden="true"
                            className={n <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                          />
                        ))}
                      </span>
                    </div>
                    {r.review && <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.review}</p>}
                    {r.reviewedAt && (
                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(r.reviewedAt).toLocaleDateString("en-GB")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ---------- booking column (stays in view on desktop) ---------- */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="card-box relative overflow-hidden p-6 pt-7">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-[image:var(--grad-brand)]" />
            <p className="text-sm text-slate-500">Starting price</p>
            <p className="text-4xl font-extrabold text-[var(--navy)]">${s.basePrice}</p>
            <p className="mb-5 mt-1 text-xs text-slate-500">The technician confirms the final amount when the job is done.</p>

            <RequestRepair service={{ _id: s._id, title: s.title }} />

            <ul className="mt-5 space-y-2.5 border-t border-[var(--line)] pt-4">
              {assurances.map(([Icon, text]) => (
                <li key={text} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Icon size={16} aria-hidden="true" className="shrink-0 text-[var(--accent-ink)]" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-box p-6">
            <h3 className="mb-4 font-bold text-[var(--navy)]">About the technician</h3>
            <div className="flex items-center gap-3">
              {tech?.image ? (
                <img src={tech.image} alt={tech.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md" />
              ) : (
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[image:var(--grad-brand)] text-xl font-bold text-white ring-2 ring-white shadow-md">
                  {s.technicianName?.[0]?.toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-[var(--navy)]">{s.technicianName}</p>
                <p className="flex items-center gap-1 text-sm text-slate-500">
                  <MapPin size={13} aria-hidden="true" className="shrink-0" />
                  <span className="truncate">{tech?.area || s.serviceArea}</span>
                </p>
              </div>
            </div>
            {tech?.bio && <p className="mt-4 text-sm leading-relaxed text-slate-600">{tech.bio}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}