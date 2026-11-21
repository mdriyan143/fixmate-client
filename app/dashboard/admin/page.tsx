"use client";
import { Briefcase, Hourglass, Users } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusChart from "@/components/StatusChart";
import { useApi } from "@/lib/useApi";
import { countBy } from "@/lib/constants";
import type { AppUser, Booking, Service } from "@/lib/types";

export default function AdminOverview() {
  const users = useApi<AppUser[]>("/api/admin/users");
  const services = useApi<Service[]>("/api/admin/services");
  const bookings = useApi<Booking[]>("/api/admin/bookings");
  if (users.loading || services.loading || bookings.loading) return <div className="skeleton h-64" />;

  const userList = users.data || [];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--navy)]">Admin Overview</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={userList.length} icon={Users} />
        <StatCard label="Total Technicians" value={userList.filter((u) => u.role === "technician").length} icon={Briefcase} />
        <StatCard label="Pending Services" value={(services.data || []).filter((s) => s.approvalStatus === "pending").length} icon={Hourglass} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <StatusChart title="All bookings by status" data={countBy(bookings.data || [], "status")} />
        <StatusChart title="Users by role" data={countBy(userList.map((u) => ({ role: u.role || "customer" })), "role")} />
      </div>
    </div>
  );
}