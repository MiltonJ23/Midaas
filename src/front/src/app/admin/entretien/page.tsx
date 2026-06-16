"use client";

import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useModalStore, ModalNames } from "@/store/modal";
import MaintenanceHeader from "@/components/organisms/maintenance/maintenance-header";
import MaintenanceRequestsTable from "@/components/organisms/maintenance/maintenance-requests-table";
import ServicesPanel from "@/components/organisms/maintenance/services-panel";
import Pagination from "@/components/organisms/maintenance/pagination";

// Mock maintenance request data
const mockMaintenanceRequests = [
  {
    id: 1,
    clientName: "Jean Dupont",
    clientAvatar: undefined,
    service: "Nettoyage intérieur simple",
    duration: "2h",
    price: "45 CHF",
  },
  {
    id: 2,
    clientName: "Marie Martin",
    clientAvatar: undefined,
    service: "Nettoyage complet",
    duration: "3h",
    price: "85 CHF",
  },
  {
    id: 3,
    clientName: "Pierre Bernard",
    clientAvatar: undefined,
    service: "Réparation moteur",
    duration: "5h",
    price: "250 CHF",
  },
  {
    id: 4,
    clientName: "Sophie Laurent",
    clientAvatar: undefined,
    service: "Vidange",
    duration: "1h",
    price: "65 CHF",
  },
  {
    id: 5,
    clientName: "Luc Petit",
    clientAvatar: undefined,
    service: "Changement pneus",
    duration: "2h",
    price: "150 CHF",
  },
];

// Mock services data
const mockServices = [
  {
    id: 1,
    name: "Nettoyage intérieur simple",
    price: "CHF 45",
    features: [
      "Aspiration complète",
      "Nettoyage surfaces",
      "Vitrages intérieurs",
    ],
  },
  {
    id: 2,
    name: "Nettoyage complet",
    price: "CHF 85",
    features: [
      "Nettoyage intérieur",
      "Lavage extérieur",
      "Polish carrosserie",
      "Traitement cuir",
    ],
  },
  {
    id: 3,
    name: "Réparation moteur",
    price: "CHF 250",
    features: ["Diagnostic complet", "Réparation pièces", "Test performance"],
  },
];

export default function MaintenancePage() {
  const router = useRouter();
  const { toggle } = useModalStore();
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  // Using mock data - replace with API call later
  const maintenanceRequests = useMemo(() => mockMaintenanceRequests, []);
  const services = useMemo(() => mockServices, []);

  // Pagination configuration
  const itemsPerPage = 10;
  const totalPages = Math.ceil(maintenanceRequests.length / itemsPerPage);

  // Get current page items
  const currentRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return maintenanceRequests.slice(startIndex, endIndex);
  }, [maintenanceRequests, currentPage]);

  // Handlers
  const handleAddRequest = () => {
    // Navigate to add service page using Next.js router
    router.push("/admin/entretien/ajout");
  };

  const handleDeleteRequest = (request: any) => {
    toggle({
      name: ModalNames.CONFIRM_DELETE,
      data: {
        title: "Supprimer la demande",
        description: `Êtes-vous sûr de vouloir supprimer la demande de "${request.clientName}" pour le service "${request.service}" ? Cette action est irréversible.`,
        itemName: `la demande de ${request.clientName}`,
        onConfirm: async () => {
          setIsDeleting(true);
          try {
            // TODO: Replace with actual API call
            // const result = await maintenanceProvider.deleteRequest(request.id);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success("Demande supprimée avec succès");
            // TODO: Remove from state or refetch data
          } catch (error) {
            console.error("Failed to delete request:", error);
            toast.error("Erreur lors de la suppression");
          } finally {
            setIsDeleting(false);
          }
        },
        isLoading: isDeleting,
      },
    });
  };

  const handleEditRequest = (request: any) => {
    router.push(`/admin/entretien/modifier?id=${request.id}`);
  };

  const handleAddService = () => {
    // Navigate to add service page using Next.js router
    router.push("/admin/entretien/ajout");
  };

  const handleDeleteService = (serviceId: number) => {
    // Find service by ID for the modal
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    toggle({
      name: ModalNames.CONFIRM_DELETE,
      data: {
        title: "Supprimer le service",
        description: `Êtes-vous sûr de vouloir supprimer le service "${service.name}" ? Cette action est irréversible.`,
        itemName: service.name,
        onConfirm: async () => {
          setIsDeleting(true);
          try {
            // TODO: Replace with actual API call
            // const result = await maintenanceProvider.deleteService(serviceId);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success("Service supprimé avec succès");
            // TODO: Remove from state or refetch data
          } catch (error) {
            console.error("Failed to delete service:", error);
            toast.error("Erreur lors de la suppression");
          } finally {
            setIsDeleting(false);
          }
        },
        isLoading: isDeleting,
      },
    });
  };

  const handleEditService = (service: any) => {
    router.push(`/admin/entretien/modifier?id=${service.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="p-6">
      <div className="max-w-[1400px] mx-auto">
        <MaintenanceHeader
          title="Demandes d'entretien de voiture"
          requestCount={maintenanceRequests.length}
          onAddRequest={handleAddRequest}
        />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
          {/* Main content - Requests table */}
          <div className="space-y-6">
            <MaintenanceRequestsTable
              requests={currentRequests}
              isLoading={isLoading}
              error={error}
              onDeleteRequest={handleDeleteRequest}
              onEditRequest={handleEditRequest}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={maintenanceRequests.length}
              itemsPerPage={itemsPerPage}
            />
          </div>

          {/* Right sidebar - Services panel */}
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <ServicesPanel
              services={services}
              isLoading={isLoading}
              error={error}
              onAddService={handleAddService}
              onDeleteService={handleDeleteService}
              onEditService={handleEditService}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}
