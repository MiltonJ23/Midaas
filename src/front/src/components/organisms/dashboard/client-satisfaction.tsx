"use client";

interface SatisfactionDataPoint {
  month: string;
  value: number;
}

interface ClientSatisfactionProps {
  data: SatisfactionDataPoint[];
  currentYear?: number;
  previousYear?: number;
  isLoading?: boolean;
  error?: string | null;
}

export default function ClientSatisfaction({
  data,
  currentYear = 1987,
  previousYear = 2000,
  isLoading = false,
  error = null,
}: ClientSatisfactionProps) {
  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-MontserratBold mb-4">
          Satisfaction des clients
        </h2>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-MontserratBold mb-4">
          Satisfaction des clients
        </h2>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-MontserratBold mb-4">
        Satisfaction des clients
      </h2>

      {/* Chart Area - Placeholder for actual chart implementation */}
      <div className="relative h-64 bg-gradient-to-b from-[#e3f2fd] via-[#fdecea] to-white rounded-lg overflow-hidden">
        {/* Simplified area chart visualization */}
        <div className="absolute inset-0 flex items-end justify-around px-2">
          {data.map((point, idx) => {
            const heightPercent = (point.value / 500) * 100;
            return (
              <div
                key={idx}
                className="flex-1 relative"
                style={{ height: "100%" }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#8b3a3a] to-transparent opacity-60"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* SVG for smooth curves - simplified */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8b3a3a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b3a3a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#8b3a3a]" />
          <span className="text-xs text-gray-600">Ce moi</span>
          <span className="text-xs font-medium">{previousYear}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <span className="text-xs text-gray-600">Le mois dernier</span>
          <span className="text-xs font-medium">{currentYear}</span>
        </div>
      </div>
    </div>
  );
}
