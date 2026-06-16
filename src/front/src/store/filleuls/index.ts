import Filleul from "@/entities/filleuls/filleul";
import { create } from "zustand";

type State = {
  filleuls: Filleul[];
  count: number;
  next: string | null;
  loaded: boolean;
};

type Actions = {
  loadData: ({
    filleuls,
    count,
    next,
  }: {
    filleuls: Filleul[];
    count: number;
    next: string | null;
  }) => void;
  addFilleul: (filleul: Filleul) => void;
  updateFilleul: (id: string, updatedData: Partial<Filleul>) => void;
};

export const useFilleulsStore = create<State & Actions>((set) => {
  return {
    filleuls: [],
    count: 0,
    next: null,
    loaded: false,

    loadData({ filleuls, count, next }) {
      set({ filleuls, count, next, loaded: true });
    },

    addFilleul(filleul: Filleul) {
      set((state) => ({
        filleuls: [filleul, ...state.filleuls],
        count: state.count + 1,
      }));
    },

    updateFilleul(id: string, updatedData: Partial<Filleul>) {
      set((state) => {
        const filleuls = state.filleuls.map((filleul) => {
          if (filleul.id === id) {
            filleul.update(updatedData);
          }
          return filleul;
        });

        return { filleuls };
      });
    },
  };
});
