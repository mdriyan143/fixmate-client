import Link from "next/link";
import ServiceCard from "../ServiceCard";
import EmptyState from "../EmptyState";
import { getJSON } from "@/lib/server-api";
import type { Service } from "@/lib/types";

export default async function FeaturedServices() {
  // 6 latest approved + available services (sorted and limited on the server)
  const services = (await getJSON<Service[]>("/api/services?sort=newest&limit=6")) || [];

  return (
    <section className="page-wrap section-gap">
      <h2 className="section-title">Featured Services</h2>
      <p className="section-sub">Fresh repair services from our verified technicians.</p>
      {services.length === 0 ? (
        <EmptyState title="No services yet" text="Approved services will show up here." href="/services" cta="Browse Services" />
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
