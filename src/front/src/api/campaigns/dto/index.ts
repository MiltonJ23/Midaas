export interface CreateCampaignDto {
  title: string;
  description: string;
  funding_goal: number;
  company_id?: string;
  currency?: string;
  category?: string;
  cover_image_url?: string;
  start_date?: string;
  end_date?: string;
}

export interface UpdateCampaignDto extends Partial<CreateCampaignDto> {
  status?: string;
}

export interface CreateMilestoneDto {
  title: string;
  description: string;
  order_num: number;
  fund_allocation: number;
  due_date?: string;
}
