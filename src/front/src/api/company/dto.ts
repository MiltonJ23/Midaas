export interface CreateCompanyDto {
  legal_name: string;
  trade_name?: string;
  corporate_form: string;
  industry_sector?: string;
  gps_coordinates?: string;
  physical_address?: string;
}

export interface UpdateCompanyDto {
  legal_name?: string;
  trade_name?: string;
  corporate_form?: string;
  industry_sector?: string;
  gps_coordinates?: string;
  physical_address?: string;
}
