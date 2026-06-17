"use client";

import { parrainProvider } from "@/api/parrains";
import Parrain from "@/entities/parrains/parrain";
import { useModalStore } from "@/store/modal";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function ViewParrainModal() {
  const { toggle, data } = useModalStore();
  const [loading, setLoading] = useState(false);
  const [parrain, setParrain] = useState<Parrain | null>(
    (data?.parrain as Parrain) || null,
  );

  const userReference = useMemo(() => {
    const modalReference = data?.userReference as string | undefined;
    if (modalReference) return modalReference;
    if ((data?.parrain as Parrain | undefined)?.userReference) {
      return (data?.parrain as Parrain).userReference;
    }
    return "";
  }, [data]);

  useEffect(() => {
    if (!userReference) return;

    (async () => {
      setLoading(true);
      const { data: detail, error } =
        await parrainProvider.getById(userReference);

      if (detail) {
        setParrain(detail);
      } else if (error) {
        toast.error(error);
      }

      setLoading(false);
    })();
  }, [userReference]);

  return (
    <section className="w-full p-8">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-MontserratBold">Détails du parrain</h2>

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
      ) : parrain ? (
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Référence utilisateur
              </p>
              <p className="mt-1 text-sm font-MontserratSemiBold break-all">
                {String(
                  parrain.raw?.userReference ?? parrain.userReference ?? "-",
                )}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Code parrainage
              </p>
              <p className="mt-1 text-sm font-MontserratSemiBold">
                {String(
                  parrain.raw?.codeParrainage ?? parrain.codeParrainage ?? "-",
                )}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Points
              </p>
              <p className="mt-1 text-sm font-MontserratSemiBold">
                {String(parrain.raw?.points ?? 0)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Nombre de filleuls
              </p>
              <p className="mt-1 text-sm font-MontserratSemiBold">
                {Array.isArray(parrain.raw?.filleuls)
                  ? parrain.raw.filleuls.length
                  : 0}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-MontserratBold">Filleuls associés</h3>
            {Array.isArray(parrain.raw?.filleuls) &&
            parrain.raw.filleuls.length > 0 ? (
              <div className="mt-3 max-h-[220px] overflow-auto space-y-2">
                {parrain.raw.filleuls.map((filleul: any) => (
                  <div
                    key={String(filleul.id)}
                    className="rounded-lg border border-border bg-gray-50 p-3"
                  >
                    <p className="text-xs text-gray-500">ID</p>
                    <p className="text-sm break-all">
                      {String(filleul.id ?? "-")}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">Référence</p>
                    <p className="text-sm break-all">
                      {String(filleul.userReference ?? "-")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Aucun filleul associé.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-MontserratBold">Coupons</h3>
            {Array.isArray(parrain.raw?.coupons) &&
            parrain.raw.coupons.length > 0 ? (
              <div className="mt-3 max-h-[260px] overflow-auto space-y-2">
                {parrain.raw.coupons.map((coupon: any) => (
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
