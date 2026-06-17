import axios from "axios";
import { Storage, StorageKeys } from "./auth/storage";

/**
 * Toggle to allow access to all pages while testing the UI (when backend auth isn't enforced).
 * Set to `true` to prevent automatic redirects on 401/402 responses and to allow browsing while logged out.
 * Usage: import { setAllowAccessWhenLoggedOut } from "src/api/v1"; setAllowAccessWhenLoggedOut(true)
 */
export let allowAccessWhenLoggedOut = false;

export const setAllowAccessWhenLoggedOut = (value: boolean) => {
  allowAccessWhenLoggedOut = value;
};

/**
 * UI-ONLY TESTING MODE: When enabled, all API requests are blocked and return mock responses.
 * Set to `true` to test the UI without any backend connection.
 * Set to `false` to resume actual API calls.
 * Usage: import { setUIOnlyMode } from "src/api/v1"; setUIOnlyMode(true)
 */
export let uiOnlyMode = false;

export const setUIOnlyMode = (value: boolean) => {
  uiOnlyMode = value;
  console.log(`🎨 UI-Only Mode: ${value ? "ENABLED" : "DISABLED"}`);
};

// export const baseURL = "http://180.149.197.182:8000";
// export const wsURL = "wss://180.149.197.182:8000/ws/conversation/";

export const baseURL = "https://midaas-production.up.railway.app";
export const wsURL = "wss://https://midaas.onrender.com/ws/conversation/";

const instance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  timeout: 100000,
  // Allow all status codes to be handled by withErrorHandling
  validateStatus: () => true,
});

const publicAuthRoutes = [
  "/auth/login",
  "/auth/register",
  "/login_check",
  "/user",
  "/real-estate-entities/auth/login/",
  "/real-estate-entities/auth/forgot-password/",
  "/real-estate-entities/auth/register/owner",
  "/real-estate-entities/auth/register/agencies",
];

const isPublicAuthRoute = (url?: string) => {
  if (!url) {
    return false;
  }

  return publicAuthRoutes.some((route) => url.startsWith(route));
};

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // BLOCK ALL REQUESTS IN UI-ONLY MODE
    if (uiOnlyMode) {
      console.log(`🚫 [UI-ONLY MODE] Blocked request to: ${config.url}`);
      // Return a mock response that will be handled by the response interceptor
      return Promise.reject(new Error("UI_ONLY_MODE_ENABLED"));
    }

    // Do something before request is sent
    const token = Storage.getItem(StorageKeys.access);

    if (!isPublicAuthRoute(config.url)) {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (response) {
    // Handle authentication-related redirects but still return response.
    // When `allowAccessWhenLoggedOut` is true (UI testing), skip automatic redirects so you can browse while logged out.
    if (!allowAccessWhenLoggedOut && typeof window !== "undefined") {
      if (
        window.location.pathname !== "/subscriptions" &&
        window.location.pathname !== "/auth/signin"
      ) {
        if (response.status === 402) {
          // Commented out automatic redirect - let withErrorHandling decide
          // window.location.href = "/subscriptions";
        } else if (response.status === 401) {
          window.location.href = "/auth/signin";
        }
      }
    }

    return response;
  },
  function (error) {
    // Handle UI-ONLY MODE: Return mock empty response instead of failing
    if (error.message === "UI_ONLY_MODE_ENABLED") {
      return {
        status: 200,
        data: {
          message: "Mock response in UI-only mode",
          Data: {},
        },
        config: {},
        headers: {},
        statusText: "OK",
      };
    }

    // Handle network errors or other non-HTTP errors
    console.error("Network or request error:", error);

    const custumError =
      "Erreur de réseaux!, Veillez vérifier votre connexion internet.";
    return Promise.reject(custumError);
  },
);

export default instance;
// f30a19a0-1406-4c4f-a9a4-e2279f6f0064
