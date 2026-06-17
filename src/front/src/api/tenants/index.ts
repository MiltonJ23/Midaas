import Tenant, { ITenant } from "@/entities/tenants/tenant";
import instance from "..";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { RegisterPayment } from "./dto/register-payment.dto";
import { withErrorHandling } from "@/api/api-wrapper-utility";

export const tenantProvider = {

  async getTenantInfo(tenantId: string) {
    type TenantInfoResponse = {
      Message: string;
      Data: {
        id: string;
        name: string;
        email: string;
        phone: string;
        professions: string;
        contract_start_date: string | null;
        contract_end_date: string | null;
        contract_duration: string | null;
        language: string;
        rental_contract_file: string;
        identity_document: string;
        profile_picture: string;
        created_at: string;
        updated_at: string;
      };
    };

    return await withErrorHandling<TenantInfoResponse | null>(
      async () => {
        const response = await instance.get(`/properties/tenants/${tenantId}/`);
        if (response.status === 200) {
          return {
            status: response.status,
            data: response.data as TenantInfoResponse,
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
      "Impossible de récupérer les informations du locataire",
      "Informations du locataire récupérées avec succès"
    );
  },


  async create(payload: CreateTenantDto) {
    return await withErrorHandling<{ message: string; id: string }>(
      async () => {
        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("email", payload.email);
        formData.append("phone", payload.phone.trim());
        formData.append("professions", payload.professions);
        // formData.append("password", payload.password);
        formData.append("identity_document", payload.identity_document);
        formData.append("profile_picture", payload.profile_picture);

        const response = await instance.post("/properties/tenants/", formData);

        if (response.status === 201) {
          return {
            status: response.status,
            data: {
              message: "Le locataire a été créé avec succès",
              id: response.data.Id,
            },
          };
        }

        // Special handling for form validation errors (status 400)
        if (response.status === 400) {
          console.log("");
          const errors = Object.entries(response.data)?.map((error) => {
            return `${error[0]}: ${error[1]}`;
          });

          return {
            status: response.status,
            data: {
              message: errors.join(", "),
              isError: true,
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la création du locataire"
    );
  },

  async delete(id: string) {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete(`/properties/tenants/${id}/`);

        if (response.status === 204 || response.status === 200) {
          return {
            status: response.status,
            data: {
              message: "Le locataire a été supprimé avec succès",
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la suppression du locataire",
      "Le locataire a été supprimé avec succès"
    );
  },

  async update(id: string, payload: Partial<CreateTenantDto> | FormData) {
    return await withErrorHandling<{ message: string; tenant: Tenant }>(
      async () => {
        let formData: FormData;
        
        if (payload instanceof FormData) {
          formData = payload;
        } else {
          formData = new FormData();
          // Only append fields that are provided
          if (payload.name !== undefined) formData.append("name", payload.name);
          if (payload.email !== undefined) formData.append("email", payload.email);
          if (payload.phone !== undefined) formData.append("phone", payload.phone.trim());
          if (payload.professions !== undefined) formData.append("professions", payload.professions);
          if (payload.identity_document) formData.append("identity_document", payload.identity_document);
          if (payload.profile_picture) formData.append("profile_picture", payload.profile_picture);
        }

        const response = await instance.patch(
          `/properties/tenants/${id}/`,
          formData
        );

        if (response.status === 200) {
          return {
            status: response.status,
            data: {
              message: "Le locataire a été modifié avec succès",
              tenant: new Tenant(response.data.Data),
            },
          };
        }

        // Special handling for form validation errors (status 400)
        if (response.status === 400) {
          const errors = Object.entries(response.data)?.map((error) => {
            return `${error[0]}: ${error[1]}`;
          });

          return {
            status: response.status,
            data: {
              message: errors.join(", "),
              isError: true,
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la modification du locataire"
    );
  },

  async getAllList() {
    return await withErrorHandling<Tenant[]>(
      async () => {
        const response = await instance.get(
          "properties/properties/tenants/all/"
        );

        if (response.status === 200) {
          const tenants: Tenant[] = response.data.Data?.map(
            (tenant: ITenant) => new Tenant(tenant)
          );

          return {
            status: response.status,
            data: tenants,
          };
        }

        return response;
      },
      "Impossible de récupérer la liste des locataires",
      "Liste des locataires récupérée avec succès"
    );
  },

  async getEveryTenants() {
    return await withErrorHandling<Tenant[]>(
      async () => {
        const response = await instance.get(
          "/real-estate-entities/tenants/without-properties/"
        );

        if (response.status === 200) {
          const tenants: Tenant[] = response.data.Data?.map(
            (tenant: ITenant) => new Tenant(tenant)
          );

          return {
            status: response.status,
            data: tenants,
          };
        }

        // Special handling for 404 - return empty array
        if (response.status === 404) {
          return {
            status: response.status,
            data: [],
          };
        }

        return response;
      },
      "Impossible de récupérer la liste des locataires",
      "Liste des locataires récupérée avec succès"
    );
  },

  async getById(id: string) {
    return await withErrorHandling<Tenant | null>(
      async () => {
        const response = await instance.get(`/properties/tenants/${id}/`);

        if (response.status === 200) {
          const tenant: Tenant = new Tenant(response.data.Data);

          return {
            status: response.status,
            data: tenant,
          };
        }

        // Special handling for 404 - return null
        if (response.status === 404) {
          return {
            status: response.status,
            data: null,
          };
        }

        return response;
      },
      "Impossible de récupérer le locataire",
      "Informations du locataire récupérées avec succès"
    );
  },

  async registerPayment(data: RegisterPayment) {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.post(
          "/properties/tenants/create/payments/",
          data
        );

        if (response.status === 201) {
          return {
            status: response.status,
            data: {
              message: "Le paiement a été enregistré avec succès",
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de l'enregistrement du paiement",
      "Le paiement a été enregistré avec succès"
    );
  },

  // TODO: Modify the different endpoint for editand delete
  async updatePayment(payment_id:string, data: RegisterPayment) {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.put(
          `/properties/tenants/update/payments/${payment_id}/`,
          data
        ); 

        if (response.status === 201) {
          return {
            status: response.status,
            data: {
              message: "Le paiement a été modifié avec succès",
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la modification du paiement",
      "Le paiement a été modifié avec succès"
    );
  },
  async deletePayment(payment_id:string) {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete(
          `/properties/tenants/delete/payments/${payment_id}/`
        );

        if (response.status === 201) {
          return {
            status: response.status,
            data: {
              message: "Le paiement a été supprimé avec succès",
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la suppression du paiement",
      "Le paiement a été supprimé avec succès"
    );
  },

  async bulkDelete(ids: string[]) {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete('/properties/tenants/bulk-delete/', {
          data: { ids },
        });

        if (response.status === 204 || response.status === 200) {
          return {
            status: response.status,
            data: {
              message: "Les locataires ont été supprimés avec succès",
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la suppression des locataires",
      "Les locataires ont été supprimés avec succès"
    );
  },
  async bulkDeletePayments(ids: string[]) {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete('/properties/tenants/bulk-delete/payments', {
          data: { ids },
        });

        if (response.status === 204 || response.status === 200) {
          return {
            status: response.status,
            data: {
              message: "Les paiements ont été supprimés avec succès",
            },
          };
        }

        return response;
      },
      "Une erreur s'est produite lors de la suppression des paiements",
      "Les paiements ont été supprimés avec succès"
    );
  },
};
