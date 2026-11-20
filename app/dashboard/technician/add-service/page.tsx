"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
    <div className="card-box mx-auto max-w-3xl p-6">
      <h1 className="mb-5 text-2xl font-bold text-[var(--navy)]">Add a Service</h1>
      <ServiceForm onSubmit={save} submitText="Add Service" showOwner />
    </div>
  );
}
