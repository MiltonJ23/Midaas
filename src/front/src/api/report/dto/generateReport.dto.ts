export type GenerateReportDTO = {
	type_of_rapport: "payment" | "maintenance";
	property_id: string;
	period: string;
	type_of_return_file: "csv" | "pdf" | "excel";
};
