export interface ILocal {
  id: string;
  name: string;
  address: string;
  city: string;
  uploaded_at?: Date;
  created_at?: Date;
  type_of_local:
    | "shop"
    | "restaurant_bar"
    | "office"
    | "warehouse"
    | "workshop"
    | "showroom"
    | "office"
    | "autre"
    | string;
  code: string;
  caution_amount: number;
  price: number;
  state_photos: string;
  real_estate_entities_id: string;
  buildings_id?: string;
  tenants_id: string;
  date_debut_location: Date;
  date_fin_location: Date;
  duree_location: number;
  date_limite_paiement: number;
   penalty_enabled?: boolean;
  penalty_percentage?: number | null;

}

export default class Local {
  private _id: string;
  private _name: string;
  private _address: string;
  private _city: string;
  private _uploadedAt: Date;
  private _createdAt: Date;
  private _code: string;
  private _typeOfLocal:
    | "shop"
    | "restaurant_bar"
    | "office"
    | "warehouse"
    | "workshop"
    | "showroom"
    | "autre"
    | string;
  private _cautionAmount: number;
  private _price: number;
  private _statePhotos: string;
  private _realEstateEntitiesId: string;
  private _buildingsId?: string;
  private _tenantsId: string;
  private _dateDebutLocation: Date;
  private _dateFinLocation: Date;
  private _dureeLocation: number;
  private _dateLimitePaiement: number;
   private _penaltyEnabled?: boolean;
  private _penaltyPercentage?: number | null;


  constructor(data: ILocal) {
    this._id = data.id;
    this._name = data.name;
    this._address = data.address;
    this._city = data.city;
    this._uploadedAt = data.uploaded_at ?? new Date(Date.now());
    this._createdAt = data.created_at ?? new Date(Date.now());
    this._code = data.code;
    this._cautionAmount = data.caution_amount;
    this._price = data.price;
    this._typeOfLocal = data.type_of_local;
    this._statePhotos = data.state_photos;
    this._realEstateEntitiesId = data.real_estate_entities_id;
    this._buildingsId = data.buildings_id;
    this._tenantsId = data.tenants_id;
    this._dateDebutLocation = data.date_debut_location;
    this._dateFinLocation = data.date_fin_location;
    this._dureeLocation = data.duree_location;
    this._dateLimitePaiement = data.date_limite_paiement;
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

  get typeOfLocal():
    | "shop"
    | "restaurant_bar"
    | "office"
    | "warehouse"
    | "workshop"
    | "showroom"
    | "autre"
    | string {
    return this._typeOfLocal;
  }

  get statePhotos(): string {
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

  get dateDebutLocation(): Date {
    return this._dateDebutLocation;
  }

  get dateFinLocation(): Date {
    return this._dateFinLocation;
  }

  get dureeLocation(): number {
    return this._dureeLocation;
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
