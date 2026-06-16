"use client";

import StatisticCard from "@/components/molecules/statistic-card";
import { ReactElement } from "react";

interface Stat {
  title: string;
  value: string | number;
  icon: ReactElement;
  trend?: string;
}

interface StatsOverviewProps {
  stats: Stat[];
  isLoading?: boolean;
  error?: string | null;
}

export default function StatsOverview({
  stats,
  isLoading = false,
  error = null,
}: StatsOverviewProps) {
  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-MontserratBold mb-4">
          Statistiques générale
        </h2>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-MontserratBold mb-4">
          Statistiques générale
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="h-32 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-MontserratBold mb-4">
        Statistiques générale
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <StatisticCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            variant="maroon"
            subtitle={stat.trend}
          />
        ))}
      </div>
    </div>
  );
}
