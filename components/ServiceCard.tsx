import Link from "next/link";
import { ArrowRight, House, MapPin, Store } from "lucide-react";
import RatingLine from "./RatingLine";
import type { Service } from "@/lib/types";

export default function ServiceCard({ s }: { s: Service }) {
  // a house for home visits, a shop for drop-off
  const ModeIcon = s.serviceMode === "Home Visit" ? House : Store;

  return (
    // the whole card is one link, so it is easy to tap on a phone
    <Link
      href={`/services/${s._id}`}
      aria-label={`View details: ${s.title}`}
      className="card-box group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
        <img
          src={s.image}
          alt={s.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#1e3fcf] shadow-sm backdrop-blur">
          {s.category}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#0f1e4a]/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          <ModeIcon size={12} aria-hidden="true" /> {s.serviceMode}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-[var(--navy)]">{s.title}</h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin size={14} aria-hidden="true" className="shrink-0" />
          <span className="line-clamp-1">{s.serviceArea}</span>
        </p>

        <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[image:var(--grad-brand)] text-[10px] font-bold text-white">
            {s.technicianName?.[0]?.toUpperCase()}
          </span>
          <span className="line-clamp-1">By {s.technicianName}</span>
        </p>

        <div className="mt-2">
          <RatingLine avg={s.avgRating} count={s.reviewCount} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--line)] pt-4">
          <p>
            <span className="block text-xs text-slate-500">Starting from</span>
            <span className="text-2xl font-extrabold text-[var(--navy)]">${s.basePrice}</span>
          </p>
          <span className="btn-main btn-small transition-[filter] group-hover:brightness-110">
            View Details
            <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}