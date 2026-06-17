import { useModalStore } from "@/store/modal";
import { Button } from "@/components/atoms/button";
import { MUIInput } from "@/components/atoms/input";

export default function MakePaymentModal() {
  const { toggle } = useModalStore();

  // const location = (data as { location: Rental }).location;

  return (
    <section className="w-full bg-light-gray p-8">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-MontserratBold">Signaler un paiement</h2>

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
        <MUIInput label="Nombre de mois" type="number" min={1} />

        <div className="w-full">
          <Button className="h-12 w-full text-lg font-MontserratBold border-0 outline-none">
            Confirmer
          </Button>
        </div>
      </div>
    </section>
  );
}
