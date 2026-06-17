export type UserRole = "investor" | "entrepreneur" | "admin";

type IUser = {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  idCardUrl?: string;
  idCardBackUrl?: string;
  idCardNumber?: string;
  validationStatus: string;
  isEntrepreneur?: boolean;
  entrepreneurStatus?: string;
  role?: UserRole;
};

export default class User {
  private _id: string;
  private _email: string;
  private _name: string;
  private _phoneNumber: string | null;
  private _idCardUrl: string | null;
  private _idCardBackUrl: string | null;
  private _idCardNumber: string | null;
  private _validationStatus: string | null;
  private _isEntrepreneur: boolean;
  private _entrepreneurStatus: string | null;
  private _role: UserRole;

  constructor(data: IUser) {
    this._id = data.id;
    this._email = data.email;
    this._name = data.name;
    this._phoneNumber = data.phoneNumber ?? null;
    this._idCardUrl = data.idCardUrl ?? null;
    this._idCardBackUrl = data.idCardBackUrl ?? null;
    this._idCardNumber = data.idCardNumber ?? null;
    this._validationStatus = data.validationStatus;
    this._isEntrepreneur = data.isEntrepreneur ?? false;
    this._entrepreneurStatus = data.entrepreneurStatus ?? null;
    this._role = data.role ?? "investor";
  }

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get name() {
    return this._name;
  }

  get phoneNumber() {
    return this._phoneNumber;
  }

  get idCardUrl() {
    return this._idCardUrl;
  }

  get idCardBackUrl() {
    return this._idCardBackUrl;
  }

  get idCardNumber() {
    return this._idCardNumber;
  }

  get validationStatus() {
    return this._validationStatus;
  }

  get isEntrepreneur(): boolean {
    return this._isEntrepreneur;
  }

  get entrepreneurStatus(): string | null {
    return this._entrepreneurStatus;
  }

  get role(): UserRole {
    return this._role;
  }

  /**
   * Returns true if the user has selected a role (entrepreneur or investor).
   * An investor role is assigned by default after login; the user can later
   * upgrade to entrepreneur via the onboarding banner.
   */
  get hasSelectedRole(): boolean {
    return true; // always true after login
  }
}
