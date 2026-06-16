import instance from "..";

export const dashboardProvider = {
  getStatistics: async () => {
    try {
      const response = await instance.get("/rapport/dashboard/");

      if (response.status === 200) {
        const {
          data: { dashboard_data, Stats },
        } = response.data;

        const payload = {
          data: {
            tenants: dashboard_data.tenants_count,
            rentals: dashboard_data.rentals_count,
            totalTransactions: dashboard_data.successful_transactions_count,
            totalPaymentAmount: dashboard_data.total_payment_amount,
          },
          stats: {
            paymentPerMonths: Stats.payments_by_month,
            monthlyPaymentPercentages: Stats["monthly_payment_percentages (%)"],
          },
        };

        return {
          data: payload,
        };
      }

      return {
        error: "Une erreur s'est produite",
      };
    } catch (error) {
      console.log("");
      return {
        error: "Something went wrong",
      };
    }
  },
};

// Phn?%98bN-*kEV5S~65k
