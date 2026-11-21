"use client";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getErrorMessage } from "@/lib/api";
import { CATEGORIES, MODES } from "@/lib/constants";
import { uploadImage } from "@/lib/upload";
import type { ServiceFormValues } from "@/lib/types";


interface ServiceFormProps {
  initial?: Partial<ServiceFormValues>; // filled when editing
  onSubmit: (data: ServiceFormValues) => Promise<void>;
  submitText: string;
  showOwner?: boolean; // show the read-only technician name and email
}

type FieldEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

// used for both "add service" and "edit service"
export default function ServiceForm({ initial = {}, onSubmit, submitText, showOwner = false }: ServiceFormProps) {
  const { data } = authClient.useSession();
  const [form, setForm] = useState<ServiceFormValues>({
    title: "", category: CATEGORIES[0], description: "", basePrice: "",
    estimatedDuration: "", serviceMode: MODES[0], serviceArea: "", image: "", ...initial,
  });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const set = (key: keyof ServiceFormValues) => (e: FieldEvent) => setForm({ ...form, [key]: e.target.value });

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!(Number(form.basePrice) > 0)) return toast.error("Base price must be a positive number");
    if (!file && !form.image) return toast.error("Please choose a service image");

    setBusy(true);
    try {
      const image = file ? await uploadImage(file) : form.image; // ImgBB upload
      await onSubmit({ ...form, image });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {showOwner && (
        <>
          <div>
            <label className="input-label">Technician Name</label>
            <input className="input-box bg-slate-100" value={data?.user?.name || ""} readOnly />
          </div>
          <div>
            <label className="input-label">Technician Email</label>
            <input className="input-box bg-slate-100" value={data?.user?.email || ""} readOnly />
          </div>
        </>
      )}
      <div className="sm:col-span-2">
        <label className="input-label">Title</label>
        <input className="input-box" required value={form.title} onChange={set("title")} placeholder="iPhone Screen Replacement" />
      </div>
      <div>
        <label className="input-label">Category</label>
        <select className="input-box" value={form.category} onChange={set("category")}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="input-label">Service Mode</label>
        <select className="input-box" value={form.serviceMode} onChange={set("serviceMode")}>
          {MODES.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="input-label">Base Price (USD)</label>
        <input type="number" min="1" step="0.01" className="input-box" required value={form.basePrice} onChange={set("basePrice")} />
      </div>
      <div>
        <label className="input-label">Estimated Duration</label>
        <input className="input-box" required value={form.estimatedDuration} onChange={set("estimatedDuration")} placeholder="2-3 hours" />
      </div>
      <div className="sm:col-span-2">
        <label className="input-label">Service Area</label>
        <input className="input-box" required value={form.serviceArea} onChange={set("serviceArea")} placeholder="Dhanmondi, Dhaka" />
      </div>
      <div className="sm:col-span-2">
        <label className="input-label">Description</label>
        <textarea rows={3} className="input-box" required value={form.description} onChange={set("description")} />
      </div>
      <div className="sm:col-span-2">
        <label className="input-label">Service Image</label>
        <input type="file" accept="image/*" className="input-box" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        {(preview || form.image) && (
          <img src={preview ?? form.image} alt="preview" className="mt-3 h-32 rounded-lg object-cover" />
        )}
      </div>
      <button className="btn-main sm:col-span-2" disabled={busy}>{busy ? "Saving..." : submitText}</button>
    </form>
  );
}
