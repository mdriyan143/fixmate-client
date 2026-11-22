import Link from "next/link";
import ServiceCard from "../ServiceCard";
import EmptyState from "../EmptyState";
import { getJSON } from "@/lib/server-api";
import type { Service } from "@/lib/types";

export default async function FeaturedServices() {
  let services: Service[] = [];
  let failed = false;

  try {
    // 6 latest approved + available services (sorted and limited on the server)
    // kept for 60 seconds, so a slow server does not slow every visit
    services = (await getJSON<Service[]>("/api/services?sort=newest&limit=6", { revalidate: 60 })) || [];
  } catch {
    failed = true; // the home page must never crash, it shows a friendly message instead
  }

  return (
    <section className="page-wrap section-gap">
      <span className="section-eyebrow">Featured</span>
      <h2 className="section-title">Featured Services</h2>
      <p className="section-sub">Fresh repair services from our verified technicians.</p>
      {services.length === 0 ? (
        failed ? (
          <EmptyState title="Services could not be loaded" text="Please refresh the page in a moment." />
        ) : (
          <EmptyState title="No services yet" text="Approved services will show up here." href="/services" cta="Browse Services" />
        )
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <ServiceCard key={s._id} s={s} />)}
        </div>
      )}
      <div className="mt-8 text-center">
        <Link href="/services" className="btn-ghost">View All Services</Link>
      </div>
    </section>
  );
}
