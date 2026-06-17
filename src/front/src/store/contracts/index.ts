import Contract from "@/entities/rentals/contract";
import { contractProvider } from "@/api/contracts";
import { create } from "zustand";

type State = {
  contracts: Contract[];
  count: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  itemsPerPage: number;
};

type Actions = {
    loadData: ({
        contracts,
        count,
    }: {
        contracts: Contract[];
        count: number;
    }) => void;
    addContract: (contract: Contract) => void;
    updateContract: (id: string, payload: any) => Promise<void>;
    patchContract: (id: string, payload: any) => Promise<void>;
    deleteContract: (id: string) => Promise<void>;
      setCurrentPage: (page: number) => void;
  refreshContracts: (page?: number) => Promise<void>;
};

export const useContractsStore = create<State & Actions>((set, get) => ({
    contracts: [],
    count: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  itemsPerPage: 10,
    loadData: ({ contracts, count }) => {
    const totalPages = Math.ceil(count / 10); // 10 items per page
    set({ contracts, count, totalPages, isLoading: false });
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page, });
  },

  refreshContracts: async (page?: number) => {
    set({ isLoading: true });
    try {
      const { data, error } = await contractProvider.getContractsList(page?.toString());
      if (data) {
        set({
          contracts: data.contracts,
          count: data.count,
          totalPages: Math.ceil(data.count / 10),
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Error refreshing contracts:", error);
      set({ isLoading: false });
    }
  },

    // Add a contract to the store
    addContract: (contract: Contract) => {
        set((state) => ({
            contracts: [contract, ...state.contracts],
            count: state.count + 1,
        }));
    },

    // Full update contract (PUT)
    updateContract: async (id: string, payload: any) => {
        try {
            const { data, error } = await contractProvider.updateContract(id, payload);
            if (error) {
                console.error("Error updating contract:", error);
                return;
            }
            if (data && data.contract) {
                set((state) => ({
                    contracts: state.contracts.map((c) =>
                        c.rental_id === id ? data.contract : c
                    ) as Contract[],
                }));
            }
        } catch (error) {
            console.error("Error updating contract:", error);
        }
    },

    // Partial update contract (PATCH)
    patchContract: async (id: string, payload: any) => {
        try {
            const { data, error } = await contractProvider.patchContract(id, payload);
            if (error) {
                console.error("Error patching contract:", error);
                return;
            }
            if (data && data.contract) {
                set((state) => ({
                    contracts: state.contracts.map((c) =>
                        c.rental_id === id ? data.contract : c
                    ) as Contract[],
                }));
            }
        } catch (error) {
            console.error("Error patching contract:", error);
        }
    },

    // Delete contract
    deleteContract: async (id: string) => {
        try {
            const { data, error } = await contractProvider.deleteContract(id);
            if (error) {
                console.error("Error deleting contract:", error);
                return;
            }
            set((state) => ({
                contracts: state.contracts.filter((c) => c.rental_id !== id),
                count: state.count > 0 ? state.count - 1 : 0,
            }));
        } catch (error) {
            console.error("Error deleting contract:", error);
        }
    },
}));