"use client";
import { Briefcase, CircleCheck, Hourglass } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusChart from "@/components/StatusChart";
import { useApi } from "@/lib/useApi";
import { countBy } from "@/lib/constants";
import type { Booking, Service } from "@/lib/types";

export default function TechnicianOverview() {
  const services = useApi<Service[]>("/api/services/mine");
  const jobs = useApi<Booking[]>("/api/bookings/technician");
  if (services.loading || jobs.loading) return <div className="skeleton h-64" />;

  const myServices = services.data || [];
  const myJobs = jobs.data || [];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--navy)]">Technician Overview</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Services" value={myServices.length} icon={Briefcase} />
        <StatCard label="Approved Services" value={myServices.filter((s) => s.approvalStatus === "approved").length} icon={CircleCheck} />
        <StatCard label="Pending Requests" value={myJobs.filter((b) => b.status === "requested").length} icon={Hourglass} />
      </div>
      <StatusChart title="My jobs by status" data={countBy(myJobs, "status")} />
    </div>
  );
}