import Maintenance from "@/entities/maintenance/maintenance";
import { create } from "zustand";

type State = {
	maintenances: Maintenance[];
	count: number;
	next: string | null;
	loaded: boolean;
};

type Actions = {
	loadData: ({
		maintenances,
		count,
		next,
	}: {
		maintenances: Maintenance[];
		count: number;
		next: string | null;
	}) => void;

	assignTechnician: (
		maintenanceId: string,
		data: { name: string; phone: string; date: string; time: string }
	) => void;
};

export const useMaintenanceStore = create<State & Actions>((set, get) => {
	return {
		maintenances: [],
		count: 0,
		next: null,
		loaded: false,

		// ACTIONS
		loadData({ maintenances, count, next }) {
			set({ maintenances, count, next, loaded: true });
		},

		assignTechnician(
			maintenanceId: string,
			data: { name: string; phone: string; date: string; time: string }
		) {
			const { maintenances } = get();
			const index = maintenances.findIndex(
				(maintenance) => maintenance.id === maintenanceId
			);

			if (index === -1) return;

			maintenances[index].technicianName = data.name;
			maintenances[index].technicianContact = data.phone;
			maintenances[index].technicianAssignedDate = data.date;
			maintenances[index].technicianAssignedTime = data.time;

			set({
				maintenances,
			});
		},
	};
});
