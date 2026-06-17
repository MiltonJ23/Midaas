"use client";

import { parrainProvider } from "@/api/parrains";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/molecules/table";
import useGetParrains from "@/hooks/useParrains";
import Parrain from "@/entities/parrains/parrain";
import { useParrainsStore } from "@/store/parrains";
import { ModalNames, useModalStore } from "@/store/modal";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function ParrainsPage() {
  useGetParrains({ page: 1 });

  const { parrains } = useParrainsStore();
  const { openModal } = useModalStore();

  const [search, setSearch] = useState("");
  const [detailLoading, setDetailLoading] = useState<string | null>(null);

  const filteredParrains = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return parrains;

    return parrains.filter((parrain) => {
      return (
        parrain.userReference.toLowerCase().includes(normalized) ||
        parrain.codeParrainage.toLowerCase().includes(normalized) ||
        parrain.id.toLowerCase().includes(normalized)
      );
    });
  }, [parrains, search]);

  const handleFetchDetail = async (reference: string) => {
    if (!reference) return;

    setDetailLoading(reference);
    const { data, error } = await parrainProvider.getById(reference);

    if (data) {
      openModal({
        name: ModalNames.VIEW_PARRAIN,
        data: {
          userReference: reference,
          parrain: data,
        },
      });
    } else {
      toast.error(error);
    }

    setDetailLoading(null);
  };

  return (
    <section className="p-6">
      <div className="max-w-[1400px] mx-auto mt-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-MontserratBold text-gray-900">
            Parrains
          </h1>
          <div className="w-full md:w-[480px] flex gap-3">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un parrain"
            />
            <Button onClick={() => openModal({ name: ModalNames.ADD_PARRAIN })}>
              Ajouter
            </Button>
          </div>
        </div>

        <div className="w-full bg-background rounded-2xl p-6">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead>ID</TableHead>
                <TableHead>Référence utilisateur</TableHead>
                <TableHead>Code parrainage</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParrains.length > 0 ? (
                filteredParrains.map((parrain) => (
                  <TableRow key={`${parrain.id}-${parrain.userReference}`}>
                    <TableCell>{parrain.id || "-"}</TableCell>
                    <TableCell>{parrain.userReference || "-"}</TableCell>
                    <TableCell>{parrain.codeParrainage || "-"}</TableCell>
                    <TableCell>{parrain.createdAt || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => handleFetchDetail(parrain.userReference)}
                        disabled={
                          detailLoading === parrain.userReference ||
                          !parrain.userReference
                        }
                      >
                        {detailLoading === parrain.userReference
                          ? "Chargement..."
                          : "Voir détails"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Aucun parrain trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
