"use client";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";

type ProfileForm = { name: string; phone: string; area: string; bio: string };

export default function ProfilePage() {
  const { data, refetch } = authClient.useSession();
  const user = data?.user;
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user && !form) {
      setForm({ name: user.name || "", phone: user.phone || "", area: user.area || "", bio: user.bio || "" });
    }
  }, [user, form]);

  if (!form || !user) return <div className="skeleton h-64" />;
  const set = (key: keyof ProfileForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const image = file ? await uploadImage(file) : undefined;
      await api("/api/users/profile", { method: "PATCH", body: { ...form, image } });
      await refetch(); // navbar and top bar update without logging out
      setFile(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setBusy(false);
  }

  const photo = file ? URL.createObjectURL(file) : user.image;
  return (
    <form onSubmit={save} className="card-box mx-auto max-w-2xl space-y-4 p-6">
      <h1 className="text-2xl font-bold text-[var(--navy)]">Update Profile</h1>

      <div className="flex items-center gap-4">
        {photo ? (
          <img src={photo} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[var(--navy)] text-2xl font-bold text-white">{user.name?.[0]}</span>
        )}
        <input type="file" accept="image/*" className="input-box" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="input-label">Email (read only)</label>
          <input className="input-box bg-slate-100" value={user.email} readOnly />
        </div>
        <div>
          <label className="input-label">Role (read only)</label>
          <input className="input-box bg-slate-100 capitalize" value={user.role || "customer"} readOnly />
        </div>
        <div>
          <label className="input-label">Name</label>
          <input className="input-box" required value={form.name} onChange={set("name")} />
        </div>
        <div>
          <label className="input-label">Phone</label>
          <input className="input-box" value={form.phone} onChange={set("phone")} />
        </div>
        <div className="sm:col-span-2">
          <label className="input-label">Area</label>
          <input className="input-box" value={form.area} onChange={set("area")} placeholder="Mirpur, Dhaka" />
        </div>
        <div className="sm:col-span-2">
          <label className="input-label">Bio</label>
          <textarea rows={3} className="input-box" value={form.bio} onChange={set("bio")} />
        </div>
      </div>
      <button className="btn-main" disabled={busy}>{busy ? "Saving..." : "Save Changes"}</button>
    </form>
  );
}
