"use client";

import React, { useState, useMemo } from "react";
import { useBonus } from "@/hooks/useBonus";
import { useModalStore, ModalNames } from "@/store/modal";
import { Bonus, IBonus } from "@/entities/bonus/bonus";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/molecules/table";
import { Button } from "@/components/atoms/button";

const BonusPage = () => {
  const { bonuses, loading } = useBonus();
  const { openModal } = useModalStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "awarded" | "cancelled"
  >("all");

  const filteredBonuses = useMemo(() => {
    return bonuses.filter((bonus) => {
      const matchesSearch =
        bonus.parrain_reference
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        bonus.id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || bonus.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bonuses, searchTerm, statusFilter]);

  const handleViewBonus = (bonus: IBonus) => {
    openModal({
      name: ModalNames.VIEW_BONUS,
      data: bonus as unknown as Record<string, unknown>,
    });
  };

  const handleAwardBonus = (bonus: IBonus) => {
    if (bonus.status === "pending") {
      openModal({
        name: ModalNames.AWARD_BONUS,
        data: bonus as unknown as Record<string, unknown>,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-MontserratBold text-gray-900">
          Gestion des Bonus Parrainage
        </h1>
        <p className="text-gray-600 mt-2">
          Gérez les bonus d'attente et les jalons pour les parrains
        </p>
      </div>

      <div className="flex gap-4 bg-white p-6 rounded-lg border border-border">
        <div className="flex-1">
          <label className="block text-sm font-MontserratBold text-gray-700 mb-2">
            Rechercher
          </label>
          <input
            type="text"
            placeholder="Référence parrain ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-MontserratBold text-gray-700 mb-2">
            Statut
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tous</option>
            <option value="pending">En attente</option>
            <option value="awarded">Attribué</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Chargement des bonus...</p>
        </div>
      ) : filteredBonuses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-border">
          <p className="text-gray-600">Aucun bonus trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead>ID</TableHead>
                <TableHead>Parrain</TableHead>
                <TableHead>Filleuls</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Jalon</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBonuses.map((bonus) => (
                <TableRow key={bonus.id} className="border-b hover:bg-gray-50">
                  <TableCell className="text-xs font-mono">
                    {bonus.id.substring(0, 20)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {bonus.parrain_reference}
                  </TableCell>
                  <TableCell className="font-MontserratBold text-center">
                    {bonus.filleul_count}
                  </TableCell>
                  <TableCell className="font-MontserratBold text-primary text-center">
                    {bonus.bonus_points}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {bonus.milestone}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-MontserratBold ${
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
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewBonus(bonus)}
                      className="inline-block"
                    >
                      Voir
                    </Button>
                    {bonus.status === "pending" && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleAwardBonus(bonus)}
                        className="inline-block"
                      >
                        Attribuer
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-border">
          <p className="text-sm text-gray-600">Total Bonus</p>
          <p className="text-2xl font-MontserratBold text-gray-900 mt-2">
            {bonuses.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-border">
          <p className="text-sm text-gray-600">En Attente</p>
          <p className="text-2xl font-MontserratBold text-yellow-600 mt-2">
            {bonuses.filter((b) => b.status === "pending").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-border">
          <p className="text-sm text-gray-600">Attribués</p>
          <p className="text-2xl font-MontserratBold text-green-600 mt-2">
            {bonuses.filter((b) => b.status === "awarded").length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BonusPage;
