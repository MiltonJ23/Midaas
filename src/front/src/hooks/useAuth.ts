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

      if (data) {
        loadUser(data.user);

        toast.success("Connexion réussie");
      } else {
        toast.error("Votre session a expiré");

        router.replace("/auth/signin");
      }
    })();
  }, [loaded]);
}

 