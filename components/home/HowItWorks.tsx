import { STEPS } from "@/lib/constants";

export default function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="page-wrap section-gap">
        <h2 className="section-title">How FixMate Works</h2>
        <p className="section-sub">Four simple steps from a broken device to a happy fix.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([Icon, title, text], i) => (
            <div key={title} className="card-box p-6 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange-100 text-[var(--accent-ink)]">
                <Icon size={28} strokeWidth={1.75} />
              </div>
              <p className="mt-3 text-xs font-bold text-[var(--accent-ink)]">STEP {i + 1}</p>
              <h3 className="font-bold text-[var(--navy)]">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}