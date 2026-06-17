"use client";

import { parrainProvider } from "@/api/parrains";
import { Button } from "@/components/atoms/button";
import { MUIInput } from "@/components/atoms/input";
import { useParrainsStore } from "@/store/parrains";
import { useModalStore } from "@/store/modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { DialogTitle } from "../../modal";

type IAddParrainForm = {
  userReference: string;
};

export default function AddParrainModal() {
  const { toggle } = useModalStore();
  const { addParrain } = useParrainsStore();

  const { handleSubmit, reset, control, getValues } = useForm<IAddParrainForm>({
    defaultValues: {
      userReference: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const isFormVerified = () => {
    const { userReference } = getValues();
    return Boolean(userReference?.trim());
  };

  const onSubmit: SubmitHandler<IAddParrainForm> = async (formData) => {
    setLoading(true);

    const normalizedReference = formData.userReference.trim();
    const { data, error } = await parrainProvider.create({
      userReference: normalizedReference,
    });

    if (data) {
      const { data: parrains } = await parrainProvider.getAll();

      if (parrains?.length) {
        const createdParrain =
          parrains.find(
            (parrain) => parrain.userReference === normalizedReference,
          ) ?? parrains[0];

        if (createdParrain) {
          addParrain(createdParrain);
        }
      }

      toast.success(data.message || "Parrain créé avec succès");
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
        <DialogTitle>Ajouter un parrain</DialogTitle>

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
            name="userReference"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <MUIInput
                {...field}
                label="Référence utilisateur"
                className="pl-4"
                after={
                  <div className="pr-4">
                    <svg
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 2.75C7.13604 2.75 5.625 4.26104 5.625 6.125C5.625 7.98896 7.13604 9.5 9 9.5C10.864 9.5 12.375 7.98896 12.375 6.125C12.375 4.26104 10.864 2.75 9 2.75ZM3.75 15.5C3.75 13.636 6.10051 12.125 9 12.125C11.8995 12.125 14.25 13.636 14.25 15.5"
                        stroke="#9C9FA4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                }
              />
            )}
          />
        </div>

        <div className="mt-8 w-full">
          <Button
            type="submit"
            className="h-12 w-full"
            disabled={!isFormVerified() || loading}
          >
            {loading ? "Chargement..." : "Ajouter un parrain"}
          </Button>
        </div>
      </form>
    </section>
  );
}
