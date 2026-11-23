"use client";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChartPoint } from "@/lib/types";

// same colours as the status badges
const colors: Record<string, string> = {
  requested: "#3b82f6",
  accepted: "#6366f1",
  "in-progress": "#f59e0b",
  completed: "#22c55e",
  paid: "#14b8a6",
  rejected: "#ef4444",
  cancelled: "#9ca3af",
  customer: "#2f6df0",
  technician: "#14b8a6",
  admin: "#6366f1",
};

export default function StatusChart({ title, data }: { title: string; data: ChartPoint[] }) {
  const hasData = data.some((d) => d.value > 0);
  return (
    <div className="card-box p-5">
      <h3 className="mb-4 font-bold text-[var(--navy)]">{title}</h3>
      {!hasData ? (
        <div className="grid h-64 place-items-center text-sm text-slate-500">No data to show yet.</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="name" interval={0} tickLine={false} axisLine={false} tick={{ fill: "var(--color-slate-500)", fontSize: 10 }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--color-slate-500)", fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: "rgb(47 109 240 / 0.07)" }}
                contentStyle={{
                  borderRadius: 14,
                  border: "1px solid rgb(255 255 255 / 0.9)",
                  boxShadow: "0 14px 30px -14px rgb(30 63 207 / 0.4)",
                }}
              />
             <Bar dataKey="value" name="Count" radius={[10, 10, 0, 0]} maxBarSize={44}>
                {data.map((d) => (
                  <Cell key={d.name} fill={colors[d.name] || "#2f6df0"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}