"use client";

import { authProvider } from "@/api/auth";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useAuth() {
  const { loaded, loadUser } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (loaded) return;

    (async () => {
      const { data } = await authProvider.getMe();

      if (data?.user) {
        loadUser(data.user);
      } else {
        router.replace("/auth/signin");
      }
    })();
  }, [loaded]);
}

 