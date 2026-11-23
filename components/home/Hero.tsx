import Link from "next/link";
import HeroPhoto from "./HeroPhoto";
import { ArrowRight, BadgeCheck, CircleCheck, Lock, Receipt, Search } from "lucide-react";

// [online photo, local svg used if the photo fails, label]
const photos: [src: string, fallback: string, label: string][] = [
  ["https://i.ibb.co.com/S758FDnw/advanced-phone-repair.webp", "/images/hero-phone.svg", "Smartphone"],
  ["https://i.ibb.co.com/qF0Y0QgZ/pc.avif", "/images/hero-laptop.svg", "Laptop & PC"],
  ["https://i.ibb.co.com/FL4wK5Br/AC-repair.jpg", "/images/hero-ac.svg", "AC"],
  ["https://i.ibb.co.com/FFf7HLV/fridge.jpg", "/images/hero-fridge.svg", "Refrigerator"],
];

// qualitative trust points (no invented statistics)
const trust = [
  { icon: BadgeCheck, text: "Verified technicians" },
  { icon: Receipt, text: "Transparent pricing" },
  { icon: Lock, text: "Pay after completion" },
];

export default function Hero() {
  return (
    <section className="bg-hero">
      <div className="page-wrap grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-24">
        {/* ---------- text side ---------- */}
        <div>
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-sm font-semibold text-[#1e3fcf] shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b45]/70 dark:text-[#b7c9ff]">
            <Lock size={14} aria-hidden="true" /> Pay only after the job is done
          </span>

          <h1 className="animate-fade-up anim-delay-1 mt-5 text-4xl font-extrabold leading-[1.1] text-[var(--navy)] sm:text-5xl lg:text-[3.4rem]">
            Your devices deserve <span className="hl">expert</span> care.
          </h1>

          <p className="animate-fade-up anim-delay-2 mt-5 max-w-lg text-lg text-slate-600">
            From smartphones to home appliances, find trusted technicians and get quality repairs without the hassle.
          </p>

          <form
            action="/services"
            role="search"
            className="animate-fade-up anim-delay-3 mt-8 flex max-w-lg items-center gap-2 rounded-full border border-white/80 bg-white/80 p-1.5 shadow-[0_18px_40px_-20px_rgb(30_63_207/0.45)] backdrop-blur transition-shadow duration-300 focus-within:shadow-[0_0_0_4px_rgb(47_109_240/0.2),0_18px_40px_-20px_rgb(30_63_207/0.45)] dark:border-white/10 dark:bg-[#111b45]/80"
          >
            <label htmlFor="hero-search" className="sr-only">Search repair services</label>
            <input
              id="hero-search"
              name="search"
              placeholder="Try: iPhone screen, AC gas..."
              className="min-w-0 flex-1 bg-transparent px-4 text-[var(--text)] outline-none placeholder:text-slate-400"
            />
            <button className="btn-main shrink-0">
              <Search size={18} aria-hidden="true" /> Search
            </button>
          </form>

          <div className="animate-fade-up anim-delay-4 mt-6 flex flex-wrap gap-3">
            <Link href="/services" className="btn-dark">
              Explore Services <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/about" className="btn-ghost">How It Works</Link>
          </div>

          <ul className="animate-fade-up anim-delay-4 mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {trust.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <span className="icon-tile h-8 w-8 rounded-xl">
                  <Icon size={16} aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- photo collage ---------- */}
        <div className="animate-fade-in anim-delay-2 relative">
          <div className="grid grid-cols-2 gap-4">
            {photos.map(([src, fallback, label], i) => (
              <div
                key={label}
                className={`group relative h-44 overflow-hidden rounded-3xl bg-slate-200 shadow-[0_20px_40px_-20px_rgb(30_63_207/0.5)] ring-4 ring-white/70 sm:h-52 lg:h-56 dark:ring-white/10 ${
                  i % 2 === 1 ? "mt-8" : ""
                }`}
              >
                <HeroPhoto src={src} fallback={fallback} alt={`${label} repair`} />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0f1e4a] backdrop-blur">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* floating glass card */}
          <div className="card-box animate-float absolute -bottom-5 left-2 hidden items-center gap-3 px-4 py-3 sm:-left-6 sm:flex">
            <span className="icon-tile h-10 w-10 rounded-xl">
              <CircleCheck size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-[var(--navy)]">Track every step</p>
              <p className="text-xs text-slate-500">Requested to completed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}