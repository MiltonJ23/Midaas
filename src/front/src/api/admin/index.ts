import { withErrorHandling } from "@/api/api-wrapper-utility";
import instance from "..";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { Storage, StorageKeys } from "@/api/auth/storage";

/* ───────────────────────────────────────────────
   Admin-specific storage keys
   ─────────────────────────────────────────────── */
export const AdminStorageKeys = {
  adminAccess: "midaas-admin-access",
  adminId: "midaas-admin-id",
} as const;

const getAdminAuthHeader = () => {
  const token = Storage.getItem(AdminStorageKeys.adminAccess);
  if (!token) return undefined;
  return { Authorization: `Bearer ${token}` };
};

/* ───────────────────────────────────────────────
   Helpers
   ─────────────────────────────────────────────── */
const unwrapEnvelope = (raw: any) => {
  if (raw && typeof raw === "object" && "success" in raw && "data" in raw) {
    return raw.data;
  }
  return raw;
};

const toArray = (payload: any): any[] => {
  const p = unwrapEnvelope(payload);
  if (Array.isArray(p)) return p;
  if (p?.data && Array.isArray(p.data)) return p.data;
  if (Array.isArray(p?.Data)) return p.Data;
  return [];
};

const toObject = (payload: any): Record<string, any> | null => {
  const p = unwrapEnvelope(payload);
  if (p && typeof p === "object") return p;
  return null;
};

/* ───────────────────────────────────────────────
   Types
   ─────────────────────────────────────────────── */
export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface AdminCompanyItem {
  id: string;
  entrepreneur_id: string;
  status: string;
  legal_name: string;
  trade_name?: string;
  corporate_form: string;
  industry_sector?: string;
  gps_coordinates?: string;
  physical_address?: string;
  created_at?: string;
  updated_at?: string;
  entrepreneur?: {
    id: string;
    user?: {
      full_name?: string;
      email?: string;
    };
  };
}

/**
 * Full company detail returned by GET /companies/{id}.
 * Mirrors the fields from the creation form (CompanyRegistrationForm).
 */
export interface AdminCompanyDetail {
  id: string;
  entrepreneur_id: string;
  status: string;
  legal_name: string;
  trade_name?: string;
  corporate_form: string;
  industry_sector?: string;
  gps_coordinates?: string;
  physical_address?: string;
  created_at?: string;
  updated_at?: string;

  /** Legal documents block */
  legal_docs?: {
    rccm_number?: string;
    rccm_docs?: string[];
  };

  /** Financial information block */
  financials?: {
    dsf_years?: number[];
    bank_statements?: string[];
    momo_statements?: string[];
  };

  /** Beneficial owners */
  beneficial_owners?: {
    full_name: string;
    equity_percentage: number;
  }[];

  /** Management team */
  managers?: {
    full_name: string;
    role: string;
  }[];

  /** Uploaded document URLs by category (flat from API) */
  niu_docs?: string[];
  statuts_docs?: string[];
  premises_docs?: string[];
  sector_permits_docs?: string[];
  collateral_docs?: string[];
  identity_docs?: string[];
  bank_statements_docs?: string[];
  momo_statements_docs?: string[];

  /** Uploaded document URLs by category (grouped) */
  documents?: Record<
    | "rccm"
    | "niu"
    | "statuts"
    | "premises"
    | "sector_permits"
    | "dsf"
    | "bank_statements"
    | "momo_statements"
    | "collateral"
    | "identity",
    string[] | undefined
  >;

  entrepreneur?: {
    id: string;
    user?: {
      id: string;
      full_name?: string;
      email?: string;
      phone_number?: string;
    };
  };
}

export interface AdminEntrepreneurItem {
  id: string;
  user_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
    phone_number?: string;
  };
}

export interface AdminUserItem {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  id_card_url?: string;
  id_card_back_url?: string;
  id_card_number?: string;
  created_at?: string;
  updated_at?: string;
  is_entrepreneur?: boolean;
  entrepreneur_status?: string;
}

/* ───────────────────────────────────────────────
   Admin API Provider
   ─────────────────────────────────────────────── */
export const adminProvider = {
  /**
   * POST /admin/login
   * Authenticate as an admin and receive a JWT token.
   */
  async login({ email, password }: AdminLoginDto) {
    return await withErrorHandling<{
      admin: AdminProfile;
      token: string;
    }>(
      async () => {
        const response = await instance.post("/admin/login", {
          email,
          password,
        });

        if (response.status === 200) {
          const body = unwrapEnvelope(response.data);
          const { admin, token } = body;

          if (token) {
            Storage.setItem(AdminStorageKeys.adminAccess, token);
          }
          if (admin?.id) {
            Storage.setItem(AdminStorageKeys.adminId, admin.id);
          }

          return {
            status: response.status,
            data: { admin, token },
          };
        }

        return response;
      },
      "Erreur lors de la connexion administrateur",
      "Connexion administrateur réussie",
    );
  },

  /**
   * GET /admin/me
   * Get the authenticated admin profile.
   */
  async getMe() {
    return await withErrorHandling<{ admin: AdminProfile }>(
      async () => {
        const response = await instance.get("/admin/me", {
          headers: getAdminAuthHeader(),
        });

        if (response.status === 200) {
          const body = unwrapEnvelope(response.data);
          return {
            status: response.status,
            data: { admin: body.admin ?? body },
          };
        }

        return response;
      },
      "Impossible de récupérer le profil administrateur",
      "Profil administrateur récupéré",
    );
  },

  /**
   * GET /companies/{id}
   * Fetch the FULL detail of a company including all nested fields
   * (legal_docs, financials, beneficial_owners, managers, documents, entrepreneur).
   * Uses the regular auth header which carries the admin token.
   */
  async getCompanyDetail(id: string) {
    return await withErrorHandling<AdminCompanyDetail>(async () => {
      const response = await instance.get(`/companies/${id}`, {
        headers: getAdminAuthHeader(),
      });

      if (response.status === 200) {
        const detail = toObject(response.data);
        return {
          status: response.status,
          data: (detail ?? {}) as AdminCompanyDetail,
        };
      }

      return response;
    }, "Impossible de récupérer les détails complets de l'entreprise");
  },

  /**
   * GET /admin/companies/pending
   * List all companies with pending or reverify_requested status.
   */
  async getPendingCompanies() {
    return await withErrorHandling<AdminCompanyItem[]>(async () => {
      const response = await instance.get("/admin/companies/pending", {
        headers: getAdminAuthHeader(),
      });

      if (response.status === 200) {
        return {
          status: response.status,
          data: toArray(response.data),
        };
      }

      return response;
    }, "Impossible de récupérer les entreprises en attente");
  },

  /**
   * POST /admin/companies/{id}/approve
   * Approve a company (changes status to approved).
   */
  async approveCompany(id: string) {
    return await withErrorHandling<{ id: string; status: string }>(
      async () => {
        const response = await instance.post(
          `/admin/companies/${id}/approve`,
          {},
          { headers: getAdminAuthHeader() },
        );

        if (response.status === 200) {
          const body = toObject(response.data);
          return {
            status: response.status,
            data: body ?? { id, status: "approved" },
          };
        }

        return response;
      },
      "Erreur lors de l'approbation de l'entreprise",
      "Entreprise approuvée avec succès",
    );
  },

  /**
   * POST /admin/companies/{id}/reject
   * Reject a company with an optional reason.
   */
  async rejectCompany(id: string, reason?: string) {
    return await withErrorHandling<{ id: string; status: string }>(
      async () => {
        const payload: Record<string, string> = {};
        if (reason) payload.reason = reason;

        const response = await instance.post(
          `/admin/companies/${id}/reject`,
          payload,
          { headers: getAdminAuthHeader() },
        );

        if (response.status === 200) {
          const body = toObject(response.data);
          return {
            status: response.status,
            data: body ?? { id, status: "rejected" },
          };
        }

        return response;
      },
      "Erreur lors du rejet de l'entreprise",
      "Entreprise rejetée",
    );
  },

  /**
   * GET /admin/entrepreneurs
   * List all entrepreneurs.
   */
  async getEntrepreneurs() {
    return await withErrorHandling<AdminEntrepreneurItem[]>(async () => {
      const response = await instance.get("/admin/entrepreneurs", {
        headers: getAdminAuthHeader(),
      });

      if (response.status === 200) {
        return {
          status: response.status,
          data: toArray(response.data),
        };
      }

      return response;
    }, "Impossible de récupérer la liste des entrepreneurs");
  },

  /**
   * POST /admin/entrepreneurs/{id}/suspend
   * Suspend an entrepreneur.
   */
  async suspendEntrepreneur(id: string) {
    return await withErrorHandling<{ id: string; status: string }>(
      async () => {
        const response = await instance.post(
          `/admin/entrepreneurs/${id}/suspend`,
          {},
          { headers: getAdminAuthHeader() },
        );

        if (response.status === 200) {
          const body = toObject(response.data);
          return {
            status: response.status,
            data: body ?? { id, status: "suspended" },
          };
        }

        return response;
      },
      "Erreur lors de la suspension de l'entrepreneur",
      "Entrepreneur suspendu",
    );
  },

  /**
   * POST /admin/entrepreneurs/{id}/activate
   * Activate an entrepreneur.
   */
  async activateEntrepreneur(id: string) {
    return await withErrorHandling<{ id: string; status: string }>(
      async () => {
        const response = await instance.post(
          `/admin/entrepreneurs/${id}/activate`,
          {},
          { headers: getAdminAuthHeader() },
        );

        if (response.status === 200) {
          const body = toObject(response.data);
          return {
            status: response.status,
            data: body ?? { id, status: "active" },
          };
        }

        return response;
      },
      "Erreur lors de l'activation de l'entrepreneur",
      "Entrepreneur activé",
    );
  },

  /**
   * GET /admin/users
   * List all users.
   */
  async getUsers() {
    return await withErrorHandling<AdminUserItem[]>(async () => {
      const response = await instance.get("/admin/users", {
        headers: getAdminAuthHeader(),
      });

      if (response.status === 200) {
        return {
          status: response.status,
          data: toArray(response.data),
        };
      }

      return response;
    }, "Impossible de récupérer la liste des utilisateurs");
  },

  /**
   * Client-side logout — clears admin storage.
   */
  async logout() {
    return await withErrorHandling<{ message: string }>(
      async () => {
        Storage.removeItem(AdminStorageKeys.adminAccess);
        Storage.removeItem(AdminStorageKeys.adminId);
        return {
          status: 200,
          data: { message: "Déconnexion administrateur réussie" },
        };
      },
      "Erreur lors de la déconnexion",
      "Déconnexion réussie",
    );
  },
};
