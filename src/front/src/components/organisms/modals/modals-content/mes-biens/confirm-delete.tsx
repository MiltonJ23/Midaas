"use client";

import { Button } from "@/components/atoms/button";
import { useModalStore } from "@/store/modal";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ConfirmDelete() {
  const { toggle, data } = useModalStore();
  const [isDeleting, setIsDeleting] = useState(false);

  // Get data from modal store
  const {
    title = "Confirmer la suppression",
    description = "",
    itemName = "cet élément",
    onConfirm = () => Promise.resolve(),
    isLoading = false,
  } = data as { 
    title?: string; 
    description?: string; 
    itemName?: string; 
    onConfirm?: () => Promise<any>; 
    isLoading?: boolean; 
  } || { onConfirm: () => Promise.resolve() };

  const handleConfirm = async () => {
    if (!onConfirm) return;
    
    try {
      setIsDeleting(true);
      await onConfirm();
      toggle();
    } catch (error) {
      console.error("Error during deletion:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const defaultDescription = `Êtes-vous sûr de vouloir supprimer ${itemName} ? Cette action est irréversible.`;

  return (
    <div className="sm:max-w-[550px] p-6">
      {/* Invisible but accessible title for screen readers */}
      <div className="sr-only" id="dialog-title" role="heading" aria-level={1}>
        {title}
      </div>

      {/* Accessible description for screen readers */}
      <div className="sr-only" id="dialog-description">
        {description || defaultDescription}
      </div>

      <div className="w-full flex items-center justify-end">
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
            aria-hidden="true"
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

      <div className="flex items-center gap-4 my-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-red-600"
            aria-hidden="true"
          >
            <path
              d="M3 6H5H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 11V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {description || defaultDescription}
          </p>
        </div>
      </div>
        
      <div className="mt-8 flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={() => toggle()}
          disabled={isDeleting || isLoading}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirm}
          disabled={isDeleting || isLoading}
          className="flex-1"
        >
          {isDeleting || isLoading ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Suppression...
            </div>
          ) : (
            "Supprimer"
          )}
        </Button>
      </div>
    </div>
  );
}