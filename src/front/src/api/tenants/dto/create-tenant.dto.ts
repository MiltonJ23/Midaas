export type CreateTenantDto = {
	name: string;
	email: string;
	phone: string;
	professions: string;
	identity_document: File;
	profile_picture: File;
	// password: string;
};
