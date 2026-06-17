import { withErrorHandling } from "../api-wrapper-utility";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const bonusProvider = {
  async getByFilleul(filleulId: string) {
    return withErrorHandling(async () => {
      const response = await axios.get(
        `${API_BASE_URL}/api/parrain/bonus/by_filleul/${filleulId}`,
      );
      return response.data;
    });
  },

  async getAllBonuses() {
    return withErrorHandling(async () => {
      // This endpoint may not exist in the API, but we'll fetch all parrain data
      // and calculate bonuses from the filleul counts
      const response = await axios.get(`${API_BASE_URL}/api/parrain/all`);
      return response.data;
    });
  },
};

export default bonusProvider;
