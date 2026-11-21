import { notFound } from "next/navigation";
import { Clock, MapPin, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import RequestRepair from "@/components/RequestRepair";
import RatingLine from "@/components/RatingLine";
import { getJSON } from "@/lib/server-api";
import type { Service } from "@/lib/types";

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getJSON<Service>(`/api/services/${id}`);
  if (!s) notFound(); // missing, not approved or not available

  const tech = s.technician;
  const facts: [LucideIcon, string, string][] = [
    [Clock, "Duration", s.estimatedDuration],
    [Wrench, "Service mode", s.serviceMode],
    [MapPin, "Service area", s.serviceArea],
  ];

  return (
    <div className="page-wrap section-gap grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <img src={s.image} alt={s.title} className="h-72 w-full rounded-2xl object-cover sm:h-96" />
        <span className="badge badge-role mt-5">{s.category}</span>
        <h1 className="mt-2 text-3xl font-extrabold text-[var(--navy)]">{s.title}</h1>
        <div className="mt-2">
          <RatingLine avg={s.avgRating} count={s.reviewCount} showEmpty />
        </div>
        <p className="mt-4 leading-relaxed text-slate-600">{s.description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {facts.map(([Icon, label, value]) => (
            <div key={label} className="card-box p-4">
              <Icon size={18} className="text-[var(--accent-ink)]" />
              <p className="mt-1 text-xs text-slate-500">{label}</p>
              <p className="font-semibold text-[var(--navy)]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-5">
        <div className="card-box p-6">
          <p className="text-sm text-slate-500">Starting price</p>
          <p className="mb-4 text-4xl font-extrabold text-[var(--navy)]">${s.basePrice}</p>
          <RequestRepair service={{ _id: s._id, title: s.title }} />
        </div>

        <div className="card-box p-6">
          <h3 className="mb-3 font-bold text-[var(--navy)]">About the technician</h3>
          <div className="flex items-center gap-3">
            {tech?.image ? (
              <img src={tech.image} alt={tech.name} className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--navy)] text-xl font-bold text-white">
                {s.technicianName?.[0]}
              </span>
            )}
            <div>
              <p className="font-semibold">{s.technicianName}</p>
              <p className="text-sm text-slate-500">{tech?.area || s.serviceArea}</p>
            </div>
          </div>
          {tech?.bio && <p className="mt-3 text-sm text-slate-600">{tech.bio}</p>}
        </div>
      </aside>
    </div>
  );
}