import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";

// soft icon-tile tints that match the aurora glows (blue, mint, pink, violet)
const tints = [
  "bg-[linear-gradient(135deg,#dbe6ff,#c3d4ff)] text-[#1e3fcf]",
  "bg-[linear-gradient(135deg,#d3f7ef,#b9f0e4)] text-[#0f766e]",
  "bg-[linear-gradient(135deg,#fde1ee,#fbcfe3)] text-[#be185d]",
  "bg-[linear-gradient(135deg,#e9e3ff,#d9d0ff)] text-[#5b3fd0]",
];

export default function Categories() {
  return (
    <section className="page-wrap section-gap">
      <span className="section-eyebrow">Categories</span>
      <h2 className="section-title">Popular Categories</h2>
      <p className="section-sub">Pick a category and see only the services you need.</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {CATEGORIES.map((c, i) => {
          const Icon = CATEGORY_ICONS[c];
          return (
            <Link
              key={c}
              href={`/services?category=${encodeURIComponent(c)}`}
              className="card-box group relative flex flex-col items-center p-5 text-center"
            >
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="absolute right-3 top-3 text-[var(--accent-ink)] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
              <span
                className={`grid h-14 w-14 place-items-center rounded-2xl shadow-[inset_0_0_0_1px_rgb(255_255_255/0.8)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tints[i % tints.length]}`}
              >
                <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-semibold text-[var(--navy)]">{c}</p>
              <p className="mt-0.5 text-xs text-slate-500">Browse repairs</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}