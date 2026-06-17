"use client";

interface MaintenanceRequest {
  id: number;
  clientName: string;
  clientAvatar?: string;
  service: string;
  duration: string;
  price: string;
}

interface MaintenanceRequestsTableProps {
  requests: MaintenanceRequest[];
  isLoading?: boolean;
  error?: string | null;
  onDeleteRequest?: (request: MaintenanceRequest) => void;
  onEditRequest?: (request: MaintenanceRequest) => void;
}

export default function MaintenanceRequestsTable({
  requests,
  isLoading = false,
  error = null,
  onDeleteRequest,
  onEditRequest,
}: MaintenanceRequestsTableProps) {
  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm text-center">
        <p className="text-gray-500">Aucune demande d'entretien</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">
                Client
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">
                Service
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">
                Durée
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">
                Prix
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {request.clientAvatar ? (
                        <img
                          src={request.clientAvatar}
                          alt={request.clientName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-gray-400"
                        >
                          <path
                            d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                            fill="currentColor"
                          />
                          <path
                            d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-900">
                      {request.clientName}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-900">
                    {request.service}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600">
                    {request.duration}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-gray-900">
                    {request.price} /mois
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {onDeleteRequest && (
                      <button
                        onClick={() => onDeleteRequest(request)}
                        className="w-8 h-8 rounded-full   flex items-center justify-center "
                        title="Voir les détails"
                      >
                       <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 25.9531C20.5275 25.9531 25.953 20.5276 25.953 14.0001C25.953 7.46112 20.5155 2.04712 13.988 2.04712C7.44949 2.04712 2.04749 7.46112 2.04749 14.0001C2.04749 20.5276 7.46099 25.9531 14 25.9531ZM11.1055 20.9611C10.274 20.9611 9.79349 20.5041 9.75799 19.6721L9.32449 10.1096H8.62149C8.46679 10.1073 8.31909 10.0448 8.20969 9.93542C8.10029 9.82602 8.03781 9.67831 8.03549 9.52362C8.03549 9.19562 8.30549 8.93762 8.62149 8.93762H11.2815V7.98862C11.2815 7.07412 11.8795 6.50012 12.7465 6.50012H15.1955C16.063 6.50012 16.6605 7.07412 16.6605 7.98862V8.93762H19.3205C19.637 8.93762 19.895 9.19562 19.895 9.52362C19.895 9.84012 19.637 10.1096 19.321 10.1096H18.641L18.2075 19.6721C18.1605 20.5041 17.68 20.9611 16.848 20.9611H11.1055ZM12.4655 8.93762H15.477V8.21112C15.477 7.89462 15.2545 7.68362 14.926 7.68362H13.0045C12.688 7.68362 12.4655 7.89462 12.4655 8.21112V8.93762ZM11.8205 19.6721C12.114 19.6721 12.2895 19.4726 12.278 19.1916L11.9965 11.3401C11.973 11.0586 11.7975 10.8711 11.528 10.8711C11.235 10.8711 11.0475 11.0706 11.059 11.3401L11.3755 19.2031C11.387 19.4846 11.563 19.6721 11.8205 19.6721ZM13.977 19.6601C14.27 19.6601 14.4575 19.4726 14.4575 19.1916V11.3401C14.4575 11.0701 14.27 10.8711 13.977 10.8711C13.684 10.8711 13.497 11.0706 13.497 11.3401V19.1916C13.497 19.4726 13.696 19.6601 13.977 19.6601ZM16.145 19.6721C16.403 19.6721 16.5785 19.4846 16.59 19.2031L16.9065 11.3401C16.9185 11.0701 16.719 10.8711 16.4265 10.8711C16.1685 10.8711 15.981 11.0586 15.969 11.3401L15.688 19.1916C15.676 19.4726 15.852 19.6721 16.145 19.6721Z" fill="black"/>
</svg>

                      </button>
                    )}
                    {onEditRequest && (
                      <button
                        onClick={() => onEditRequest(request)}
                        className="w-8 h-8 rounded-full   flex items-center justify-center "
                        title="Modifier"
                      >
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.6667 2.3335C12.1346 2.3335 10.6175 2.63526 9.20203 3.22157C7.78656 3.80787 6.50044 4.66723 5.41709 5.75058C3.22916 7.93851 2 10.906 2 14.0002C2 17.0944 3.22916 20.0618 5.41709 22.2497C6.50044 23.3331 7.78656 24.1925 9.20203 24.7788C10.6175 25.3651 12.1346 25.6668 13.6667 25.6668C16.7609 25.6668 19.7283 24.4377 21.9162 22.2497C24.1042 20.0618 25.3333 17.0944 25.3333 14.0002H23C23 16.4755 22.0167 18.8495 20.2663 20.5998C18.516 22.3502 16.142 23.3335 13.6667 23.3335C11.1913 23.3335 8.81734 22.3502 7.067 20.5998C5.31666 18.8495 4.33333 16.4755 4.33333 14.0002C4.33333 11.5248 5.31666 9.15084 7.067 7.4005C8.81734 5.65016 11.1913 4.66683 13.6667 4.66683V2.3335ZM21.5767 3.50016C21.367 3.50315 21.1664 3.5867 21.0167 3.7335L19.5933 5.14516L22.51 8.06183L23.9333 6.65016C24.2367 6.34683 24.2367 5.8335 23.9333 5.54183L22.125 3.7335C21.9733 3.58183 21.775 3.50016 21.5767 3.50016ZM18.765 5.9735L10.1667 14.5835V17.5002H13.0833L21.6817 8.89016L18.765 5.9735Z" fill="black"/>
</svg>

                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
