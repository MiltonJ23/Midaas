"use client";

import { useModalStore } from "@/store/modal";
import { MUIInput } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { useTenantsStore } from "@/store/tenants";
import { toast } from "react-toastify";
import { tenantProvider } from "@/api/tenants";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import PDFViewer from "@/components/molecules/pdf-viewer";
import { pdfjs } from "react-pdf";

import { DialogTitle, DialogContent, DialogDescription } from "../../modal";
import { CreateTenantDto } from "@/api/tenants/dto/create-tenant.dto";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type ITenantForm = {
  name: string;
  phone: string;
  email: string;
  profession: string;
};

export default function ViewEditTenantModal() {
  const { toggle, data, open, name } = useModalStore();
  const { updateTenant } = useTenantsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [identityDocument, setIdentityDocument] = useState<File | null>(null);
  const identityFileRef = useRef<HTMLInputElement>(null);
  
  const isModalOpen = open && name === "view-edit-locataire";
  
  const tenant = data?.tenant as any;
  const [identityPreview, setIdentityPreview] = useState<string | null>(tenant?.identityDocument);
  const [documentType, setDocumentType] = useState<"pdf" | "image" | "unknown" | null>(null);
  const modalType = data?.type as "view" | "edit";

  const { handleSubmit, reset, control, getValues } = useForm<ITenantForm>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      profession: "",
    },
  });

  // Helper functions to determine document type
  const isPDF = (url: string) => {
    return url?.toLowerCase().endsWith('.pdf') || url?.includes('application/pdf');
  };

  const isImage = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return imageExtensions.some(ext => url?.toLowerCase().endsWith(ext));
  };

  useEffect(() => {
    if (tenant) {
      reset({
        name: tenant.name || "",
        phone: tenant.phone || "",
        email: tenant.email || "",
        profession: tenant.professions || "",
      });
      
      // Set identity document preview if exists
      if (tenant.identity_document) {
        setIdentityPreview(tenant.identity_document);
        
        // Determine document type
        if (isPDF(tenant.identity_document)) {
          setDocumentType("pdf");
        } else if (isImage(tenant.identity_document)) {
          setDocumentType("image");
        } else {
          setDocumentType("unknown");
        }
      }
    }

    setIsEditing(modalType === "edit");
  }, [tenant, reset, modalType]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Reset identity document changes when canceling edit
    if (isEditing) {
      setIdentityDocument(null);
      setIdentityPreview(tenant?.identity_document || null);
    }
  };

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdentityDocument(file);
      
      // Determine type from file
      if (file.type === 'application/pdf') {
        setDocumentType('pdf');
        setIdentityPreview(URL.createObjectURL(file));
      } else if (file.type.startsWith('image/')) {
        setDocumentType('image');
        const reader = new FileReader();
        reader.onloadend = () => {
          setIdentityPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setDocumentType('unknown');
        toast.error("Format de fichier non supporté");
      }
    }
  };

  const handleRemoveIdentity = () => {
    setIdentityDocument(null);
    setIdentityPreview(tenant?.identity_document || null);
    if (tenant?.identity_document) {
      if (isPDF(tenant.identity_document)) {
        setDocumentType("pdf");
      } else if (isImage(tenant.identity_document)) {
        setDocumentType("image");
      }
    }
    if (identityFileRef.current) {
      identityFileRef.current.value = "";
    }
  };

  const isFormVerified = () => {
    const { name, phone } = getValues();
    if (!name || !phone) return false;
    return true;
  };

  const formatJoinedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  const onSubmit: SubmitHandler<ITenantForm> = async (formData) => {
    if (!tenant) return;

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        professions: formData.profession
      } as Partial<CreateTenantDto>;

      if (identityDocument) {
        payload.identity_document = identityDocument;
      }

      const { data: responseData, error } = await tenantProvider.update(
        tenant.id,
        payload
      );

      if (responseData) {
        toast.success("Locataire mis à jour avec succès");

        const { data: updatedTenant } = await tenantProvider.getById(tenant.id);
        if (updatedTenant) {
          updateTenant(tenant.id, updatedTenant);
        }

        toggle();
      } else {
        if (Array.isArray(error)) {
          error.forEach((err) => {
            toast.error(err);
          });
        } else {
          toast.error(error);
        }
      }
    } catch (error) {
      toast.error(
        "Une erreur s'est produite lors de la mise à jour du locataire"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <>
      <div className="sr-only" id="dialog-title" role="heading" aria-level={1}>
        {isEditing ? "Modifier un locataire" : "Détails du locataire"}
      </div>

      <div className="sm:max-w-[650px] p-6 max-h-[90vh]">
        <DialogDescription className="sr-only">
          {isEditing
            ? "Formulaire pour modifier les informations du locataire"
            : "Détails du profil du locataire"}
        </DialogDescription>

        <div className="w-full flex items-center justify-end">
          <span
            onClick={() => toggle()}
            className="w-8 h-8 flex items-center justify-center border border-primary/30 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
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

        {tenant && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 ring-2 ring-primary/10">
                {tenant.profile_picture ? (
                  <img
                    src={tenant.profile_picture}
                    alt={tenant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-600">
                    {tenant.name?.substring(0, 2).toUpperCase() || "NA"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">{tenant.name}</h3>
                <p className="text-sm text-gray-500">
                  {tenant.professions || "Pas de profession spécifiée"}
                </p>
                {tenant.created_at && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-gray-400"
                    >
                      <path
                        d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Inscrit le {formatJoinedDate(tenant.created_at)}
                  </p>
                )}
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 flex flex-col gap-0"
            >
              {/* ...existing form fields... */}
              <div className="mt-2">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <MUIInput
                      {...field}
                      label="Nom complet"
                      disabled={!isEditing}
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
                              d="M12 5.75C12 7.40685 10.6569 8.75 9 8.75C7.34315 8.75 6 7.40685 6 5.75C6 4.09315 7.34315 2.75 9 2.75C10.6569 2.75 12 4.09315 12 5.75Z"
                              stroke="#9C9FA4"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9 11C6.10051 11 3.75 13.3505 3.75 16.25H14.25C14.25 13.3505 11.8995 11 9 11Z"
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
                  name="phone"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <MUIInput
                      {...field}
                      label="Téléphone"
                      disabled={!isEditing}
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
                              d="M2.25 4.25C2.25 3.42157 2.92157 2.75 3.75 2.75H6.20943C6.53225 2.75 6.81886 2.95657 6.92094 3.26283L8.0443 6.63291C8.16233 6.98699 8.00203 7.37398 7.6682 7.5409L5.97525 8.38737C6.80194 10.2209 8.27909 11.6981 10.1126 12.5247L10.9591 10.8318C11.126 10.498 11.513 10.3377 11.8671 10.4557L15.2372 11.5791C15.5434 11.6811 15.75 11.9677 15.75 12.2906V14.75C15.75 15.5784 15.0784 16.25 14.25 16.25H13.5C7.2868 16.25 2.25 11.2132 2.25 5V4.25Z"
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
                  name="profession"
                  control={control}
                  render={({ field }) => (
                    <MUIInput
                      {...field}
                      label="Profession"
                      disabled={!isEditing}
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
                              d="M6 8.75H12M8.25 12.5H9.75M6 5H12M5.25 16.25H12.75C13.9926 16.25 15 15.2426 15 14V5C15 3.75736 13.9926 2.75 12.75 2.75H5.25C4.00736 2.75 3 3.75736 3 5V14C3 15.2426 4.00736 16.25 5.25 16.25Z"
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
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <MUIInput
                      {...field}
                      label="E-mail"
                      type="email"
                      disabled={!isEditing}
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
                              d="M2.25 6.5L8.16795 10.4453C8.6718 10.7812 9.3282 10.7812 9.83205 10.4453L15.75 6.5M3.75 14.75H14.25C15.0784 14.75 15.75 14.0784 15.75 13.25V5.75C15.75 4.92157 15.0784 4.25 14.25 4.25H3.75C2.92157 4.25 2.25 4.92157 2.25 5.75V13.25C2.25 14.0784 2.92157 14.75 3.75 14.75Z"
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

              {/* Updated Identity Document Section with PDF Support */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-gray-600"
                  >
                    <path
                      d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Pièce d'identité
                </h4>
                
                {identityPreview && documentType !== "unknown" ? (
                  <div className="relative group">
                    <div className="relative w-full rounded-lg overflow-hidden border-2 border-gray-200 max-h-96">
                      {documentType === "pdf" ? (
                        <PDFViewer url={identityPreview} />
                      ) : documentType === "image" ? (
                        <div className="relative w-full h-48">
                          <Image
                            src={identityPreview}
                            alt="Identity document"
                            fill
                            className="object-contain bg-white"
                          />
                        </div>
                      ) : null}
                    </div>
                    
                    {isEditing && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="file"
                          ref={identityFileRef}
                          onChange={handleIdentityChange}
                          accept="image/*,application/pdf"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => identityFileRef.current?.click()}
                          className="flex-1"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2"
                          >
                            <path
                              d="M4 16L8.58579 11.4142C9.36684 10.6332 10.6332 10.6332 11.4142 11.4142L16 16M14 14L15.5858 12.4142C16.3668 11.6332 17.6332 11.6332 18.4142 12.4142L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Changer
                        </Button>
                        {identityDocument && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveIdentity}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2"
                            >
                              <path
                                d="M6 18L18 6M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Annuler
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {!isEditing && identityPreview && (
                      <a
                        href={identityPreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center text-sm text-primary hover:underline"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2"
                        >
                          <path
                            d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Ouvrir dans un nouvel onglet
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          ref={identityFileRef}
                          onChange={handleIdentityChange}
                          accept="image/*,application/pdf"
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="stroke-gray-400"
                            >
                              <path
                                d="M4 16L8.58579 11.4142C9.36684 10.6332 10.6332 10.6332 11.4142 11.4142L16 16M14 14L15.5858 12.4142C16.3668 11.6332 17.6332 11.6332 18.4142 12.4142L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => identityFileRef.current?.click()}
                          >
                            Ajouter une pièce d'identité
                          </Button>
                          <p className="text-xs text-gray-500 mt-1">
                            Formats acceptés: PDF, JPG, PNG
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Aucune pièce d'identité disponible
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* ...existing properties section... */}
              {tenant.properties && tenant.properties.length > 0 ? (
                <div className="mt-6">
                  <h4 className="font-medium text-sm text-gray-700 border-b pb-2 mb-3 flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-gray-600"
                    >
                      <path
                        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 22V12H15V22"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Logements associés
                  </h4>
                  <div className="space-y-2">
                    {tenant.properties.map((property: any, index: number) => (
                      <div
                        key={property.id || index}
                        className="p-3 bg-white rounded-md border border-gray-200 hover:border-primary/30 transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {property.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {property.address}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-gray-600"
                    >
                      <path
                        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Logements associés
                  </h4>
                  <p className="text-sm text-gray-500">
                    Aucun logement associé à ce locataire
                  </p>
                </div>
              )}

              <div className="mt-8 w-full flex justify-end gap-3">
                {!isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => toggle()}
                    >
                      Fermer
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={toggleEditMode}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isFormVerified() || loading}
                    >
                      {loading ? "Chargement..." : "Enregistrer"}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}