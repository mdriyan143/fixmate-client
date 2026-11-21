import {
  Smartphone, Laptop, Snowflake, Refrigerator, Tv, WashingMachine, Zap,
  Search, FileText, Wrench, CreditCard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BookingStatus, Category, ChartPoint, ServiceMode } from "./types";

export const CATEGORIES: Category[] = [
  "Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical",
];

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  Smartphone,
  "Laptop & PC": Laptop,
  AC: Snowflake,
  Refrigerator,
  TV: Tv,
  "Washing Machine": WashingMachine,
  Electrical: Zap,
};

export const MODES: ServiceMode[] = ["Home Visit", "Shop Drop-off"];
export const ACTIVE: BookingStatus[] = ["requested", "accepted", "in-progress"];

export const STEPS: [icon: LucideIcon, title: string, text: string][] = [
  [Search, "Find a Service", "Browse approved repair services from verified technicians."],
  [FileText, "Send a Request", "Tell the technician what is wrong and when you are free."],
  [Wrench, "Technician Fixes It", "Track every step: accepted, in progress, completed."],
  [CreditCard, "Pay After Completion", "Pay safely with Stripe only when the job is done."],
];

export const dashboardPath = (role?: string | null) => `/dashboard/${role || "customer"}`;

// [{ name: "requested", value: 2 }, ...] for charts
export function countBy<T>(list: T[], key: keyof T): ChartPoint[] {
  const counts: Record<string, number> = {};
  list.forEach((item) => {
    const name = String(item[key]);
    counts[name] = (counts[name] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}