"use client";

import { Button } from "@/components/atoms/button";
import { MUIInput } from "@/components/atoms/input";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { authProvider } from "@/api/auth";
import { toast } from "react-toastify";
import { Storage, StorageKeys } from "@/api/auth/storage";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Mail, Key, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

interface IEmailForm { email: string }
interface ICodeForm { resetCode: string }
interface IResetPasswordForm { newPassword: string; confirmPassword: string }
type Step = "email" | "code" | "reset";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState(false); const [cpw, setCpw] = useState(false);
  const [tokens, setTokens] = useState<{ access: string; refresh: string } | null>(null);
  const router = useRouter(); const { user } = useAuthStore();
  useEffect(() => { if (user && Storage.getItem(StorageKeys.access)) router.replace("/admin/dashboard"); }, [user, router]);

  const { handleSubmit: hEmail, control: cEmail } = useForm<IEmailForm>({ defaultValues: { email: "" } });
  const { handleSubmit: hCode, control: cCode } = useForm<ICodeForm>({ defaultValues: { resetCode: "" } });
  const { handleSubmit: hReset, control: cReset, watch } = useForm<IResetPasswordForm>({ defaultValues: { newPassword: "", confirmPassword: "" } });

  const onEmail: SubmitHandler<IEmailForm> = async (fd) => {
    setLoading(true); const { data, error } = await authProvider.forgotPassword(fd.email);
    if (data) { toast.success("Code envoye par email"); setEmail(fd.email); setStep("code"); } else toast.error(error || "Erreur");
    setLoading(false);
  };
  const onCode: SubmitHandler<ICodeForm> = async (fd) => {
    setLoading(true); const { data, error } = await authProvider.validateResetCode(email, fd.resetCode);
    if (data) { toast.success("Code valide"); const t = (data as any)?.Tokens; if (t?.access) setTokens({ access: t.access, refresh: t.refresh ?? "" }); setStep("reset"); }
    else toast.error(error || "Code invalide"); setLoading(false);
  };
  const onReset: SubmitHandler<IResetPasswordForm> = async (fd) => {
    if (fd.newPassword !== fd.confirmPassword) return toast.error("Les mots de passe ne correspondent pas");
    if (fd.newPassword.length < 8) return toast.error("Minimum 8 caracteres");
    if (!tokens) return toast.error("Tokens manquants");
    setLoading(true); const { data, error } = await authProvider.resetPassword(fd.newPassword, tokens.access);
    if (data) { toast.success("Mot de passe reinitialise"); router.push("/auth/signin"); } else toast.error(error || "Erreur");
    setLoading(false);
  };

  const titles: Record<Step, string> = { email: "Mot de passe oublie", code: "Code de verification", reset: "Nouveau mot de passe" };
  const descs: Record<Step, string> = { email: "Recevez un code par email", code: `Code envoye a ${email}`, reset: "Choisissez un nouveau mot de passe" };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 justify-center">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M2 24L8 6L14 24L20 6L26 24" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 24L14 12L20 24" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
            </svg>
            <span className="text-lg font-bold text-slate-900">MIDAAS</span>
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {step !== "email" ? <button onClick={() => setStep(step === "code" ? "email" : "code")} className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 text-slate-400"><ArrowLeft className="w-4 h-4" /></button> : <div className="w-9" />}
              <h1 className="text-lg font-bold text-slate-900">{titles[step]}</h1>
              <div className="w-9" />
            </div>
            <p className="text-sm text-slate-400 mt-2 text-center">{descs[step]}</p>
          </div>

          {step === "email" && (
            <form onSubmit={hEmail(onEmail)} className="space-y-5">
              <Controller name="email" control={cEmail} rules={{ required: true, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Email invalide" } }}
                render={({ field }) => <MUIInput {...field} label="Email" type="email" placeholder="vous@exemple.com" before={<Mail className="w-4 h-4" />} />} />
              <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/25" disabled={loading}>{loading ? "Envoi..." : "Envoyer le code"}</Button>
            </form>
          )}
          {step === "code" && (
            <form onSubmit={hCode(onCode)} className="space-y-5">
              <Controller name="resetCode" control={cCode} rules={{ required: true, minLength: 4 }}
                render={({ field }) => <MUIInput {...field} label="Code de verification" placeholder="0000" before={<Key className="w-4 h-4" />} />} />
              <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/25" disabled={loading}>{loading ? "Verification..." : "Verifier le code"}</Button>
            </form>
          )}
          {step === "reset" && (
            <form onSubmit={hReset(onReset)} className="space-y-5">
              <Controller name="newPassword" control={cReset} rules={{ required: true, minLength: 8 }}
                render={({ field }) => (
                  <MUIInput {...field} label="Nouveau mot de passe" type={pw ? "text" : "password"} placeholder="Minimum 8 caracteres"
                    before={<Lock className="w-4 h-4" />}
                    after={<button type="button" onClick={() => setPw((p) => !p)} className="text-slate-400 hover:text-slate-600">{pw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />)} />
              <Controller name="confirmPassword" control={cReset} rules={{ required: true, validate: (v) => v === watch("newPassword") || "Ne correspondent pas" }}
                render={({ field }) => (
                  <MUIInput {...field} label="Confirmer" type={cpw ? "text" : "password"} placeholder="Repetez le mot de passe"
                    before={<Lock className="w-4 h-4" />}
                    after={<button type="button" onClick={() => setCpw((p) => !p)} className="text-slate-400 hover:text-slate-600">{cpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />)} />
              <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/25" disabled={loading}>{loading ? "Reinitialisation..." : "Reinitialiser"}</Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link href="/auth/signin" className="text-xs text-primary hover:underline font-medium">Retour a la connexion</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
