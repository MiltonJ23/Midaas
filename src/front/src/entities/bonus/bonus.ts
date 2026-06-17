export interface IBonus {
  id: string;
  parrain_id?: string;
  filleul_id?: string;
  filleul_reference?: string;
  parrain_reference?: string;
  bonus_points: number;
  filleul_count: number;
  milestone: number; // e.g., 5 filleuls per bonus
  status: "pending" | "awarded" | "cancelled";
  created_at?: string;
  awarded_at?: string;
  reason?: string;
  raw: any;
}

export class Bonus implements IBonus {
  id: string;
  parrain_id?: string;
  filleul_id?: string;
  filleul_reference?: string;
  parrain_reference?: string;
  bonus_points: number;
  filleul_count: number;
  milestone: number;
  status: "pending" | "awarded" | "cancelled";
  created_at?: string;
  awarded_at?: string;
  reason?: string;
  raw: any;

  constructor(data: any) {
    this.raw = data;
    this.id = data?.id || data?._id || "";
    this.parrain_id = data?.parrain_id || data?.parrain?.id || "";
    this.filleul_id = data?.filleul_id || data?.filleul?.id || "";
    this.filleul_reference =
      data?.filleul_reference ||
      data?.filleul?.userReference ||
      data?.user_reference ||
      "";
    this.parrain_reference =
      data?.parrain_reference || data?.parrain?.userReference || "";
    this.bonus_points = data?.bonus_points || data?.points || 0;
    this.filleul_count = data?.filleul_count || data?.count || 0;
    this.milestone = data?.milestone || 5;
    this.status = data?.status || "pending";
    this.created_at = data?.created_at || data?.createdAt || "";
    this.awarded_at = data?.awarded_at || data?.awardedAt || "";
    this.reason = data?.reason || "";
  }
}
