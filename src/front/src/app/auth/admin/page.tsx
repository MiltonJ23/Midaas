"use client";

import { Button } from "@/components/atoms/button";
import { MUIInput } from "@/components/atoms/input";
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
  const [pw, setPw] = useState(false);

  useEffect(() => {
    const token = Storage.getItem(AdminStorageKeys.adminAccess);
    if (admin && token) {
      router.replace("/admin/dashboard");
    }
  }, [admin, router]);

  const onSubmit: SubmitHandler<IAdminSigninForm> = async (fd) => {
    setLoading(true);
    const { data, error } = await adminProvider.login(fd);
    if (data && !error) {
      loadAdmin(data.admin);
      loadUser(
        new User({
          id: data.admin.id,
          email: data.admin.email,
          name: data.admin.full_name,
          validationStatus: "verified",
          role: "admin",
        })
      );
      if (data.token) Storage.setItem(StorageKeys.access, data.token);
      toast.success("Connexion reussie");
      reset();
      router.push("/admin/dashboard");
    } else {
      toast.error(error || "Email ou mot de passe invalide");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary" />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <span className="text-lg font-bold text-white">MIDAAS</span>
          </div>
          <div className="text-center mb-8">
            <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">Administration</p>
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
                  type={pw ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  before={<Lock className="w-4 h-4" />}
                  after={
                    <button
                      type="button"
                      onClick={() => setPw((p) => !p)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      {pw ? (
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
              disabled={loading}
            >
              {loading ? "Connexion..." : "Acceder au panel"}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <Link
              href="/auth/signin"
              className="text-xs text-slate-500 hover:text-slate-400"
            >
              Retour a l&apos;espace utilisateur
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
