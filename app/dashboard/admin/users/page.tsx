"use client";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useApi } from "@/lib/useApi";
import type { AppUser, Role } from "@/lib/types";

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

  if (loading) return <div className="skeleton h-64" />;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--navy)]">Manage Users</h1>
      <div className="card-box table-box">
        <table>
          <thead>
            <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {(data || []).map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="flex items-center gap-3">
                    {u.image ? (
                      <img src={u.image} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--navy)] text-sm font-bold text-white">{u.name?.[0]}</span>
                    )}
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <select
                    className="input-box w-auto py-1.5"
                    value={u.role || "customer"}
                    disabled={String(u._id) === session?.user?.id}
                    onChange={(e) => changeRole(u._id, e.target.value as Role)}
                  >
                    <option value="customer">Customer</option>
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
