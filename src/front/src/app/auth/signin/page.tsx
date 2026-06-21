"use client";

import { Button } from "@/components/atoms/button";
import { MUIInput } from "@/components/atoms/input";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { authProvider } from "@/api/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Storage, StorageKeys } from "@/api/auth/storage";
import { Mail, Lock, Eye, EyeOff, TrendingUp, Check } from "lucide-react";

interface ISigninForm { email: string; password: string }

export default function AuthSignin() {
  const { handleSubmit, control, reset } = useForm<ISigninForm>({ defaultValues: { email: "", password: "" } });
  const router = useRouter(); const { user } = useAuthStore();
  useEffect(() => { if (user && Storage.getItem(StorageKeys.access)) router.replace("/admin/dashboard"); }, [user, router]);
  const [loading, setLoading] = useState(false); const [pw, setPw] = useState(false);

  const onSubmit: SubmitHandler<ISigninForm> = async (fd) => {
    setLoading(true);
    const { data, error } = await authProvider.login(fd);
    if (data && !error) { toast.success("Connexion reussie"); reset(); router.push("/admin/dashboard"); }
    else toast.error(error || "Une erreur est survenue");
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex animate-fade-in">
      {/* LEFT — Black panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#0A0A0A] relative overflow-hidden flex-col justify-between p-12 animate-slide-in-left">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M2 24L8 6L14 24L20 6L26 24" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 24L14 12L20 24" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
            </svg>
            <span className="text-lg font-bold text-white">MIDAAS</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Investissez dans<br />
            <span className="text-primary italic font-light">l&apos;avenir</span> de l&apos;Afrique
          </h2>
          <p className="text-white/30 text-sm leading-relaxed">
            Decouvrez des entreprises verifiees, suivez chaque etape de financement et
            recevez vos retours sur investissement en toute transparence.
          </p>
          <div className="mt-10 space-y-3">
            {["Investissement securise par escrow", "Suivi transparent de chaque projet", "Audit humain de chaque jalon"].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/40">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-primary" /></div>
                {t}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/10">© {new Date().getFullYear()} Midaas</p>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* RIGHT — Form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16 bg-white animate-slide-in-right">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden text-center">
            <Link href="/" className="flex items-center gap-2.5 justify-center">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M2 24L8 6L14 24L20 6L26 24" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 24L14 12L20 24" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/></svg>
              <span className="text-lg font-bold text-black">MIDAAS</span>
            </Link>
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-black">Bon retour</h1>
            <p className="text-black/40 text-sm mt-1">Connectez-vous a votre compte</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Controller name="email" control={control} rules={{ required: true }}
              render={({ field }) => <MUIInput {...field} label="Adresse email" type="email" placeholder="vous@exemple.com" before={<Mail className="w-4 h-4" />} />} />
            <Controller name="password" control={control} rules={{ required: true }}
              render={({ field }) => (
                <MUIInput {...field} label="Mot de passe" type={pw ? "text" : "password"} placeholder="Votre mot de passe"
                  before={<Lock className="w-4 h-4" />}
                  after={<button type="button" onClick={() => setPw((p) => !p)} className="text-black/20 hover:text-black/50">{pw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />)} />
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-sm text-black/40 cursor-pointer"><input type="checkbox" className="rounded border-black/10 accent-primary" /> Se souvenir</label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline font-medium">Mot de passe oublie ?</Link>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/25 py-3" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</Button>
          </form>
          <p className="mt-8 text-center text-sm text-black/40">Pas encore de compte ? <Link href="/auth/signup" className="text-primary font-semibold hover:underline">Creer un compte</Link></p>
          <div className="mt-8 pt-8 border-t border-black/5"><Link href="/auth/admin" className="text-xs text-black/20 hover:text-black/40">Acces administrateur</Link></div>
        </div>
      </div>
    </main>
  );
}
