"use client";
import { Briefcase, ClipboardList, Hourglass, Users } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusChart from "@/components/StatusChart";
import { useApi } from "@/lib/useApi";
import { countBy } from "@/lib/constants";
import type { AppUser, Booking, Service } from "@/lib/types";

export default function AdminOverview() {
  const users = useApi<AppUser[]>("/api/admin/users");
  const services = useApi<Service[]>("/api/admin/services");
  const bookings = useApi<Booking[]>("/api/admin/bookings");

  if (users.loading || services.loading || bookings.loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-16 w-72" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-24" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="skeleton h-80" />
          <div className="skeleton h-80" />
        </div>
      </div>
    );
  }

  const userList = users.data || [];
  const bookingList = bookings.data || [];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)] sm:text-3xl">Admin Overview</h1>
        <p className="mt-1 text-sm text-slate-500">A quick look at users, services and jobs across FixMate.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={userList.length} icon={Users} />
        <StatCard label="Total Technicians" value={userList.filter((u) => u.role === "technician").length} icon={Briefcase} />
        <StatCard label="Pending Services" value={(services.data || []).filter((s) => s.approvalStatus === "pending").length} icon={Hourglass} />
        <StatCard label="Total Bookings" value={bookingList.length} icon={ClipboardList} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatusChart title="All bookings by status" data={countBy(bookingList, "status")} />
        <StatusChart title="Users by role" data={countBy(userList.map((u) => ({ role: u.role || "customer" })), "role")} />
      </div>
    </div>
  );
}