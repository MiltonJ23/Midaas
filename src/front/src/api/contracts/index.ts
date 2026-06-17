import Contract from "@/entities/rentals/contract";
import instance from "..";
import { withErrorHandling } from "@/api/api-wrapper-utility";

export const contractProvider = {
  // Get contracts list
  getContractsList: async (page?: string) => {
  return await withErrorHandling<{
    count: number;
    next: number;
    contracts: Contract[];
    message?: string;
  }>(
    async () => {
      const response = await instance.get(`rentals/?page=${page || 1}`);
       if (response.status === 200) {
        // Try all possible shapes
        const raw = response.data;
        const contractsRaw =
          raw.results?.Data ||
          raw.Data ||
          raw.results?.data ||
          raw.contracts ||
          [];

          console.log("contractsRaw: ",contractsRaw)

        const contracts = contractsRaw.map((contract: any) =>
          new Contract({
            rental_id: contract.rental_id || contract._id,
            tenant_id: contract.tenant_id,
            property_id: contract.property_id,
            tenant_name: contract.tenant_name,
            tenant_phone: contract.tenant_phone,
            property_name: contract.property_name,
            property_address: contract.property_address,
            monthly_amount: contract.monthly_amount,
            start_date: contract.start_date || contract._start,
            end_date: contract.end_date || contract._end,
            payment_status: contract.payment_status || contract._paymentStatus,
            rentals_status: contract.rentals_status || contract._status,
            rental_contract_file_url: contract.rental_contract_file_url || contract._contractURL,
            created_at: contract.created_at || contract._createdAt,
          })
        );

        return {
          status: response.status,
          data: {
            count: raw.count || 0,
            next: raw.next,
            contracts,
            message: raw.message,
          },
        };
      }
      return response;
    },
    "Impossible de récupérer la liste des contrats. Veuillez vérifier votre connexion et réessayer plus tard.",
    "Liste des contrats récupérée avec succès"
  );
},

  // Get single contract by ID (detailed info, including contract file URL)
  getContractById: async (id: string) => {
    return await withErrorHandling<{ contract: Contract; message?: string }>(
      async () => {
        const response = await instance.get(`rentals/details/${id}/`);
        if (response.status === 200) {
          const contractData = response.data.Data || response.data;
          const contract = new Contract({
            rental_id: contractData.rental_id,
            tenant_id: contractData.tenant_id,
            property_id: contractData.property_id,
            tenant_name: contractData.tenant_name,
            tenant_phone: contractData.tenant_phone,
            property_name: contractData.property_name,
            property_address: contractData.property_address,
            monthly_amount: contractData.monthly_amount,
            start_date: contractData.start_date,
            end_date: contractData.end_date,
            payment_status: contractData.payment_status,
            rentals_status: contractData.rentals_status,
            rental_contract_file_url: contractData.rental_contract_file_url,
            created_at: contractData.created_at,
          });

          return {
            status: response.status,
            data: {
              contract,
              message: response.data.message || "Contrat récupéré avec succès",
            },
          };
        }
        return response;
      },
      "Impossible de récupérer le contrat. Veuillez vérifier votre connexion et réessayer plus tard.",
      "Contrat récupéré avec succès"
    );
  },

  // Create new contract
  createContract: async (payload: any) => {
    return await withErrorHandling<{ message: string; contract: Contract }>(
      async () => {
        const formData = new FormData();
        // Add all fields to FormData
        for (const [key, value] of Object.entries(payload)) {
          if (value !== null && value !== undefined) {
            formData.append(key, value as string | Blob);
          }
        }
        const response = await instance.post("rentals/create/", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 201 || response.status === 200) {
          const contractData = response.data.Data || response.data;
          const contract = new Contract({
            rental_id: contractData.rental_id,
            tenant_id: contractData.tenant_id,
            property_id: contractData.property_id,
            tenant_name: contractData.tenant_name,
            tenant_phone: contractData.tenant_phone,
            property_name: contractData.property_name,
            property_address: contractData.property_address,
            monthly_amount: contractData.monthly_amount,
            start_date: contractData.start_date,
            end_date: contractData.end_date,
            payment_status: contractData.payment_status,
            rentals_status: contractData.rentals_status,
            rental_contract_file_url: contractData.rental_contract_file_url,
            created_at: contractData.created_at,
          });
          return {
            status: response.status,
            data: {
              message: response.data.message || "Contrat créé avec succès",
              contract,
            },
          };
        }
        return response;
      },
      "Une erreur s'est produite lors de la création du contrat"
    );
  },

  // Full update contract (PUT)
  updateContract: async (id: string, payload: any) => {
    return await withErrorHandling<{ message: string; contract?: Contract }>(
      async () => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(payload)) {
          if (value !== null && value !== undefined) {
            formData.append(key, value as string | Blob);
          }
        }
        const response = await instance.put(`rentals/update/${id}/`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 200) {
          const contractData = response.data.Data || response.data;
          const contract = new Contract({
            rental_id: contractData.rental_id,
            tenant_id: contractData.tenant_id,
            property_id: contractData.property_id,
            tenant_name: contractData.tenant_name,
            tenant_phone: contractData.tenant_phone,
            property_name: contractData.property_name,
            property_address: contractData.property_address,
            monthly_amount: contractData.monthly_amount,
            start_date: contractData.start_date,
            end_date: contractData.end_date,
            payment_status: contractData.payment_status,
            rentals_status: contractData.rentals_status,
            rental_contract_file_url: contractData.rental_contract_file_url,
            created_at: contractData.created_at,
          });
          return {
            status: response.status,
            data: {
              message:
                response.data.message || "Contrat mis à jour avec succès",
              contract,
            },
          };
        }
        return response;
      },
      "Erreur lors de la mise à jour du contrat"
    );
  },

  // Partial update contract (PATCH)
  patchContract: async (id: string, payload: any) => {
    return await withErrorHandling<{ message: string; contract?: Contract }>(
      async () => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(payload)) {
          if (value !== null && value !== undefined) {
            formData.append(key, value as string | Blob);
          }
        }
        const response = await instance.patch(
          `rentals/rental-agreement/${id}/`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response.status === 200) {
          const contractData = response.data.Data || response.data;
          const contract = new Contract({
            rental_id: contractData.rental_id,
            tenant_id: contractData.tenant_id,
            property_id: contractData.property_id,
            tenant_name: contractData.tenant_name,
            tenant_phone: contractData.tenant_phone,
            property_name: contractData.property_name,
            property_address: contractData.property_address,
            monthly_amount: contractData.monthly_amount,
            start_date: contractData.start_date,
            end_date: contractData.end_date,
            payment_status: contractData.payment_status,
            rentals_status: contractData.rentals_status,
            rental_contract_file_url: contractData.rental_contract_file_url,
            created_at: contractData.created_at,
          });
          return {
            status: response.status,
            data: {
              message:
                response.data.message || "Contrat mis à jour avec succès",
              contract,
            },
          };
        }
        return response;
      },
      "Erreur lors de la mise à jour partielle du contrat"
    );
  },

  // Delete contract
  deleteContract: async (id: string) => {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete(
          `rentals/delete/${id}/`
        );
        if (response.status === 204 || response.status === 200) {
          return {
            status: response.status,
            data: {
              message: "Le contrat a été supprimé avec succès",
            },
          };
        }
        return response;
      },
      "Une erreur s'est produite lors de la suppression du contrat",
      "Le contrat a été supprimé avec succès"
    );
  },

  // Get contracts with filters
  getFilteredContracts: async (filters: {
    status?: string;
    paymentStatus?: string;
    tenant?: string;
    address?: string;
  }) => {
    return await withErrorHandling<{
      count: number;
      contracts: Contract[];
      message?: string;
    }>(
      async () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });
        const response = await instance.get(
          `rentals/?${params.toString()}`
        );
        if (response.status === 200) {
          const contracts =
            response.data.results?.Data?.map(
              (contract: any) =>
                new Contract({
                  rental_id: contract.rental_id,
                  tenant_id: contract.tenant_id,
                  property_id: contract.property_id,
                  tenant_name: contract.tenant_name,
                  tenant_phone: contract.tenant_phone,
                  property_name: contract.property_name,
                  property_address: contract.property_address,
                  monthly_amount: contract.monthly_amount,
                  start_date: contract.start_date,
                  end_date: contract.end_date,
                  payment_status: contract.payment_status,
                  rentals_status: contract.rentals_status,
                  rental_contract_file_url: contract.rental_contract_file_url,
                  created_at: contract.created_at,
                })
            ) || [];
          return {
            status: response.status,
            data: {
              count: response.data.count || contracts.length,
              contracts,
              message:
                response.data.message ||
                "Contrats filtrés récupérés avec succès",
            },
          };
        }
        return response;
      },
      "Impossible de récupérer les contrats filtrés. Veuillez vérifier votre connexion et réessayer plus tard.",
      "Contrats filtrés récupérés avec succès"
    );
  },
};
