"use client";

import { useModalStore } from "@/store/modal";
import { MUIInput, MUITextarea } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { DialogTitle } from "../../modal";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { campaignProvider } from "@/api/campaigns";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { DatePicker } from "@/components/molecules/date-picker";

type IMilestoneForm = {
  title: string;
  description: string;
  fundAllocation: string;
  dueDate: Date;
};

export default function AddMilestoneModal() {
  const { toggle, data } = useModalStore();
  const projectId = data?.projectId as string;

  const { handleSubmit, control, reset, getValues } = useForm<IMilestoneForm>({
    defaultValues: {
      title: "",
      description: "",
      fundAllocation: "",
      dueDate: new Date(),
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<IMilestoneForm> = async (value) => {
    if (!projectId) {
      toast.error("Erreur: projet non identifié");
      return;
    }

    setLoading(true);

    const payload = {
      title: value.title,
      description: value.description,
      order_num: 0, // Will be set by backend
      fund_allocation: parseFloat(value.fundAllocation),
      due_date: value.dueDate.toISOString().split("T")[0],
    };

    const { data: responseData, error } =
      await campaignProvider.createMilestone(projectId, payload);

    if (responseData?.milestone) {
      toast.success("Jalon ajouté avec succès");
      reset();
      toggle();
    } else {
      toast.error(error || "Erreur lors de la création du jalon");
    }

    setLoading(false);
  };

  const isFormValid = () => {
    const { title, fundAllocation } = getValues();
    return (
      Boolean(title?.trim()) &&
      Boolean(fundAllocation) &&
      parseFloat(fundAllocation) > 0
    );
  };

  return (
    <section className="w-full p-8 bg-white">
      <div className="w-full flex items-center justify-between">
        <DialogTitle>Ajouter un jalon</DialogTitle>
        <span
          onClick={() => {
            reset();
            toggle();
          }}
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
        className="mt-4 flex flex-col gap-4"
      >
        <Controller
          name="title"
          control={control}
          rules={{ required: "Le titre est requis" }}
          render={({ field }) => (
            <MUIInput
              {...field}
              label="Titre du jalon"
              after={<div className="pr-4"></div>}
              className="pl-4"
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <MUITextarea
              {...field}
              label="Description (optionnelle)"
              className="min-h-[80px]"
              placeholder=" "
            />
          )}
        />

        <Controller
          name="fundAllocation"
          control={control}
          rules={{ required: "L'allocation est requise" }}
          render={({ field }) => (
            <MUIInput
              {...field}
              type="number"
              label="Montant alloué"
              after={
                <div className="pr-4">
                  <span className="text-slate-500 text-sm">XOF</span>
                </div>
              }
              className="pl-4"
            />
          )}
        />

        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <DatePicker {...field} label="Date d'échéance" />
          )}
        />

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              toggle();
            }}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading || !isFormValid()}>
            {loading ? (
              <Loader className="animate-spin w-4 h-4" />
            ) : (
              "Ajouter le jalon"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
