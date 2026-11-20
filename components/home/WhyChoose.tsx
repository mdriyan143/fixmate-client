const stats: [value: string, label: string][] = [
  ["500+", "Verified technicians"],
  ["12k+", "Jobs completed"],
  ["100%", "Pay after service"],
  ["4.8/5", "Customer rating"],
];
const points = [
  "Every technician is checked by our admin team",
  "Track your job: requested, accepted, in progress, completed",
  "No advance payment, you pay only for finished work",
];

export default function WhyChoose() {
  return (
    <section className="bg-[var(--sage)] text-[var(--navy)]">
      <div className="page-wrap grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">Why choose FixMate?</h2>
          <ul className="mt-5 space-y-3 text-[var(--navy)]/85">
            {points.map((p) => <li key={p}>✅ {p}</li>)}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map(([value, label]) => (
            <div key={label} className="card-box p-6 text-center">
              <p className="text-3xl font-extrabold text-[var(--accent-ink)]">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
