"use client";

import { filleulProvider } from "@/api/filleuls";
import Filleul from "@/entities/filleuls/filleul";
import { useModalStore } from "@/store/modal";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function ViewFilleulModal() {
  const { toggle, data } = useModalStore();
  const [loading, setLoading] = useState(false);
  const [filleul, setFilleul] = useState<Filleul | null>(
    (data?.filleul as Filleul) || null,
  );

  const parrainId = useMemo(() => {
    const modalParrainId = data?.parrainId as string | undefined;
    if (modalParrainId) return modalParrainId;
    if ((data?.filleul as Filleul | undefined)?.raw?.parrain?.id) {
      return (data?.filleul as Filleul).raw.parrain.id;
    }
    return "";
  }, [data]);

  useEffect(() => {
    if (!parrainId) return;

    (async () => {
      setLoading(true);
      const { data: detail, error } = await filleulProvider.getById(parrainId);

      if (detail) {
        setFilleul(detail);
      } else if (error) {
        toast.error(error);
      }

      setLoading(false);
    })();
  }, [parrainId]);

  return (
    <section className="w-full p-8">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-MontserratBold">Détails du filleul</h2>

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

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Chargement des détails...</p>
      ) : filleul ? (
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Référence utilisateur
              </p>
              <p className="mt-1 text-sm font-MontserratSemiBold break-all">
                {String(
                  filleul.raw?.userReference ??
                    filleul.userFilleulReference ??
                    "-",
                )}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Points
              </p>
              <p className="mt-1 text-sm font-MontserratSemiBold">
                {String(filleul.raw?.points ?? 0)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Statut
              </p>
              <p className="mt-1 text-sm font-MontserratSemiBold">
                {filleul.raw?.isNew ? "Nouveau" : "Actif"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Parrain
              </p>
              <p className="mt-1 text-sm font-MontserratSemiBold break-all">
                {String(filleul.raw?.parrain?.id ?? "-")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-MontserratBold">
              Informations du parrain
            </h3>
            <div className="mt-3 rounded-lg border border-border bg-gray-50 p-3">
              <p className="text-xs text-gray-500">ID</p>
              <p className="text-sm break-all">
                {String(filleul.raw?.parrain?.id ?? "-")}
              </p>
              <p className="mt-2 text-xs text-gray-500">Code parrainage</p>
              <p className="text-sm">
                {String(filleul.raw?.parrain?.codeParrainage ?? "-")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-MontserratBold">Coupons</h3>
            {Array.isArray(filleul.raw?.coupons) &&
            filleul.raw.coupons.length > 0 ? (
              <div className="mt-3 max-h-[260px] overflow-auto space-y-2">
                {filleul.raw.coupons.map((coupon: any) => (
                  <div
                    key={String(coupon.id)}
                    className="rounded-lg border border-border bg-gray-50 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-MontserratSemiBold">
                        Coupon #{String(coupon.id ?? "-")}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-full bg-white border border-border">
                        {coupon.isAvailable ? "Disponible" : "Utilisé"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Valeur</p>
                    <p className="text-sm">{String(coupon.value ?? 0)}%</p>
                    <p className="mt-2 text-xs text-gray-500">Raison</p>
                    <p className="text-sm break-words">
                      {String(coupon.reason ?? "-")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Aucun coupon disponible.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-gray-500">
          Aucune information disponible.
        </p>
      )}
    </section>
  );
}
