import type { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { getJSON } from "@/lib/server-api";
import type { ServiceFilters, ServicePage } from "@/lib/types";

export const metadata: Metadata = { title: "Browse Services | FixMate" };

type Props = { searchParams: Promise<Record<string, string | undefined>> };

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

  return (
    <div className="page-wrap section-gap">
      <h1 className="section-title">Browse Repair Services</h1>
      <p className="section-sub">Search, filter and sort approved services from verified technicians.</p>

      {/* key resets the search box when the URL filters change (e.g. Clear all filters) */}
      <FilterBar key={JSON.stringify(current)} current={current} />

      {services.length === 0 ? (
        <EmptyState title="No services found" text="Try a different search or clear the filters." href="/services" cta="Clear Filters" />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">{data?.total ?? 0} service(s) found</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((s) => <ServiceCard key={s._id} s={s} />)}
          </div>
          <Pagination page={pageNo} pages={data?.pages || 1} current={current} />
        </>
      )}
    </div>
  );
}