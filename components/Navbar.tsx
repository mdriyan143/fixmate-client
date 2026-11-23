"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import Logo from "./Logo";
import Avatar from "./Avatar";
import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/constants";
import { clearToken } from "@/lib/api";

const links: [label: string, href: string][] = [
  ["Home", "/"],
  ["Services", "/services"],
  ["How It Works", "/about"],
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = authClient.useSession();
  const user = data?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // close the dropdown when the user clicks outside it, and close everything with the Esc key
  useEffect(() => {
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // active link = soft blue pill, other links get a light pill on hover
  const linkClass = (href: string) =>
    `press rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
      isActive(href)
        ? "bg-[var(--accent-ink)]/10 text-[var(--accent-ink)]"
        : "text-slate-600 hover:bg-[var(--accent-ink)]/10 hover:text-[var(--navy)]"
    }`;

  const menuItem =
    "press flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-[var(--accent-ink)]/10 hover:text-[var(--navy)]";

  async function signOut() {
    await authClient.signOut();
    clearToken();
    toast.success("Signed out", { duration: 2500 });
    setDropOpen(false);
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 shadow-[0_8px_30px_-18px_rgb(30_63_207/0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1638]/70">
      <div className="page-wrap flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={linkClass(href)} aria-current={isActive(href) ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {!user ? (
            <>
              <Link href="/sign-in" className="btn-ghost btn-small">Sign In</Link>
              <Link href="/sign-up" className="btn-main btn-small">Sign Up</Link>
            </>
          ) : (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="press flex items-center gap-1.5 rounded-full p-0.5 pr-2 transition-colors hover:bg-[var(--accent-ink)]/10"
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={dropOpen}
              >
                <span className="block rounded-full ring-2 ring-white shadow-md">
                  <Avatar user={user} />
                </span>
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={`text-slate-500 transition-transform duration-300 ${dropOpen ? "rotate-180" : ""}`}
                />
              </button>
              {dropOpen && (
                <div role="menu" className="card-box animate-pop absolute right-0 mt-3 w-64 origin-top-right bg-white p-3 dark:bg-[#0d1638]">
                  <div className="mb-2 border-b border-[var(--line)] px-2 pb-3">
                    <p className="truncate font-bold text-[var(--navy)]">{user.name}</p>
                    <span className="badge badge-role mt-1 capitalize">{user.role || "customer"}</span>
                  </div>
                  <Link role="menuitem" onClick={() => setDropOpen(false)} href={dashboardPath(user.role)} className={menuItem}>
                    <LayoutDashboard size={17} aria-hidden="true" /> Dashboard
                  </Link>
                  <Link role="menuitem" onClick={() => setDropOpen(false)} href="/dashboard/profile" className={menuItem}>
                    <UserRound size={17} aria-hidden="true" /> Update Profile
                  </Link>
                  <button
                    role="menuitem"
                    onClick={signOut}
                    className="press flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={17} aria-hidden="true" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="press grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-[var(--accent-ink)]/10 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="animate-fade-up max-h-[calc(100dvh-4rem)] overflow-y-auto space-y-2 border-t border-white/60 bg-white/85 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1638]/90 md:hidden">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Menu</span>
            <ThemeToggle />
          </div>
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 text-base ${linkClass(href)}`}
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          {!user ? (
            <div className="flex gap-3 pt-2">
              <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="btn-ghost flex-1">Sign In</Link>
              <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="btn-main flex-1">Sign Up</Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-2xl bg-[var(--accent-ink)]/10 p-3">
                <Avatar user={user} />
                <div className="min-w-0">
                  <p className="truncate font-bold text-[var(--navy)]">{user.name}</p>
                  <span className="badge badge-role capitalize">{user.role || "customer"}</span>
                </div>
              </div>
              <Link href={dashboardPath(user.role)} onClick={() => setMenuOpen(false)} className={menuItem}>
                <LayoutDashboard size={17} aria-hidden="true" /> Dashboard
              </Link>
              <Link href="/dashboard/profile" onClick={() => setMenuOpen(false)} className={menuItem}>
                <UserRound size={17} aria-hidden="true" /> Update Profile
              </Link>
              <button
                onClick={signOut}
                className="press flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut size={17} aria-hidden="true" /> Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}