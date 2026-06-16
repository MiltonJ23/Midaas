"use client";

interface Service {
  rank: string;
  name: string;
  demand: number; // Percentage 0-100
  percentage: string;
}

interface BestServicesProps {
  services: Service[];
  isLoading?: boolean;
  error?: string | null;
}

const barColors = ["bg-orange-400", "bg-red-400", "bg-blue-400", "bg-pink-300"];

export default function BestServices({
  services,
  isLoading = false,
  error = null,
}: BestServicesProps) {
  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-MontserratBold mb-4">Meilleurs services</h2>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-MontserratBold mb-4">Meilleurs services</h2>
        <div className="space-y-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-MontserratBold mb-4">Meilleurs services</h2>

      {/* Table Headers */}
      <div className="grid grid-cols-12 gap-4 mb-3 text-xs text-gray-500 font-medium">
        <div className="col-span-1">Rang</div>
        <div className="col-span-3">Service</div>
        <div className="col-span-6">Demande</div>
        <div className="col-span-2 text-right">%</div>
      </div>

      {/* Service Rows */}
      <div className="space-y-3">
        {services.map((service, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-4 items-center">
            {/* Rank */}
            <div className="col-span-1">
              <span className="text-sm font-medium text-gray-700">
                {service.rank}
              </span>
            </div>

            {/* Service Name */}
            <div className="col-span-3">
              <span className="text-sm text-gray-700">{service.name}</span>
            </div>

            {/* Demand Bar */}
            <div className="col-span-6">
              <div className="w-full h-3 bg-gray-100 rounded-full relative overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-3 rounded-full transition-all duration-500 ${barColors[idx % barColors.length]}`}
                  style={{ width: `${service.demand}%` }}
                />
                <div
                  className="absolute right-0 top-0 h-3 bg-gray-800 rounded-r-full"
                  style={{ width: `${100 - service.demand}%` }}
                />
              </div>
            </div>

            {/* Percentage Badge */}
            <div className="col-span-2 flex justify-end">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">
                {service.percentage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
