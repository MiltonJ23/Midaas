"use client";

import { parrainProvider } from "@/api/parrains";
import Parrain from "@/entities/parrains/parrain";
import { useAuthStore } from "@/store/auth";
import { useParrainsStore } from "@/store/parrains";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useGetParrains({ page }: { page: number }) {
  const { user } = useAuthStore();
  const { loadData } = useParrainsStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (loading) return;

    (async () => {
      setLoading(true);
      const { data, error } = await parrainProvider.getAll();

      if (data) {
        loadData({
          parrains: data,
          count: data.length,
          next: null,
        });
      } else {
        toast.error(error);
      }

      setLoading(false);
    })();
  }, [user, page]);

  return { loading };
}

export function useGetEveryParrains() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [parrains, setParrains] = useState<Parrain[]>([]);

  useEffect(() => {
    if (!user) return;
    if (loading) return;

    (async () => {
      setLoading(true);
      const { data, error } = await parrainProvider.getAll();

      if (data) {
        setParrains(data);
      } else {
        toast.error(error);
      }

      setLoading(false);
    })();
  }, [user]);

  return { loading, parrains };
}
