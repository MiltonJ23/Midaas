export interface IVilla {
	id: string;
	name: string;
	address: string;
	city: string;
	type_of_villa: string;
	uploaded_at?: Date;
	created_at?: Date;
	code: string;
	caution_amount: number;
	price: number;
	state_photos?: string | null;
	real_estate_entities_id: string;
	buildings_id?: string;
	tenants_id: string;
	date_debut_location: string;
	duree_location: string;
	date_fin_location: string;
	date_limite_paiement: number;
	penalty_enabled?: boolean;
  penalty_percentage?: number | null;
}

export default class Villa {
	private _id: string;
	private _name: string;
	private _address: string;
	private _city: string;
	private _typeOfVilla: string;
	private _uploadedAt: Date;
	private _createdAt: Date;
	private _code: string;
	private _cautionAmount: number;
	private _price: number;
	private _statePhotos: string | null;
	private _realEstateEntitiesId: string;
	private _buildingsId?: string;
	private _tenantsId: string;
	private _dateDebutLocation: string;
	private _dureeLocation: string;
	private _dateFinLocation: string;
	private _dateLimitePaiement: number;
	
   private _penaltyEnabled?: boolean;
  private _penaltyPercentage?: number | null;

	constructor(data: IVilla) {
		this._id = data.id;
		this._name = data.name;
		this._address = data.address;
		this._city = data.city;
		this._typeOfVilla = data.type_of_villa;
		this._uploadedAt = data.uploaded_at ?? new Date(Date.now());
		this._createdAt = data.created_at ?? new Date(Date.now());
		this._code = data.code;
		this._cautionAmount = data.caution_amount;
		this._price = data.price;
		this._statePhotos = data.state_photos ?? null;
		this._realEstateEntitiesId = data.real_estate_entities_id;
		this._buildingsId = data.buildings_id;
		this._tenantsId = data.tenants_id;
		this._dateDebutLocation = data.date_debut_location;
		this._dateFinLocation = data.date_fin_location;
		this._dateLimitePaiement = data.date_limite_paiement;
		this._dureeLocation = data.duree_location;
		
    this._penaltyPercentage = data.penalty_percentage;
    this._penaltyEnabled = data.penalty_enabled;
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get address(): string {
		return this._address;
	}

	get city(): string {
		return this._city;
	}

	get typeOfVilla(): string {
		return this._typeOfVilla;
	}

	get uploadedAt(): Date {
		return this._uploadedAt;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get code(): string {
		return this._code;
	}

	get cautionAmount(): number {
		return this._cautionAmount;
	}

	get price(): number {
		return this._price;
	}

	get statePhotos(): string | null {
		return this._statePhotos;
	}

	get realEstateEntitiesId(): string {
		return this._realEstateEntitiesId;
	}

	get buildingsId(): string | undefined {
		return this._buildingsId;
	}

	get tenantsId(): string {
		return this._tenantsId;
	}

	get dateDebutLocation(): string {
		return this._dateDebutLocation;
	}
	get dureeLocation(): string {
		return this._dureeLocation;
	}

	get dateFinLocation(): string {
		return this._dateFinLocation;
	}

	get dateLimitePaiement(): number {
		return this._dateLimitePaiement;
	}

	  get penaltyEnabled(): boolean | undefined {
    return this._penaltyEnabled;
  }
  get penaltyPercentage(): number | undefined  | null{
    return this._penaltyPercentage;
  }
}
