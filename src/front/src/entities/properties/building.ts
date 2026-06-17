export interface IBuilding {
	id: string;
	name: string;
	address: string;
	city: string;
	uploaded_at: Date;
	created_at: Date;
	real_estate_entities_id: string;
}

export default class Building {
	private _id: string;
	private _name: string;
	private _address: string;
	private _city: string;
	private _uploadedAt: Date;
	private _createdAt: Date;
	private _realEstateEntitiesId: string;

  constructor(data: IBuilding) {
    this._id = data.id;
    this._name = data.name;
    this._address = data.address;
    this._city = data.city;
    this._uploadedAt = data.uploaded_at;
    this._createdAt = data.created_at;
    this._realEstateEntitiesId = data.real_estate_entities_id;
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

  get realEstateEntitiesId(): string {
    return this._realEstateEntitiesId;
  }
}
