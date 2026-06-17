"use client";

import React, { useState } from "react";
import { useModalStore, ModalNames } from "@/store/modal";
import { IBonus } from "@/entities/bonus/bonus";
import { useBonusStore } from "@/store/bonus";
import { bonusProvider } from "@/api/bonus";
import { Button } from "@/components/atoms/button";
import { toast } from "react-toastify";

const AwardBonusModal = () => {
  const { data, open, toggle } = useModalStore();
  const bonus = data as IBonus | null;
  const { updateBonus } = useBonusStore();
  const [loading, setLoading] = useState(false);

  const handleAwardBonus = async () => {
    if (!bonus) return;

    setLoading(true);
    try {
      // Call the API to award the bonus for this filleul
      if (bonus.filleul_reference) {
        const result = await bonusProvider.getByFilleul(
          bonus.filleul_reference,
        );

        if (result?.data) {
          // Update the bonus status to awarded
          updateBonus(bonus.id, {
            status: "awarded",
            awarded_at: new Date().toISOString(),
          });

          toast.success("Bonus attribué avec succès");
          toggle();
        } else {
          toast.error(result?.error || "Erreur lors de l'attribution du bonus");
        }
      }
    } catch (error) {
      console.error("Error awarding bonus:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !bonus) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-xl w-full">
        <div className="bg-white border-b border-border p-6 flex justify-between items-center">
          <h2 className="text-2xl font-MontserratBold">Attribuer le Bonus</h2>
          <button
            onClick={() => toggle()}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Vous êtes sur le point d'attribuer{" "}
              <span className="font-MontserratBold">
                {bonus.bonus_points} points
              </span>{" "}
              au parrain
              <span className="font-MontserratBold">
                {" "}
                {bonus.parrain_reference}
              </span>{" "}
              pour avoir atteint le jalon de
              <span className="font-MontserratBold">
                {" "}
                {bonus.milestone} filleuls
              </span>
              .
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 border border-border rounded-lg p-4">
              <p className="text-sm text-gray-600 font-MontserratBold">
                ID Bonus
              </p>
              <p className="text-gray-900 mt-1 break-words font-mono text-xs">
                {bonus.id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-border rounded-lg p-4">
                <p className="text-sm text-gray-600 font-MontserratBold">
                  Points
                </p>
                <p className="text-lg font-MontserratBold text-primary mt-1">
                  {bonus.bonus_points}
                </p>
              </div>
              <div className="bg-gray-50 border border-border rounded-lg p-4">
                <p className="text-sm text-gray-600 font-MontserratBold">
                  Jalon
                </p>
                <p className="text-lg font-MontserratBold text-gray-900 mt-1">
                  {bonus.milestone}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900 font-MontserratBold">
              ⚠️ Attention
            </p>
            <p className="text-sm text-yellow-800 mt-2">
              Cette action attribuera les points au parrain. Assurez-vous que
              toutes les conditions sont remplies avant de continuer.
            </p>
          </div>
        </div>

        <div className="bg-white border-t border-border p-6 flex gap-3 justify-end">
          <Button variant="outline" onClick={() => toggle()} disabled={loading}>
            Annuler
          </Button>
          <Button
            variant="default"
            onClick={handleAwardBonus}
            disabled={loading}
            className={loading ? "opacity-50 cursor-not-allowed" : ""}
          >
            {loading ? "Traitement..." : "Attribuer le Bonus"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AwardBonusModal;
