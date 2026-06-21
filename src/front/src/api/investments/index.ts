import { withErrorHandling } from "@/api/api-wrapper-utility";
import instance from "..";

export interface InvestDto {
  amount: number;
  currency?: string;
}

export interface InvestmentItem {
  id: string;
  project_id: string;
  investor_id: string;
  amount: number;
  currency: string;
  fee_amount: number;
  total_amount: number;
  status: string;
  created_at: string;
  project?: {
    id: string;
    title: string;
    funding_goal: number;
    funding_raised: number;
    currency: string;
    status: string;
    category?: string;
  };
}

const toArray = (payload: any): any[] => {
  if (Array.isArray(payload?.Data)) return payload.Data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

export const investmentProvider = {
  invest: (projectId: string, data: InvestDto) =>
    withErrorHandling(async () => {
      const res = await instance.post(`/projects/${projectId}/invest`, {
        amount: data.amount,
        currency: data.currency || "XOF",
      });
      return res.data;
    }),

  getMyInvestments: () =>
    withErrorHandling(async () => {
      const res = await instance.get("/investments/my");
      return { data: toArray(res.data) };
    }),

  getProjectInvestors: (projectId: string) =>
    withErrorHandling(async () => {
      const res = await instance.get(`/projects/${projectId}/investors`);
      return { data: toArray(res.data) };
    }),
};
