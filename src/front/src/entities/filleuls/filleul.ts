export interface IFilleul {
  id?: string | number;
  Id?: string | number;
  user_filleul_reference?: string;
  userFilleulReference?: string;
  user_reference?: string;
  userReference?: string;
  code_parrainage?: string;
  codeParrainage?: string;
  parrain?: {
    id?: string;
    codeParrainage?: string;
  };
  points?: number;
  coupons?: Array<Record<string, any>>;
  isNew?: boolean;
  created_at?: string;
  createdAt?: string;
  [key: string]: any;
}

export default class Filleul {
  private _id: string;
  private _userFilleulReference: string;
  private _codeParrainage: string;
  private _createdAt: string;
  private _raw: Record<string, any>;

  constructor(filleul: IFilleul) {
    this._id = String(filleul.id ?? filleul.Id ?? "");
    this._userFilleulReference =
      filleul.userFilleulReference ??
      filleul.user_filleul_reference ??
      filleul.userReference ??
      filleul.user_reference ??
      "";
    this._codeParrainage =
      filleul.codeParrainage ??
      filleul.code_parrainage ??
      filleul.parrain?.codeParrainage ??
      "";
    this._createdAt = filleul.createdAt ?? filleul.created_at ?? "";
    this._raw = filleul;
  }

  get id() {
    return this._id;
  }

  get userFilleulReference() {
    return this._userFilleulReference;
  }

  get codeParrainage() {
    return this._codeParrainage;
  }

  get createdAt() {
    return this._createdAt;
  }

  get raw() {
    return this._raw;
  }

  update(data: Partial<Filleul>): void {
    Object.assign(this, data);
  }
}
