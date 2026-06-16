import Rental from "@/entities/rentals/rental";
import { create } from "zustand";

type State = {
	rentals: Rental[];
	count: number;
	next: string | null;
	loaded: boolean;
};

type Actions = {
	loadData: ({
		rentals,
		count,
		next,
	}: {
		rentals: Rental[];
		count: number;
		next: string | null;
	}) => void;
};

export const useRentalsStore = create<State & Actions>((set) => {
	return {
		rentals: [],
		count: 0,
		next: null,
		loaded: false,

		// ACTIONS
		loadData({ rentals, count, next }) {
			set({ rentals, count, next, loaded: true });
		},
	};
});
