import { baseURL } from "@/api";

export interface IApplication {
  id: string;
  full_name: string;
  phone_number: string;
  address: string;
  identitie_card_photo: string;
  created_at: string;
  announcement: string;
}

export class Application {
	private _id: string;
	private _fullName: string;
	private _phoneNumber: string;
	private _address: string;
	private _identitieCardPhoto: string;
	private _createdAt: Date;
	private _announcement: string;

	constructor(application: IApplication) {
		this._id = application.id;
		this._fullName = application.full_name;
		this._phoneNumber = application.phone_number;
		this._address = application.address;
		this._identitieCardPhoto = `${baseURL}${application.identitie_card_photo}`;
		this._createdAt = new Date(application.created_at);
		this._announcement = application.announcement;
	}

	get id(): string {
		return this._id;
	}

	get fullName(): string {
		return this._fullName;
	}

	get phoneNumber(): string {
		return this._phoneNumber;
	}

	get address(): string {
		return this._address;
	}

	get identitieCardPhoto(): string {
		return this._identitieCardPhoto;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get announcement(): string {
		return this._announcement;
	}

	isPDF(file: string) {
		return file.includes(".pdf");
	}

	isImage(file: string) {
		return (
			file.includes(".png") ||
			file.includes(".jpg") ||
			file.includes(".jpeg") ||
			file.includes(".gif") ||
			file.includes(".svg")
		);
	}

	static fromJson(application: IApplication): Application {
		return new Application(application);
	}
}