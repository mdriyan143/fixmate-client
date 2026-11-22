import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="card-box card-hover group flex items-center gap-4 p-5">
      <span className="icon-tile h-14 w-14 shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
        <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-500">{label}</p>
        <p className="text-3xl font-extrabold leading-tight text-[var(--navy)]">{value}</p>
      </div>
    </div>
  );
}