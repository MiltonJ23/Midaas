"use client";

import { ModalNames, useModalStore } from "@/store/modal";
import { Dialog, DialogContent } from "@/components/organisms/modals/modal";
import ProfileDetailModal from "./profile/profile-detail";
import AddCampaignModal from "./campaigns/add-campaign";
import CampaignDetailsModal from "./campaigns/campaign-details";
import AddMilestoneModal from "./campaigns/add-milestone";
import AddCompanyModal from "./dashboard/add-company";
import ConfirmActionModal from "./admin/confirm-action";

export default function ModalContainer() {
  const { open, toggle, name } = useModalStore();

  const displayContent = () => {
    switch (name) {
      case ModalNames.PROFILE_DETAIL:
        return <ProfileDetailModal />;

      case ModalNames.ADD_CAMPAIGN:
      case ModalNames.EDIT_CAMPAIGN:
        return <AddCampaignModal />;

      case ModalNames.CAMPAIGN_DETAILS:
        return <CampaignDetailsModal />;

      case ModalNames.ADD_MILESTONE:
        return <AddMilestoneModal />;

      case ModalNames.ADD_COMPANY:
        return <AddCompanyModal />;

      case ModalNames.CONFIRM_ACTION:
        return <ConfirmActionModal />;

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-h-[90%] overflow-auto p-0 scrollable sm:min-w-lg">
        {displayContent()}
      </DialogContent>
    </Dialog>
  );
}
