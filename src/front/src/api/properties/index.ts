import Appartment, { IAppartment } from "@/entities/properties/appartment";
import instance from "..";
import Villa, { IVilla } from "@/entities/properties/villa";
import Local, { ILocal } from "@/entities/properties/local";
import {
  CreateAppartmentDto,
  CreateBuildingDto,
  CreateLocalDto,
  CreateVillaDto,
} from "./dto";
import Building, { IBuilding } from "@/entities/properties/building";
import { withErrorHandling } from "@/api/api-wrapper-utility";
import { ids } from "webpack";

export const propertyProvider = {
  // Appartments API
  getAppartmentsList: async (url: string) => {
    return await withErrorHandling<{
      count: number;
      next: number;
      appartments: Appartment[];
      message?: string;
    }>(
      async () => {
        const response = await instance.get(url || "properties/apartments/");
        if (response.status === 200) {
          const appartments = response.data.results.Data.map(
            (appartment: IAppartment) => new Appartment(appartment)
          );
          return {
            status: response.status,
            data: {
              count: response.data.count,
              next: response.data.next,
              appartments,
              message: response.data.message,
            },
          };
        }
        return response;
      },
      "Impossible de récupérer la liste des appartements",
      "Liste des appartements récupérée avec succès"
    );
  },

  updateAppartment: async (id: string, payload: any) => {
    return await withErrorHandling<{
      message: string;
      appartment?: Appartment;
    }>(
      async () => {
        const response = await instance.put(
          `/properties/apartments/${id}/`,
          payload
        );

        if (response.status === 200) {
          const { Message, Id } = response.data;

          // Fetch the updated apartment data
          const updatedAppartmentResponse = await instance.get(
            `/properties/apartments/details/${Id}/`
          );

          let updatedAppartment: Appartment | undefined;

          if (updatedAppartmentResponse.status === 200) {
            updatedAppartment = new Appartment(
              updatedAppartmentResponse.data.Data
            );
          }

          return {
            status: response.status,
            data: {
              message: Message || "Appartement mis à jour avec succès",
              appartment: updatedAppartment,
            },
          };
        }

        return response;
      },
      "Erreur lors de la mise à jour de l'appartement",
      "Appartement mis à jour avec succès"
    );
  },
  // Villas API
  getVillasList: async (url: string) => {
    return await withErrorHandling<{
      count: number;
      next: number;
      villas: Villa[];
      message?: string;
    }>(
      async () => {
        const response = await instance.get(url || "properties/villas/");
        if (response.status === 200) {
          const villas = response.data.results.Data.map(
            (villa: IVilla) => new Villa(villa)
          );
          return {
            status: response.status,
            data: {
              count: response.data.count,
              next: response.data.next,
              villas,
              message: response.data.message,
            },
          };
        }
        return response;
      },
      "Impossible de récupérer la liste des villas",
      "Liste des villas récupérée avec succès"
    );
  },

  // Locaux API
  getLocalsList: async (url: string) => {
    return await withErrorHandling<{
      count: number;
      next: number;
      locals: Local[];
      message?: string;
    }>(
      async () => {
        const response = await instance.get(url || "properties/locals/");
        if (response.status === 200) {
          const locals = response.data.results.Data.map(
            (local: ILocal) => new Local(local)
          );
          return {
            status: response.status,
            data: {
              count: response.data.count,
              next: response.data.next,
              locals,
              message: response.data.message,
            },
          };
        }
        return response;
      },
      "Impossible de récupérer la liste des locaux",
      "Liste des locaux récupérée avec succès"
    );
  },
  // Locaux API
  getBuildingsList: async (url: string | undefined) => {
    return await withErrorHandling<{
      count: number;
      next: number;
      buildings: Building[];
      message?: string;
    }>(
      async () => {
        const response = await instance.get(url || "properties/buildings/");
        if (response.status === 200) {
          const buildings = response.data.results.Data.map(
            (building: IBuilding) => new Building(building)
          );
          return {
            status: response.status,
            data: {
              count: response.data.count,
              next: response.data.next,
              buildings,
              message: response.data.message,
            },
          };
        }
        return response;
      },
      "Impossible de récupérer la liste des immeubles",
      "Liste des immeubles récupérée avec succès"
    );
  },
  getPropetyListByTenantId: async (tenant_id: string) => {
    return await withErrorHandling<{
      count: number;
      next: number;
      properties:  Array<{
      type: "buildings" | "Apartment" | "Villa" | "Local";
      id: string;
      name: string;
    }>;
      message?: string;
    }>(
      async () => {
        const response = await instance.get(`properties/properties/by-tenant/?tenant_id=${tenant_id}&property_type=all`);
        if (response.status === 200) {
          console.log(response)
          const properties = response.data.Data;
          return {
            status: response.status,
            data: {
              count: properties.length,
              next: response.data.next,
              properties,
              message: response.data.message,
            },
          };
        }
        return response;
      },
      "Impossible de récupérer la liste des proprietés lié au locataire",
      "Liste des proprietés lié au locataire récupérée avec succès"
    );
  },
 

  getAllList: async () => {
    return await withErrorHandling<{ properties: any[]; message?: string }>(
      async () => {
        const response = await instance.get("properties/properties/all/");
        if (response.status === 200) {
          const properties = response.data.Data.map(
            (property: { type: string; id: string; name: string }) => ({
              type: property.type,
              id: property.id,
              name: property.name,
            })
          );
          return {
            status: response.status,
            data: {
              properties,
              message:
                response.data.message ||
                "Liste des propriétés récupérée avec succès",
            },
          };
        }
        return response;
      },
      "Impossible de récupérer la liste des propriétés",
      "Liste des propriétés récupérée avec succès"
    );
  },

  createAppartment: async (payload: CreateAppartmentDto) => {
    const formData = new FormData();
      // Handle all properties except state_photos first
    for (const [key, value] of Object.entries(payload)) {
      if (key !== 'state_photos' && value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    }

    // Only append state_photos if it exists and is a File
    if (payload.state_photos instanceof File) {
      formData.append('state_photos', payload.state_photos);
    }
    return await withErrorHandling<{ message: string; appartment: Appartment }>(
      async () => {
        const response = await instance.post(
          "/properties/apartments/create/",
          formData
        );
        if (response.status === 201) {
          const appartment = new Appartment({
            id: response.data.Id,
            ...payload,
            state_photos: "",
            date_debut_location: new Date(payload.date_debut_location),
            date_fin_location: new Date(payload.date_fin_location),
            duree_location: payload.duree_location,
            date_limite_paiement: payload.date_limite_paiement,
          });
          return {
            status: response.status,
            data: {
              message: "Appartement crée avec succès",
              appartment,
            },
          };
        }
        return response;
      },
      "Une erreur s'est produite lors de la creation d'un appartement"
    );
  },

  createVilla: async (payload: CreateVillaDto) => {
    const formData = new FormData();
     for (const [key, value] of Object.entries(payload)) {
      if (key !== 'state_photos' && value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    }

    // Only append state_photos if it exists and is a File
    if (payload.state_photos instanceof File) {
      formData.append('state_photos', payload.state_photos);
    }
    return await withErrorHandling<{ message: string; villa: Villa }>(
      async () => {
        const response = await instance.post(
          "/properties/villas/create/",
          formData
        );
        if (response.status === 201) {
          const villa = new Villa({
            id: response.data.Id,
            ...payload,
            state_photos: "",
            duree_location: payload.duree_location.toString(),
          });
          return {
            status: response.status,
            data: {
              message: "Villa crée avec succès",
              villa,
            },
          };
        }
        return response;
      },
      "Une erreur s'est produite lors de la creation d'une villa"
    );
  },

  createBuilding: async (payload: CreateBuildingDto, userId: string) => {
    return await withErrorHandling<{ message: string; building: Building }>(
      async () => {
        const response = await instance.post(
          "/properties/buildings/create/",
          payload
        );
        if (response.status === 201) {
          const building = new Building({
            id: response.data.Id,
            ...payload,
            uploaded_at: new Date(Date.now()),
            created_at: new Date(Date.now()),
            real_estate_entities_id: userId,
          });
          return {
            status: response.status,
            data: {
              message: "Immeuble crée avec succès",
              building,
            },
          };
        }
        return response;
      },
      "Une erreur s'est produite lors de la creation d'un immeuble"
    );
  },

  createLocal: async (payload: CreateLocalDto) => {
    const formData = new FormData();
     for (const [key, value] of Object.entries(payload)) {
      if (key !== 'state_photos' && value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    }

    // Only append state_photos if it exists and is a File
    if (payload.state_photos instanceof File) {
      formData.append('state_photos', payload.state_photos);
    }
    return await withErrorHandling<{ message: string; local: Local }>(
      async () => {
        const response = await instance.post(
          "/properties/locals/create/",
          formData
        );
        if (response.status === 201) {
          const local = new Local({
            id: response.data.Id,
            ...payload,
            state_photos:( payload.state_photos instanceof File ? payload.state_photos.name : payload.state_photos) ?? "",
            type_of_local: payload.type_of_local ?? "",
            caution_amount: payload.caution_amount,
            price: payload.montant_loyer,
            date_debut_location: new Date(payload.date_debut_location),
            date_fin_location: new Date(payload.date_fin_location),
            duree_location: payload.duree_location,
            date_limite_paiement: payload.date_limite_paiement,
          });
          return {
            status: response.status,
            data: {
              message: "Local crée avec succès",
              local,
            },
          };
        }
        return response;
      },
      "Une erreur s'est produite lors de la creation d'un local"
    );
  },

  // Delete methods
  deleteAppartment: async (id: string) => {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete(
          `/properties/apartments/delete/${id}/`
        );

        if (response.status === 204 || response.status === 200) {
          return {
            status: response.status,
            data: {
              message: "L'appartement a été supprimé avec succès",
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la suppression de l'appartement",
      "L'appartement a été supprimé avec succès"
    );
  },

  deleteVilla: async (id: string) => {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete(
          `/properties/villas/delete/${id}/`
        );

        if (response.status === 204 || response.status === 200) {
          return {
            status: response.status,
            data: {
              message: "La villa a été supprimée avec succès",
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la suppression de la villa",
      "La villa a été supprimée avec succès"
    );
  },

  deleteLocal: async (id: string) => {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete(
          `/properties/locals/delete/${id}/`
        );

        if (response.status === 204 || response.status === 200) {
          return {
            status: response.status,
            data: {
              message: "Le local a été supprimé avec succès",
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la suppression du local",
      "Le local a été supprimé avec succès"
    );
  },

  deleteBuilding: async (id: string) => {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete(
          `/properties/buildings/delete/${id}/`
        );


        if (response.status === 204 || response.status === 200) {
          return {
            status: response.status,
            data: {
              message: "L'immeuble a été supprimé avec succès",
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la suppression de l'immeuble",
      "L'immeuble a été supprimé avec succès"
    );
  },

  updateVilla: async (id: string, payload: any) => {
    return await withErrorHandling<{ message: string; villa?: Villa }>(
      async () => {
        const response = await instance.put(
          `/properties/villas/${id}/`,
          payload
        );

        if (response.status === 200) {
          const { Message, Id } = response.data;

          // Fetch the updated villa data
          const updatedVillaResponse = await instance.get(
            `/properties/villas/details/${Id}/`
          );

          let updatedVilla: Villa | undefined;

          if (updatedVillaResponse.status === 200) {
            updatedVilla = new Villa(updatedVillaResponse.data.Data);
          }

          return {
            status: response.status,
            data: {
              message: Message || "Villa mise à jour avec succès",
              villa: updatedVilla,
            },
          };
        }

        return response;
      },
      "Erreur lors de la mise à jour de la villa",
      "Villa mise à jour avec succès"
    );
  },

  updateLocal: async (id: string, payload: any) => {
    return await withErrorHandling<{ message: string; local?: Local }>(
      async () => {
        const response = await instance.put(
          `/properties/locals/${id}/`,
          payload
        );

        if (response.status === 200) {
          const { Message, Id } = response.data;

          // Fetch the updated local data
          const updatedLocalResponse = await instance.get(
            `/properties/locals/details/${Id}/`
          );

          let updatedLocal: Local | undefined;

          if (updatedLocalResponse.status === 200) {
            updatedLocal = new Local(updatedLocalResponse.data.Data);
          }

          return {
            status: response.status,
            data: {
              message: Message || "Local mis à jour avec succès",
              local: updatedLocal,
            },
          };
        }

        return response;
      },
      "Erreur lors de la mise à jour du local",
      "Local mis à jour avec succès"
    );
  },

  updateBuilding: async (id: string, payload: any) => {
    return await withErrorHandling<{ message: string; building?: Building }>(
      async () => {
        const response = await instance.put(
          `/properties/buildings/update/${id}/`,
          payload
        );


        if (response.status === 200) {
          const { Message, Id } = response.data;

          // Fetch the updated building data
          const updatedBuildingResponse = await instance.get(
            `/properties/buildings/${id}/`
          );

          let updatedBuilding: Building | undefined;

          if (updatedBuildingResponse.status === 200) {
            updatedBuilding = new Building(updatedBuildingResponse.data.Data);
          }

          return {
            status: response.status,
            data: {
              message: Message || "Immeuble mis à jour avec succès",
              building: updatedBuilding,
            },
          };
        }

        return response;
      },
      "Erreur lors de la mise à jour de l'immeuble",
      "Immeuble mis à jour avec succès"
    );
  },
  bulkDelete: async (entity_type: string, ids: string[]) => {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete(
          "/properties/properties/bulk-delete/",
          { data: { entity_type, ids } }
        );

        if (response.status === 200 || response.status === 204) {
          return {
            status: response.status,
            data: {
              message: "Propriétés supprimées avec succès",
            },
          };
        }

        return response;
      },
      "Erreur lors de la suppression en masse",
      "Propriétés supprimées avec succès"
    );
  },
};