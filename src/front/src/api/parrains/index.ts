import { withErrorHandling } from "@/api/api-wrapper-utility";
import instance from "..";
import Parrain, { IParrain } from "@/entities/parrains/parrain";
import { CreateParrainDto } from "./dto/create-parrain.dto";

const toArray = (payload: any): any[] => {
  if (Array.isArray(payload?.Data)) return payload.Data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const toObject = (payload: any): Record<string, any> | null => {
  if (payload?.Data && typeof payload.Data === "object") return payload.Data;
  if (payload?.data && typeof payload.data === "object") return payload.data;
  if (payload && typeof payload === "object") return payload;
  return null;
};

export const parrainProvider = {
  async create(payload: CreateParrainDto) {
    return await withErrorHandling<{ message: string }>(async () => {
      const response = await instance.post("/parrain", payload);

      if (response.status === 200 || response.status === 201) {
        return {
          status: response.status,
          data: {
            message:
              response.data?.message ?? "Le parrain a été créé avec succès",
          },
        };
      }

      return response;
    }, "Une erreur s'est produite lors de la création du parrain");
  },

  async getAll() {
    return await withErrorHandling<Parrain[]>(
      async () => {
        const response = await instance.get("/parrain/all");

        if (response.status === 200) {
          const parrains = toArray(response.data).map(
            (parrain: IParrain) => new Parrain(parrain),
          );

          return {
            status: response.status,
            data: parrains,
          };
        }

        return response;
      },
      "Impossible de récupérer la liste des parrains",
      "Liste des parrains récupérée avec succès",
    );
  },

  async getById(id: string) {
    return await withErrorHandling<Parrain | null>(
      async () => {
        const response = await instance.get(`/parrain/${id}/infos`);

        if (response.status === 200) {
          const detail = toObject(response.data);

          if (!detail) {
            return {
              status: response.status,
              data: null,
            };
          }

          return {
            status: response.status,
            data: new Parrain(detail as IParrain),
          };
        }

        if (response.status === 404) {
          return {
            status: response.status,
            data: null,
          };
        }

        return response;
      },
      "Impossible de récupérer les informations du parrain",
      "Informations du parrain récupérées avec succès",
    );
  },
};
