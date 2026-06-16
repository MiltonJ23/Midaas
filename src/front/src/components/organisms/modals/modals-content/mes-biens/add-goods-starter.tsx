import ModalItem from "@/components/molecules/modal-item";
import { ModalNames, useModalStore } from "@/store/modal";
import Appartement from "@/components/atoms/icons/appartement";
import Locaux from "@/components/atoms/icons/locaux";
import VillaIcon from "@/components/atoms/icons/villa";
import Building from "@/components/atoms/icons/building";

export default function AddGoodsStarterModal() {
  const { openModal, toggle } = useModalStore();

  return (
    <section className="w-full bg-light-gray p-8">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-MontserratBold">AJouter</h2>

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
          title="Un immeuble"
          icon={<Building />}
          onClick={() =>
            openModal({
              name: ModalNames.ADD_GOODS_BUILDING,
              data: {
                type: "create",
              },
            })
          }
        />
        <ModalItem
          title="Un appartement"
          icon={<Appartement />}
          onClick={() =>
            openModal({
              name: ModalNames.ADD_GOODS_APPARTMENT,
              data: {
                type: "create",
              },
            })
          }
        />
        <ModalItem
          title="Une villa"
          icon={<VillaIcon />}
          onClick={() =>
            openModal({
              name: ModalNames.ADD_GOODS_VILLA,
              data: {
                type: "create",
              },
            })
          }
        />
        {/* <ModalItem title='Un terrain' icon={<Ground />} /> */}
        <ModalItem
          title="Un local"
          icon={<Locaux />}
          onClick={() =>
            openModal({
              name: ModalNames.ADD_GOODS_LOCAL,
              data: {
                type: "create",
              },
            })
          }
        />
      </div>
    </section>
  );
}
