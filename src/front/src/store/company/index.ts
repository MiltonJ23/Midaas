import Company from "@/entities/company/company";
import { create } from "zustand";

type State = {
  companies: Company[];
  count: number;
  loaded: boolean;
};

type Actions = {
  loadData: ({ companies }: { companies: Company[] }) => void;
  addCompany: (company: Company) => void;
  updateCompanyInList: (company: Company) => void;
  removeCompany: (id: string) => void;
};

export const useCompanyStore = create<State & Actions>((set) => {
  return {
    companies: [],
    count: 0,
    loaded: false,

    loadData({ companies }) {
      set({ companies, count: companies.length, loaded: true });
    },

    addCompany(company: Company) {
      set((state) => ({
        companies: [company, ...state.companies],
        count: state.count + 1,
      }));
    },

    updateCompanyInList(company: Company) {
      set((state) => {
        const companies = state.companies.map((c) =>
          c.id === company.id ? company : c,
        );
        return { companies };
      });
    },

    removeCompany(id: string) {
      set((state) => ({
        companies: state.companies.filter((c) => c.id !== id),
        count: state.count - 1,
      }));
    },
  };
});
