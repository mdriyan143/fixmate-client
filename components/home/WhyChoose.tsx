import Link from "next/link";
import { Activity, ArrowRight, BadgeCheck, Lock, Receipt } from "lucide-react";

// every point describes something the platform really does (no invented numbers)
const points = [
  {
    icon: BadgeCheck,
    title: "Verified Technicians",
    text: "Every service is reviewed and approved by our admin team before it goes live.",
  },
  {
    icon: Receipt,
    title: "Transparent Pricing",
    text: "See the starting price up front. The technician confirms the final amount when the job is done.",
  },
  {
    icon: Activity,
    title: "Track Your Repair",
    text: "Follow every stage from requested to completed, right from your dashboard.",
  },
  {
    icon: Lock,
    title: "Pay After Completion",
    text: "No advance payment. Pay securely online only after the repair is finished.",
  },
];

export default function WhyChoose() {
  return (
    <section className="page-wrap section-gap">
      <div className="bg-deep relative overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-14">
        {/* soft glows behind the content */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#2f6df0]/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#14b8a6]/20 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8fb0ff] ring-1 ring-white/15">
              Why FixMate
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Repairs you can{" "}
              <span className="bg-[linear-gradient(90deg,#8fb0ff,#5eead4)] bg-clip-text text-transparent">
                trust
              </span>
              , from start to finish.
            </h2>
            <p className="mt-4 max-w-md text-blue-100/80">
              We built FixMate so you always know who is fixing your device, what it costs, and where the job stands.
            </p>
            <Link href="/services" className="btn-ghost mt-7">
              Browse Services <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {points.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="press rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-[#8fb0ff]">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-bold text-white">{title}</h3>
                <p className="mt-1.5 text-sm text-blue-100/80">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}