import { STEPS } from "@/lib/constants";

export default function HowItWorks() {
  return (
    <section className="bg-soft">
      <div className="page-wrap section-gap">
        <span className="section-eyebrow">Simple process</span>
        <h2 className="section-title">How FixMate Works</h2>
        <p className="section-sub">Four simple steps from a broken device to a happy fix.</p>

        <div className="relative grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* gradient line that connects the four circles (desktop only) */}
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-0.5 bg-[linear-gradient(90deg,#7aa2ff,#5eead4)] opacity-60 lg:block"
          />

          {STEPS.map(([Icon, title, text], i) => (
            <div key={title} className="relative flex flex-col items-center">
              <div className="relative">
                <span className="icon-tile h-16 w-16 rounded-full ring-8 ring-[var(--soft)]">
                  <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-[#0f1e4a] text-xs font-bold text-white ring-2 ring-white">
                  {i + 1}
                </span>
              </div>

              <div className="card-box card-hover mt-5 w-full flex-1 p-6 text-center">
                <h3 className="font-bold text-[var(--navy)]">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}