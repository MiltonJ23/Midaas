export interface IParrain {
  id?: string | number;
  Id?: string | number;
  user_reference?: string;
  userReference?: string;
  code_parrainage?: string;
  codeParrainage?: string;
  created_at?: string;
  createdAt?: string;
  [key: string]: any;
}

export default class Parrain {
  private _id: string;
  private _userReference: string;
  private _codeParrainage: string;
  private _createdAt: string;
  private _raw: Record<string, any>;

  constructor(parrain: IParrain) {
    this._id = String(parrain.id ?? parrain.Id ?? "");
    this._userReference = parrain.userReference ?? parrain.user_reference ?? "";
    this._codeParrainage =
      parrain.codeParrainage ?? parrain.code_parrainage ?? "";
    this._createdAt = parrain.createdAt ?? parrain.created_at ?? "";
    this._raw = parrain;
  }

  get id() {
    return this._id;
  }

  get userReference() {
    return this._userReference;
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

  update(data: Partial<Parrain>): void {
    Object.assign(this, data);
  }
}
