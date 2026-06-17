import { useEffect } from "react";
import { useBonusStore } from "@/store/bonus";

export const useBonus = () => {
  const store = useBonusStore();

  useEffect(() => {
    if (!store.loaded) {
      store.loadData();
    }
  }, [store.loaded, store.loadData]);

  return {
    bonuses: store.bonuses,
    count: store.count,
    loading: store.loading,
    loaded: store.loaded,
    loadData: store.loadData,
    addBonus: store.addBonus,
    updateBonus: store.updateBonus,
    removeBonus: store.removeBonus,
  };
};
