import { ListOrganisations } from "@components/Dashboard/ListOrganisations";
import { PathUsage } from "@components/Dashboard/PathUsage";
import { RecentFeedback } from "@components/Dashboard/RecentFeedback";
import { DraftBanner } from "@components/Forms/DraftBanner";

export const DashboardView = () => {
  return (
    <div className="w-[calc(100vw-20rem)] max-w-350 min-w-0 pb-12 p-4">
      <div className="mb-6">
        <h1 className="mb-1">Dashboard</h1>
      </div>
      <DraftBanner />

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(10rem,2fr)]">
        <PathUsage />

        <RecentFeedback />
      </div>

      <ListOrganisations />
    </div>
  );
};
