import ModalItem from "@/components/molecules/modal-item";
import { useModalStore } from "@/store/modal";
import Rental from "@/entities/rentals/rental";
import { displayDate, displayNumberWithMoneyFormat } from "@/lib/format";
import Status from "@/components/atoms/status";

export default function LocationDetailsModal() {
  const { toggle, data } = useModalStore();

  const location = (data as { location: Rental }).location;

  console.log("Here in edit mode", data);

  return (
    <section className="w-full bg-light-gray p-8">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-MontserratBold">Detail de la Location</h2>

        <span
          onClick={() => toggle()}
          className="w-8 h-8 flex items-center justify-center border border-primary/30 rounded-full cursor-pointer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-primary"
          >
            <path
              d="M6 18L18 6M6 6L18 18"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <ModalItem
          title="Nom du Locataire"
          value={
            <div className="flex items-center gap-2">
              <span>{location.tenantName}</span>
            </div>
          }
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-primary"
            >
              <path
                d="M8 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7H16M15 11L12 14M12 14L9 11M12 14L12 4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <ModalItem
          title="Adresse"
          value={location.propertyAddress}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <ModalItem
          title="Date de debut de location"
          value={displayDate(location.startDate)}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <ModalItem
          title="Date de fin de location"
          value={displayDate(location.endDate)}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <ModalItem
          title="Loyer"
          value={`${displayNumberWithMoneyFormat(location.monthlyAmount)} XOF`}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-primary"
            >
              <path
                d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <ModalItem
          title="Status de la location"
          after={
            <Status
              text={location.rentalsStatus === "active" ? "Actif" : "Terminé"}
              variant={`${location.rentalsStatus === "active" ? "success" : "error"}`}
            />
          }
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-primary"
            >
              <circle
                cx="12"
                cy="12"
                r="9.25"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </svg>
          }
        />

        {/* <div className='w-full'>
					<Button
						onClick={() =>
							openModal({
								name: ModalNames.MAKE_PAYMENT,
								data: { location },
							})
						}
						className='h-12 w-full text-lg font-MontserratBold border-0 outline-none'
					>
						Signaler un paiement
					</Button>
				</div> */}
      </div>
    </section>
  );
}
