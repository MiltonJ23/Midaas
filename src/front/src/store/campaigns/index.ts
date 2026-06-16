import Project from "@/entities/project/project";
import { create } from "zustand";

type State = {
  campaigns: Project[];
  count: number;
  next: string | null;
  loaded: boolean;
};

type Actions = {
  loadData: ({
    campaigns,
    count,
    next,
  }: {
    campaigns: Project[];
    count: number;
    next: string | null;
  }) => void;
  addCampaign: (campaign: Project) => void;
  updateCampaign: (id: string, updatedData: Partial<Project>) => void;
  updateCampaignInList: (campaign: Project) => void;
  removeCampaign: (id: string) => void;
};

export const useCampaignsStore = create<State & Actions>((set) => {
  return {
    campaigns: [],
    count: 0,
    next: null,
    loaded: false,

    loadData({ campaigns, count, next }) {
      set({ campaigns, count, next, loaded: true });
    },

    addCampaign(campaign: Project) {
      set((state) => ({
        campaigns: [campaign, ...state.campaigns],
        count: state.count + 1,
      }));
    },

    updateCampaign(id: string, updatedData: Partial<Project>) {
      set((state) => {
        const campaigns = state.campaigns.map((c) => {
          if (c.id === id) {
            c.update(updatedData);
          }
          return c;
        });
        return { campaigns };
      });
    },

    updateCampaignInList(campaign: Project) {
      set((state) => {
        const campaigns = state.campaigns.map((c) =>
          c.id === campaign.id ? campaign : c,
        );
        return { campaigns };
      });
    },

    removeCampaign(id: string) {
      set((state) => ({
        campaigns: state.campaigns.filter((c) => c.id !== id),
        count: state.count - 1,
      }));
    },
  };
});
