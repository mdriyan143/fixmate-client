"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";
import { CATEGORIES, MODES } from "@/lib/constants";
import type { ServiceFilters } from "@/lib/types";

// a select with a custom arrow (the native arrow is hidden with appearance-none)
const selectClass = "input-box cursor-pointer appearance-none pr-10";
const Arrow = () => (
  <ChevronDown
    size={16}
    aria-hidden="true"
    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
  />
);

// every change only updates the URL; the server page then asks MongoDB for the result
export default function FilterBar({ current }: { current: ServiceFilters }) {
  const router = useRouter();
  const [search, setSearch] = useState(current.search || "");

  function update(key: string, value: string) {
    const params = new URLSearchParams({ ...current, [key]: value });
    [...params.keys()].forEach((k) => !params.get(k) && params.delete(k));
    router.push(`/services?${params.toString()}`);
  }

  return (
    <div className="card-box mb-8 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
      <form
        onSubmit={(e) => { e.preventDefault(); update("search", search); }}
        role="search"
        className="flex gap-2 sm:col-span-2"
      >
        <div className="relative min-w-0 flex-1">
          <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-box pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category"
            aria-label="Search services"
          />
        </div>
        <button className="btn-main shrink-0" aria-label="Search">
          <Search size={18} aria-hidden="true" className="sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      <div className="relative">
        <select className={selectClass} aria-label="Filter by category" value={current.category || ""} onChange={(e) => update("category", e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <Arrow />
      </div>
      <div className="relative">
        <select className={selectClass} aria-label="Filter by service mode" value={current.mode || ""} onChange={(e) => update("mode", e.target.value)}>
          <option value="">All service modes</option>
          {MODES.map((m) => <option key={m}>{m}</option>)}
        </select>
        <Arrow />
      </div>
      <div className="relative">
        <select className={selectClass} aria-label="Sort services" value={current.sort || "newest"} onChange={(e) => update("sort", e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <Arrow />
      </div>

      {Object.keys(current).length > 0 && (
        <Link
          href="/services"
          className="press inline-flex w-max items-center gap-1.5 text-sm font-semibold text-[var(--accent-ink)] hover:underline sm:col-span-2 lg:col-span-5"
        >
          <X size={14} aria-hidden="true" /> Clear all filters
        </Link>
      )}
    </div>
  );
}