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
import { useCallback, useRef, useState, useEffect } from "react";
import Villa from "@/entities/properties/villa";
import { villes } from "@/data/cities";
import { useLoadAllProperties } from "@/hooks/useProperties";
import useGetTenants, { useGetEveryTenants } from "@/hooks/useTenants";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { propertyProvider } from "@/api/properties";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/auth";
import { usePropertiesStore } from "@/store/properties";
import FileItem from "@/components/molecules/file-item";
import { displayFileSize } from "@/lib/format";
import { DatePicker } from "@/components/molecules/date-picker";
import { Loader } from "lucide-react";

const villaTypes = ["Basse", "Duplex", "Triplex", "Autre"];

type IVillaForm = {
  // 1st
  name: string;
  city: string;
  typeOfVilla: string;
  address: string;
  code: string;
  tenant: string;

  // 2nd
  amount: string;
  dureeLocation: string;
  startLocation: Date;
  endLocation: Date;
  deadlinePaiement: number;
  cautionAmount: string;

   penaltyEnabled: boolean;
  penaltyPercentage: string;
};

// NOTE: cautionAmount is there to replace cautionAmount, but in thecode someplaces will still rely on thenaming caution_amount even though it won't really be what it will holds

export default function AddGoodsVillaModal() {
  const { toggle, data } = useModalStore();
  const { user } = useAuthStore();
  const { addVilla, updateVilla } = usePropertiesStore();

  const [customType, setCustomType] = useState("");

  const photoRef = useRef<HTMLInputElement>(null);

  const { handleSubmit, control, reset, getValues, watch, setValue } =
    useForm<IVillaForm>({
      defaultValues: {
        name: "",
        city: "default",
        typeOfVilla: "default",
        address: "",
        code: "",
        tenant: "default",
        amount: "",

        dureeLocation: "default",
        startLocation: new Date(),
        endLocation: new Date(),
        deadlinePaiement: 1,
        cautionAmount: "",
         penaltyEnabled:false ,
  penaltyPercentage:"",
      },
    });

  // watchers
  const name = watch("name");
  const city = watch("city");
  const address = watch("address");
  const typeOfVilla = watch("typeOfVilla");
  const code = watch("code");
  const tenant = watch("tenant");
  const amount = watch("amount");
  const dureeLocation = watch("dureeLocation");
  const cautionAmount = watch("cautionAmount");
  const startLocation = watch("startLocation");
  const endLocation = watch("endLocation");
  const deadlinePaiement = watch("deadlinePaiement");

  const penaltyEnabled = watch("penaltyEnabled");
const penaltyPercentage = watch("penaltyPercentage");

  const [x, setX] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { properties } = useLoadAllProperties();
  useGetTenants({ page: 1 });
  const { tenants } = useGetEveryTenants();

  // Compute values after hooks
  const isEditMode = data?.type === "edit";
  const villaToEdit = data?.villa as Villa | undefined;

  // Check if required data is loaded
  useEffect(() => {
    if (tenants.length > 0) {
      setDataLoaded(true);
    }
  }, [tenants.length]);

  useEffect(() => {
    if (startLocation && endLocation) {
      const months =
        (endLocation.getFullYear() - startLocation.getFullYear()) * 12 +
        (endLocation.getMonth() - startLocation.getMonth());
      setValue("dureeLocation", months.toString());
    }
  }, [startLocation, endLocation, setValue]);

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (isEditMode && villaToEdit && dataLoaded) {
      const timer = setTimeout(() => {
        setValue("name", villaToEdit.name);
        setValue("city", villaToEdit.city);
        setValue("address", villaToEdit.address);
        setValue("code", villaToEdit.code);
        setValue("amount", villaToEdit.price?.toString());
        setValue("dureeLocation", villaToEdit.dureeLocation?.toString());
        setValue("cautionAmount", villaToEdit.cautionAmount?.toString());
        setValue("startLocation", new Date(villaToEdit.dateDebutLocation));
        setValue("endLocation", new Date(villaToEdit.dateFinLocation));
        setValue("deadlinePaiement", villaToEdit.dateLimitePaiement);
        setValue("tenant", villaToEdit.tenantsId);
        setValue("typeOfVilla", villaToEdit.typeOfVilla);
        setValue("penaltyEnabled", villaToEdit.penaltyEnabled || false);
      setValue("penaltyPercentage", villaToEdit.penaltyPercentage?.toString() || "");
      }, 100);

      return () => clearTimeout(timer);
    } else if (!isEditMode) {
      reset({
        name: "",
        city: "default",
        typeOfVilla: "default",
        address: "",
        code: "",
        tenant: "default",
        amount: "",
        dureeLocation: "default",
        cautionAmount: "",
        startLocation: new Date(),
        endLocation: new Date(),
        deadlinePaiement: 1,
        penaltyEnabled: false,
        penaltyPercentage: "",
      });
    }
  }, [isEditMode, villaToEdit, dataLoaded, setValue, reset]);

  const handleOpenFileExplorer = () => {
    photoRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) return;

    const file = e.target.files[0];

    setPhoto(file);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (checkForm(1)) {
      setX(1);
    } else {
      toast.error("Veuillez remplir tous les champs requis");
    }
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setX(0);
  };

  const onSubmit: SubmitHandler<IVillaForm> = async (value) => {
    if (!user) {
      toast.error("Apparemment vous n'etes pas connecté");
      return;
    }

    setLoading(true);

    const payload = {
      name: value.name,
      city: value.city,
      address: value.address,
      code: value.code,
      type_of_villa: value.typeOfVilla.startsWith("Autre:")
        ? value.typeOfVilla.substring(6) // Remove "Autre: " prefix
        : value.typeOfVilla,
      duree_location: parseInt(value.dureeLocation, 10),
      caution_amount: parseInt(value.cautionAmount, 10),
      price: parseFloat(value.amount),
      state_photos: photo,
      real_estate_entities_id: user.id,
      tenants_id: value.tenant,
      date_debut_location: value.startLocation.toISOString().split("T")[0],
      date_fin_location: value.endLocation.toISOString().split("T")[0],
      date_limite_paiement: value.deadlinePaiement,
       penalty_enabled: value.penaltyEnabled,
  penalty_percentage: value.penaltyEnabled ? parseFloat(value.penaltyPercentage) : null,
    };

    try {
      if (isEditMode && villaToEdit) {
        // Update existing villa
        const { data: responseData, error } =
          await propertyProvider.updateVilla(villaToEdit.id, payload);

        if (responseData && responseData.villa) {
          toast.success("Villa modifiée avec succès");
          updateVilla(responseData.villa);
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
        // Create new villa
        const { data: responseData, error } =
          await propertyProvider.createVilla(payload);

        if (responseData) {
          toast.success(
            typeof responseData === "object" && "message" in responseData
              ? String(responseData.message)
              : "Annonce ajoutée avec succès"
          );
          addVilla(responseData.villa);
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

  const filterBuilding = useCallback(() => {
    return properties.filter((property) => property.type === "buildings");
  }, [properties]);

  const checkForm = useCallback(
    (step: number) => {
      const {
        // 1st
        name,
        city,
        address,
        code,
        tenant,

        // 2nd
        amount,
        dureeLocation,
        startLocation,
        endLocation,
        deadlinePaiement,
        cautionAmount,
      } = getValues();

      if (step === 1) {
        if (
          !!(
            name &&
            city &&
            typeOfVilla &&
            !(city === "default") &&
            address &&
            code &&
            tenant &&
            !(tenant === "default")
          )
        ) {
          return true;
        }

        return false;
      } else {
        if (
          amount &&
          startLocation &&
          endLocation &&
          deadlinePaiement &&
          dureeLocation &&
          cautionAmount &&
          !(dureeLocation === "default")
        ) {
          return true;
        }

        return false;
      }
    },
    [
      name,
      city,
      address,
      code,
      tenant,
      amount,
      dureeLocation,
      cautionAmount,
      typeOfVilla,
      startLocation,
      endLocation,
      deadlinePaiement,
    ]
  );

  // Don't render form until data is loaded when in edit mode
  if (isEditMode && !dataLoaded) {
    return (
      <section className="w-full p-8 overflow-hidden">
        <div className="flex items-center justify-center h-32">
          <Loader className="animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full p-8 max-h-[80vh]">
      <div className="w-full flex items-center justify-between">
        <DialogTitle>
          {isEditMode ? "Modifier la villa" : "Ajouter un bien"}
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto min-h-0">
          <motion.div
            // initial={{ x }}
            // animate={{ x: x === 1 ? "-50%" : 0 }}
            className="relative w-full"
          >
            <motion.div
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: x === 1 ? "-150%" : 0, opacity: x === 0 ? 1 : 0 }}
              className="mt-4 flex flex-col gap-0 shrink-0 pb-4"
            >
              <div className="mt-2">
                <Controller
                  name="city"
                  control={control}
                  rules={{
                    required: "La ville est requise",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={(v) => field.onChange(v)}
                      defaultValue="default"
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="default"
                          className="text-black/40"
                          disabled
                        >
                          Selectioner une ville
                        </SelectItem>
                        {villes.map((ville) => (
                          <SelectItem key={ville.id} value={ville.name}>
                            {ville.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="mt-4">
                <Controller
                  name="typeOfVilla"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        onValueChange={(value) => {
                          if (value === "autre") {
                            field.onChange("autre");
                            setCustomType(""); // Reset custom type when selecting "Autre"
                          } else {
                            field.onChange(value);
                            setCustomType("");
                          }
                        }}
                        value={
                          field.value.startsWith("Autre:")
                            ? "autre"
                            : field.value
                        }
                        defaultValue="default"
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Quel est le type de votre villa ?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="default"
                            className="text-black/40"
                            disabled
                          >
                            Quel est le type de votre villa ?
                          </SelectItem>
                          {villaTypes.map((value) => (
                            <SelectItem
                              key={value}
                              value={
                                value === "Autre"
                                  ? "autre"
                                  : value.toLowerCase()
                              }
                            >
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Show custom input when "Autre" is selected */}
                      {(field.value === "autre" ||
                        field.value.startsWith("Autre:")) && (
                        <div className="mt-2">
                          <MUIInput
                            value={customType}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setCustomType(newValue);
                              field.onChange(
                                newValue ? `Autre: ${newValue}` : "autre"
                              );
                            }}
                            label="Préciser le type"
                            className="pl-4"
                          />
                        </div>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="mt-2">
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Le nom de l'appartement est requis",
                  }}
                  render={({ field }) => (
                    <MUIInput
                      {...field}
                      label="Nom de la villa"
                      after={
                        <div className="pr-4">
                          {/* <svg
													width='18'
													height='18'
													viewBox='0 0 18 18'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
												>
													<path
														d='M13.2426 12.4926C12.6185 13.1168 11.3891 14.3462 10.4137 15.3216C9.63264 16.1026 8.36745 16.1027 7.5864 15.3217C6.62886 14.3641 5.42126 13.1565 4.75736 12.4926C2.41421 10.1495 2.41421 6.35051 4.75736 4.00736C7.10051 1.66421 10.8995 1.66421 13.2426 4.00736C15.5858 6.35051 15.5858 10.1495 13.2426 12.4926Z'
														stroke='#9C9FA4'
														strokeWidth='1.5'
														strokeLinecap='round'
														strokeLinejoin='round'
													/>
													<path
														d='M11.25 8.25C11.25 9.49264 10.2426 10.5 9 10.5C7.75736 10.5 6.75 9.49264 6.75 8.25C6.75 7.00736 7.75736 6 9 6C10.2426 6 11.25 7.00736 11.25 8.25Z'
														stroke='#9C9FA4'
														strokeWidth='1.5'
														strokeLinecap='round'
														strokeLinejoin='round'
													/>
												</svg> */}
                        </div>
                      }
                      className="pl-4"
                    />
                  )}
                />
              </div>

              <div className="mt-2">
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

              <div className="mt-2">
                <Controller
                  name="code"
                  control={control}
                  rules={{
                    required: "Le code est requis",
                  }}
                  render={({ field }) => (
                    <MUIInput
                      {...field}
                      label="Code de la villa"
                      after={
                        <div className="pr-4">
                          {/* <svg
													width='18'
													height='18'
													viewBox='0 0 18 18'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
												>
													<path
														d='M13.2426 12.4926C12.6185 13.1168 11.3891 14.3462 10.4137 15.3216C9.63264 16.1026 8.36745 16.1027 7.5864 15.3217C6.62886 14.3641 5.42126 13.1565 4.75736 12.4926C2.41421 10.1495 2.41421 6.35051 4.75736 4.00736C7.10051 1.66421 10.8995 1.66421 13.2426 4.00736C15.5858 6.35051 15.5858 10.1495 13.2426 12.4926Z'
														stroke='#9C9FA4'
														strokeWidth='1.5'
														strokeLinecap='round'
														strokeLinejoin='round'
													/>
													<path
														d='M11.25 8.25C11.25 9.49264 10.2426 10.5 9 10.5C7.75736 10.5 6.75 9.49264 6.75 8.25C6.75 7.00736 7.75736 6 9 6C10.2426 6 11.25 7.00736 11.25 8.25Z'
														stroke='#9C9FA4'
														strokeWidth='1.5'
														strokeLinecap='round'
														strokeLinejoin='round'
													/>
												</svg> */}
                        </div>
                      }
                      className="pl-4"
                    />
                  )}
                />
              </div>

              <div className="mt-2">
                <Controller
                  name="tenant"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={(v) => field.onChange(v)}
                      defaultValue="default"
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="default"
                          className="text-black/40"
                          disabled
                        >
                          Selectionner un locataire
                        </SelectItem>
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: "150%", opacity: 0 }}
              animate={{ x: x === 1 ? 0 : "150%", opacity: x === 1 ? 1 : 0 }}
              className="absolute -top-4 mt-4 flex flex-col gap-0 w-full shrink-0"
            >
              <div className="mt-2">
                <Controller
                  name="startLocation"
                  control={control}
                  render={({ field }) => (
                    <DatePicker {...field} label="Date de debut de location" />
                  )}
                />
              </div>

              <div className="mt-2">
                <Controller
                  name="endLocation"
                  control={control}
                  render={({ field }) => (
                    <DatePicker {...field} label="Date de fin de location" />
                  )}
                />
              </div>

              {/* New duration field */}
              <div className="mt-2">
                <MUIInput
                  name="dureeLocation"
                  label="Durée de la location"
                  value={(() => {
                    if (!startLocation || !endLocation) return "";

                    const start = new Date(startLocation);
                    const end = new Date(endLocation);

                    if (end <= start) return "Dates invalides";

                    const months =
                      (end.getFullYear() - start.getFullYear()) * 12 +
                      (end.getMonth() - start.getMonth());

                    if (months === 0) {
                      const days = Math.ceil(
                        (end.getTime() - start.getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      return `${days} jour${days > 1 ? "s" : ""}`;
                    } else if (months < 12) {
                      return `${months} mois`;
                    } else {
                      const years = Math.floor(months / 12);
                      const remainingMonths = months % 12;

                      if (remainingMonths === 0) {
                        return `${years} an${years > 1 ? "s" : ""}`;
                      } else {
                        return `${years} an${
                          years > 1 ? "s" : ""
                        } et ${remainingMonths} mois`;
                      }
                    }
                  })()}
                  disabled
                  readOnly
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
                          d="M13.5 2.25V4.5M4.5 2.25V4.5M2.25 7.5H15.75M3.75 3.75H14.25C15.0784 3.75 15.75 4.42157 15.75 5.25V14.25C15.75 15.0784 15.0784 15.75 14.25 15.75H3.75C2.92157 15.75 2.25 15.0784 2.25 14.25V5.25C2.25 4.42157 2.92157 3.75 3.75 3.75Z"
                          stroke="#9C9FA4"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  }
                  className="pl-4 bg-gray-50"
                />
              </div>

              <div className="mt-2">
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: "Le montant du loyer est requis",
                  }}
                  render={({ field }) => (
                    <MUIInput
                      {...field}
                      label="Montant du loyer"
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
                              d="M12.75 7.25V5.75C12.75 4.92157 12.0784 4.25 11.25 4.25H3.75C2.92157 4.25 2.25 4.92157 2.25 5.75V10.25C2.25 11.0784 2.92157 11.75 3.75 11.75H5.25M6.75 14.75H14.25C15.0784 14.75 15.75 14.0784 15.75 13.25V8.75C15.75 7.92157 15.0784 7.25 14.25 7.25H6.75C5.92157 7.25 5.25 7.92157 5.25 8.75V13.25C5.25 14.0784 5.92157 14.75 6.75 14.75ZM12 11C12 11.8284 11.3284 12.5 10.5 12.5C9.67157 12.5 9 11.8284 9 11C9 10.1716 9.67157 9.5 10.5 9.5C11.3284 9.5 12 10.1716 12 11Z"
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
              <div className="mt-3">
                <Controller
                  name="deadlinePaiement"
                  control={control}
                  render={({ field }) => (
                    <>
                    <label>
                      Date limite de paiement 
                    </label>
                    <Select
                      {...field}
                      onValueChange={(v) => field.onChange(parseInt(v, 10))} // Convert string to number
                      value={field.value?.toString()} // Ensure value is string for Select
                      defaultValue="1"
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Sélectionner le jour du mois" />
                      </SelectTrigger>
                      <SelectContent>
                       
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(
                          (day) => (
                            <SelectItem key={day} value={day.toString()}>
                              Chaque {day} du mois
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select></>
                  )}
                />
              </div>

              <div className="mt-3 space-y-4">
  <div className="flex items-center space-x-2">
    <Controller
      name="penaltyEnabled"
      control={control}
      render={({ field }) => (
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="penalty-disabled"
            checked={!field.value}
            onChange={() => field.onChange(false)}
            className="w-4 h-4 text-primary"
          />
          <label htmlFor="penalty-disabled">Sans pénalité</label>
          
          <input
            type="radio"
            id="penalty-enabled"
            checked={field.value}
            onChange={() => field.onChange(true)}
            className="ml-4 w-4 h-4 text-primary"
          />
          <label htmlFor="penalty-enabled">Avec pénalité</label>
        </div>
      )}
    />
  </div>

  {penaltyEnabled && (
    <div className="mt-2">
      <Controller
        name="penaltyPercentage"
        control={control}
        rules={{
          required: penaltyEnabled ? "Le pourcentage de pénalité est requis" : false,
          min: {
            value: 0,
            message: "Le pourcentage doit être positif"
          },
          max: {
            value: 100,
            message: "Le pourcentage ne peut pas dépasser 100%"
          }
        }}
        render={({ field }) => (
          <MUIInput
            {...field}
            type="number"
            label="Pourcentage de pénalité"
            disabled={!penaltyEnabled}
            after={
              <div className="pr-4">
                <span className="text-gray-500">%</span>
              </div>
            }
            className="pl-4"
          />
        )}
      />
    </div>
  )}
</div>

             
{/* TODO: Needs testing */}
              <div className="mt-2">
                <Controller
                  name="cautionAmount"
                  control={control}
                  rules={{
                    required: "Le montant de la caution est requis",
                  }}
                  render={({ field }) => (
                    <MUIInput
                    type="number"
                      {...field}
                      label="Montant de la caution"
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
                              d="M12.75 7.25V5.75C12.75 4.92157 12.0784 4.25 11.25 4.25H3.75C2.92157 4.25 2.25 4.92157 2.25 5.75V10.25C2.25 11.0784 2.92157 11.75 3.75 11.75H5.25M6.75 14.75H14.25C15.0784 14.75 15.75 14.0784 15.75 13.25V8.75C15.75 7.92157 15.0784 7.25 14.25 7.25H6.75C5.92157 7.25 5.25 7.92157 5.25 8.75V13.25C5.25 14.0784 5.92157 14.75 6.75 14.75ZM12 11C12 11.8284 11.3284 12.5 10.5 12.5C9.67157 12.5 9 11.8284 9 11C9 10.1716 9.67157 9.5 10.5 9.5C11.3284 9.5 12 10.1716 12 11Z"
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

              <div className="mt-4 mb-1">
                {photo ? (
                  <FileItem
                    name={photo.name}
                    size={displayFileSize(photo.size)}
                    type={"image"}
                    url="/static/files.svg"
                    onDelete={() => setPhoto(null)}
                  />
                ) : (
                  <MUIInput
                    className="w-full"
                    label="Etat des lieux"
                    placeholderShown={false}
                    componentType="file"
                    disabled
                    before={
                      <div
                        onClick={handleOpenFileExplorer}
                        className="h-full px-4 flex items-center border-r-2 border-r-border bg-primary/10 text-[12px]"
                      >
                        Insérer des images
                      </div>
                    }
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
                          d="M15.1716 7L8.58579 13.5858C7.80474 14.3668 7.80474 15.6332 8.58579 16.4142C9.36684 17.1953 10.6332 17.1953 11.4142 16.4142L17.8284 9.82843C19.3905 8.26633 19.3905 5.73367 17.8284 4.17157C16.2663 2.60948 13.7337 2.60948 12.1716 4.17157L5.75736 10.7574C3.41421 13.1005 3.41421 16.8995 5.75736 19.2426C8.1005 21.5858 11.8995 21.5858 14.2426 19.2426L20.5 13"
                          stroke="#555"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                )}

                <input
                  ref={photoRef}
                  hidden
                  type="file"
                  onChange={handleChangeFile}
                  accept="image/*"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-4 w-full flex items-center justify-between bg-white pt-4 z-10">
          <Button
            onClick={handlePrevious}
            className="w-8 h-8 rounded-full bg-transparent hover:bg-primary/10 border"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.02022 4.97994C7.21548 5.1752 7.21548 5.49179 7.02022 5.68705L4.70711 8.00016L7.02022 10.3133C7.21548 10.5085 7.21548 10.8251 7.02022 11.0204C6.82496 11.2156 6.50838 11.2156 6.31311 11.0204L3.64645 8.35372C3.45118 8.15845 3.45118 7.84187 3.64645 7.64661L6.31311 4.97994C6.50838 4.78468 6.82496 4.78468 7.02022 4.97994Z"
                fill="#777E90"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.5 8C3.5 7.72386 3.72386 7.5 4 7.5L12 7.5C12.2761 7.5 12.5 7.72386 12.5 8C12.5 8.27614 12.2761 8.5 12 8.5L4 8.5C3.72386 8.5 3.5 8.27614 3.5 8Z"
                fill="#777E90"
              />
            </svg>
          </Button>

          <div>
            <span className="text-[12px] text-black/60">
              Page {x + 1} sur 2
            </span>
          </div>

          {x === 0 ? (
            <Button
              onClick={handleNext}
              disabled={!checkForm(1)}
              className="w-8 h-8 rounded-full hover:bg-primary/10 bg-transparent border disabled:cursor-not-allowed"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-180"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.02022 4.97994C7.21548 5.1752 7.21548 5.49179 7.02022 5.68705L4.70711 8.00016L7.02022 10.3133C7.21548 10.5085 7.21548 10.8251 7.02022 11.0204C6.82496 11.2156 6.50838 11.2156 6.31311 11.0204L3.64645 8.35372C3.45118 8.15845 3.45118 7.84187 3.64645 7.64661L6.31311 4.97994C6.50838 4.78468 6.82496 4.78468 7.02022 4.97994Z"
                  fill="#777E90"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.5 8C3.5 7.72386 3.72386 7.5 4 7.5L12 7.5C12.2761 7.5 12.5 7.72386 12.5 8C12.5 8.27614 12.2761 8.5 12 8.5L4 8.5C3.72386 8.5 3.5 8.27614 3.5 8Z"
                  fill="#777E90"
                />
              </svg>
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!checkForm(2)}
              className="w-8 h-8 rounded-full hover:bg-primary/70 bg-primary border"
            >
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.00065 2.8335V12.1668M11.6673 7.50016L2.33398 7.50016"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}
