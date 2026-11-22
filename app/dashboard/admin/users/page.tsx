"use client";
import { toast } from "sonner";
import { ChevronDown, Users } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { api, getErrorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useApi } from "@/lib/useApi";
import type { AppUser, Role } from "@/lib/types";

function UserAvatar({ u }: { u: AppUser }) {
  return u.image ? (
    <img src={u.image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm" />
  ) : (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[image:var(--grad-brand)] text-sm font-bold text-white ring-2 ring-white shadow-sm">
      {u.name?.[0]?.toUpperCase()}
    </span>
  );
}

export default function ManageUsers() {
  const { data, loading, reload } = useApi<AppUser[]>("/api/admin/users");
  const { data: session } = authClient.useSession();

  async function changeRole(id: string, role: Role) {
    try {
      await api(`/api/admin/users/${id}/role`, { method: "PATCH", body: { role } });
      toast.success("Role updated");
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12 w-64" />
        <div className="skeleton h-72" />
      </div>
    );
  }
  const users = data || [];
  if (!users.length) return <EmptyState icon={Users} title="No users found" />;

  const isMe = (u: AppUser) => String(u._id) === session?.user?.id;

  // the same role picker is used by the table and the mobile cards
  const roleSelect = (u: AppUser) => (
    <div className="relative inline-block">
      <select
        aria-label={`Role for ${u.name}`}
        className="input-box w-auto cursor-pointer appearance-none py-1.5 pl-3 pr-9 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        value={u.role || "customer"}
        disabled={isMe(u)}
        onChange={(e) => changeRole(u._id, e.target.value as Role)}
      >
        <option value="customer">Customer</option>
        <option value="technician">Technician</option>
        <option value="admin">Admin</option>
      </select>
      <ChevronDown size={14} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--navy)] sm:text-3xl">Manage Users</h1>
        <p className="mt-1 text-sm text-slate-500">{users.length} user(s). You cannot change your own role.</p>
      </div>

      {/* TABLE (tablet and desktop) */}
      <div className="card-box table-box hidden md:block">
        <table>
          <thead>
            <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <UserAvatar u={u} />
                    <span className="font-medium text-[var(--navy)]">{u.name}</span>
                    {isMe(u) && <span className="badge badge-role">You</span>}
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{roleSelect(u)}</td>
                <td className="whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDS (phones) */}
      <div className="grid gap-3 md:hidden">
        {users.map((u) => (
          <div key={u._id} className="card-box p-4">
            <div className="flex items-center gap-3">
              <UserAvatar u={u} />
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-bold text-[var(--navy)]">
                  <span className="truncate">{u.name}</span>
                  {isMe(u) && <span className="badge badge-role">You</span>}
                </p>
                <p className="truncate text-xs text-slate-500">{u.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-3">
              {roleSelect(u)}
              <span className="text-xs text-slate-500">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}