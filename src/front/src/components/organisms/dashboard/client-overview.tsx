"use client";

interface ClientOverviewDataPoint {
  month: string;
  value: number;
}

interface ClientOverviewProps {
  data: ClientOverviewDataPoint[];
  isLoading?: boolean;
  error?: string | null;
}

export default function ClientOverview({
  data,
  isLoading = false,
  error = null,
}: ClientOverviewProps) {
  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-MontserratBold mb-4">
          Aperçu de la clientèle
        </h2>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-MontserratBold mb-4">
          Aperçu de la clientèle
        </h2>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-MontserratBold mb-4">
        Aperçu de la clientèle
      </h2>

      {/* Chart Container */}
      <div className="relative h-64 bg-white rounded-lg">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round((maxValue + minValue) / 2)}</span>
          <span>{minValue}</span>
        </div>

        {/* Chart area */}
        <div className="absolute left-12 right-0 top-0 bottom-8 overflow-hidden rounded-lg">
          <div className="relative h-full w-full bg-gradient-to-b from-gray-50 to-white">
            {/* Line chart visualization */}
            <div className="absolute inset-0 flex items-end justify-around">
              {data.map((point, idx) => {
                const heightPercent =
                  ((point.value - minValue) / (maxValue - minValue)) * 100;
                return (
                  <div key={idx} className="flex-1 relative h-full">
                    {/* Area fill */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#8b3a3a]/40 to-[#8b3a3a]/10"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Line path - simplified */}
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <polyline
                points={data
                  .map((point, idx) => {
                    const x = (idx / (data.length - 1)) * 100;
                    const y =
                      100 -
                      ((point.value - minValue) / (maxValue - minValue)) * 100;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#8b3a3a"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="absolute left-12 right-0 bottom-0 h-8 flex justify-between items-center text-xs text-gray-500">
          {data.map((point, idx) => (
            <span key={idx} className="flex-1 text-center">
              {point.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
