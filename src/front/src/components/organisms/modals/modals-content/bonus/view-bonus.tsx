"use client";

import React, { useMemo } from "react";
import { useModalStore, ModalNames } from "@/store/modal";
import { IBonus } from "@/entities/bonus/bonus";
import { Button } from "@/components/atoms/button";

const ViewBonusModal = () => {
  const { data, open, toggle } = useModalStore();
  const bonus = data as IBonus | null;

  const parrain = useMemo(() => {
    return bonus?.raw;
  }, [bonus]);

  if (!open || !bonus) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-6 flex justify-between items-center">
          <h2 className="text-2xl font-MontserratBold">Détails du Bonus</h2>
          <button
            onClick={() => toggle()}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-border rounded-xl p-4">
              <p className="text-sm text-gray-600 font-MontserratBold">
                ID Bonus
              </p>
              <p className="text-lg font-MontserratBold text-gray-900 mt-1 break-words">
                {bonus.id}
              </p>
            </div>
            <div className="bg-gray-50 border border-border rounded-xl p-4">
              <p className="text-sm text-gray-600 font-MontserratBold">
                Parrain
              </p>
              <p className="text-lg font-MontserratBold text-gray-900 mt-1">
                {bonus.parrain_reference}
              </p>
            </div>
            <div className="bg-gray-50 border border-border rounded-xl p-4">
              <p className="text-sm text-gray-600 font-MontserratBold">
                Points Bonus
              </p>
              <p className="text-lg font-MontserratBold text-primary mt-1">
                {bonus.bonus_points}
              </p>
            </div>
            <div className="bg-gray-50 border border-border rounded-xl p-4">
              <p className="text-sm text-gray-600 font-MontserratBold">
                Statut
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-MontserratBold mt-1 ${
                  bonus.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : bonus.status === "awarded"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {bonus.status === "pending"
                  ? "En attente"
                  : bonus.status === "awarded"
                    ? "Attribué"
                    : "Annulé"}
              </span>
            </div>
          </div>

          {/* Bonus Details */}
          <div className="border-t border-border pt-5">
            <h3 className="font-MontserratBold text-lg text-gray-900 mb-4">
              Détails du Bonus
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Jalon</p>
                <p className="font-MontserratBold text-gray-900 mt-1">
                  {bonus.milestone} filleuls
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Filleuls Actuels</p>
                <p className="font-MontserratBold text-gray-900 mt-1">
                  {bonus.filleul_count}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date de Création</p>
                <p className="font-MontserratBold text-gray-900 mt-1">
                  {bonus.created_at
                    ? new Date(bonus.created_at).toLocaleDateString("fr-FR")
                    : "N/A"}
                </p>
              </div>
              {bonus.awarded_at && (
                <div>
                  <p className="text-sm text-gray-600">Date d'Attribution</p>
                  <p className="font-MontserratBold text-gray-900 mt-1">
                    {new Date(bonus.awarded_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Parrain Info */}
          {parrain && (
            <div className="border-t border-border pt-5">
              <h3 className="font-MontserratBold text-lg text-gray-900 mb-4">
                Informations Parrain
              </h3>
              <div className="bg-gray-50 border border-border rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Référence</p>
                    <p className="font-MontserratBold text-gray-900 mt-1">
                      {parrain.userReference}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Code Parrainage</p>
                    <p className="font-MontserratBold text-gray-900 mt-1">
                      {parrain.codeParrainage}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Points Totaux</p>
                    <p className="font-MontserratBold text-primary mt-1">
                      {parrain.points || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Filleuls Totaux</p>
                    <p className="font-MontserratBold text-gray-900 mt-1">
                      {parrain.filleuls?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filleuls List */}
          {parrain?.filleuls && parrain.filleuls.length > 0 && (
            <div className="border-t border-border pt-5">
              <h3 className="font-MontserratBold text-lg text-gray-900 mb-4">
                Filleuls ({parrain.filleuls.length})
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2 border border-border rounded-lg p-3 bg-gray-50">
                {parrain.filleuls.map((filleul: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border border-border rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-MontserratBold text-gray-900">
                        {filleul.userReference ||
                          filleul.user_reference ||
                          "N/A"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{filleul.id}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {filleul.points || 0} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-border p-6 flex gap-3 justify-end">
          <Button variant="outline" onClick={() => toggle()}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewBonusModal;
