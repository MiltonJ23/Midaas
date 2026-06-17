"use client";

import { adminProvider, AdminStorageKeys } from "@/api/admin";
import { useAdminStore } from "@/store/admin";
import { useAuthStore } from "@/store/auth";
import { Storage, StorageKeys } from "@/api/auth/storage";
import User from "@/entities/user/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

/**
 * Admin authentication hook.
 * Checks for a stored admin token and attempts to restore the admin session.
 * Falls back to regular user auth if no admin token is found.
 */
export default function useAdminAuth() {
  const { loaded: adminLoaded, loadAdmin } = useAdminStore();
  const { loaded: userLoaded, loadUser } = useAuthStore();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const adminToken = Storage.getItem(AdminStorageKeys.adminAccess);

    if (!adminToken) {
      // No admin token — let the regular useAuth handle it
      return;
    }

    // Admin token exists — try to restore admin session
    (async () => {
      // Store admin token as regular access token so API interceptors work
      Storage.setItem(StorageKeys.access, adminToken);

      const { data, error } = await adminProvider.getMe();

      if (data?.admin) {
        // Restore admin profile in admin store
        loadAdmin(data.admin);

        // Create a synthetic User entity for the auth store (sidebar depends on it)
        const adminUser = new User({
          id: data.admin.id,
          email: data.admin.email,
          name: data.admin.full_name,
          validationStatus: "verified",
          role: "admin",
        });
        loadUser(adminUser);
      } else {
        // Admin session expired — try regular auth as fallback
        Storage.removeItem(AdminStorageKeys.adminAccess);
        Storage.removeItem(StorageKeys.access);

        // Let regular useAuth try
        if (!userLoaded) {
          const { data: userData } = await adminProvider.getMe();
          if (userData) {
            // Not expected here, but just in case
          }
        }
      }
    })();
  }, [initialized, loadAdmin, loadUser, router, userLoaded]);
}
