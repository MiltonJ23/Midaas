"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { MUIInput } from "@/components/atoms/input";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { authProvider } from "@/api/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Storage, StorageKeys } from "@/api/auth/storage";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface ISigninForm {
  email: string;
  password: string;
}

export default function AuthSignin() {
  const { handleSubmit, control, reset } = useForm<ISigninForm>({
    defaultValues: { email: "", password: "" },
  });
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const access = Storage.getItem(StorageKeys.access);
    const refresh = Storage.getItem(StorageKeys.refresh);
    if (user && access && refresh) {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  const [loading, setLoading] = useState(false);
  const [passwordViewed, setPasswordViewed] = useState(false);

  const onSubmit: SubmitHandler<ISigninForm> = async (formData) => {
    setLoading(true);
    const { data, error } = await authProvider.login(formData);
    if (data && !error) {
      toast.success("Connexion réussie");
      reset();
      router.push("/admin/dashboard");
    } else {
      toast.error(error || "Une erreur est survenue");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Midaas"
              width={130}
              height={40}
              className="mx-auto object-contain"
            />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-slate-900">Connexion</h1>
            <p className="text-sm text-slate-500 mt-1">
              Accédez à votre espace Midaas
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
                  placeholder="vous@exemple.com"
                  before={<Mail className="w-4 h-4" />}
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
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {passwordViewed ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                />
              )}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                Se souvenir
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              className="w-full"
              type="submit"
              disabled={loading}
              size="lg"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Pas encore de compte ?{" "}
            <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          <Link href="/auth/admin" className="hover:text-slate-600">
            Accès administrateur
          </Link>
        </p>
      </div>
    </main>
  );
}
