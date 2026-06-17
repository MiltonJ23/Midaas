export interface ITenant {
	id: string;
	name: string;
	email: string;
	professions: string;
	phone: string;
	identity_document: string;
	profile_picture: string;
}

export default class Tenant {
	private _id: string;
	private _name: string;
	private _email: string;
	private _professions: string;
	private _phone: string;
	private _identityDocument: string;
	private _profilePicture: string;

	constructor(tenant: ITenant) {
		this._id = tenant.id;
		this._name = tenant.name;
		this._email = tenant.email;
		this._professions = tenant.professions;
		this._phone = tenant.phone;
		this._identityDocument = tenant.identity_document;
		this._profilePicture = tenant.profile_picture;
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get email() {
		return this._email;
	}

	get phone() {
		return this._phone;
	}

	get professions() {
		return this._professions;
	}

	get identityDocument() {
		return this._identityDocument;
	}

	get profilePicture() {
		return this._profilePicture;
	}

	update(data: Partial<Tenant>): void {
    Object.assign(this, data);
}
}
