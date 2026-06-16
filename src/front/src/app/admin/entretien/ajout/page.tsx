"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ServiceForm, {
  ServiceFormData,
} from "@/components/organisms/maintenance/service-form";

export default function AddMaintenanceServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ServiceFormData) => {
    setLoading(true);

    try {
      // Collect all non-empty activities
      const features = [
        values.activity1,
        values.activity2,
        values.activity3,
        values.activity4,
        values.activity5,
        values.activity6,
        values.activity7,
      ].filter((activity) => activity.trim() !== "");

      const payload = {
        name: values.title,
        price: values.price,
        duration: values.duration,
        features,
      };

      // TODO: Replace with actual API call
      console.log("Service payload:", payload);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Service ajouté avec succès!");
      router.push("/admin/entretien");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceForm
      mode="create"
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/admin/entretien")}
    />
  );
}
