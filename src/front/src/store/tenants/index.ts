import Tenant from "@/entities/tenants/tenant";
import { create } from "zustand";

type State = {
  tenants: Tenant[];
  count: number;
  next: string | null;
  loaded: boolean;
};

type Actions = {
  loadData: ({
    tenants,
    count,
    next,
  }: {
    tenants: Tenant[];
    count: number;
    next: string | null;
  }) => void;

  addTenant: (tenant: Tenant) => void;

  // Add the updateTenant action type
  updateTenant: (id: string, updatedData: Partial<Tenant>) => void;

  // Add the removeTenant action type
  removeTenant: (tenantId: string) => void;
};

export const useTenantsStore = create<State & Actions>((set) => {
  return {
    tenants: [],
    count: 0,
    next: null,
    loaded: false,

    // ACTIONS
    loadData({ tenants, count, next }) {
      set({ tenants, count, next, loaded: true });
    },

    addTenant(tenant: Tenant) {
      set((state) => ({
        tenants: [...state.tenants, tenant],
        count: state.count + 1,
      }));
    },

    updateTenant(id: string, updatedData: Partial<Tenant>) {
      set((state) => {
        const tenants = state.tenants?.map((tenant) => {
          if (tenant.id === id) {
            tenant.update(updatedData);
          }
          return tenant;
        });

        return { tenants };
      });
    },

    removeTenant(tenantId: string) {
      set((state) => ({
        tenants: state.tenants.filter(tenant => tenant.id !== tenantId),
        count: state.count - 1,
      }));
    },
  };
});