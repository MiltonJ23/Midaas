import { create } from "zustand";
import { Bonus, IBonus } from "@/entities/bonus/bonus";
import bonusProvider from "@/api/bonus";

interface BonusStore {
  bonuses: IBonus[];
  count: number;
  next: string | null;
  loaded: boolean;
  loading: boolean;
  loadData: () => Promise<void>;
  addBonus: (bonus: IBonus) => void;
  updateBonus: (id: string, bonus: Partial<IBonus>) => void;
  removeBonus: (id: string) => void;
}

export const useBonusStore = create<BonusStore>((set, get) => ({
  bonuses: [],
  count: 0,
  next: null,
  loaded: false,
  loading: false,

  loadData: async () => {
    set({ loading: true });
    try {
      const result = await bonusProvider.getAllBonuses();

      // Transform parrain data into bonus records
      const bonuses: IBonus[] = [];

      if (result?.data) {
        const parrains = Array.isArray(result.data)
          ? result.data
          : [result.data];

        parrains.forEach((parrain: any) => {
          const filleulCount = parrain.filleuls?.length || 0;
          const completedMilestones = Math.floor(filleulCount / 5);

          // Create bonus records for each milestone
          for (let i = 0; i < completedMilestones; i++) {
            bonuses.push(
              new Bonus({
                id: `${parrain.id}_milestone_${i + 1}`,
                parrain_id: parrain.id,
                parrain_reference: parrain.userReference,
                bonus_points: 100 * (i + 1),
                filleul_count: filleulCount,
                milestone: (i + 1) * 5,
                status: "awarded",
                created_at: parrain.createdAt,
                raw: parrain,
              }),
            );
          }

          // If there's a pending milestone, add it
          if (filleulCount % 5 !== 0) {
            const pendingBonus = new Bonus({
              id: `${parrain.id}_pending`,
              parrain_id: parrain.id,
              parrain_reference: parrain.userReference,
              bonus_points: 100 * (completedMilestones + 1),
              filleul_count: filleulCount,
              milestone: (completedMilestones + 1) * 5,
              status: "pending",
              created_at: parrain.createdAt,
              raw: parrain,
            });
            bonuses.push(pendingBonus);
          }
        });
      }

      set({
        bonuses,
        count: bonuses.length,
        loaded: true,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to load bonuses:", error);
      set({ loading: false, loaded: true });
    }
  },

  addBonus: (bonus: IBonus) => {
    set((state) => ({
      bonuses: [...state.bonuses, bonus],
      count: state.bonuses.length + 1,
    }));
  },

  updateBonus: (id: string, updates: Partial<IBonus>) => {
    set((state) => ({
      bonuses: state.bonuses.map((bonus) =>
        bonus.id === id ? { ...bonus, ...updates } : bonus,
      ),
    }));
  },

  removeBonus: (id: string) => {
    set((state) => ({
      bonuses: state.bonuses.filter((bonus) => bonus.id !== id),
      count: Math.max(0, state.count - 1),
    }));
  },
}));
