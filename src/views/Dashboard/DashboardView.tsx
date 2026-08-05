import { ListOrganisations } from "@components/Dashboard/ListOrganisations";
import { PathUsage } from "@components/Dashboard/PathUsage";
import { RecentFeedback } from "@components/Dashboard/RecentFeedback";

export const DashboardView = () => {
  return (
    <div className="w-[calc(100vw-20rem)] max-w-350 min-w-0 pb-12">
      <div className="mb-6">
        <h1 className="mb-1">Dashboard</h1>
        <p className="text-gray-400">Monitor wayfinding activity and manage your locations.</p>
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(22rem,2fr)]">
        <PathUsage />

        <RecentFeedback />
      </div>

      <ListOrganisations />
    </div>
  );
};
