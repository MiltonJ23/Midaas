import { useModalStore } from "@/store/modal";
import { useCallback, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/atoms/select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { useLoadAllProperties } from "@/hooks/useProperties";
import { MUIInput } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import FileItem from "@/components/molecules/file-item";
import { displayFileSize } from "@/lib/format";
import { CreateAnnouncementNotificationDto } from "@/api/notifications/dto";
import { notificationProvider } from "@/api/notifications";
import { toast } from "react-toastify";

type RadioProps = {
  label: string;
  icon: React.ReactNode;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
};

export const Radio = ({ name, icon, value, checked, onChange }: RadioProps) => {
  return (
    <div
      onClick={() => {
        console.log("");
        onChange(value);
      }}
      className={twMerge(
        "w-full rounded-md p-4 bg-white border flex items-center justify-between cursor-pointer transition-all duration-300",
        checked ? "border-primary" : "border-transparent",
      )}
    >
      <div className="flex items-center gap-4">
        <span>{icon}</span>
        <span>{name}</span>
      </div>

      <span
        className={twMerge(
          "size-4 rounded-full transition-all duration-300",
          checked ? "bg-primary" : "bg-gray-200",
        )}
      ></span>
    </div>
  );
};

interface IForm {
  propertyId: string;
  title: string;
  message: string;
}

export default function PublishCommuniqueModal() {
  const { properties, buildings } = useLoadAllProperties();
  // const { buildings } = useLoadAllProperties();

  const { toggle } = useModalStore();

  // State
  const [target, setTarget] = useState("all_tenants");
  const [channel, setChannel] = useState("email");
  const [loading, setLoading] = useState(false);

  const photoRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<File | null>(null);

  const { control, handleSubmit, watch } = useForm<IForm>({
    defaultValues: {
      propertyId: "default",
      title: "",
      message: "",
    },
  });

  const title = watch("title");
  const message = watch("message");
  const propertyId = watch("propertyId");

  const filteredBuildingsAndAppartments = useMemo(() => {
    return [...(properties ?? []), ...(buildings ?? [])];
  }, [properties, buildings]);

  const handleOpenFileExplorer = () => {
    photoRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) return;

    const file = e.target.files[0];

    setPhoto(file);
  };

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    const isBuilding = (buildings ?? []).some((b) => b.id === data.propertyId);

    const computedTarget = isBuilding ? "building" : target;

    const payload: CreateAnnouncementNotificationDto = {
      notification_title: data.title,
      notification_message: data.message,
      notification_channel: channel as "email" | "push_notification",
      target: computedTarget as "all_tenants" | "tenants" | "building",
      properties_id: data.propertyId,
      attachment: photo ?? undefined,
    };

    setLoading(true);

    // Call API
    const { data: response, error } =
      await notificationProvider.publishAnnouncementNotification(payload);

    setLoading(false);

    console.log("Here is the response", response);

    if (response) {
      toast.info(response.message);
      toggle();
    } else if (error) {
      toast.error(error);
    } else {
      toast.error("Erreur lors de l'envoi du communiqué");
    }
  };

  const verifyForm = useCallback(() => {
    if (!title || !message) {
      return false;
    }

    if (target === "tenants" && propertyId === "default") {
      return false;
    }

    return true;
  }, [title, message, propertyId, target]);

  return (
    <section className="w-full bg-light-gray p-8">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-MontserratBold">Publier un communiqué</h2>

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

      <div className="mt-4 flex flex-col gap-4">
        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Radio
            label="Tous les utilisateurs"
            name="Tous les utilisateurs"
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            value={"all_tenants"}
            checked={target === "all_tenants"}
            onChange={setTarget}
          />
          <Radio
            label="Immeuble ou proprieté"
            name="Immeuble ou proprieté"
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            value={"tenants"}
            checked={target === "tenants"}
            onChange={setTarget}
          />

          <AnimatePresence>
            {target === "tenants" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Controller
                  name="propertyId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={(v) => field.onChange(v)}
                      defaultValue="default"
                    >
                      <SelectTrigger className="h-12 bg-white">
                        <SelectValue></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="default"
                          className="text-black/40"
                          disabled
                        >
                          Selectioner un immeuble ou une proprieté
                        </SelectItem>

                        {(properties ?? []).length > 0 && (
                          <>
                            <SelectItem
                              value="header-properties"
                              disabled
                              className="text-black/60 cursor-default"
                            >
                              Propriétés
                            </SelectItem>
                            {properties!.map((property) => (
                              <SelectItem key={property.id} value={property.id}>
                                {property.name}
                              </SelectItem>
                            ))}
                          </>
                        )}

                        {(buildings ?? []).length > 0 && (
                          <>
                            <SelectItem
                              value="header-buildings"
                              disabled
                              className="text-black/60 cursor-default"
                            >
                              Immeubles
                            </SelectItem>
                            {buildings!.map((building) => (
                              <SelectItem key={building.id} value={building.id}>
                                {building.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* <div className="w-full mt-4 flex flex-col gap-4">
            <span>Par</span>
            <Radio
              label="Envoyer par mail"
              name="Envoyer par mail"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              value={"email"}
              checked={channel === "email"}
              onChange={setChannel}
            />
            <Radio
              label="Notification"
              name="Notification"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              value={"push_notification"}
              checked={channel === "push_notification"}
              onChange={setChannel}
            />
         */}

          <Controller
            name="title"
            control={control}
            rules={{ required: "Le titre est requis" }}
            render={({ field }) => (
              <MUIInput {...field} label="Titre" required />
            )}
          />

          <Controller
            name="message"
            control={control}
            rules={{ required: "Le message est requis" }}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {/* label text */}Message
                </label>
                <textarea
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  rows={6}
                  placeholder="Écrivez votre message ici..."
                  required
                  className="w-full bg-white border border-border rounded-md p-3 resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          />

          <div className="mt-3">
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

          <Button type="submit" className="h-12" disabled={!verifyForm()}>
            {loading ? "En cours..." : "Envoyer le communiqué"}
          </Button>
        </form>
      </div>
    </section>
  );
}
