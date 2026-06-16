"use client";

import { campaignProvider } from "@/api/campaigns";
import Project from "@/entities/project/project";
import { useAuthStore } from "@/store/auth";
import { useCampaignsStore } from "@/store/campaigns";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useGetCampaigns({ page }: { page: number }) {
  const { user } = useAuthStore();
  const { loadData, loaded } = useCampaignsStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (loading) return;
    if (loaded) return;

    (async () => {
      setLoading(true);
      const { data, error } = await campaignProvider.getAll();

      if (data) {
        loadData({
          campaigns: data,
          count: data.length,
          next: null,
        });
      } else {
        toast.error(error);
      }

      setLoading(false);
    })();
  }, [user, page, loaded]);

  return { loading };
}

export function useGetEveryCampaigns() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Project[]>([]);

  useEffect(() => {
    if (!user) return;
    if (loading) return;

    (async () => {
      setLoading(true);
      const { data, error } = await campaignProvider.getAll();

      if (data) {
        setCampaigns(data);
      } else {
        toast.error(error);
      }

      setLoading(false);
    })();
  }, [user]);

  return { loading, campaigns };
}
