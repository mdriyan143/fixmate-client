"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CATEGORIES, MODES } from "@/lib/constants";
import type { ServiceFilters } from "@/lib/types";

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
    <div className="card-box mb-8 grid gap-3 p-4 md:grid-cols-5">
      <form
        onSubmit={(e) => { e.preventDefault(); update("search", search); }}
        className="flex gap-2 md:col-span-2"
      >
        <input className="input-box" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or category" />
        <button className="btn-main" aria-label="Search"><Search size={18} /></button>
      </form>

      <select className="input-box" value={current.category || ""} onChange={(e) => update("category", e.target.value)}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>
      <select className="input-box" value={current.mode || ""} onChange={(e) => update("mode", e.target.value)}>
        <option value="">All service modes</option>
        {MODES.map((m) => <option key={m}>{m}</option>)}
      </select>
      <select className="input-box" value={current.sort || "newest"} onChange={(e) => update("sort", e.target.value)}>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>

      {Object.keys(current).length > 0 && (
        <Link href="/services" className="text-sm font-semibold text-[var(--accent-ink)] md:col-span-5">Clear all filters</Link>
      )}
    </div>
  );
}
