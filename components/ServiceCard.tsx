import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Service } from "@/lib/types";

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <div className="card-box flex h-full flex-col overflow-hidden">
      <img src={s.image} alt={s.title} className="h-44 w-full object-cover" />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="badge badge-role">{s.category}</span>
          <span className="text-slate-500">{s.serviceMode}</span>
        </div>
        <h3 className="line-clamp-1 text-lg font-bold text-[var(--navy)]">{s.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin size={14} /> {s.serviceArea}</p>
        <p className="mt-1 text-sm text-slate-500">By {s.technicianName}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="font-bold text-[var(--navy)]">
            <span className="text-xs font-normal text-slate-500">From </span>${s.basePrice}
          </p>
          <Link href={`/services/${s._id}`} className="btn-main btn-small">View Details</Link>
        </div>
      </div>
    </div>
  );
}
