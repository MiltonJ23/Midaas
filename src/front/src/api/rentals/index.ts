import Rental from "@/entities/rentals/rental";
import instance from "..";
import Contract from "@/entities/rentals/contract";
import { withErrorHandling } from "../api-wrapper-utility";

export const rentalsProvider = {
   getRentals: async (url: string) => {
    return withErrorHandling<{
      rentals: Rental[];
      count: number;
      next: string | null;
    }>(async () => {
      const response = await instance.get(url || "/rentals/");

      if (response.status === 200) {
        const rentals: Rental[] = [];
        const rentalsData = response.data;

        for (const data of rentalsData.results.data) {
          rentals.push(new Rental(data)); // Pass the whole object, it matches IRental
        }

        return {
          status: 200,
          data: {
            rentals,
            count: rentalsData.count,
            next: rentalsData.next,
          },
        };
      }

      return response;
    }, "Impossible de récupérer les locations actuellement. Veuillez vérifier votre connexion internet et réessayer ultérieurement.");
  },

  getFilteredRentals: async (params: Array<{ key: string; value: string }>) => {
    return withErrorHandling<{
      rentals: Rental[];
      count: number;
      next: string | null;
    }>(async () => {
      const stringParams = params
        .map((param) => `${param.key}=${param.value}`)
        .join("&");
      const response = await instance.get(`/rentals/filter/?${stringParams}`);

      if (response.status === 200) {
        const rentals: Rental[] = [];
        const rentalsData = response.data;

        for (const data of rentalsData.results.data) {
          rentals.push(new Rental(data));
        }

        return {
          status: 200,
          data: {
            rentals,
            count: rentalsData.count,
            next: rentalsData.next,
          },
        };
      }
      return response;
    }, "Impossible de filtrer les locations. Vérifiez les paramètres de recherche et réessayez.");
  },

 
  getRentalsContractsList: async (url: string) => {
    return withErrorHandling<{
      contracts: Contract[];
      count: number;
      next: string | null;
    }>(async () => {
      const response = await instance.get(url || "rentals");
        if (response.status === 200) {

            console.log("Raw contract data:", response.data.results.data);
          const contracts =
            response.data.results?.data?.map(
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
              next: response.data.next,
              contracts,
              message: response.data.message,
            },
          };
        }
        return response;
    }, "Impossible de récupérer les contrats. Assurez-vous d'être connecté et d'avoir les autorisations nécessaires.");
  },
};
