"use client";

import { Button } from "@/components/atoms/button";
import { MUIInput } from "@/components/atoms/input";
import Image from "next/image";
import vector from "@/assets/images/Vector.svg";
import illustration from "@/assets/images/amico.svg";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { authProvider } from "@/api/auth";
import { toast } from "react-toastify";
import { Storage, StorageKeys } from "@/api/auth/storage";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface IEmailForm {
  email: string;
}

interface ICodeForm {
  resetCode: string;
}

interface IResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

type Step = "email" | "code" | "reset";

export default function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordViewed, setPasswordViewed] = useState(false);
  const [confirmPasswordViewed, setConfirmPasswordViewed] = useState(false);
  const [resetTokens, setResetTokens] = useState<{
    access: string;
    refresh: string;
  } | null>(null);

  const router = useRouter();

  const { user } = useAuthStore();

  useEffect(() => {
    const access = Storage.getItem(StorageKeys.access);
    const refresh = Storage.getItem(StorageKeys.refresh);

    if (user && access && refresh) {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  // Form for email step
  const {
    handleSubmit: handleEmailSubmit,
    control: emailControl,
    reset: resetEmailForm,
  } = useForm<IEmailForm>({
    defaultValues: {
      email: "",
    },
  });

  // Form for code step
  const {
    handleSubmit: handleCodeSubmit,
    control: codeControl,
    reset: resetCodeForm,
  } = useForm<ICodeForm>({
    defaultValues: {
      resetCode: "",
    },
  });

  // Form for password reset step
  const {
    handleSubmit: handleResetSubmit,
    control: resetControl,
    reset: resetPasswordForm,
    watch,
  } = useForm<IResetPasswordForm>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchNewPassword = watch("newPassword");

  // Step 1: Send email for reset code
  const onEmailSubmit: SubmitHandler<IEmailForm> = async (formData) => {
    setLoading(true);

    const { data, error } = await authProvider.forgotPassword(formData.email);

    if (data) {
      toast.success("Code de réinitialisation envoyé par email");
      setEmail(formData.email);
      setCurrentStep("code");
    } else {
      toast.error(error || "Une erreur s'est produite");
    }

    setLoading(false);
  };

  // Step 2: Validate reset code
  const onCodeSubmit: SubmitHandler<ICodeForm> = async (formData) => {
    setLoading(true);

    const { data, error } = await authProvider.validateResetCode(
      email,
      formData.resetCode,
    );

    if (data) {
      toast.success("Code validé avec succès");

      // Save the tokens for the password reset step
      if (
        "Tokens" in data &&
        data.Tokens &&
        typeof data.Tokens === "object" &&
        "access" in data.Tokens &&
        "refresh" in data.Tokens
      ) {
        setResetTokens({
          access: data.Tokens.access as string,
          refresh: data.Tokens.refresh as string,
        });
      }

      setCurrentStep("reset");
    } else {
      toast.error(error || "Code invalide");
    }

    setLoading(false);
  };

  // Step 3: Reset password
  const onResetSubmit: SubmitHandler<IResetPasswordForm> = async (formData) => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (!resetTokens) {
      toast.error("Tokens de réinitialisation manquants");
      return;
    }

    setLoading(true);

    const { data, error } = await authProvider.resetPassword(
      formData.newPassword,
      resetTokens.access,
    );

    if (data) {
      toast.success("Mot de passe réinitialisé avec succès");
      resetPasswordForm();
      router.push("/auth/signin");
    } else {
      toast.error(error || "Une erreur s'est produite");
    }

    setLoading(false);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "MOT DE PASSE OUBLIÉ";
      case "code":
        return "CODE DE VÉRIFICATION";
      case "reset":
        return "NOUVEAU MOT DE PASSE";
      default:
        return "MOT DE PASSE OUBLIÉ";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "email":
        return "Entrez votre adresse email pour recevoir un code de réinitialisation";
      case "code":
        return "Entrez le code de vérification reçu par email";
      case "reset":
        return "Entrez votre nouveau mot de passe";
      default:
        return "";
    }
  };

  const goBack = () => {
    if (currentStep === "code") {
      setCurrentStep("email");
    } else if (currentStep === "reset") {
      setCurrentStep("code");
    }
  };

  return (
    <section className="w-screen h-screen p-4 flex items-center overflow-auto">
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center">
        <div className="mt-[100px] max-w-[430px] w-full px-10 pb-[100px] lg:pb-0">
          <h1 className="text-3xl font-MontserratSemiBold text-center">
            {getStepTitle()}
          </h1>

          <Image
            src="/logo.png"
            alt="Midaas logo"
            width={227}
            height={56}
            className="mx-auto mb-6"
          />

          <p className="text-gray-600 text-center mb-6">
            {getStepDescription()}
          </p>

          {/* Step 1: Email Form */}
          {currentStep === "email" && (
            <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
              <Controller
                name="email"
                control={emailControl}
                rules={{
                  required: "L'email est requis",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format d'email invalide",
                  },
                }}
                render={({ field, fieldState }) => (
                  <MUIInput
                    className="w-full my-4"
                    label="Email"
                    type="email"
                    after={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-4"
                      >
                        <path
                          d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                          stroke="#555"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                    {...field}
                  />
                )}
              />

              <Button
                className="w-full h-10 rounded-lg mt-8"
                type="submit"
                disabled={loading}
              >
                {loading ? "Envoi en cours..." : "Envoyer le code"}
              </Button>
            </form>
          )}

          {/* Step 2: Code Verification Form */}
          {currentStep === "code" && (
            <form onSubmit={handleCodeSubmit(onCodeSubmit)}>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Code envoyé à: <strong>{email}</strong>
                </p>
              </div>

              <Controller
                name="resetCode"
                control={codeControl}
                rules={{
                  required: "Le code est requis",
                  minLength: {
                    value: 4,
                    message: "Le code doit contenir au moins 4 caractères",
                  },
                }}
                render={({ field, fieldState }) => (
                  <MUIInput
                    className="w-full my-4"
                    label="Code de vérification"
                    type="text"
                    after={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-4"
                      >
                        <path
                          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="#555"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                    {...field}
                  />
                )}
              />

              <Button
                className="w-full h-10 rounded-lg mt-8"
                type="submit"
                disabled={loading}
              >
                {loading ? "Vérification..." : "Vérifier le code"}
              </Button>

              <button
                type="button"
                onClick={goBack}
                className="w-full mt-4 text-primary text-sm hover:underline"
              >
                ← Changer d&apos;adresse email
              </button>
            </form>
          )}

          {/* Step 3: Password Reset Form */}
          {currentStep === "reset" && (
            <form onSubmit={handleResetSubmit(onResetSubmit)}>
              <Controller
                name="newPassword"
                control={resetControl}
                rules={{
                  required: "Le mot de passe est requis",
                  minLength: {
                    value: 8,
                    message:
                      "Le mot de passe doit contenir au moins 8 caractères",
                  },
                }}
                render={({ field, fieldState }) => (
                  <MUIInput
                    className="w-full my-4"
                    label="Nouveau mot de passe"
                    type={passwordViewed ? "text" : "password"}
                    after={
                      <div
                        className="mr-4 cursor-pointer"
                        onClick={() => setPasswordViewed((prev) => !prev)}
                      >
                        {passwordViewed ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                              stroke="black"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z"
                              stroke="black"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 3L6.58916 6.58916M21 21L17.4112 17.4112M13.8749 18.8246C13.2677 18.9398 12.6411 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12C2.80515 10.8955 3.33851 9.87361 4.02143 8.97118M9.87868 9.87868C10.4216 9.33579 11.1716 9 12 9C13.6569 9 15 10.3431 15 12C15 12.8284 14.6642 13.5784 14.1213 14.1213M9.87868 9.87868L14.1213 14.1213M9.87868 9.87868L6.58916 6.58916M14.1213 14.1213L6.58916 6.58916M14.1213 14.1213L17.4112 17.4112M6.58916 6.58916C8.14898 5.58354 10.0066 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.8357 14.2507 19.3545 16.1585 17.4112 17.4112"
                              stroke="black"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    }
                    {...field}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={resetControl}
                rules={{
                  required: "Confirmez votre mot de passe",
                  validate: (value) =>
                    value === watchNewPassword ||
                    "Les mots de passe ne correspondent pas",
                }}
                render={({ field, fieldState }) => (
                  <MUIInput
                    className="w-full my-4"
                    label="Confirmer le mot de passe"
                    type={confirmPasswordViewed ? "text" : "password"}
                    after={
                      <div
                        className="mr-4 cursor-pointer"
                        onClick={() =>
                          setConfirmPasswordViewed((prev) => !prev)
                        }
                      >
                        {confirmPasswordViewed ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                              stroke="black"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z"
                              stroke="black"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 3L6.58916 6.58916M21 21L17.4112 17.4112M13.8749 18.8246C13.2677 18.9398 12.6411 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12C2.80515 10.8955 3.33851 9.87361 4.02143 8.97118M9.87868 9.87868C10.4216 9.33579 11.1716 9 12 9C13.6569 9 15 10.3431 15 12C15 12.8284 14.6642 13.5784 14.1213 14.1213M9.87868 9.87868L14.1213 14.1213M9.87868 9.87868L6.58916 6.58916M14.1213 14.1213L6.58916 6.58916M14.1213 14.1213L17.4112 17.4112M6.58916 6.58916C8.14898 5.58354 10.0066 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.8357 14.2507 19.3545 16.1585 17.4112 17.4112"
                              stroke="black"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    }
                    {...field}
                  />
                )}
              />

              <Button
                className="w-full h-10 rounded-lg mt-8"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Réinitialisation..."
                  : "Réinitialiser le mot de passe"}
              </Button>

              <button
                type="button"
                onClick={goBack}
                className="w-full mt-4 text-primary text-sm hover:underline"
              >
                ← Retour au code
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <Link href="/auth/signin">
              <span className="text-primary text-sm cursor-pointer hover:underline">
                Retour à la connexion
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden lg:flex w-1/2 h-full bg-primary rounded-2xl">
        <Image
          src={illustration}
          alt="Illustration"
          objectFit="cover"
          width={400}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        />

        <Image
          src={vector}
          alt="Vector"
          objectFit="cover"
          width={1000}
          className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </section>
  );
}
