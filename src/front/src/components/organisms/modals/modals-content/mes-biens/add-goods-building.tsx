import { useModalStore } from "@/store/modal";
import { MUIInput } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/atoms/select";
import { Button } from "@/components/atoms/button";
import { SelectValue } from "@radix-ui/react-select";
import { DialogTitle } from "../../modal";
import { motion } from "motion/react";
import { villes } from "@/data/cities";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { propertyProvider } from "@/api/properties";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/auth";
import { useCallback, useRef, useState, useEffect } from "react";
import { usePropertiesStore } from "@/store/properties";

import { Loader } from "lucide-react";
import Building from "@/entities/properties/building";

type IBuildingForm = {
  // 1st
  name: string;
  city: string;
  address: string;
};

export default function AddGoodsBuildingModal() {
  const { toggle, data } = useModalStore();
  const { user } = useAuthStore();
  const { addBuilding, updateBuilding } = usePropertiesStore();

  const { handleSubmit, control, reset, getValues, watch, setValue } =
    useForm<IBuildingForm>({
      defaultValues: {
        name: "",
        city: "default",
        address: "",
      },
    });

  // watchers
  const name = watch("name");
  const city = watch("city");
  const address = watch("address");

  const [x, setX] = useState(0);

  const [loading, setLoading] = useState(false); // Add loading state

  // Compute values after hooks
  const isEditMode = data?.type === "edit";
  const buildingToEdit = data?.building as Building | undefined;

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (isEditMode && buildingToEdit) {
      const timer = setTimeout(() => {
        setValue("name", buildingToEdit.name);
        setValue("city", buildingToEdit.city);
        setValue("address", buildingToEdit.address);
      }, 100);

      return () => clearTimeout(timer);
    } else if (!isEditMode) {
      reset({
        name: "",
        city: "default",
        address: "",
      });
    }
  }, [isEditMode, buildingToEdit, setValue, reset]);

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setX(0);
  };

  const onSubmit: SubmitHandler<IBuildingForm> = async (value) => {
    if (!user) {
      toast.error("Apparemment vous n'etes pas connecté");
      return;
    }

    setLoading(true);

    const payload = {
      name: value.name,
      city: value.city,
      address: value.address,
    };

    try {
      if (isEditMode && buildingToEdit) {
        // Update existing building
        const { data: responseData, error } =
          await propertyProvider.updateBuilding(buildingToEdit.id, payload);

        if (responseData && responseData.building) {
          toast.success("Immeuble modifié avec succès");
          updateBuilding(responseData.building);
        } else {
          // Handle field validation errors
          if (error && typeof error === "string" && error.includes("\n")) {
            const fieldErrors = error
              .split("\n")
              .filter((err) => err.trim() !== "");
            fieldErrors.forEach((err) => {
              toast.error(err);
            });
          } else if (error) {
            toast.error(error);
          } else {
            toast.error("Erreur lors de la modification");
          }
        }
      } else {
        // Create new building
        const { data: responseData, error } =
          await propertyProvider.createBuilding(payload, user.id);

        if (responseData) {
          toast.success(
            typeof responseData === "object" && "message" in responseData
              ? String(responseData.message)
              : "Immeuble ajouté avec succès"
          );
          addBuilding(responseData.building);
        } else {
          // Handle field validation errors
          if (error && typeof error === "string" && error.includes("\n")) {
            const fieldErrors = error
              .split("\n")
              .filter((err) => err.trim() !== "");
            fieldErrors.forEach((err) => {
              toast.error(err);
            });
          } else if (error) {
            toast.error(error);
          } else {
            toast.error("Une erreur inattendue s'est produite");
          }
        }
      }

      // Reset form and close modal
      reset();
      toggle();
    } catch (error) {
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const checkForm = useCallback(() => {
    const { name, city, address } = getValues();
    return !!(name && city && city !== "default" && address);
  }, [getValues]);

  return (
    <section className="w-full p-8 overflow-hidden">
      <div className="w-full flex items-center justify-between">
        <DialogTitle>
          {isEditMode ? "Modifier l'immeuble" : "Ajouter un immeuble"}
        </DialogTitle>

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

      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div className="relative w-full">
          <motion.div
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: x === 1 ? "-150%" : 0, opacity: x === 0 ? 1 : 0 }}
            className="mt-4 flex flex-col gap-0 shrink-0 pb-4"
          >
            <div className="my-2">
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Le nom de l'immeuble est requis",
                }}
                render={({ field }) => (
                  <MUIInput
                    {...field}
                    label="Nom de l'immeuble"
                    after={<div className="pr-4"></div>}
                    className="pl-4"
                  />
                )}
              />
            </div>

            <Controller
              name="city"
              control={control}
              rules={{
                required: "La ville est requise",
              }}
              render={({ field }) => (
                <>
                <label>Sélectionner une ville</label>
                
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {villes.map((ville) => (
                      <SelectItem key={ville.id} value={ville.name}>
                        {ville.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </>
              )}
            />

            <div className="my-2">
              <Controller
                name="address"
                control={control}
                rules={{
                  required: "L'adresse est requise",
                }}
                render={({ field }) => (
                  <MUIInput
                    {...field}
                    label="Adresse complète"
                    after={
                      <div className="pr-4">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.2426 12.4926C12.6185 13.1168 11.3891 14.3462 10.4137 15.3216C9.63264 16.1026 8.36745 16.1027 7.5864 15.3217C6.62886 14.3641 5.42126 13.1565 4.75736 12.4926C2.41421 10.1495 2.41421 6.35051 4.75736 4.00736C7.10051 1.66421 10.8995 1.66421 13.2426 4.00736C15.5858 6.35051 15.5858 10.1495 13.2426 12.4926Z"
                            stroke="#9C9FA4"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11.25 8.25C11.25 9.49264 10.2426 10.5 9 10.5C7.75736 10.5 6.75 9.49264 6.75 8.25C6.75 7.00736 7.75736 6 9 6C10.2426 6 11.25 7.00736 11.25 8.25Z"
                            stroke="#9C9FA4"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    }
                    className="pl-4"
                  />
                )}
              />
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-8 w-full flex items-center justify-end">
          <Button
            type="submit"
            disabled={!checkForm()}
            className="px-4 py-2 rounded hover:bg-primary/70 bg-primary border text-white"
          >
            {loading ? (
              <Loader className="animate-spin mr-2" size={16} />
            ) : null}
            {isEditMode ? "Modifier l'immeuble" : "Ajouter l'immeuble"}
          </Button>
        </div>
      </form>
    </section>
  );
}