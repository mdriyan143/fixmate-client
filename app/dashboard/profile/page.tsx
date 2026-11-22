"use client";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import { Camera, Loader2, MapPin, Phone, Save, UserRound } from "lucide-react";
import { api, getErrorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";

type ProfileForm = { name: string; phone: string; area: string; bio: string };

const iconClass = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400";
const readOnlyClass = "input-box cursor-default bg-slate-100 text-slate-500";

export default function ProfilePage() {
  const { data, refetch } = authClient.useSession();
  const user = data?.user;
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (user && !form) {
      setForm({ name: user.name || "", phone: user.phone || "", area: user.area || "", bio: user.bio || "" });
    }
  }, [user, form]);

  if (!form || !user) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="skeleton h-40" />
        <div className="skeleton h-72" />
      </div>
    );
  }
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

  const photo = preview ?? user.image;
  return (
    <form onSubmit={save} className="card-box mx-auto max-w-2xl overflow-hidden">
      <div className="bg-deep h-28" />

      <div className="px-6 pb-6">
        <div className="-mt-12 flex flex-wrap items-start gap-4">
          {photo ? (
            <img src={photo} alt="" className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-lg dark:ring-[#0d1638]" />
          ) : (
            <span className="grid h-24 w-24 place-items-center rounded-full bg-[image:var(--grad-brand)] text-3xl font-bold text-white ring-4 ring-white shadow-lg dark:ring-[#0d1638]">
              {user.name?.[0]?.toUpperCase()}
            </span>
          )}
          <div className="pt-14">
            <h1 className="text-2xl font-extrabold text-[var(--navy)]">Update Profile</h1>
            <span className="badge badge-role mt-1 capitalize">{user.role || "customer"}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <input
            id="profile-photo"
            type="file"
            accept="image/*"
            className="peer sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <label htmlFor="profile-photo" className="btn-ghost btn-small peer-focus-visible:ring-4 peer-focus-visible:ring-[#2f6df0]/25">
            <Camera size={14} aria-hidden="true" /> Change photo
          </label>
          {file && <span className="truncate text-sm text-slate-500">{file.name}</span>}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pf-email" className="input-label">Email (read only)</label>
            <input id="pf-email" className={readOnlyClass} value={user.email} readOnly />
          </div>
          <div>
            <label htmlFor="pf-role" className="input-label">Role (read only)</label>
            <input id="pf-role" className={`${readOnlyClass} capitalize`} value={user.role || "customer"} readOnly />
          </div>
          <div>
            <label htmlFor="pf-name" className="input-label">Name</label>
            <div className="relative">
              <UserRound size={18} aria-hidden="true" className={iconClass} />
              <input id="pf-name" className="input-box pl-11" required value={form.name} onChange={set("name")} />
            </div>
          </div>
          <div>
            <label htmlFor="pf-phone" className="input-label">Phone</label>
            <div className="relative">
              <Phone size={18} aria-hidden="true" className={iconClass} />
              <input id="pf-phone" type="tel" autoComplete="tel" className="input-box pl-11" value={form.phone} onChange={set("phone")} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="pf-area" className="input-label">Area</label>
            <div className="relative">
              <MapPin size={18} aria-hidden="true" className={iconClass} />
              <input id="pf-area" className="input-box pl-11" value={form.area} onChange={set("area")} placeholder="Mirpur, Dhaka" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="pf-bio" className="input-label">Bio</label>
            <textarea id="pf-bio" rows={3} className="input-box resize-none" value={form.bio} onChange={set("bio")} />
          </div>
        </div>

        <button className="btn-main mt-6" disabled={busy}>
          {busy ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Saving...
            </>
          ) : (
            <>
              <Save size={16} aria-hidden="true" /> Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}