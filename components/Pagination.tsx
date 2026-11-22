import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ServiceFilters } from "@/lib/types";

type PaginationProps = { page: number; pages: number; current: ServiceFilters };

export default function Pagination({ page, pages, current }: PaginationProps) {
  if (pages <= 1) return null; // one page only, nothing to show

  // keeps the search, category, mode and sort, and only changes the page number
  const link = (n: number) => `/services?${new URLSearchParams({ ...current, page: String(n) })}`;

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={link(page - 1)} className="btn-ghost btn-small">
          <ChevronLeft size={14} aria-hidden="true" /> Previous
        </Link>
      )}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={link(n)}
          aria-current={n === page ? "page" : undefined}
          className={`${n === page ? "btn-main" : "btn-ghost"} btn-small min-w-9`}
        >
          {n}
        </Link>
      ))}
      {page < pages && (
        <Link href={link(page + 1)} className="btn-ghost btn-small">
          Next <ChevronRight size={14} aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}