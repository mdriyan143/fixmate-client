"use client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft, BadgeCheck, ClipboardList, CreditCard, Inbox, LayoutDashboard,
  LogOut, Menu, Plus, UserCog, Users, Wrench, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import Avatar from "@/components/Avatar";
import ThemeToggle from "@/components/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/constants";
import type { Role } from "@/lib/types";
import { clearToken } from "@/lib/api";

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

  // close the mobile menu with the Esc key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  async function signOut() {
    await authClient.signOut();
    clearToken();
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
      {open && (
        <div
          className="animate-fade-in fixed inset-0 z-30 bg-[#0b1636]/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        aria-label="Dashboard menu"
        className={`bg-deep fixed inset-y-0 left-0 z-40 flex w-64 flex-col rounded-r-3xl p-4 shadow-[8px_0_40px_-12px_rgb(15_30_74/0.5)] transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-1">
          <Logo onDark />
          <button
            className="press grid h-9 w-9 place-items-center rounded-full text-blue-100/80 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-1 overflow-y-auto">
          {items.map(([label, href, Icon]) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`press relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "bg-white/15 font-semibold text-white ring-1 ring-white/15"
                    : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {active && <span aria-hidden="true" className="absolute -left-4 h-6 w-1.5 rounded-r-full bg-[#7aa2ff]" />}
                <Icon size={18} aria-hidden="true" /> {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 pt-3">
          <button
            onClick={signOut}
            className="press flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-blue-100/80 transition-colors hover:bg-red-500/15 hover:text-red-200"
          >
            <LogOut size={18} aria-hidden="true" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/60 bg-white/70 px-4 backdrop-blur-xl md:px-6 dark:border-white/10 dark:bg-[#0d1638]/70">
          <div className="flex items-center gap-3">
            <button
              className="press grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--accent-ink)]/10 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <Link
              href="/"
              className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-[var(--accent-ink)]"
            >
              <ArrowLeft size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-1" />
              Back to site
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-[var(--navy)]">{user.name}</p>
              <span className="badge badge-role capitalize">{role}</span>
            </div>
            <span className="block rounded-full ring-2 ring-white shadow-md dark:ring-white/10">
              <Avatar user={user} />
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}