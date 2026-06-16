export interface IRental {
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

export default class Rental {
  private _rentalId: string;
  private _tenantId: string;
  private _propertyId: string;
  private _tenantName: string;
  private _tenantPhone: string;
  private _propertyName: string;
  private _propertyAddress: string;
  private _monthlyAmount: number;
  private _startDate: Date;
  private _endDate: Date;
  private _paymentStatus: string;
  private _rentalsStatus: string;
  private _rentalContractFileUrl: string;
  private _createdAt: Date;

  constructor(data: IRental) {
    this._rentalId = data.rental_id;
    this._tenantId = data.tenant_id;
    this._propertyId = data.property_id;
    this._tenantName = data.tenant_name;
    this._tenantPhone = data.tenant_phone;
    this._propertyName = data.property_name;
    this._propertyAddress = data.property_address;
    this._monthlyAmount = data.monthly_amount;
    this._startDate = new Date(data.start_date);
    this._endDate = new Date(data.end_date);
    this._paymentStatus = data.payment_status;
    this._rentalsStatus = data.rentals_status;
    this._rentalContractFileUrl = data.rental_contract_file_url;
    this._createdAt = new Date(data.created_at);
  }

  get rentalId(): string {
    return this._rentalId;
  }
  get tenantId(): string {
    return this._tenantId;
  }
  get propertyId(): string {
    return this._propertyId;
  }
  get tenantName(): string {
    return this._tenantName;
  }
  get tenantPhone(): string {
    return this._tenantPhone;
  }
  get propertyName(): string {
    return this._propertyName;
  }
  get propertyAddress(): string {
    return this._propertyAddress;
  }
  get monthlyAmount(): number {
    return this._monthlyAmount;
  }
  get startDate(): Date {
    return this._startDate;
  }
  get endDate(): Date {
    return this._endDate;
  }
  get paymentStatus(): string {
    return this._paymentStatus;
  }
  get rentalsStatus(): string {
    return this._rentalsStatus;
  }
  get rentalContractFileUrl(): string {
    return this._rentalContractFileUrl;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
