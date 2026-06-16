"use client";

import { rentalsProvider } from "@/api/rentals";
import Rental from "@/entities/rentals/rental";
import { useAuthStore } from "@/store/auth";
import { useRentalsStore } from "@/store/rentals";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useGetRentals({ page }: { page: number }) {
	const { user } = useAuthStore();
	const { loadData: loadRentalsData, next } = useRentalsStore();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!user) return;
		if (loading) return;

		(async () => {
			setLoading(true);
			const { data, error } = await rentalsProvider.getRentals(next || "");

			if (data) {
				loadRentalsData(data);
			} else {
				toast.error(error);
			}

			setLoading(false);
		})();
	}, [user, page]);

	return { loading }
}

export function useFilterRentals(
	params: Array<{ key: string; value: string }>
) {
	const { user } = useAuthStore();
	const [rentals, setRentals] = useState<{
		data: Rental[];
		count: number;
		next: string | null;
	}>({
		data: [],
		count: 0,
		next: null,
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!user || params.length === 0) return;
		if (loading) return;

		(async () => {
			setLoading(true);
			const { data, error } = await rentalsProvider.getFilteredRentals(params);

			if (data) {
				setRentals({ ...data, data: data.rentals});
			} else {
				toast.error(error);
			}

			setLoading(false);
		})();
	}, [user, JSON.stringify(params)]);

	return { rentals, loading };
}
