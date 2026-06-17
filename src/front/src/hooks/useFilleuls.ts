"use client";

import { filleulProvider } from "@/api/filleuls";
import Filleul from "@/entities/filleuls/filleul";
import { useAuthStore } from "@/store/auth";
import { useFilleulsStore } from "@/store/filleuls";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useGetFilleuls({ page }: { page: number }) {
  const { user } = useAuthStore();
  const { loadData } = useFilleulsStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (loading) return;

    (async () => {
      setLoading(true);
      const { data, error } = await filleulProvider.getAll();

      if (data) {
        loadData({
          filleuls: data,
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

export function useGetEveryFilleuls() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [filleuls, setFilleuls] = useState<Filleul[]>([]);

  useEffect(() => {
    if (!user) return;
    if (loading) return;

    (async () => {
      setLoading(true);
      const { data, error } = await filleulProvider.getAll();

      if (data) {
        setFilleuls(data);
      } else {
        toast.error(error);
      }

      setLoading(false);
    })();
  }, [user]);

  return { loading, filleuls };
}
