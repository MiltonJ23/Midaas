import Parrain from "@/entities/parrains/parrain";
import { create } from "zustand";

type State = {
  parrains: Parrain[];
  count: number;
  next: string | null;
  loaded: boolean;
};

type Actions = {
  loadData: ({
    parrains,
    count,
    next,
  }: {
    parrains: Parrain[];
    count: number;
    next: string | null;
  }) => void;
  addParrain: (parrain: Parrain) => void;
  updateParrain: (id: string, updatedData: Partial<Parrain>) => void;
};

export const useParrainsStore = create<State & Actions>((set) => {
  return {
    parrains: [],
    count: 0,
    next: null,
    loaded: false,

    loadData({ parrains, count, next }) {
      set({ parrains, count, next, loaded: true });
    },

    addParrain(parrain: Parrain) {
      set((state) => ({
        parrains: [parrain, ...state.parrains],
        count: state.count + 1,
      }));
    },

    updateParrain(id: string, updatedData: Partial<Parrain>) {
      set((state) => {
        const parrains = state.parrains.map((parrain) => {
          if (parrain.id === id) {
            parrain.update(updatedData);
          }
          return parrain;
        });

        return { parrains };
      });
    },
  };
});
