"use client";

import { authProvider } from "@/api/auth";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/atoms/button";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Briefcase,
  TrendingUp,
  Loader,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface Props {
  onDismiss?: () => void;
}

export default function OnboardingBanner({ onDismiss }: Props) {
  const { user, loadUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (
    !user ||
    dismissed ||
    user.isEntrepreneur ||
    user.entrepreneurStatus === "pending"
  ) {
    return null;
  }

  const handleBecomeEntrepreneur = async () => {
    setLoading(true);

    const { data, error } = await authProvider.becomeEntrepreneur();

    if (data) {
      toast.success("Demande envoyée ! En attente de validation.");
      const { data: refreshed } = await authProvider.refreshUser();
      if (refreshed?.user) {
        loadUser(refreshed.user);
      }
      setDismissed(true);
    } else {
      toast.error(error || "Une erreur est survenue");
    }

    setLoading(false);
  };

  const handleStayInvestor = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
      <button
        onClick={handleStayInvestor}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors z-10"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">
            Bienvenue sur Midaas !
          </h3>
          <p className="text-slate-500 mt-1 max-w-2xl text-sm leading-relaxed">
            Découvrez comment vous souhaitez participer à notre plateforme de
            financement participatif.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button
            onClick={handleBecomeEntrepreneur}
            disabled={loading}
            className="gap-2 min-w-[200px]"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Briefcase className="w-4 h-4" />
                Je suis entrepreneur
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <Button
            onClick={handleStayInvestor}
            variant="outline"
            className="gap-2 min-w-[200px]"
          >
            <TrendingUp className="w-4 h-4" />
            Je suis investisseur
          </Button>
        </div>
      </div>
    </div>
  );
}
