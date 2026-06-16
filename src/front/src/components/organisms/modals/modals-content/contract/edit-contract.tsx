"use client";

import { Button } from "@/components/atoms/button";
import { DialogTitle } from "../../modal";
import { Controller, useForm } from "react-hook-form";
import { useModalStore } from "@/store/modal";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useContractsStore } from "@/store/contracts";
import { useAllProperties } from "@/store/properties";
import { useGetEveryTenants } from "@/hooks/useTenants";
import { DatePicker } from "@/components/molecules/date-picker";
import FileItem from "@/components/molecules/file-item";
import { displayFileSize } from "@/lib/format";
import { contractProvider } from "@/api/contracts";
import { DivideCircle, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { useLoadAllProperties } from "@/hooks/useProperties";

type EditContractForm = {
  tenant_id: string;
  property_id: string;
  start_date: Date;
  end_date: Date;
  payment_status: string;
  rentals_status: string;
  rental_contract_file: File | null;
};

export default function EditContractModal() {
  const { toggle, data } = useModalStore();
  const { contract } = (data as { contract: any }) || {};
  const { updateContract, refreshContracts } = useContractsStore();
  const properties = useLoadAllProperties();
  const { tenants } = useGetEveryTenants();

  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [isDragActive, setIsDragActive] = useState(false);

  // Preload contract data
  const { handleSubmit, control, reset, watch, setValue } =
    useForm<EditContractForm>({
      defaultValues: contract
        ? {
            tenant_id: contract.tenant_id || contract.tenant || "",
            property_id: contract.property_id || "",
            start_date: contract.start_date
              ? new Date(contract.start_date)
              : contract.start
              ? new Date(contract.start)
              : new Date(),
            end_date: contract.end_date
              ? new Date(contract.end_date)
              : contract.end
              ? new Date(contract.end)
              : new Date(),
            payment_status:
              contract.payment_status || contract.paymentStatus || "pending",
            rentals_status:
              contract.rentals_status || contract.status || "pending",
            rental_contract_file: null,
          }
        : {
            tenant_id: "",
            property_id: "",
            start_date: new Date(),
            end_date: new Date(),
            payment_status: "pending",
            rentals_status: "pending",
            rental_contract_file: null,
          },
    });

  // If contract changes, reset form
  useEffect(() => {
    if (contract) {
      reset({
        tenant_id: contract.tenant_id || contract.tenant || "",
        property_id: contract.property_id || "",
        start_date: contract.start_date
          ? new Date(contract.start_date)
          : contract.start
          ? new Date(contract.start)
          : new Date(),
        end_date: contract.end_date
          ? new Date(contract.end_date)
          : contract.end
          ? new Date(contract.end)
          : new Date(),
        payment_status:
          contract.payment_status || contract.paymentStatus || "pending",
        rentals_status: contract.rentals_status || contract.status || "pending",
        rental_contract_file: null,
      });
    }
  }, [contract, reset]);

  const rental_contract_file = watch("rental_contract_file");

  const handleOpenFileExplorer = () => {
    fileRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setValue("rental_contract_file", e.target.files[0]);
  };

  const removeSelectedFile = () => {
    setValue("rental_contract_file", null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const onSubmit = async (values: EditContractForm) => {
    setLoading(true);

    try {
      const contractId = contract?.rental_id || contract?._rental_id;

      console.log("Contract fetched:", contract);

      const formData = new FormData();
      formData.append("tenant_id", values.tenant_id);
      formData.append("property_id", values.property_id);
      formData.append(
        "start_date",
        values.start_date.toISOString().split("T")[0]
      );
      formData.append("end_date", values.end_date.toISOString().split("T")[0]);
      formData.append("payment_status", values.payment_status);
      formData.append("rentals_status", values.rentals_status);
      if (values.rental_contract_file) {
        formData.append("rental_contract_file", values.rental_contract_file);
      }

      const { data, error } = await contractProvider.updateContract(
        contractId,
        formData
      );

      if (data) {
        toast.success("Contrat mis à jour avec succès");
        await refreshContracts();
        // router.push("admin/contrats");
        toggle();
      } else {
        toast.error(error || "Erreur lors de la mise à jour du contrat");
      }
    } catch (err) {
      toast.error("Erreur inattendue lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setValue("rental_contract_file", e.dataTransfer.files[0]);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  if (!contract) {
    return (
      <div className="sm:max-w-[600px] p-6">
        <p className="text-center text-red-600">
          Erreur: Aucun contrat sélectionné
        </p>
      </div>
    );
  }

  return (
    <div className="sm:max-w-[700px] p-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <DialogTitle>Modifier le contrat</DialogTitle>
        <button
          onClick={() => toggle()}
          className="w-8 h-8 flex items-center justify-center border border-primary/30 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
          aria-label="Fermer le dialog"
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
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Tenant Select */}
        <Controller
          name="tenant_id"
          control={control}
          rules={{ required: "Le locataire est requis" }}
          render={({ field }) => (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Locataire
              </label>
              <Select
                {...field}
                onValueChange={(v) => field.onChange(v)}
                defaultValue={field.value}
              >
                <SelectTrigger className="h-12">
                  <SelectValue>
                    {tenants.find((t) => t.id === field.value)?.name ||
                      "Sélectionner un locataire"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {/* Property Select */}
        <Controller
          name="property_id"
          control={control}
          rules={{
            required: "Le nom du bénéficiaire est requis",
          }}
          render={({ field }) => (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Le Bien
              </label>
              <Select
                {...field}
                onValueChange={(v) => field.onChange(v)}
                defaultValue={field.value}
              >
                <SelectTrigger className="h-12 mt-2">
                  <SelectValue>
                    {properties.properties.find(
                      (p: any) => p.id === field.value
                    )?.name || "Sélectionner une proprieté"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem
                        value="default"
                        className="text-black/40"
                        disabled
                      >
                        Selectionner une propriété
                      </SelectItem> */}
                  {properties.properties.map((property: any) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {/* Start Date */}
        <Controller
          name="start_date"
          control={control}
          render={({ field }) => (
            <DatePicker {...field} label="Date de début" />
          )}
        />

        {/* End Date */}
        <Controller
          name="end_date"
          control={control}
          render={({ field }) => <DatePicker {...field} label="Date de fin" />}
        />

        {/* Payment Status */}
        <Controller
          name="payment_status"
          control={control}
          render={({ field }) => (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Statut de paiement
              </label>
              <Select
                {...field}
                onValueChange={(v) => field.onChange(v)}
                defaultValue={field.value}
              >
                <SelectTrigger className="h-12">
                  <SelectValue>
                    {field.value === "pending"
                      ? "En attente"
                      : field.value === "paid"
                      ? "Payé"
                      : "Statut"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {/* Rentals Status */}
        <Controller
          name="rentals_status"
          control={control}
          render={({ field }) => (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Statut du contrat
              </label>
              <Select
                {...field}
                onValueChange={(v) => field.onChange(v)}
                defaultValue={field.value}
              >
                <SelectTrigger className="h-12">
                  <SelectValue>
                    {field.value === "pending"
                      ? "En attente"
                      : field.value === "active"
                      ? "Actif"
                      : field.value === "finished"
                      ? "Terminé"
                      : "Statut"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="finished">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {/* File Upload */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Document du contrat (PDF/Image)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Formats acceptés: PDF, Image (max 10MB)
          </p>
          {!rental_contract_file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Button
                variant="outline"
                onClick={handleOpenFileExplorer}
                className="mx-auto"
                type="button"
              >
                Sélectionner un fichier
              </Button>
              <p className="mt-2 text-sm text-gray-500">
                ou <span className="font-semibold">glissez-déposez</span> votre
                fichier ici
              </p>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleChangeFile}
              />
              {isDragActive && (
                <div className="mt-2 text-primary font-semibold">
                  Déposez le fichier maintenant...
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <FileItem
                name={rental_contract_file.name}
                size={displayFileSize(rental_contract_file.size)}
                type={"file"}
                url="/static/files.svg"
                onDelete={removeSelectedFile}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3 justify-end">
          <Button variant="outline" onClick={() => toggle()} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[120px]">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin h-4 w-4" />
                <span>Mise à jour...</span>
              </div>
            ) : (
              "Mettre à jour"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
