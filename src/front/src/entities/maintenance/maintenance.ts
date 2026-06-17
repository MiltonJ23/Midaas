// Description: The maintenance entity model.
export const maintenanceTypes = {
  water_leak: "Fuite d'eau",
  plumbing: "Plomberie",
  pests: "Insectes/Rongeurs",
  electricity: "Électricité",
  locks: "Serrures",
  wall_floor_issues: "Problèmes mur/Sol",
  waterproofing: "Étanchéité",
  appliances: "Électroménagers",
  hvac: "Chauffage, Ventilation et Climatisation (HVAC)",
  painting: "Peinture",
  roof_issues: "Problèmes de Toiture",
  windows: "Fenêtres",
  garbage_disposal: "Élimination des Déchets",
  internet_cable: "Internet et Câbles",
  landscaping: "Aménagement Paysager",
  pool_maintenance: "Entretien de la Piscine",
  sewage: "Problèmes d’Égouts",
  gas: "Problèmes de Gaz",
  fire_safety: "Sécurité Incendie",
  elevator: "Ascenseur",
  other: "Autres",
} as const;

export type maintenanceType = typeof maintenanceTypes[keyof typeof maintenanceTypes];

interface IMaintenance {
	id: string;
	maintenance_type: maintenanceType;
	maintenance_title: string;
	maintenance_priority: string;
	status: string;
	description: string;
	scheduled_date: string;
	technician_assigned_date: string;
	technician_assigned_time: string;
	photo: string;
	technician_name: string;
	technician_contact: string;
	created_at: string;
	updated_at: string;
	tenants_id: string;
	tenants_name: string;
	property_id: string;
	property_name: string;
	property_address: string;
	property_city: string;
}

export default class Maintenance {
	private _id: string;
	private _maintenanceType: maintenanceType;
	private _maintenanceTitle: string;
	private _maintenancePriority: string;
	private _status: string;
	private _description: string;
	private _scheduledDate: Date;
	private _technicianAssignedDate: string;
	private _technicianAssignedTime: string;
	private _photo: string;
	private _technicianName: string;
	private _technicianContact: string;
	private _createdAt: string;
	private _updatedAt: string;
	private _tenantsId: string;
	private _tenantsName: string;
	private _propertyId: string;
	private _propertyName: string;
	private _propertyAddress: string;
	private _propertyCity: string;

	constructor(payload: IMaintenance) {
		this._id = payload.id;
		this._maintenanceType = payload.maintenance_type;
		this._maintenanceTitle = payload.maintenance_title;
		this._maintenancePriority = payload.maintenance_priority;
		this._status = payload.status;
		this._description = payload.description;
		this._scheduledDate = new Date(payload.scheduled_date);
		this._technicianAssignedDate = payload.technician_assigned_date;
		this._technicianAssignedTime = payload.technician_assigned_time;
		this._photo = payload.photo;
		this._technicianName = payload.technician_name;
		this._technicianContact = payload.technician_contact;
		this._createdAt = payload.created_at;
		this._updatedAt = payload.updated_at;
		this._tenantsId = payload.tenants_id;
		this._tenantsName = payload.tenants_name;
		this._propertyId = payload.property_id;
		this._propertyName = payload.property_name;
		this._propertyAddress = payload.property_address;
		this._propertyCity = payload.property_city;
	}

	get id(): string {
		return this._id;
	}

	get maintenanceType(): maintenanceType {
		return this._maintenanceType;
	}
	get maintenanceTitle(): string {
		return this._maintenanceTitle;
	}

	get maintenancePriority(): string {
		return this._maintenancePriority;
	}

	get status(): string {
		return this._status;
	}

	get description(): string {
		return this._description;
	}

	get scheduledDate(): Date {
		return this._scheduledDate;
	}

	get technicianAssignedDate(): string {
		return this._technicianAssignedDate;
	}

	get technicianAssignedTime(): string {
		return this._technicianAssignedTime;
	}

	get photo(): string {
		return this._photo;
	}

	get technicianName(): string {
		return this._technicianName;
	}

	get technicianContact(): string {
		return this._technicianContact;
	}

	get createdAt(): string {
		return this._createdAt;
	}

	get updatedAt(): string {
		return this._updatedAt;
	}

	get tenantsId(): string {
		return this._tenantsId;
	}

	get tenantsName(): string {
		return this._tenantsName;
	}

	get propertyId(): string {
		return this._propertyId;
	}

	get propertyName(): string {
		return this._propertyName;
	}

	get propertyAddress(): string {
		return this._propertyAddress;
	}

	get propertyCity(): string {
		return this._propertyCity;
	}

	set technicianContact(value: string) {
		this._technicianContact = value;
	}

	set technicianName(value: string) {
		this._technicianName = value;
	}

	set technicianAssignedDate(value: string) {
		this._technicianAssignedDate = value;
	}

	set technicianAssignedTime(value: string) {
		this._technicianAssignedTime = value;
	}
}