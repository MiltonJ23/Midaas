import { create } from "zustand";
import type {
  AdminProfile,
  AdminCompanyItem,
  AdminEntrepreneurItem,
  AdminUserItem,
} from "@/api/admin";

type State = {
  // Auth
  admin: AdminProfile | null;
  loaded: boolean;

  // Data
  pendingCompanies: AdminCompanyItem[];
  pendingCompaniesLoading: boolean;
  entrepreneurs: AdminEntrepreneurItem[];
  entrepreneursLoading: boolean;
  users: AdminUserItem[];
  usersLoading: boolean;
};

type Actions = {
  // Auth
  loadAdmin: (admin: AdminProfile) => void;
  clearAdmin: () => void;

  // Companies
  setPendingCompanies: (companies: AdminCompanyItem[]) => void;
  setPendingCompaniesLoading: (loading: boolean) => void;
  updateCompanyStatus: (id: string, status: string) => void;

  // Entrepreneurs
  setEntrepreneurs: (entrepreneurs: AdminEntrepreneurItem[]) => void;
  setEntrepreneursLoading: (loading: boolean) => void;
  updateEntrepreneurStatus: (id: string, status: string) => void;

  // Users
  setUsers: (users: AdminUserItem[]) => void;
  setUsersLoading: (loading: boolean) => void;
};

export const useAdminStore = create<State & Actions>((set) => ({
  // Initial state
  admin: null,
  loaded: false,
  pendingCompanies: [],
  pendingCompaniesLoading: false,
  entrepreneurs: [],
  entrepreneursLoading: false,
  users: [],
  usersLoading: false,

  // Auth
  loadAdmin(admin) {
    set({ admin, loaded: true });
  },
  clearAdmin() {
    set({ admin: null, loaded: false });
  },

  // Companies
  setPendingCompanies(companies) {
    set({ pendingCompanies: companies, pendingCompaniesLoading: false });
  },
  setPendingCompaniesLoading(loading) {
    set({ pendingCompaniesLoading: loading });
  },
  updateCompanyStatus(id, status) {
    set((state) => ({
      pendingCompanies: state.pendingCompanies.map((c) =>
        c.id === id ? { ...c, status } : c,
      ),
    }));
  },

  // Entrepreneurs
  setEntrepreneurs(entrepreneurs) {
    set({ entrepreneurs, entrepreneursLoading: false });
  },
  setEntrepreneursLoading(loading) {
    set({ entrepreneursLoading: loading });
  },
  updateEntrepreneurStatus(id, status) {
    set((state) => ({
      entrepreneurs: state.entrepreneurs.map((e) =>
        e.id === id ? { ...e, status } : e,
      ),
    }));
  },

  // Users
  setUsers(users) {
    set({ users, usersLoading: false });
  },
  setUsersLoading(loading) {
    set({ usersLoading: loading });
  },
}));
