import { useModalStore } from "@/store/modal";
import Image from "next/image";
import { Button } from "@/components/atoms/button";
import { toast } from "react-toastify";

export default function DownloadReportModal() {
  const { toggle, data } = useModalStore();

  const handleDownload = () => {
    if (!data) {
      toast.error("Oops, le lien de téléchargement est introuvable");

      return;
    }

    toast.success("Téléchargement en cours...");

    const { url } = data;

    window.open(url as string, "_blank");

    // Close the modal
    toggle();
  };

  return (
    <section className="w-full bg-background p-8">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-MontserratBold"></h2>

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
        <div className="w-full flex flex-col justify-center items-center py-4">
          <Image
            src={"/static/files.svg"}
            alt="files"
            width={640}
            height={640}
            className="size-[150px]"
          />

          <p className="font-MontserratBold mt-4">
            Votre fichier est prêt 😇 !
          </p>
        </div>

        <Button onClick={handleDownload} className="h-12">
          Télécharger
        </Button>
      </div>
    </section>
  );
}
