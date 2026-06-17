"use client";

import { filleulProvider } from "@/api/filleuls";
import { Button } from "@/components/atoms/button";
import { MUIInput } from "@/components/atoms/input";
import { useFilleulsStore } from "@/store/filleuls";
import { useModalStore } from "@/store/modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { DialogTitle } from "../../modal";

type IAddFilleulForm = {
  userFilleulReference: string;
  codeParrainage: string;
};

export default function AddFilleulModal() {
  const { toggle } = useModalStore();
  const { addFilleul } = useFilleulsStore();

  const { handleSubmit, reset, control, getValues } = useForm<IAddFilleulForm>({
    defaultValues: {
      userFilleulReference: "",
      codeParrainage: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const isFormVerified = () => {
    const { userFilleulReference, codeParrainage } = getValues();
    return Boolean(userFilleulReference?.trim() && codeParrainage?.trim());
  };

  const onSubmit: SubmitHandler<IAddFilleulForm> = async (formData) => {
    setLoading(true);

    const normalizedReference = formData.userFilleulReference.trim();
    const normalizedCode = formData.codeParrainage.trim();

    const { data, error } = await filleulProvider.create({
      userFilleulReference: normalizedReference,
      codeParrainage: normalizedCode,
    });

    if (data) {
      const { data: filleuls } = await filleulProvider.getAll();

      if (filleuls?.length) {
        const createdFilleul =
          filleuls.find(
            (filleul) =>
              filleul.userFilleulReference === normalizedReference &&
              filleul.codeParrainage === normalizedCode,
          ) ?? filleuls[0];

        if (createdFilleul) {
          addFilleul(createdFilleul);
        }
      }

      toast.success(data.message || "Filleul créé avec succès");
      reset();
      toggle();
    } else {
      toast.error(error);
    }

    setLoading(false);
  };

  return (
    <section className="w-full p-8">
      <div className="w-full flex items-center justify-between">
        <DialogTitle>Ajouter un filleul</DialogTitle>

        <span
          onClick={() => toggle()}
          className="w-8 h-8 flex items-center justify-center border border-primary/30 rounded-full cursor-pointer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-primary"
          >
            <path
              d="M6 18L18 6M6 6L18 18"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-0"
      >
        <div className="mt-2">
          <Controller
            name="userFilleulReference"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <MUIInput {...field} label="Référence filleul" className="pl-4" />
            )}
          />
        </div>

        <div className="mt-2">
          <Controller
            name="codeParrainage"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <MUIInput {...field} label="Code parrainage" className="pl-4" />
            )}
          />
        </div>

        <div className="mt-8 w-full">
          <Button
            type="submit"
            className="h-12 w-full"
            disabled={!isFormVerified() || loading}
          >
            {loading ? "Chargement..." : "Ajouter un filleul"}
          </Button>
        </div>
      </form>
    </section>
  );
}
