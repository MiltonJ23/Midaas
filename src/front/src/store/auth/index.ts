import User from "@/entities/user/user";
import { create } from "zustand";

type State = {
  user: User | null;
  loaded: boolean;
};

type Actions = {
  loadUser: (user: User) => void;
};

export const useAuthStore = create<State & Actions>((set) => {
  return {
    user: null,
    loaded: false,

    // ACTIONS
    loadUser(user) {
      set({ user, loaded: true });
    },
  };
});
