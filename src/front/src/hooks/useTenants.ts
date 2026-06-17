"use client";

import { rentalsProvider } from "@/api/rentals";
import { tenantProvider } from "@/api/tenants";
import Rental from "@/entities/rentals/rental";
import Tenant from "@/entities/tenants/tenant";
import { useAuthStore } from "@/store/auth";
import { useTenantsStore } from "@/store/tenants";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useGetTenants({ page }: { page: number }) {
	const { user } = useAuthStore();
	const { loadData: loadRentalsData } = useTenantsStore();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!user) return;
		if (loading) return;

		(async () => {
			setLoading(true);
			const { data, error } = await tenantProvider.getEveryTenants();
			// const { data, error } = await tenantProvider.getAllList();

			if (data) {
				loadRentalsData({
					tenants: data,
					count: data.length,
					next: null,
				});
			} else {
				toast.error(error);
			}

			setLoading(false);
		})();
	}, [user, page]);

	return { loading };
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
				setRentals({ ...data, data: data.rentals });
			} else {
				toast.error(error);
			}

			setLoading(false);
		})();
	}, [user, JSON.stringify(params)]);

	return { rentals, loading };
}

export function useGetEveryTenants() {
	const { user } = useAuthStore();
	const [loading, setLoading] = useState(false);
	const [tenants, setTenants] = useState<Tenant[]>([]);

	useEffect(() => {
		if (!user) return;
		if (loading) return;

		(async () => {
			setLoading(true);
			const { data, error } = await tenantProvider.getEveryTenants();

			if (data) {
				setTenants(data);
			} else {
				toast.error(error);
			}

			setLoading(false);
		})();
	}, [user]);

	return { loading, tenants };
}
