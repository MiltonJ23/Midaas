"use client";

import { Button } from "@/components/atoms/button";
import { MUIInput } from "@/components/atoms/input";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { adminProvider, AdminStorageKeys } from "@/api/admin";
import { Storage, StorageKeys } from "@/api/auth/storage";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/admin";
import { useAuthStore } from "@/store/auth";
import User from "@/entities/user/user";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface IAdminSigninForm {
  email: string;
  password: string;
}

export default function AdminSignin() {
  const { handleSubmit, control, reset } = useForm<IAdminSigninForm>({
    defaultValues: { email: "", password: "" },
  });
  const router = useRouter();
  const { admin, loadAdmin } = useAdminStore();
  const { loadUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [passwordViewed, setPasswordViewed] = useState(false);

  useEffect(() => {
    const token = Storage.getItem(AdminStorageKeys.adminAccess);
    if (admin && token) {
      router.replace("/admin/dashboard");
    }
  }, [admin, router]);

  const onSubmit: SubmitHandler<IAdminSigninForm> = async (formData) => {
    setLoading(true);
    const { data, error } = await adminProvider.login(formData);

    if (data && !error) {
      loadAdmin(data.admin);

      const adminUser = new User({
        id: data.admin.id,
        email: data.admin.email,
        name: data.admin.full_name,
        validationStatus: "verified",
        role: "admin",
      });
      loadUser(adminUser);

      if (data.token) {
        Storage.setItem(StorageKeys.access, data.token);
      }

      toast.success("Connexion administrateur réussie");
      reset();
      router.push("/admin/dashboard");
    } else {
      toast.error(error || "Email ou mot de passe invalide");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Shield badge */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Midaas Admin"
              width={120}
              height={36}
              className="object-contain brightness-0 invert opacity-90"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-lg font-bold text-white">Administration</h1>
            <p className="text-slate-400 text-sm mt-1">
              Accès réservé aux administrateurs
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <MUIInput
                  {...field}
                  label="Email"
                  type="email"
                  placeholder="admin@midaas.com"
                  before={<Mail className="w-4 h-4" />}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <MUIInput
                  {...field}
                  label="Mot de passe"
                  type={passwordViewed ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  before={<Lock className="w-4 h-4" />}
                  after={
                    <button
                      type="button"
                      onClick={() => setPasswordViewed((prev) => !prev)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      {passwordViewed ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              )}
            />

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Accéder au panel"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <Link
              href="/auth/signin"
              className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
            >
              Retour à l&apos;espace utilisateur
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
