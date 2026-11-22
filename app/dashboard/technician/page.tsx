"use client";
import Link from "next/link";
import { Briefcase, CircleCheck, Hourglass, Plus } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusChart from "@/components/StatusChart";
import { authClient } from "@/lib/auth-client";
import { useApi } from "@/lib/useApi";
import { countBy } from "@/lib/constants";
import type { Booking, Service } from "@/lib/types";

export default function TechnicianOverview() {
  const { data: session } = authClient.useSession();
  const services = useApi<Service[]>("/api/services/mine");
  const jobs = useApi<Booking[]>("/api/bookings/technician");

  if (services.loading || jobs.loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-16 w-72" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24" />)}
        </div>
        <div className="skeleton h-72" />
      </div>
    );
  }

  const myServices = services.data || [];
  const myJobs = jobs.data || [];
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--navy)] sm:text-3xl">
            Hello{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Here is how your services and jobs are doing.</p>
        </div>
        <Link href="/dashboard/technician/add-service" className="btn-main">
          <Plus size={16} aria-hidden="true" /> Add Service
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Services" value={myServices.length} icon={Briefcase} />
        <StatCard label="Approved Services" value={myServices.filter((s) => s.approvalStatus === "approved").length} icon={CircleCheck} />
        <StatCard label="Pending Requests" value={myJobs.filter((b) => b.status === "requested").length} icon={Hourglass} />
      </div>
      <StatusChart title="My jobs by status" data={countBy(myJobs, "status")} />
    </div>
  );
}