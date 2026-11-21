import Link from "next/link";
import type { ServiceFilters } from "@/lib/types";

type PaginationProps = { page: number; pages: number; current: ServiceFilters };

export default function Pagination({ page, pages, current }: PaginationProps) {
  if (pages <= 1) return null; // one page only, nothing to show

  // keeps the search, category, mode and sort, and only changes the page number
  const link = (n: number) => `/services?${new URLSearchParams({ ...current, page: String(n) })}`;

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && <Link href={link(page - 1)} className="btn-ghost btn-small">Previous</Link>}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <Link key={n} href={link(n)} className={n === page ? "btn-main btn-small" : "btn-ghost btn-small"}>
          {n}
        </Link>
      ))}
      {page < pages && <Link href={link(page + 1)} className="btn-ghost btn-small">Next</Link>}
    </div>
  );
}