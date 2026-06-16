export const Storage = {
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },

  getItem: (key: string) => {
    return localStorage.getItem(key);
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

export const StorageKeys = {
  access: "midaas-access",
  refresh: "midaas-refresh",
  userId: "midaas-user-id",
} as const;

export type StorageKeys = (typeof StorageKeys)[keyof typeof StorageKeys];
