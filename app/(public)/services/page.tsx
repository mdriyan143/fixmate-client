import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, X } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { getJSON } from "@/lib/server-api";
import type { ServiceFilters, ServicePage } from "@/lib/types";

export const metadata: Metadata = { title: "Browse Services | FixMate" };

type Props = { searchParams: Promise<Record<string, string | undefined>> };

const filterLabels: Record<string, string> = { search: "Search", category: "Category", mode: "Mode" };

export default async function ServicesPage({ searchParams }: Props) {
  const { search, category, mode, sort, page } = await searchParams;
  // keep only the filters that have a value (page is handled separately)
  const current = Object.fromEntries(
    Object.entries({ search, category, mode, sort }).filter(([, v]) => v)
  ) as ServiceFilters;

  // the server (MongoDB) does the searching, filtering, sorting and paging
  const pageNo = Math.max(Number(page) || 1, 1);
  const data = await getJSON<ServicePage>(
    `/api/services?${new URLSearchParams({ ...current, page: String(pageNo) })}`
  );
  const services = data?.items || [];

  // chips for the active filters (sort is not shown as a chip); each chip link removes just that filter
  const activeChips = Object.entries(current).filter(([key]) => key !== "sort");
  const withoutFilter = (key: string) => {
    const params = new URLSearchParams(current);
    params.delete(key);
    const query = params.toString();
    return query ? `/services?${query}` : "/services";
  };

  return (
    <div className="page-wrap section-gap">
      <span className="section-eyebrow">Browse</span>
      <h1 className="section-title">Browse Repair Services</h1>
      <p className="section-sub">Search, filter and sort approved services from verified technicians.</p>

      {/* key resets the search box when the URL filters change (e.g. Clear all filters) */}
      <FilterBar key={JSON.stringify(current)} current={current} />

      {services.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No services found"
          text="Try a different search or clear the filters."
          href="/services"
          cta="Clear Filters"
        />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <p className="mr-2 text-sm font-semibold text-slate-600">{data?.total ?? 0} service(s) found</p>
            {activeChips.map(([key, value]) => (
              <Link
                key={key}
                href={withoutFilter(key)}
                aria-label={`Remove ${filterLabels[key] ?? key} filter: ${value}`}
                className="press inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-ink)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent-ink)]/20"
              >
                {filterLabels[key] ?? key}: {value}
                <X size={12} aria-hidden="true" />
              </Link>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((s) => <ServiceCard key={s._id} s={s} />)}
          </div>
          <Pagination page={pageNo} pages={data?.pages || 1} current={current} />
        </>
      )}
    </div>
  );
}