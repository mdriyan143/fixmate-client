import Link from "next/link";
import { CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";

export default function Categories() {
  return (
    <section className="page-wrap section-gap">
      <h2 className="section-title">Popular Categories</h2>
      <p className="section-sub">Pick a category and see only the services you need.</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c];
          return (
            <Link
              key={c}
              href={`/services?category=${encodeURIComponent(c)}`}
              className="card-box p-5 text-center transition hover:-translate-y-1 hover:border-[var(--accent)]"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--sage-soft)] text-[var(--accent-ink)]">
                <Icon size={28} strokeWidth={1.75} />
              </div>
              <p className="mt-3 text-sm font-semibold text-[var(--navy)]">{c}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}