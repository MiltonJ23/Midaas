import { create } from "zustand";

export const ModalNames = {
  DEFAULT: "",
  PROFILE_DETAIL: "profile-detail",
  CONFIRM_ACTION: "confirm-action",
  ADD_CAMPAIGN: "add-campaign",
  EDIT_CAMPAIGN: "edit-campaign",
  CAMPAIGN_DETAILS: "campaign-details",
  ADD_MILESTONE: "add-milestone",
  ADD_COMPANY: "add-company",
} as const;

export type ModalNamesType = (typeof ModalNames)[keyof typeof ModalNames];

type State = {
  open: boolean;
  name: ModalNamesType;
  data: Record<string, unknown> | null;
};

type Actions = {
  toggle: (_?: {
    name: ModalNamesType;
    data?: Record<string, unknown>;
  }) => void;
  openModal: (_?: {
    name: ModalNamesType;
    data?: Record<string, unknown>;
  }) => void;
};

export const useModalStore = create<State & Actions>((set, get) => {
  return {
    open: false,
    name: ModalNames.DEFAULT,
    data: null,

    toggle(payload) {
      const { name, data } = payload ?? {};
      const state = get();
      set({ open: !state.open, name, data: data ?? null });
    },

    openModal(payload) {
      const { name, data } = payload ?? {};
      set({ open: true, name, data: data ?? null });
    },
  };
});
