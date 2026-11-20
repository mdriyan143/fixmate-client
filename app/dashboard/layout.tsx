"use client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft, BadgeCheck, ClipboardList, CreditCard, Inbox, LayoutDashboard,
  LogOut, Menu, Plus, UserCog, Users, Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/constants";
import type { Role } from "@/lib/types";

type MenuItem = [label: string, href: string, icon: LucideIcon];

// the sidebar changes with the role
const menus: Record<Role, MenuItem[]> = {
  customer: [
    ["Overview", "/dashboard/customer", LayoutDashboard],
    ["My Bookings", "/dashboard/customer/bookings", ClipboardList],
    ["Payment History", "/dashboard/customer/payments", CreditCard],
  ],
  technician: [
    ["Overview", "/dashboard/technician", LayoutDashboard],
    ["Add Service", "/dashboard/technician/add-service", Plus],
    ["My Services", "/dashboard/technician/my-services", Wrench],
    ["Requests", "/dashboard/technician/requests", Inbox],
  ],
  admin: [
    ["Overview", "/dashboard/admin", LayoutDashboard],
    ["Manage Users", "/dashboard/admin/users", Users],
    ["Service Approval", "/dashboard/admin/services", BadgeCheck],
    ["All Bookings", "/dashboard/admin/bookings", ClipboardList],
    ["Transactions", "/dashboard/admin/transactions", CreditCard],
  ],
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const role = (user?.role || "customer") as Role;
  const section = pathname.split("/")[2]; // customer | technician | admin | profile
  const [open, setOpen] = useState(false);
  const allowed = Boolean(user) && (section === "profile" || section === role);

  useEffect(() => {
    if (isPending) return; // wait for the session, so a reload never kicks a logged-in user out
    if (!user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
    } else if (!allowed) {
      if (section && section !== "profile") toast.error("Forbidden: that area is not for your role");
      router.replace(dashboardPath(role));
    }
  }, [isPending, user, allowed, section, role, pathname, router]);

  async function signOut() {
    await authClient.signOut();
    toast.success("Signed out", { duration: 2000 });
    router.push("/");
  }

  if (!user || !allowed) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="skeleton h-10 w-48" />
      </div>
    );
  }

  const items: MenuItem[] = [...menus[role], ["Update Profile", "/dashboard/profile", UserCog]];

  return (
    <div className="flex min-h-screen">
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[var(--sage)] p-4 text-[var(--navy)] transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Logo light />
        <nav className="mt-8 flex-1 space-y-1">
          {items.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname === href ? "bg-[var(--accent)] font-semibold text-[var(--navy)] shadow-sm" : "text-[var(--navy)]/80 hover:bg-white/40"
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <button onClick={signOut} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--navy)]/80 hover:bg-white/40">
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[var(--line)] bg-[var(--soft)] px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
            <Link href="/" className="flex items-center gap-1 text-sm text-slate-500 hover:text-[var(--accent-ink)]">
              <ArrowLeft size={16} /> Back to site
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight">{user.name}</p>
              <span className="badge badge-role capitalize">{role}</span>
            </div>
            {user.image ? (
              <img src={user.image} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--navy)] font-bold text-white">
                {user.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
