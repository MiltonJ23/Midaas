import Transaction from "@/entities/payments/transaction";
import Appartment from "@/entities/properties/appartment";
import Building from "@/entities/properties/building";
import Local from "@/entities/properties/local";
import Villa from "@/entities/properties/villa";
import { create } from "zustand";

type State = {
  appartments: {
    data: Appartment[];
    count: number;
    next: string | null;
  };
  villas: {
    data: Villa[];
    count: number;
    next: string | null;
  };
  locals: {
    data: Local[];
    count: number;
    next: string | null;
  };
  buildings: {
    data: Building[];
    count: number;
    next: string | null;
  };
  payments: {
    data: Transaction[];
    count: number;
    next: string | null;
  };
};

type Actions = {
    loadAppartments: ({
        data,
        count,
        next,
    }: {
        data: Appartment[];
        count: number;
        next: string | null;
    }) => void;

    addAppartment: (appartment: Appartment) => void;

    updateAppartment: (appartment: Appartment) => void;

    removeAppartment: (id: string) => void;

    loadVillas: ({
        data,
        count,
        next,
    }: {
        data: Villa[];
        count: number;
        next: string | null;
    }) => void;

    addVilla: (villa: Villa) => void;
    
    updateVilla: (villa: Villa) => void;

    removeVilla: (id: string) => void;

    loadLocals: ({
        data,
        count,
        next,
    }: {
        data: Local[];
        count: number;
        next: string | null;
    }) => void;

    addLocal: (local: Local) => void;
    
    updateLocal: (local: Local) => void;

    removeLocal: (id: string) => void;

    loadBuildings: ({
        data,
        count,
        next,
    }: {
        data: Building[];
        count: number;
        next: string | null;
    }) => void;

    addBuilding: (building: Building) => void;
    
    updateBuilding: (building: Building) => void;

    removeBuilding: (id: string) => void;

    loadPayments: ({
        data,
        count,
        next,
    }: {
        data: Transaction[];
        count: number;
        next: string | null;
    }) => void;

    addPayment: (payment: Transaction) => void;
    
    updatePayment: (payment: Transaction) => void;

    removePayment: (id: string) => void;
};

export const useAllProperties = () => {
  const {
    appartments,
    villas,
    locals,
    buildings,
  } = usePropertiesStore.getState();

  // Combine all property types into one array
  return [
    ...appartments.data?.map((p) => ({ ...p, type: "appartment" })),
    ...villas.data?.map((p) => ({ ...p, type: "villa" })),
    ...locals.data?.map((p) => ({ ...p, type: "local" })),
    ...buildings.data?.map((p) => ({ ...p, type: "building" })),
  ];
};

export const usePropertiesStore = create<State & Actions>((set, get) => {
  return {
    appartments: {
      data: [],
      count: 0,
      next: null,
    },
    villas: {
      data: [],
      count: 0,
      next: null,
    },
    locals: {
      data: [],
      count: 0,
      next: null,
    },
    buildings: {
      data: [],
      count: 0,
      next: null,
    },
    payments: {
      data: [],
      count: 0,
      next: null,
    },

    // ACTIONS
    loadAppartments({ data, count, next }) {
      set({ appartments: { data, count, next } });
    },

    addAppartment(appartment: Appartment) {
      const state = get();

      set({
        appartments: {
          ...state.appartments,
          data: [...state.appartments.data, appartment],
        },
      });
    },

    updateAppartment(updatedAppartment: Appartment) {
      const state = get();
      const updatedData = state.appartments.data?.map((apartment) =>
        apartment.id === updatedAppartment.id ? updatedAppartment : apartment
      );

      set({
        appartments: {
          ...state.appartments,
          data: updatedData,
        },
      });
    },

    removeAppartment(id: string) {
      const state = get();
      const filteredData = state.appartments.data.filter(
        (apartment) => apartment.id !== id
      );

      set({
        appartments: {
          ...state.appartments,
          data: filteredData,
          count: state.appartments.count - 1,
        },
      });
    },

    loadVillas({ data, count, next }) {
      set({ villas: { data, count, next } });
    },

    addVilla(villa: Villa) {
      const state = get();

      set({
        villas: {
          ...state.villas,
          data: [...state.villas.data, villa],
        },
      });
    },

    removeVilla(id: string) {
      const state = get();
      const filteredData = state.villas.data.filter((villa) => villa.id !== id);

      set({
        villas: {
          ...state.villas,
          data: filteredData,
          count: state.villas.count - 1,
        },
      });
    },

    loadLocals({ data, count, next }) {
      set({ locals: { data, count, next } });
    },

    addLocal(local: Local) {
      const state = get();

      set({
        locals: {
          ...state.locals,
          data: [...state.locals.data, local],
        },
      });
    },

    removeLocal(id: string) {
      const state = get();
      const filteredData = state.locals.data.filter((local) => local.id !== id);

      set({
        locals: {
          ...state.locals,
          data: filteredData,
          count: state.locals.count - 1,
        },
      });
    },

    loadBuildings({ data, count, next }) {
      set({ buildings: { data, count, next } });
    },

    addBuilding(building: Building) {
      const state = get();

      set({
        buildings: {
          ...state.buildings,
          data: [...state.buildings.data, building],
        },
      });
    },

    removeBuilding(id: string) {
      const state = get();
      const filteredData = state.buildings.data.filter(
        (building) => building.id !== id
      );

      set({
        buildings: {
          ...state.buildings,
          data: filteredData,
          count: state.buildings.count - 1,
        },
      });
    },

    loadPayments({ data, count, next }) {
      set({ payments: { data, count, next } });
    },

    addPayment(payment: Transaction) {
      const state = get();

      set({
        payments: {
          ...state.payments,
          data: [...state.payments.data, payment],
        },
      });
    },

    removePayment(id: string) {
      const state = get();
      const filteredData = state.payments.data.filter(
        (payment) => payment.id !== id
      );

      set({
        payments: {
          ...state.payments,
          data: filteredData,
          count: state.payments.count - 1,
        },
      });
    },

    updateVilla(updatedVilla: Villa) {
      const state = get();
      const updatedData = state.villas.data?.map((villa) =>
        villa.id === updatedVilla.id ? updatedVilla : villa
      );

      set({
        villas: {
          ...state.villas,
          data: updatedData,
        },
      });
    },

    updateLocal(updatedLocal: Local) {
      const state = get();
      const updatedData = state.locals.data?.map((local) =>
        local.id === updatedLocal.id ? updatedLocal : local
      );

      set({
        locals: {
          ...state.locals,
          data: updatedData,
        },
      });
    },

    updateBuilding(updatedBuilding: Building) {
      const state = get();
      const updatedData = state.buildings.data?.map((building) =>
        building.id === updatedBuilding.id ? updatedBuilding : building
      );

      set({
        buildings: {
          ...state.buildings,
          data: updatedData,
        },
      });
    },

    updatePayment(updatedPayment: Transaction) {
      const state = get();
      const updatedData = state.payments.data?.map((payment) =>
        payment.id === updatedPayment.id ? updatedPayment : payment
      );

      set({
        payments: {
          ...state.payments,
          data: updatedData,
        },
      });
    },
  };
});
