"use client";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import { ChevronDown, DollarSign, ImagePlus, Loader2 } from "lucide-react";
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

const readOnlyClass = "input-box cursor-default bg-slate-100 text-slate-500";
const selectClass = "input-box cursor-pointer appearance-none pr-10";
const Arrow = () => (
  <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
);

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
            <label htmlFor="sf-owner-name" className="input-label">Technician Name</label>
            <input id="sf-owner-name" className={readOnlyClass} value={data?.user?.name || ""} readOnly />
          </div>
          <div>
            <label htmlFor="sf-owner-email" className="input-label">Technician Email</label>
            <input id="sf-owner-email" className={readOnlyClass} value={data?.user?.email || ""} readOnly />
          </div>
        </>
      )}
      <div className="sm:col-span-2">
        <label htmlFor="sf-title" className="input-label">Title</label>
        <input id="sf-title" className="input-box" required value={form.title} onChange={set("title")} placeholder="iPhone Screen Replacement" />
      </div>
      <div>
        <label htmlFor="sf-category" className="input-label">Category</label>
        <div className="relative">
          <select id="sf-category" className={selectClass} value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <Arrow />
        </div>
      </div>
      <div>
        <label htmlFor="sf-mode" className="input-label">Service Mode</label>
        <div className="relative">
          <select id="sf-mode" className={selectClass} value={form.serviceMode} onChange={set("serviceMode")}>
            {MODES.map((m) => <option key={m}>{m}</option>)}
          </select>
          <Arrow />
        </div>
      </div>
      <div>
        <label htmlFor="sf-price" className="input-label">Base Price (USD)</label>
        <div className="relative">
          <DollarSign size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input id="sf-price" type="number" min="1" step="0.01" className="input-box pl-11" required value={form.basePrice} onChange={set("basePrice")} />
        </div>
      </div>
      <div>
        <label htmlFor="sf-duration" className="input-label">Estimated Duration</label>
        <input id="sf-duration" className="input-box" required value={form.estimatedDuration} onChange={set("estimatedDuration")} placeholder="2-3 hours" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="sf-area" className="input-label">Service Area</label>
        <input id="sf-area" className="input-box" required value={form.serviceArea} onChange={set("serviceArea")} placeholder="Dhanmondi, Dhaka" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="sf-desc" className="input-label">Description</label>
        <textarea id="sf-desc" rows={3} className="input-box resize-none" required value={form.description} onChange={set("description")} />
      </div>
      <div className="sm:col-span-2">
        <span className="input-label">Service Image</span>
        <input
          id="sf-image"
          type="file"
          accept="image/*"
          className="peer sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <label
          htmlFor="sf-image"
          className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-[#2f6df0]/30 bg-[#2f6df0]/5 p-4 transition-colors hover:border-[#2f6df0]/60 hover:bg-[#2f6df0]/10 peer-focus-visible:ring-4 peer-focus-visible:ring-[#2f6df0]/20"
        >
          {preview || form.image ? (
            <img src={preview ?? form.image} alt="preview" className="h-20 w-28 shrink-0 rounded-xl object-cover" />
          ) : (
            <span className="icon-tile h-14 w-14 shrink-0">
              <ImagePlus size={24} aria-hidden="true" />
            </span>
          )}
          <span className="min-w-0 text-sm">
            <span className="block truncate font-semibold text-[var(--navy)]">
              {file ? file.name : form.image ? "Click to replace the image" : "Click to upload an image"}
            </span>
            <span className="text-slate-500">PNG or JPG</span>
          </span>
        </label>
      </div>
      <button className="btn-main sm:col-span-2" disabled={busy}>
        {busy ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Saving...
          </>
        ) : (
          submitText
        )}
      </button>
    </form>
  );
}