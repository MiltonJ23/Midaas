"use client";

import { Button } from "@/components/atoms/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/molecules/table";
import { Input } from "@/components/atoms/input";
import Image from "next/image";
import { useState, useMemo } from "react";
import { ModalNames, useModalStore } from "@/store/modal";
import { toast } from "react-toastify";
import {
  withBulkDelete,
  BulkDeleteProps,
} from "@/components/hoc/with-bulk-delete";

// Mock transport data - Replace with actual API call later
const mockTransports = [
  {
    id: 1,
    clientImage: "/api/placeholder/40/40",
    clientName: "Jugalax kimmy Black",
    type: "Aller simple",
    pickupLocation: "Avenue azerty",
    returnLocation: "Avenue kwerty",
    date: "20 Sep 2024",
    duration: "30 min",
    distance: "200 km",
  },
  {
    id: 2,
    clientImage: "/api/placeholder/40/40",
    clientName: "Jugalax kimmy Black",
    type: "Aller simple",
    pickupLocation: "Avenue azerty",
    returnLocation: "Avenue kwerty",
    date: "20 Sep 2024",
    duration: "30 min",
    distance: "200 km",
  },
  {
    id: 3,
    clientImage: "/api/placeholder/40/40",
    clientName: "Jugalax kimmy Black",
    type: "Aller simple",
    pickupLocation: "Avenue azerty",
    returnLocation: "Avenue kwerty",
    date: "20 Sep 2024",
    duration: "30 min",
    distance: "200 km",
  },
  {
    id: 4,
    clientImage: "/api/placeholder/40/40",
    clientName: "Jugalax kimmy Black",
    type: "Aller simple",
    pickupLocation: "Avenue azerty",
    returnLocation: "Avenue kwerty",
    date: "20 Sep 2024",
    duration: "30 min",
    distance: "200 km",
  },
  {
    id: 5,
    clientImage: "/api/placeholder/40/40",
    clientName: "Jugalax kimmy Black",
    type: "Aller simple",
    pickupLocation: "Avenue azerty",
    returnLocation: "Avenue kwerty",
    date: "20 Sep 2024",
    duration: "30 min",
    distance: "200 km",
  },
  {
    id: 6,
    clientImage: "/api/placeholder/40/40",
    clientName: "Jugalax kimmy Black",
    type: "Aller simple",
    pickupLocation: "Avenue azerty",
    returnLocation: "Avenue kwerty",
    date: "20 Sep 2024",
    duration: "30 min",
    distance: "200 km",
  },
  {
    id: 7,
    clientImage: "/api/placeholder/40/40",
    clientName: "Jugalax kimmy Black",
    type: "Aller simple",
    pickupLocation: "Avenue azerty",
    returnLocation: "Avenue kwerty",
    date: "20 Sep 2024",
    duration: "30 min",
    distance: "200 km",
  },
  {
    id: 8,
    clientImage: "/api/placeholder/40/40",
    clientName: "Jugalax kimmy Black",
    type: "Aller simple",
    pickupLocation: "Avenue azerty",
    returnLocation: "Avenue kwerty",
    date: "20 Sep 2024",
    duration: "30 min",
    distance: "200 km",
  },
];

function TransportsPage({
  BulkActionBar,
  SelectAllCheckbox,
  SelectableCheckbox,
  selectedIds,
}: BulkDeleteProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);
  const { toggle } = useModalStore();

  // Temporary: using mock data
  const transports = mockTransports;
  const totalPages = 10;

  // Filter transports based on search
  const filteredTransports = useMemo(() => {
    return transports.filter((transport) => {
      const searchMatch =
        !search ||
        transport.clientName.toLowerCase().includes(search.toLowerCase()) ||
        transport.type.toLowerCase().includes(search.toLowerCase()) ||
        transport.pickupLocation.toLowerCase().includes(search.toLowerCase());

      return searchMatch;
    });
  }, [transports, search]);

  // Transport management functions
  const handleViewTransport = (transport: any, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Affichage des détails du transport: ${transport.clientName}`);
    // TODO: Implement transport details modal
    // toggle({
    //   name: ModalNames.TRANSPORT_DETAILS,
    //   data: { transport },
    // });
  };

  const handleEditTransport = (transport: any, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Modification du transport: ${transport.clientName}`);
    // TODO: Implement edit transport modal
    // toggle({
    //   name: ModalNames.EDIT_TRANSPORT,
    //   data: { transport },
    // });
  };

  const displayPagination = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          className={`w-10 h-10 mb-[4.5rem] rounded-lg bg-transparent shadow-none ${
            currentPage === i
              ? "bg-black hover:bg-black text-white"
              : "text-black hover:bg-black/10"
          }`}
          onClick={() => setCurrentPage(i)}
          disabled={isLoading}
        >
          {i}
        </Button>,
      );
    }

    return pages;
  };

  return (
    <section>
      <div className="flex items-center justify-between mt-8 mb-6">
        <div>
          <h2 className="py-4 font-MontserratBold font-lg">
            Transports effectués
          </h2>
        </div>

        <div className="relative flex items-center gap-3">
          {/* Delete button (shown when items are selected) */}
          {selectedIds.size > 0 && (
            <Button
              variant="outline"
              className="h-10 px-4 bg-[#8B7355] text-white hover:bg-[#8B7355]/90 border-[#8B7355]"
              onClick={() => {
                // This will be handled by BulkActionBar
              }}
            >
              SUPPRIMER
            </Button>
          )}
        </div>
      </div>

      <div>
        {isLoading ? (
          <div>Chargement...</div>
        ) : (
          <div className="w-full bg-background rounded-2xl p-6">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="w-[50px]">
                    <SelectAllCheckbox
                      allIds={filteredTransports?.map((t) => t.id) ?? []}
                    />
                  </TableHead>
                  <TableHead className="w-[180px]">Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prise en charge</TableHead>
                  <TableHead>Lieu du retour</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Distance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransports?.length > 0 ? (
                  filteredTransports?.map((transport) => (
                    <TableRow
                      key={transport.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={(e: React.MouseEvent) =>
                        handleViewTransport(transport, e)
                      }
                    >
                      <TableCell
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <SelectableCheckbox
                          id={transport.id}
                          isSelected={selectedIds.has(transport.id)}
                        />
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                            <Image
                              src={transport.clientImage}
                              alt={transport.clientName}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{transport.clientName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{transport.type}</TableCell>
                      <TableCell>{transport.pickupLocation}</TableCell>
                      <TableCell>{transport.returnLocation}</TableCell>
                      <TableCell>{transport.date}</TableCell>
                      <TableCell>{transport.duration}</TableCell>
                      <TableCell>{transport.distance}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-muted-foreground"
                        >
                          <path
                            d="M5 17h14v-5l-1.5-2h-11L5 12v5z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="7.5"
                            cy="17"
                            r="1.5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <circle
                            cx="16.5"
                            cy="17"
                            r="1.5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        <p className="text-muted-foreground">
                          Aucun transport trouvé
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex flex-row justify-end mt-4 mb-4">
          {displayPagination()}
        </div>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar />
    </section>
  );
}

// Wrap component with HOC at export
export default withBulkDelete({
  onDeleteItems: async (ids: (string | number)[]) => {
    // TODO: Replace with actual API call when transports API is implemented
    // For now, simulating deletion
    const results = await Promise.allSettled(
      ids.map(
        (id: string | number) =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 100);
          }),
      ),
    );

    const successfulIds: (string | number)[] = [];
    const failedIds: (string | number)[] = [];
    const errors: { id: string | number; error: any }[] = [];

    results.forEach((result, index) => {
      const id = ids[index];
      if (result.status === "fulfilled") {
        successfulIds.push(id);
      } else {
        failedIds.push(id);
        errors.push({ id, error: result.reason });
      }
    });

    return { successfulIds, failedIds, errors };
  },
  storeMethods: {
    // TODO: Add refreshTransports when store is implemented
  },

  onSuccess: async (result: any, storeMethods: any) => {
    if (result.successfulIds.length > 0) {
      // TODO: Call refresh method when implemented
      // await storeMethods.refreshTransports?.();
      toast.success(
        `${result.successfulIds.length} transport(s) supprimé(s) avec succès`,
      );
    }
    if (result.failedIds.length > 0) {
      toast.error(
        `Échec de suppression pour ${result.failedIds.length} transport(s)`,
      );
    }
  },
  confirmMessage:
    "Êtes-vous sûr de vouloir supprimer les transports sélectionnés?",
  allowPartialSuccess: true,
})(TransportsPage);
