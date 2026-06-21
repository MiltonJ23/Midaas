"use client";

import { Button } from "@/components/atoms/button";
import { MUIInput } from "@/components/atoms/input";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { authProvider } from "@/api/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Storage, StorageKeys } from "@/api/auth/storage";
import { useAuthStore } from "@/store/auth";
import { User, Mail, Lock, Phone, CircleDollarSign, ArrowLeft, Eye, EyeOff, Upload } from "lucide-react";

interface ISignupForm {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  idCardNumber: string;
  idCardFront: FileList | null;
  idCardBack: FileList | null;
}

export default function Home() {
  const { handleSubmit, control, reset, register } = useForm<ISignupForm>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      idCardNumber: "",
      idCardFront: null,
      idCardBack: null,
    },
  });

  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const access = Storage.getItem(StorageKeys.access);
    const refresh = Storage.getItem(StorageKeys.refresh);
    if (user && access && refresh) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const [loading, setLoading] = useState(false);
  const [passwordViewed, setPasswordViewed] = useState(false);

  const onSubmit: SubmitHandler<ISignupForm> = async (formData) => {
    setLoading(true);
    try {
      let idCardFrontUrl = "";
      let idCardBackUrl = "";
      const hasFront = formData.idCardFront && formData.idCardFront.length > 0;
      const hasBack = formData.idCardBack && formData.idCardBack.length > 0;

      if (hasFront || hasBack) {
        const uploadFormData = new FormData();
        if (hasFront) uploadFormData.append("front", formData.idCardFront![0]);
        if (hasBack) uploadFormData.append("back", formData.idCardBack![0]);
        const { data: uploadResult } =
          await authProvider.uploadIdCard(uploadFormData);
        if (uploadResult) {
          idCardFrontUrl = uploadResult.front_url ?? "";
          idCardBackUrl = uploadResult.back_url ?? "";
        }
      }

      const backendPayload = {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber || undefined,
        id_card_number: formData.idCardNumber || undefined,
        id_card_url: idCardFrontUrl || undefined,
      };

      const { data, error } = await authProvider.signup(backendPayload);

      if (data && !error) {
        toast.success("Inscription réussie");
        reset();
        router.push("/auth/signin");
      } else {
        toast.error(error || "Une erreur est survenue");
      }
    } catch {
      toast.error("Erreur de communication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
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
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <Link
                href="/auth/signin"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 text-slate-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-xl font-bold text-slate-900">Inscription</h1>
              <div className="w-9" />
            </div>
            <p className="text-sm text-slate-500 mt-2 text-center">
              Créez votre compte investisseur Midaas
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: "Le nom complet est requis" }}
              render={({ field }) => (
                <MUIInput
                  label="Nom complet"
                  placeholder="Votre nom et prénom"
                  before={<User className="w-4 h-4" />}
                  {...field}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email invalide",
                },
              }}
              render={({ field }) => (
                <MUIInput
                  label="Email"
                  type="email"
                  placeholder="vous@exemple.com"
                  before={<Mail className="w-4 h-4" />}
                  {...field}
                />
              )}
            />

            <Controller
              name="phoneNumber"
              control={control}
              rules={{ required: "Le téléphone est requis" }}
              render={({ field }) => (
                <MUIInput
                  label="Téléphone"
                  placeholder="+225 XX XX XX XX"
                  before={<Phone className="w-4 h-4" />}
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Le mot de passe est requis",
                minLength: { value: 6, message: "Minimum 6 caractères" },
              }}
              render={({ field }) => (
                <MUIInput
                  label="Mot de passe"
                  type={passwordViewed ? "text" : "password"}
                  placeholder="Minimum 6 caractères"
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
                  {...field}
                />
              )}
            />

            <hr className="border-slate-200" />

            {/* KYC Section */}
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-4">
                Pièce d&apos;identité (CNI ou Récépissé)
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Recto (face avant)
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    {...register("idCardFront")}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Verso (face arrière) — optionnel
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    {...register("idCardBack")}
                  />
                </div>
              </div>
            </div>

            <Controller
              name="idCardNumber"
              control={control}
              rules={{ required: "Le numéro de pièce est requis" }}
              render={({ field }) => (
                <MUIInput
                  label="Numéro de la pièce d'identité"
                  placeholder="Ex: 1234567890"
                  before={<CircleDollarSign className="w-4 h-4" />}
                  {...field}
                />
              )}
            />

            <Button
              className="w-full"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "Inscription..." : "Créer mon compte"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Déjà un compte ?{" "}
          <Link href="/auth/signin" className="text-primary font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
