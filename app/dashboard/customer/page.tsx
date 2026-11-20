"use client";
import StatCard from "@/components/StatCard";
import StatusChart from "@/components/StatusChart";
import { useApi } from "@/lib/useApi";
import { ACTIVE, countBy } from "@/lib/constants";
import type { Booking } from "@/lib/types";

export default function CustomerOverview() {
  const { data, loading } = useApi<Booking[]>("/api/bookings/my");
  if (loading) return <div className="skeleton h-64" />;

  const list = data || [];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--navy)]">Customer Overview</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Requests" value={list.length} icon="📋" />
        <StatCard label="Active Jobs" value={list.filter((b) => ACTIVE.includes(b.status)).length} icon="🛠️" />
        <StatCard label="Completed Jobs" value={list.filter((b) => b.status === "completed").length} icon="✅" />
      </div>
      <StatusChart title="My bookings by status" data={countBy(list, "status")} />
    </div>
  );
}
