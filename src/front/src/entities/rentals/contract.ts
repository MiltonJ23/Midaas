interface IContract {
  rental_id: string;
  tenant_id: string;
  property_id: string;
  tenant_name: string;
  tenant_phone: string;
  property_name: string;
  property_address: string;
  monthly_amount: number;
  start_date: string;
  end_date: string;
  payment_status: string;
  rentals_status: string;
  rental_contract_file_url: string;
  created_at: string;
}

export default class Contract {
  private _rental_id: string;
  private _tenant_id: string;
  private _property_id: string;
  private _tenant_name: string;
  private _tenant_phone: string;
  private _property_name: string;
  private _property_address: string;
  private _monthly_amount: number;
  private _start_date: string;
  private _end_date: string;
  private _payment_status: string;
  private _rentals_status: string;
  private _rental_contract_file_url: string;
  private _created_at: string;

  constructor(data: IContract) {
    this._rental_id = data.rental_id;
    this._tenant_id = data.tenant_id;
    this._property_id = data.property_id;
    this._tenant_name = data.tenant_name;
    this._tenant_phone = data.tenant_phone;
    this._property_name = data.property_name;
    this._property_address = data.property_address;
    this._monthly_amount = data.monthly_amount;
    this._start_date = data.start_date;
    this._end_date = data.end_date;
    this._payment_status = data.payment_status;
    this._rentals_status = data.rentals_status;
    this._rental_contract_file_url = data.rental_contract_file_url;
    this._created_at = data.created_at;
  }

  get rental_id() { return this._rental_id; }
  get tenant_id() { return this._tenant_id; }
  get property_id() { return this._property_id; }
  get tenant_name() { return this._tenant_name; }
  get tenant_phone() { return this._tenant_phone; }
  get property_name() { return this._property_name; }
  get property_address() { return this._property_address; }
  get monthly_amount() { return this._monthly_amount; }
  get start_date() { return this._start_date; }
  get end_date() { return this._end_date; }
  get payment_status() { return this._payment_status; }
  get rentals_status() { return this._rentals_status; }
  get rental_contract_file_url() { return this._rental_contract_file_url; }
  get created_at() { return this._created_at; }

  isPDF(file?: string): boolean {
    if (!file) return false;
    return file.includes(".pdf");
  }

  isImage(file?: string): boolean {
    if (!file) return false;
    return (
      file.includes(".png") ||
      file.includes(".jpg") ||
      file.includes(".jpeg") ||
      file.includes(".gif") ||
      file.includes(".svg")
    );
  }
}