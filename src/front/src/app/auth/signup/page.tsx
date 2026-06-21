"use client";

import { Button } from "@/components/atoms/button";
import { MUIInput } from "@/components/atoms/input";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { authProvider } from "@/api/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Storage, StorageKeys } from "@/api/auth/storage";
import { useAuthStore } from "@/store/auth";
import { User, Mail, Lock, Phone, CircleDollarSign, ArrowLeft, Eye, EyeOff, Sparkles, Check, Globe } from "lucide-react";

interface ISignupForm {
  fullName: string; email: string; password: string; phoneNumber: string;
  idCardNumber: string; idCardFront: FileList | null; idCardBack: FileList | null;
}

export default function Signup() {
  const { handleSubmit, control, reset, register } = useForm<ISignupForm>({
    defaultValues: { fullName: "", email: "", password: "", phoneNumber: "", idCardNumber: "", idCardFront: null, idCardBack: null },
  });
  const router = useRouter(); const { user } = useAuthStore();
  useEffect(() => { if (user && Storage.getItem(StorageKeys.access)) router.replace("/dashboard"); }, [user, router]);
  const [loading, setLoading] = useState(false); const [pw, setPw] = useState(false);

  const onSubmit: SubmitHandler<ISignupForm> = async (fd) => {
    setLoading(true);
    try {
      let fu = "", bu = "";
      if (fd.idCardFront?.[0] || fd.idCardBack?.[0]) { const f = new FormData(); if (fd.idCardFront?.[0]) f.append("front", fd.idCardFront[0]); if (fd.idCardBack?.[0]) f.append("back", fd.idCardBack[0]); const { data: up } = await authProvider.uploadIdCard(f); if (up) { fu = up.front_url ?? ""; bu = up.back_url ?? ""; } }
      const { data, error } = await authProvider.signup({ email: fd.email, password: fd.password, full_name: fd.fullName, phone_number: fd.phoneNumber || undefined, id_card_number: fd.idCardNumber || undefined, id_card_url: fu || undefined });
      if (data && !error) { toast.success("Inscription reussie !"); reset(); router.push("/auth/signin"); } else toast.error(error || "Erreur");
    } catch { toast.error("Erreur de communication"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex animate-fade-in">
      {/* LEFT — Form (swapped from signin) */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-12 bg-white overflow-y-auto order-1 lg:order-1 animate-slide-in-left">
        <div className="w-full max-w-md my-auto">
          <div className="mb-8 lg:hidden text-center">
            <Link href="/" className="flex items-center gap-2.5 justify-center">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M2 24L8 6L14 24L20 6L26 24" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 24L14 12L20 24" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/></svg>
              <span className="text-lg font-bold text-black">MIDAAS</span>
            </Link>
          </div>
          <div className="flex items-center justify-between mb-8">
            <Link href="/auth/signin" className="w-9 h-9 flex items-center justify-center rounded-full border border-black/10 hover:bg-black/5 text-black/30 transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
            <div><h1 className="text-2xl font-bold text-black">Creer un compte</h1><p className="text-black/40 text-sm mt-1">Rejoignez la plateforme</p></div>
            <div className="w-9" />
          </div>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Controller name="fullName" control={control} rules={{ required: true }} render={({ field }) => <MUIInput label="Nom complet" placeholder="Votre nom" before={<User className="w-4 h-4" />} {...field} />} />
              <Controller name="email" control={control} rules={{ required: true, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Email invalide" } }} render={({ field }) => <MUIInput label="Email" type="email" placeholder="vous@exemple.com" before={<Mail className="w-4 h-4" />} {...field} />} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Controller name="phoneNumber" control={control} rules={{ required: true }} render={({ field }) => <MUIInput label="Telephone" placeholder="+225 XX XX XX XX" before={<Phone className="w-4 h-4" />} {...field} />} />
              <Controller name="password" control={control} rules={{ required: true, minLength: 6 }}
                render={({ field }) => (
                  <MUIInput label="Mot de passe" type={pw ? "text" : "password"} placeholder="Minimum 6 caracteres"
                    before={<Lock className="w-4 h-4" />}
                    after={<button type="button" onClick={() => setPw((p) => !p)} className="text-black/20 hover:text-black/50">{pw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} {...field} />)} />
            </div>
            <hr className="border-black/5" />
            <div>
              <p className="text-sm font-semibold text-black mb-4">Piece d&apos;identite (CNI ou Recepisse)</p>
              <div className="space-y-4">
                <div><label className="text-xs text-black/30 mb-1.5 block">Recto (face avant)</label><input type="file" accept="image/*,application/pdf" className="w-full text-sm text-black/40 border border-black/10 rounded-lg p-2.5 bg-white cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-black/5 file:text-black/60" {...register("idCardFront")} /></div>
                <div><label className="text-xs text-black/30 mb-1.5 block">Verso (face arriere) — optionnel</label><input type="file" accept="image/*,application/pdf" className="w-full text-sm text-black/40 border border-black/10 rounded-lg p-2.5 bg-white cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-black/5 file:text-black/60" {...register("idCardBack")} /></div>
              </div>
            </div>
            <Controller name="idCardNumber" control={control} rules={{ required: true }} render={({ field }) => <MUIInput label="Numero de la piece" placeholder="Ex: 1234567890" before={<CircleDollarSign className="w-4 h-4" />} {...field} />} />
            <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/25 py-3" disabled={loading}>{loading ? "Inscription..." : "Creer mon compte"}</Button>
          </form>
          <p className="mt-8 text-center text-sm text-black/40">Deja un compte ? <Link href="/auth/signin" className="text-primary font-semibold hover:underline">Se connecter</Link></p>
        </div>
      </div>

      {/* RIGHT — Black panel (swapped from signin) */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#0A0A0A] relative overflow-hidden flex-col justify-between p-12 order-2 animate-slide-in-right">
        <div className="flex justify-end">
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M2 24L8 6L14 24L20 6L26 24" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 24L14 12L20 24" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/></svg>
            <span className="text-lg font-bold text-white">MIDAAS</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Investissez dans<br />
            <span className="text-primary italic font-light">20 pays</span> africains
          </h2>
          <p className="text-white/30 text-sm leading-relaxed">
            Avec Midaas, investissez directement dans des entreprises locales
            sans passer par les bourses regionales. Pas d&apos;intermediaire, pas de
            frais caches. Votre capital travaille la ou l&apos;impact est reel.
          </p>

          <div className="mt-10 space-y-3">
            {[
              "Cote d'Ivoire, Cameroun, Senegal, Nigeria...",
              "Pas de BRVM, pas de BVMAC, pas de frais de courtage",
              "Investissement direct en Mobile Money",
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/40">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-primary" /></div>
                {t}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/10 text-right">© {new Date().getFullYear()} Midaas</p>
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>
    </main>
  );
}
