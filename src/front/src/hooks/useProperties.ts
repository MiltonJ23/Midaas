import { propertyProvider } from "@/api/properties";
import Building from "@/entities/properties/building";
import { useAuthStore } from "@/store/auth";
import { usePropertiesStore } from "@/store/properties";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useProperties({
  page,
  resource,
}: {
  page: number;
  resource: "buildings" | "appartments" | "buildings" | "locals" | "villa" | "payments";
}) {
  const { user } = useAuthStore();
  const {
    loadAppartments,
    loadBuildings,
    loadVillas,
    loadLocals,
    loadPayments,
    appartments: { next: appartmentsNextURL, data: appartmentsData },
    villas: { next: villasNextURL, data: villasData },
    locals: { next: localsNextURL, data: localsData },
    buildings: { next: buildingsNextURL, data: buildingsData },
    payments: { next: paymentsNextURL, data: paymentsData },
  } = usePropertiesStore();
  const [loading, setLoading] = useState(false);

  // Track which resources have been loaded - use a Map instead of single boolean
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    if (loading) return;

    // Check if we need to load data for current resource
    const needsData = () => {
      const hasLoadedThisResource = loadedResources.has(resource);
      
      switch (resource) {
        case "appartments":
          return appartmentsData.length === 0 && !hasLoadedThisResource;
        case "villa":
          return villasData.length === 0 && !hasLoadedThisResource;
        case "buildings":
          return buildingsData.length === 0 && !hasLoadedThisResource;
        case "locals":
          return localsData.length === 0 && !hasLoadedThisResource;
        case "payments":
          return paymentsData.length === 0 && !hasLoadedThisResource;
        default:
          return true;
      }
    };

    // If we already have data and this is not the first page, check pagination
    if (!needsData() && page > 1) {
      switch (resource) {
        case "buildings": {
          const currentPages = Math.ceil(buildingsData.length / 10);
          if (page <= currentPages) return;
          break;
        }
        case "appartments": {
          const currentPages = Math.ceil(appartmentsData.length / 10);
          if (page <= currentPages) return;
          break;
        }
        case "villa": {
          const currentPages = Math.ceil(villasData.length / 10);
          if (page <= currentPages) return;
          break;
        }
        case "locals": {
          const currentPages = Math.ceil(localsData.length / 10);
          if (page <= currentPages) return;
          break;
        }
        case "payments": {
          const currentPages = Math.ceil(paymentsData.length / 10);
          if (page <= currentPages) return;
          break;
        }
      }
    }

    // If we don't need data and it's not a pagination request, return
    if (!needsData() && page === 1) return;

    (async () => {
      setLoading(true);
      let response;

      switch (resource) {
        case "buildings":
          response = await propertyProvider.getBuildingsList(buildingsNextURL || "properties/buildings");

          if (response.data) {
            loadBuildings({
              ...response.data,
              data: response.data.buildings,
              next: response.data.next ? String(response.data.next) : null,
            });
            setLoadedResources(prev => new Set([...prev, "buildings"]));
          } else {
            toast.error(
              response.error || "Impossible de charger les immeubles"
            );
          }
          break;
        case "appartments":
          response = await propertyProvider.getAppartmentsList(
            appartmentsNextURL || "properties/apartments"
          );

          if (response.data) {
            loadAppartments({
              ...response.data,
              data: response.data.appartments,
              next: response.data.next ? String(response.data.next) : null,
            });
            setLoadedResources(prev => new Set([...prev, "appartments"]));
          } else {
            toast.error(
              response.error || "Impossible de charger les appartements"
            );
          }
          break;

        case "villa":
          response = await propertyProvider.getVillasList(villasNextURL || "");

          if (response.data) {
            loadVillas({
              ...response.data,
              data: response.data.villas,
              next: response.data.next ? String(response.data.next) : null,
            });
            setLoadedResources(prev => new Set([...prev, "villa"]));
          } else {
            toast.error(response.error || "Impossible de charger les villas");
          }
          break;

        case "locals":
          response = await propertyProvider.getLocalsList(localsNextURL || "");

          if (response.data) {
            loadLocals({
              ...response.data,
              data: response.data.locals,
              next: response.data.next ? String(response.data.next) : null,
            });
            setLoadedResources(prev => new Set([...prev, "locals"]));
          } else {
            toast.error(response.error || "Impossible de charger les locaux");
          }
          break;

        case "payments":
          response = await propertyProvider.getPaymentsList(
            paymentsNextURL || ""
          );

          if (response.data) {
            loadPayments({
              ...response.data,
              data: response.data.payments,
              next: response.data.next ? String(response.data.next) : null,
            });
            setLoadedResources(prev => new Set([...prev, "payments"]));
          } else {
            toast.error(
              response.error || "Impossible de charger les paiements"
            );
          }
          break;

        default:
          response = await propertyProvider.getAppartmentsList(
            appartmentsNextURL || "properties/apartments"
          );

          if (response.data) {
            loadAppartments({
              ...response.data,
              data: response.data.appartments,
              next: response.data.next ? String(response.data.next) : null,
            });
            setLoadedResources(prev => new Set([...prev, "appartments"]));
          } else {
            toast.error(
              response.error || "Impossible de charger les appartements"
            );
          }
          break;
      }

      setLoading(false);
    })();
  }, [page, resource, user]);

  return { loading };
}

export function useLoadAllProperties() {
  const [properties, setProperties] = useState<
    Array<{
      type: "buildings" | "Apartment" | "Villa" | "Local";
      id: string;
      name: string;
    }>
  >([]);
  const [buildings, setBuildings] = useState<
    Array<Building>
  >([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await propertyProvider.getAllList();
      const { data: buildingData, error: buildingError } =
        await propertyProvider.getBuildingsList("properties/buildings/");

      if (data && buildingData) {
        setProperties(data.properties);
        setBuildings(buildingData.buildings);
      } else {
        toast.error(
          error || "Une erreur s'est produite lors du chargement des biens"
        );
        toast.error(
          buildingError || "Une erreur s'est produite lors du chargement des immeubles"
        );
      }
    })();
  }, []);

  return { properties, buildings };
}

export function useLoadAllPropertiesByTenantID(id: string | null) {
  const [propertiesById, setPropertiesById] = useState<Array<{
    type: "buildings" | "Apartment" | "Villa" | "Local";
    id: string;
    name: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset states when tenant ID changes
    setPropertiesById([]);
    setError(null);

    // Don't fetch if no ID is provided
    if (!id ||id == "default") return;

    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const { data: propertyData, error } = 
          await propertyProvider.getPropetyListByTenantId(id);

          console.log(propertyData)

        if (propertyData && propertyData.count !== 0) {
          setPropertiesById(propertyData.properties);
        } else if(propertyData && propertyData.count === 0){
          // setError(error || "Une erreur s'est produite lors du chargement des biens");
          toast.error("Acune propriété trouvé pour le locataire choisit!");
        } else {
          setError(error || "Une erreur s'est produite lors du chargement des biens");
          toast.error(error || "Une erreur s'est produite lors du chargement des biens");
        }
      } catch (err) {
        setError("Une erreur inattendue s'est produite");
        toast.error("Une erreur inattendue s'est produite");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [id]); // Re-run effect when tenant ID changes

  return { 
    propertiesById, 
    isLoading, 
    error,
    isEmpty: !isLoading && propertiesById.length === 0 
  };
}