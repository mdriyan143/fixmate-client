interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="card-box flex items-center gap-4 p-5">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--sage-soft)] text-2xl">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-[var(--navy)]">{value}</p>
      </div>
    </div>
  );
}
