"use client";

import { companyProvider } from "@/api/company";
import { useAuthStore } from "@/store/auth";
import { useCompanyStore } from "@/store/company";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useGetCompanies() {
  const { user } = useAuthStore();
  const { loadData, loaded } = useCompanyStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (loading) return;
    if (loaded) return;

    (async () => {
      setLoading(true);
      const { data, error } = await companyProvider.getAll();

      if (data) {
        loadData({ companies: data });
      } else {
        toast.error(error);
      }

      setLoading(false);
    })();
  }, [user, loaded]);

  return { loading };
}
