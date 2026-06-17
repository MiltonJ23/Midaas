export type CreateAppartmentDto = {
	name: string;
	address: string;
	city: string;
	code: string;
	type_of_apartment: string;
	caution_amount: number;
	price: number;
	state_photos?: File | null;
	real_estate_entities_id: string;
	buildings_id?: string;
	tenants_id: string;
	date_debut_location: string;
	date_fin_location: string;
	duree_location: number;
	date_limite_paiement: number;
	 penalty_enabled?: boolean;
  penalty_percentage?: number | null;

};

export type CreateVillaDto = {
	name: string;
	address: string;
	city: string;
	code: string;
	type_of_villa: string;
	caution_amount: number;
	duree_location: number;
	price: number;
	state_photos?: File | null;
	real_estate_entities_id: string;
	tenants_id: string;
	date_debut_location: string;
	date_fin_location: string;
	date_limite_paiement: number;
	 penalty_enabled?: boolean;
  penalty_percentage?: number | null;

};

export type CreateBuildingDto = {
	name: string;
	address: string;
	city: string;
};

export type CreateLocalDto = {
	name: string;
	address: string;
	city: string;
	code: string;
	type_of_local?:
		| "shop"
		| "restaurant_bar"
		| "office"
		| "warehouse"
		| "workshop"
		| "showroom"
		| "autre"
		| string;
	caution_amount: number;
	montant_loyer: number;
	state_photos?: File | null;
	real_estate_entities_id: string;
	buildings_id?: string;
	tenants_id: string;
	date_debut_location: string;
	date_fin_location: string;
	duree_location: number;
	date_limite_paiement: number;
	 penalty_enabled?: boolean;
  penalty_percentage?: number | null;

};