"use client";

import { useModalStore } from "@/store/modal";
import { Button } from "@/components/atoms/button";
import { MUITextarea } from "@/components/atoms/input";
import { DialogTitle } from "../../modal";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Ban,
  UserCheck,
  Shield,
} from "lucide-react";

const actionConfig: Record<
  string,
  {
    icon: React.ReactNode;
    confirmLabel: string;
    confirmVariant?: "default" | "destructive";
    accentColor: string;
  }
> = {
  approve_company: {
    icon: <CheckCircle2 className="w-10 h-10 text-emerald-500" />,
    confirmLabel: "Approuver",
    accentColor: "emerald",
  },
  reject_company: {
    icon: <XCircle className="w-10 h-10 text-red-500" />,
    confirmLabel: "Rejeter",
    confirmVariant: "destructive",
    accentColor: "red",
  },
  suspend_entrepreneur: {
    icon: <Ban className="w-10 h-10 text-red-500" />,
    confirmLabel: "Suspendre",
    confirmVariant: "destructive",
    accentColor: "red",
  },
  activate_entrepreneur: {
    icon: <UserCheck className="w-10 h-10 text-emerald-500" />,
    confirmLabel: "Activer",
    accentColor: "emerald",
  },
};

export default function ConfirmActionModal() {
  const { toggle, data } = useModalStore();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const type = (data?.type as string) || "";
  const title = (data?.title as string) || "Confirmer l'action";
  const description = (data?.description as string) || "";
  const requireReason = data?.requireReason === true;
  const onConfirm = data?.onConfirm as
    | ((reason?: string) => Promise<void>)
    | undefined;

  const config = actionConfig[type] || {
    icon: <AlertTriangle className="w-10 h-10 text-amber-500" />,
    confirmLabel: "Confirmer",
    accentColor: "amber",
  };

  const handleConfirm = async () => {
    if (!onConfirm) return;
    setLoading(true);
    try {
      await onConfirm(requireReason ? reason : undefined);
      toggle();
    } catch {
      // Error handled by caller
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <DialogTitle />

      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4">{config.icon}</div>

        {/* Title */}
        <h3 className="text-xl font-MontserratBold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm max-w-sm mb-6">{description}</p>

        {/* Reason textarea for rejections */}
        {requireReason && (
          <div className="w-full mb-6">
            <label className="block text-sm font-MontserratSemiBold text-gray-700 mb-2 text-left">
              Motif du rejet (optionnel)
            </label>
            <MUITextarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquez la raison du rejet..."
              label=""
              rows={3}
              className="w-full"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 w-full">
          <Button
            onClick={() => toggle()}
            variant="outline"
            className="flex-1 h-11"
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            variant={config.confirmVariant || "default"}
            className="flex-1 h-11"
            disabled={loading}
          >
            {loading ? "Traitement..." : config.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
