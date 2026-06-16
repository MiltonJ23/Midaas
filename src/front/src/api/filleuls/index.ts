import { withErrorHandling } from "@/api/api-wrapper-utility";
import instance from "..";
import Filleul, { IFilleul } from "@/entities/filleuls/filleul";
import { CreateFilleulDto } from "./dto/create-filleul.dto";

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

export const filleulProvider = {
  async create(payload: CreateFilleulDto) {
    return await withErrorHandling<{ message: string }>(async () => {
      const response = await instance.post("/filleul", payload);

      if (response.status === 200 || response.status === 201) {
        return {
          status: response.status,
          data: {
            message:
              response.data?.message ?? "Le filleul a été créé avec succès",
          },
        };
      }

      return response;
    }, "Une erreur s'est produite lors de la création du filleul");
  },

  async getAll() {
    return await withErrorHandling<Filleul[]>(
      async () => {
        const response = await instance.get("/v1/filleul/all");

        if (response.status === 200) {
          const filleuls = toArray(response.data).map(
            (filleul: IFilleul) => new Filleul(filleul),
          );

          return {
            status: response.status,
            data: filleuls,
          };
        }

        return response;
      },
      "Impossible de récupérer la liste des filleuls",
      "Liste des filleuls récupérée avec succès",
    );
  },

  async getById(id: string) {
    return await withErrorHandling<Filleul | null>(
      async () => {
        const response = await instance.get(`/filleul/${id}/infos`);

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
            data: new Filleul(detail as IFilleul),
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
      "Impossible de récupérer les informations du filleul",
      "Informations du filleul récupérées avec succès",
    );
  },
};
