import { withErrorHandling } from "@/api/api-wrapper-utility";
import instance from "..";
import Project, { IProject } from "@/entities/project/project";
import Milestone, { IMilestone } from "@/entities/project/milestone";
import {
  CreateCampaignDto,
  CreateMilestoneDto,
  UpdateCampaignDto,
} from "./dto";

const toArray = (payload: any): any[] => {
  if (Array.isArray(payload?.Data)) return payload.Data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results?.Data)) return payload.results.Data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const toObject = (payload: any): Record<string, any> | null => {
  if (payload?.Data && typeof payload.Data === "object") return payload.Data;
  if (payload?.data && typeof payload.data === "object") return payload.data;
  if (payload && typeof payload === "object") return payload;
  return null;
};

export const campaignProvider = {
  // ─── Campaigns / Projects ───────────────────────────────────────

  async getAll() {
    return await withErrorHandling<Project[]>(
      async () => {
        const response = await instance.get("/projects/");

        if (response.status === 200) {
          const projects = toArray(response.data).map(
            (project: IProject) => new Project(project),
          );

          return {
            status: response.status,
            data: projects,
          };
        }

        return response;
      },
      "Impossible de récupérer la liste des campagnes",
      "Liste des campagnes récupérée avec succès",
    );
  },

  async getById(id: string) {
    return await withErrorHandling<Project | null>(
      async () => {
        const response = await instance.get(`/projects/${id}/`);

        if (response.status === 200) {
          const detail = toObject(response.data);

          if (!detail) {
            return { status: response.status, data: null };
          }

          return {
            status: response.status,
            data: new Project(detail as IProject),
          };
        }

        if (response.status === 404) {
          return { status: response.status, data: null };
        }

        return response;
      },
      "Impossible de récupérer les détails de la campagne",
      "Détails de la campagne récupérés avec succès",
    );
  },

  async create(payload: CreateCampaignDto) {
    return await withErrorHandling<{ message: string; project?: Project }>(
      async () => {
        const response = await instance.post("/projects/", payload);

        if (response.status === 200 || response.status === 201) {
          const detail = toObject(response.data);
          let project: Project | undefined;

          if (detail) {
            project = new Project(detail as IProject);
          }

          return {
            status: response.status,
            data: {
              message: response.data?.message ?? "Campagne créée avec succès",
              project,
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la création de la campagne",
    );
  },

  async update(id: string, payload: UpdateCampaignDto) {
    return await withErrorHandling<{ message: string; project?: Project }>(
      async () => {
        const response = await instance.put(`/projects/${id}/`, payload);

        if (response.status === 200) {
          const detail = toObject(response.data);
          let project: Project | undefined;

          if (detail) {
            project = new Project(detail as IProject);
          }

          return {
            status: response.status,
            data: {
              message:
                response.data?.message ?? "Campagne mise à jour avec succès",
              project,
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la mise à jour de la campagne",
    );
  },

  async remove(id: string) {
    return await withErrorHandling<{ message: string }>(async () => {
      const response = await instance.delete(`/projects/${id}/`);

      if (response.status === 200 || response.status === 204) {
        return {
          status: response.status,
          data: {
            message: response.data?.message ?? "Campagne supprimée avec succès",
          },
        };
      }

      return response;
    }, "Une erreur s'est produite lors de la suppression de la campagne");
  },

  // ─── Milestones ─────────────────────────────────────────────────

  async getMilestones(projectId: string) {
    return await withErrorHandling<Milestone[]>(
      async () => {
        const response = await instance.get(
          `/projects/${projectId}/milestones/`,
        );

        if (response.status === 200) {
          const milestones = toArray(response.data).map(
            (milestone: IMilestone) => new Milestone(milestone),
          );

          return {
            status: response.status,
            data: milestones,
          };
        }

        return response;
      },
      "Impossible de récupérer les jalons",
      "Jalons récupérés avec succès",
    );
  },

  async createMilestone(projectId: string, payload: CreateMilestoneDto) {
    return await withErrorHandling<{ message: string; milestone?: Milestone }>(
      async () => {
        const response = await instance.post(
          `/projects/${projectId}/milestones/`,
          payload,
        );

        if (response.status === 200 || response.status === 201) {
          const detail = toObject(response.data);
          let milestone: Milestone | undefined;

          if (detail) {
            milestone = new Milestone(detail as IMilestone);
          }

          return {
            status: response.status,
            data: {
              message: response.data?.message ?? "Jalon créé avec succès",
              milestone,
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la création du jalon",
    );
  },

  async updateMilestone(
    projectId: string,
    milestoneId: string,
    payload: Partial<CreateMilestoneDto>,
  ) {
    return await withErrorHandling<{ message: string; milestone?: Milestone }>(
      async () => {
        const response = await instance.put(
          `/projects/${projectId}/milestones/${milestoneId}/`,
          payload,
        );

        if (response.status === 200) {
          const detail = toObject(response.data);
          let milestone: Milestone | undefined;

          if (detail) {
            milestone = new Milestone(detail as IMilestone);
          }

          return {
            status: response.status,
            data: {
              message: response.data?.message ?? "Jalon mis à jour avec succès",
              milestone,
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la mise à jour du jalon",
    );
  },

  async removeMilestone(projectId: string, milestoneId: string) {
    return await withErrorHandling<{ message: string }>(async () => {
      const response = await instance.delete(
        `/projects/${projectId}/milestones/${milestoneId}/`,
      );

      if (response.status === 200 || response.status === 204) {
        return {
          status: response.status,
          data: {
            message: response.data?.message ?? "Jalon supprimé avec succès",
          },
        };
      }

      return response;
    }, "Une erreur s'est produite lors de la suppression du jalon");
  },
};
