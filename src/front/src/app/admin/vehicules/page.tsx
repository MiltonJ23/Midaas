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

// Mock vehicle data - Replace with actual API call later
const mockVehicles = [
  {
    id: 1,
    image: "/api/placeholder/80/60",
    model: "Mercedes-Benz S63 AMG",
    registration: "MB2950",
    color: "Noir",
    seats: "04",
    luggage: "07",
    price: "293 CHF",
    type: "Transport",
  },
  {
    id: 2,
    image: "/api/placeholder/80/60",
    model: "Mercedes-Benz S63 AMG",
    registration: "MB2950",
    color: "Noir",
    seats: "04",
    luggage: "07",
    price: "293 CHF",
    type: "Transport",
  },
  {
    id: 3,
    image: "/api/placeholder/80/60",
    model: "Mercedes-Benz S63 AMG",
    registration: "MB2950",
    color: "Noir",
    seats: "04",
    luggage: "07",
    price: "293 CHF",
    type: "Transport",
  },
  {
    id: 4,
    image: "/api/placeholder/80/60",
    model: "Mercedes-Benz S63 AMG",
    registration: "MB2950",
    color: "Noir",
    seats: "04",
    luggage: "07",
    price: "293 CHF",
    type: "Transport",
  },
  {
    id: 5,
    image: "/api/placeholder/80/60",
    model: "Mercedes-Benz S63 AMG",
    registration: "MB2950",
    color: "Noir",
    seats: "04",
    luggage: "07",
    price: "293 CHF",
    type: "Transport",
  },
  {
    id: 6,
    image: "/api/placeholder/80/60",
    model: "Mercedes-Benz S63 AMG",
    registration: "MB2950",
    color: "Noir",
    seats: "04",
    luggage: "07",
    price: "293 CHF",
    type: "Transport",
  },
  {
    id: 7,
    image: "/api/placeholder/80/60",
    model: "Mercedes-Benz S63 AMG",
    registration: "MB2950",
    color: "Noir",
    seats: "04",
    luggage: "07",
    price: "293 CHF",
    type: "Transport",
  },
  {
    id: 8,
    image: "/api/placeholder/80/60",
    model: "Mercedes-Benz S63 AMG",
    registration: "MB2950",
    color: "Noir",
    seats: "04",
    luggage: "07",
    price: "293 CHF",
    type: "Transport",
  },
  {
    id: 9,
    image: "/api/placeholder/80/60",
    model: "Mercedes-Benz S63 AMG",
    registration: "MB2950",
    color: "Noir",
    seats: "04",
    luggage: "07",
    price: "293 CHF",
    type: "Transport",
  },
];

function VehiclesPage({
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
  const vehicles = mockVehicles;
  const totalPages = 10;

  // Filter vehicles based on search
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const searchMatch =
        !search ||
        vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.registration.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(search.toLowerCase());

      return searchMatch;
    });
  }, [vehicles, search]);

  // Vehicle management functions
  const handleViewVehicle = (vehicle: any, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Affichage des détails du véhicule: ${vehicle.model}`);
    // TODO: Implement vehicle details modal
    // toggle({
    //   name: ModalNames.VEHICLE_DETAILS,
    //   data: { vehicle },
    // });
  };

  const handleEditVehicle = (vehicle: any, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Modification du véhicule: ${vehicle.model}`);
    // TODO: Implement edit vehicle modal
    // toggle({
    //   name: ModalNames.EDIT_VEHICLE,
    //   data: { vehicle },
    // });
  };

  const handleAddVehicle = () => {
    toast.info("Ajout d'un nouveau véhicule");
    // TODO: Implement add vehicle modal
    // toggle({
    //   name: ModalNames.ADD_VEHICLE,
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
          <h2 className="py-4 font-MontserratBold font-lg">Voitures</h2>
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

          {/* Add vehicle button */}
          <Button
            className="h-10 px-4 bg-[#8B2F2F] text-white hover:bg-[#8B2F2F]/90"
            onClick={handleAddVehicle}
          >
            AJOUTER UNE VOITURE
          </Button>
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
                      allIds={filteredVehicles?.map((v) => v.id) ?? []}
                    />
                  </TableHead>
                  <TableHead className="w-[150px]">Voiture</TableHead>
                  <TableHead>Modèle</TableHead>
                  <TableHead>Immatriculation</TableHead>
                  <TableHead>Couleur</TableHead>
                  <TableHead>Places</TableHead>
                  <TableHead>Bagages</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles?.length > 0 ? (
                  filteredVehicles?.map((vehicle) => (
                    <TableRow
                      key={vehicle.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={(e: React.MouseEvent) =>
                        handleViewVehicle(vehicle, e)
                      }
                    >
                      <TableCell
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <SelectableCheckbox
                          id={vehicle.id}
                          isSelected={selectedIds.has(vehicle.id)}
                        />
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="w-20 h-14 bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={vehicle.image}
                            alt={vehicle.model}
                            width={80}
                            height={60}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {vehicle.model}
                      </TableCell>
                      <TableCell>{vehicle.registration}</TableCell>
                      <TableCell>{vehicle.color}</TableCell>
                      <TableCell>{vehicle.seats}</TableCell>
                      <TableCell>{vehicle.luggage}</TableCell>
                      <TableCell className="font-medium">
                        {vehicle.price}
                      </TableCell>
                      <TableCell>{vehicle.type}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-black/5 rounded-full"
                            onClick={(e: React.MouseEvent) =>
                              handleViewVehicle(vehicle, e)
                            }
                            title="Voir les détails"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-black"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="1"
                                fill="currentColor"
                              />
                              <circle
                                cx="12"
                                cy="5"
                                r="1"
                                fill="currentColor"
                              />
                              <circle
                                cx="12"
                                cy="19"
                                r="1"
                                fill="currentColor"
                              />
                            </svg>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-primary/10 rounded-full"
                            onClick={(e: React.MouseEvent) =>
                              handleEditVehicle(vehicle, e)
                            }
                            title="Modifier le véhicule"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-black"
                            >
                              <path
                                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43739 22.1213 4.00001C22.1213 4.56262 21.8978 5.10218 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10">
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
                          Aucune voiture trouvée
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
    // TODO: Replace with actual API call when vehicles API is implemented
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
    // TODO: Add refreshVehicles when store is implemented
  },

  onSuccess: async (result: any, storeMethods: any) => {
    if (result.successfulIds.length > 0) {
      // TODO: Call refresh method when implemented
      // await storeMethods.refreshVehicles?.();
      toast.success(
        `${result.successfulIds.length} véhicule(s) supprimé(s) avec succès`,
      );
    }
    if (result.failedIds.length > 0) {
      toast.error(
        `Échec de suppression pour ${result.failedIds.length} véhicule(s)`,
      );
    }
  },
  confirmMessage:
    "Êtes-vous sûr de vouloir supprimer les véhicules sélectionnés?",
  allowPartialSuccess: true,
})(VehiclesPage);
