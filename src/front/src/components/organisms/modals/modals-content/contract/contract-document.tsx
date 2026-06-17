import { useModalStore } from "@/store/modal";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/atoms/button";
import Image from "next/image";
import PDFViewer from "@/components/molecules/pdf-viewer";
import { pdfjs } from "react-pdf";
import Contract from "@/entities/rentals/contract";
import { useEffect, useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function ContractDocumentDetailsModal() {
  const { toggle, data } = useModalStore();
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<
    "pdf" | "image" | "unknown" | null
  >(null);

  // Make sure we have a contract object
  const contract = data && (data as { contract?: Contract }).contract;

  console.log("");

  useEffect(() => {
    if (!contract) {
      setError("Contract data is missing");
      return;
    }

    // Check if we have a contract URL
    if (!contract.rental_contract_file_url) {
      setError("Contract document URL is missing");
      return;
    }

    // Determine document type
    if (contract.isPDF(contract.rental_contract_file_url)) {
      setDocumentType("pdf");
    } else if (contract.isImage(contract.rental_contract_file_url)) {
      setDocumentType("image");
    } else {
      setDocumentType("unknown");
      setError("Unsupported document format");
    }
  }, [contract]);

  if (!user) return null;
  if (!contract) return <div className="p-8">Loading contract data...</div>;

  return (
    <section className="w-full bg-background p-8">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-MontserratBold">{"Document du contrat"}</h2>

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
        <div className="w-full">
          {error ? (
            <div className="p-8 text-center text-red-500">
              <p>{error}</p>
              <p className="text-sm mt-2">
                URL: {contract.rental_contract_file_url || "No URL available"}
              </p>
            </div>
          ) : documentType === "image" ? (
            <Image
              src={contract.rental_contract_file_url}
              alt="Document"
              width={400}
              height={400}
              className="w-full h-auto"
            />
          ) : documentType === "pdf" ? (
            <PDFViewer url={contract.rental_contract_file_url} />
          ) : (
            <div className="p-8 text-center">
              <p>Loading document...</p>
            </div>
          )}
        </div>

        <div className="w-full flex items-center gap-4">
          <Button
            onClick={() => toggle()}
            className="h-12 w-full text-md font-MontserratBold bg-primary/10 hover:bg-primary/20 text-rprimary"
          >
            Fermer
          </Button>
          {contract?.rental_contract_file_url && documentType !== "unknown" && (
            <a
              href={contract.rental_contract_file_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-full flex items-center justify-center text-md font-MontserratBold bg-primary/10 hover:bg-primary/20 text-rprimary rounded"
            >
              Télécharger
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
