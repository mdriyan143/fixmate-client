"use client";
import Link from "next/link";
import { CircleCheck, ClipboardList, Search, Wrench } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusChart from "@/components/StatusChart";
import { authClient } from "@/lib/auth-client";
import { useApi } from "@/lib/useApi";
import { ACTIVE, countBy } from "@/lib/constants";
import type { Booking } from "@/lib/types";

export default function CustomerOverview() {
  const { data: session } = authClient.useSession();
  const { data, loading } = useApi<Booking[]>("/api/bookings/my");

  if (loading) {
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

  const list = data || [];
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--navy)] sm:text-3xl">
            Hello{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Here is a summary of your repair requests.</p>
        </div>
        <Link href="/services" className="btn-main">
          <Search size={16} aria-hidden="true" /> Browse Services
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Requests" value={list.length} icon={ClipboardList} />
        <StatCard label="Active Jobs" value={list.filter((b) => ACTIVE.includes(b.status)).length} icon={Wrench} />
        <StatCard label="Completed Jobs" value={list.filter((b) => b.status === "completed").length} icon={CircleCheck} />
      </div>

      <StatusChart title="My bookings by status" data={countBy(list, "status")} />
    </div>
  );
}