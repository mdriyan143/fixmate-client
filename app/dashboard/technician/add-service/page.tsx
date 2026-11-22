"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import ServiceForm from "@/components/ServiceForm";
import { api } from "@/lib/api";
import type { ServiceFormValues } from "@/lib/types";

export default function AddService() {
  const router = useRouter();

  async function save(data: ServiceFormValues) {
    await api("/api/services", { method: "POST", body: data });
    toast.success("Service added! It is waiting for admin approval");
    router.push("/dashboard/technician/my-services");
  }

  return (
    <div className="card-box mx-auto max-w-3xl p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-4">
        <span className="icon-tile h-12 w-12 shrink-0 rounded-2xl">
          <Plus size={24} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--navy)]">Add a Service</h1>
          <p className="text-sm text-slate-500">New services appear on the site after an admin approves them.</p>
        </div>
      </div>
      <ServiceForm onSubmit={save} submitText="Add Service" showOwner />
    </div>
  );
}