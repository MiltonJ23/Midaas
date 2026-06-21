import instance from "..";

export interface ProviderConfig {
  provider: string;
  displayName: string;
  logo?: string;
  nameDisplayedToCustomer?: string;
  currencies: {
    currency: string;
    displayName?: string;
    operationTypes: {
      DEPOSIT?: {
        authType: string;
        pinPrompt?: string;
        minAmount: string;
        maxAmount: string;
        decimalsInAmount: string;
        status: string;
      };
    };
  }[];
}

export interface CountryConfig {
  country: string;
  displayName: Record<string, string>;
  prefix: string;
  flag?: string;
  providers: ProviderConfig[];
}

export interface ActiveConf {
  companyName: string;
  signatureConfiguration: {
    signedRequestsOnly: boolean;
    signedCallbacks: boolean;
  };
  countries: CountryConfig[];
}

// Fallback static data
const FALLBACK_COUNTRIES: CountryConfig[] = [
  {
    country: "CIV",
    displayName: { en: "Cote d'Ivoire", fr: "Cote d'Ivoire" },
    prefix: "225",
    providers: [
      { provider: "MTN_MOMO_CIV", displayName: "MTN", currencies: [{ currency: "XOF", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
      { provider: "ORANGE_CIV", displayName: "Orange", currencies: [{ currency: "XOF", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
      { provider: "WAVE_CIV", displayName: "Wave", currencies: [{ currency: "XOF", operationTypes: { DEPOSIT: { authType: "REDIRECT_AUTH", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
    ],
  },
  {
    country: "CMR",
    displayName: { en: "Cameroon", fr: "Cameroun" },
    prefix: "237",
    providers: [
      { provider: "MTN_MOMO_CMR", displayName: "MTN", currencies: [{ currency: "XAF", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
      { provider: "ORANGE_CMR", displayName: "Orange", currencies: [{ currency: "XAF", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
    ],
  },
  {
    country: "SEN",
    displayName: { en: "Senegal", fr: "Senegal" },
    prefix: "221",
    providers: [
      { provider: "ORANGE_SEN", displayName: "Orange", currencies: [{ currency: "XOF", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
      { provider: "FREE_SEN", displayName: "Free", currencies: [{ currency: "XOF", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
      { provider: "WAVE_SEN", displayName: "Wave", currencies: [{ currency: "XOF", operationTypes: { DEPOSIT: { authType: "REDIRECT_AUTH", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
    ],
  },
  {
    country: "BEN",
    displayName: { en: "Benin", fr: "Benin" },
    prefix: "229",
    providers: [
      { provider: "MTN_MOMO_BEN", displayName: "MTN", currencies: [{ currency: "XOF", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
      { provider: "MOOV_BEN", displayName: "Moov", currencies: [{ currency: "XOF", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
    ],
  },
  {
    country: "BFA",
    displayName: { en: "Burkina Faso", fr: "Burkina Faso" },
    prefix: "226",
    providers: [
      { provider: "MOOV_BFA", displayName: "Moov", currencies: [{ currency: "XOF", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
      { provider: "ORANGE_BFA", displayName: "Orange", currencies: [{ currency: "XOF", operationTypes: { DEPOSIT: { authType: "PREAUTH", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
    ],
  },
  {
    country: "GHA",
    displayName: { en: "Ghana", fr: "Ghana" },
    prefix: "233",
    providers: [
      { provider: "MTN_MOMO_GHA", displayName: "MTN", currencies: [{ currency: "GHS", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "1", maxAmount: "100000", decimalsInAmount: "TWO_PLACES", status: "OPERATIONAL" } } }] },
      { provider: "AIRTELTIGO_GHA", displayName: "AirtelTigo", currencies: [{ currency: "GHS", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "1", maxAmount: "100000", decimalsInAmount: "TWO_PLACES", status: "OPERATIONAL" } } }] },
      { provider: "VODAFONE_GHA", displayName: "Vodafone", currencies: [{ currency: "GHS", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "1", maxAmount: "100000", decimalsInAmount: "TWO_PLACES", status: "OPERATIONAL" } } }] },
    ],
  },
  {
    country: "KEN",
    displayName: { en: "Kenya", fr: "Kenya" },
    prefix: "254",
    providers: [
      { provider: "MPESA_KEN", displayName: "M-Pesa", currencies: [{ currency: "KES", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "1", maxAmount: "500000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
    ],
  },
  {
    country: "NGA",
    displayName: { en: "Nigeria", fr: "Nigeria" },
    prefix: "234",
    providers: [
      { provider: "AIRTEL_NGA", displayName: "Airtel", currencies: [{ currency: "NGN", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "500000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
      { provider: "MTN_MOMO_NGA", displayName: "MTN", currencies: [{ currency: "NGN", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "500000", decimalsInAmount: "TWO_PLACES", status: "OPERATIONAL" } } }] },
    ],
  },
  {
    country: "RWA",
    displayName: { en: "Rwanda", fr: "Rwanda" },
    prefix: "250",
    providers: [
      { provider: "AIRTEL_RWA", displayName: "Airtel", currencies: [{ currency: "RWF", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
      { provider: "MTN_MOMO_RWA", displayName: "MTN", currencies: [{ currency: "RWF", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
    ],
  },
  {
    country: "TZA",
    displayName: { en: "Tanzania", fr: "Tanzanie" },
    prefix: "255",
    providers: [
      { provider: "AIRTEL_TZA", displayName: "Airtel", currencies: [{ currency: "TZS", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "TWO_PLACES", status: "OPERATIONAL" } } }] },
      { provider: "VODACOM_TZA", displayName: "Vodacom", currencies: [{ currency: "TZS", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
    ],
  },
  {
    country: "UGA",
    displayName: { en: "Uganda", fr: "Ouganda" },
    prefix: "256",
    providers: [
      { provider: "AIRTEL_OAPI_UGA", displayName: "Airtel", currencies: [{ currency: "UGX", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "NONE", status: "OPERATIONAL" } } }] },
      { provider: "MTN_MOMO_UGA", displayName: "MTN", currencies: [{ currency: "UGX", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "100", maxAmount: "2000000", decimalsInAmount: "TWO_PLACES", status: "OPERATIONAL" } } }] },
    ],
  },
  {
    country: "ZMB",
    displayName: { en: "Zambia", fr: "Zambie" },
    prefix: "260",
    providers: [
      { provider: "AIRTEL_OAPI_ZMB", displayName: "Airtel", currencies: [{ currency: "ZMW", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "1", maxAmount: "100000", decimalsInAmount: "TWO_PLACES", status: "OPERATIONAL" } } }] },
      { provider: "MTN_MOMO_ZMB", displayName: "MTN", currencies: [{ currency: "ZMW", operationTypes: { DEPOSIT: { authType: "PROVIDER_AUTH", pinPrompt: "AUTOMATIC", minAmount: "1", maxAmount: "100000", decimalsInAmount: "TWO_PLACES", status: "OPERATIONAL" } } }] },
    ],
  },
];

// Cache for dynamic data
let cachedConfig: ActiveConf | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

export const pawaPayProvider = {
  /**
   * Fetch provider configuration dynamically from PawaPay.
   * Falls back to static data if the API is unreachable.
   */
  async getActiveConf(): Promise<ActiveConf> {
    if (cachedConfig && Date.now() - cacheTimestamp < CACHE_TTL) {
      return cachedConfig;
    }

    try {
      const res = await instance.get("/pawapay/active-conf");
      if (res.data?.success && res.data?.data) {
        cachedConfig = res.data.data;
        cacheTimestamp = Date.now();
        return cachedConfig;
      }
    } catch {
      // Backend proxy not available — use static fallback
    }

    return {
      companyName: "Midaas",
      signatureConfiguration: { signedRequestsOnly: false, signedCallbacks: false },
      countries: FALLBACK_COUNTRIES,
    };
  },

  /** Clear cache to force refresh on next call */
  clearCache() {
    cachedConfig = null;
    cacheTimestamp = 0;
  },
};
