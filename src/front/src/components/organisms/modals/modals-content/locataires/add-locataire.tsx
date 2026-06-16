import { useModalStore } from "@/store/modal";
import { MUIInput } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { DialogTitle } from "../../modal";
import FileItem from "@/components/molecules/file-item";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { tenantProvider } from "@/api/tenants";
import { toast } from "react-toastify";
import { CreateTenantDto } from "@/api/tenants/dto/create-tenant.dto";
import { useTenantsStore } from "@/store/tenants";
import { displayFileSize } from "@/lib/format";

type IAddLocataireForm = {
  name: string;
  phone: string;
  email: string;
  profession: string;
};

export default function AddLocataireModal() {
  const { toggle, data } = useModalStore();
  const { addTenant } = useTenantsStore();

  const { handleSubmit, reset, control, getValues } =
    useForm<IAddLocataireForm>({
      defaultValues: {
        name: "",
        phone: "",
        email: "",
        profession: "",
      },
    });

  const identityFileRef = useRef<HTMLInputElement>(null);
  const profileFileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  // const [passwordViewed, setPasswordViewed] = useState(false);

  const handleOpenFileExplorer = (type: "identity" | "profile") => {
    if (type === "identity") {
      identityFileRef.current?.click();
    } else {
      profileFileRef.current?.click();
    }
  };

  const handleChangeFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "identity" | "contract" | "profile"
  ) => {
    e.preventDefault();

    if (!e.target.files) return;

    const file = e.target.files[0];

    if (type === "identity") {
      setIdentityFile(file);
    } else {
      setProfileFile(file);
    }
  };

  const isFormVerified = () => {
    if (!identityFile || !profileFile) return false;

    const { name, phone, email, profession } = getValues();

    if (!name || !phone || !email || !profession) return false;

    return true;
  };

  const onSubmit: SubmitHandler<IAddLocataireForm> = async (data) => {
    if (!identityFile || !profileFile) return;

    const payload: CreateTenantDto = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      professions: data.profession,
      // password: data.password,
      identity_document: identityFile,
      profile_picture: profileFile,
    };

    setLoading(true);

    // Call the API here
    const { data: responseData, error } = await tenantProvider.create(payload);

    console.log("J'ajoutemon locataire", responseData);

    if (responseData) {
      // Get tenant by id
      const { data: tenant } = await tenantProvider.getById(
        responseData.id?.toString()
      );

      toast.success(responseData.message);

      // Update the store with the new tenant
      if (tenant) {
        addTenant(tenant);
      } else {
        toast.error(
          "Une erreur s'est produite lors de la récupération du locataire, veuillez rafraichir la page"
        );
      }

      reset();
      toggle();
    } else {
      console.log("");
      // Handle field validation errors that come as a string with newline separators
      if (error && typeof error === "string" && error.includes("\n")) {
        // Split the error string by newlines to get individual field errors
        const fieldErrors = error
          .split("\n")
          .filter((err) => err.trim() !== "");
        fieldErrors.forEach((err) => {
          toast.error(err);
        });
      } else if (error) {
        // Handle single error message
        toast.error(error);
      } else {
        toast.error("Une erreur inattendue s'est produite");
      }
    }

    setLoading(false);
  };

  return (
    <section className="w-full p-8">
      <div className="w-full flex items-center justify-between">
        <DialogTitle>
          {data?.type === "create"
            ? "Ajouter un locataire"
            : "Modifier un locataire"}
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-0"
      >
        <div className="mt-2">
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <MUIInput
                {...field}
                label="Nom complet"
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
            rules={{ required: true }}
            render={({ field }) => (
              <MUIInput
                {...field}
                label="Profession"
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
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <MUIInput
                {...field}
                label="E-mail"
                type="email"
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

        {/* <div className='mt-2'>
					<Controller
						name='password'
						control={control}
						rules={{ required: true }}
						render={({ field }) => (
							<MUIInput
								{...field}
								label='Mot de passe'
								type={passwordViewed ? "text" : "password"}
								after={
									<div
										className='mr-4 cursor-pointer'
										onClick={() => setPasswordViewed((prev) => !prev)}
									>
										{passwordViewed ? (
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z'
													stroke='#9c9fa4'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z'
													stroke='#9c9fa4'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										) : (
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M3 3L6.58916 6.58916M21 21L17.4112 17.4112M13.8749 18.8246C13.2677 18.9398 12.6411 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12C2.80515 10.8955 3.33851 9.87361 4.02143 8.97118M9.87868 9.87868C10.4216 9.33579 11.1716 9 12 9C13.6569 9 15 10.3431 15 12C15 12.8284 14.6642 13.5784 14.1213 14.1213M9.87868 9.87868L14.1213 14.1213M9.87868 9.87868L6.58916 6.58916M14.1213 14.1213L6.58916 6.58916M14.1213 14.1213L17.4112 17.4112M6.58916 6.58916C8.14898 5.58354 10.0066 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.8357 14.2507 19.3545 16.1585 17.4112 17.4112'
													stroke='#9c9fa4'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										)}
									</div>
								}
								className='pl-4'
							/>
						)}
					/>
				</div> */}

        <div className="mt-4">
          {identityFile ? (
            <FileItem
              name={identityFile.name}
              size={displayFileSize(identityFile.size)}
              type={identityFile.type.split("/")[1] === "pdf" ? "pdf" : "image"}
              url="/static/files.svg"
              onDelete={() => setIdentityFile(null)}
            />
          ) : (
            <MUIInput
              className="w-full"
              label="Pièce d'identité"
              placeholderShown={false}
              componentType="file"
              before={
                <div
                  onClick={() => handleOpenFileExplorer("identity")}
                  className="h-full cursor-pointer px-4 flex items-center border-r-2 border-r-border bg-primary/10 text-[12px]"
                >
                  Insérer un fichier
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
        </div>

        <div className="mt-4">
          {profileFile ? (
            <FileItem
              name={profileFile.name}
              size={displayFileSize(profileFile.size)}
              type={profileFile.type.split("/")[1] === "pdf" ? "pdf" : "image"}
              url="/static/files.svg"
              onDelete={() => setProfileFile(null)}
            />
          ) : (
            <MUIInput
              className="w-full"
              label="Photo de profil"
              placeholderShown={false}
              componentType="file"
              before={
                <div
                  onClick={() => handleOpenFileExplorer("profile")}
                  className="h-full cursor-pointer px-4 flex items-center border-r-2 border-r-border bg-primary/10 text-[12px]"
                >
                  Insérer un fichier
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
        </div>

        <input
          type="file"
          hidden
          ref={identityFileRef}
          onChange={(e) => handleChangeFile(e, "identity")}
          accept="application/pdf, image/*"
        />
        <input
          type="file"
          hidden
          ref={profileFileRef}
          onChange={(e) => handleChangeFile(e, "profile")}
          accept="image/*"
        />

        <div className="mt-8 w-full">
          <Button
            type="submit"
            className="h-12 w-full"
            disabled={!isFormVerified() || loading}
          >
            {loading
              ? "Chargement..."
              : data?.type === "create"
              ? "Ajouter un locataire"
              : "Modifier un locataire"}
          </Button>
        </div>
      </form>
    </section>
  );
}
