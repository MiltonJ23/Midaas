"use client";

import { filleulProvider } from "@/api/filleuls";
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
import Filleul from "@/entities/filleuls/filleul";
import useGetFilleuls from "@/hooks/useFilleuls";
import { useFilleulsStore } from "@/store/filleuls";
import { ModalNames, useModalStore } from "@/store/modal";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function FilleulsPage() {
  useGetFilleuls({ page: 1 });

  const { filleuls } = useFilleulsStore();
  const { openModal } = useModalStore();

  const [search, setSearch] = useState("");
  const [detailLoading, setDetailLoading] = useState<string | null>(null);

  const filteredFilleuls = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return filleuls;

    return filleuls.filter((filleul) => {
      return (
        filleul.userFilleulReference.toLowerCase().includes(normalized) ||
        filleul.codeParrainage.toLowerCase().includes(normalized) ||
        filleul.id.toLowerCase().includes(normalized)
      );
    });
  }, [filleuls, search]);

  const handleFetchDetail = async (parrainId: string, filleul: Filleul) => {
    if (!parrainId) return;

    setDetailLoading(parrainId);
    const { data, error } = await filleulProvider.getById(parrainId);

    if (data) {
      openModal({
        name: ModalNames.VIEW_FILLEUL,
        data: {
          parrainId,
          filleul: data ?? filleul,
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
            Filleuls
          </h1>
          <div className="w-full md:w-[480px] flex gap-3">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un filleul"
            />
            <Button onClick={() => openModal({ name: ModalNames.ADD_FILLEUL })}>
              Ajouter
            </Button>
          </div>
        </div>

        <div className="w-full bg-background rounded-2xl p-6">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead>ID</TableHead>
                <TableHead>Référence filleul</TableHead>
                <TableHead>Code parrainage</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFilleuls.length > 0 ? (
                filteredFilleuls.map((filleul) => (
                  <TableRow
                    key={`${filleul.id}-${filleul.userFilleulReference}`}
                  >
                    <TableCell>{filleul.id || "-"}</TableCell>
                    <TableCell>{filleul.userFilleulReference || "-"}</TableCell>
                    <TableCell>{filleul.codeParrainage || "-"}</TableCell>
                    <TableCell>{filleul.createdAt || "-"}</TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const parrainId =
                          (filleul.raw?.parrain?.id as string | undefined) ??
                          "";

                        return (
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleFetchDetail(parrainId, filleul)
                            }
                            disabled={detailLoading === parrainId || !parrainId}
                          >
                            {detailLoading === parrainId
                              ? "Chargement..."
                              : "Voir détails"}
                          </Button>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Aucun filleul trouvé
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
