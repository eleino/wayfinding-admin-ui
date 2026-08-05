import PathUsageChart from "./PathUsageChart";
import { useGetAllPathMetrics } from "@hooks/useMetrics";
import { useSelectionStore } from "@storage/store";
import { aggregateMetricsByDate } from "@utils/sortMetrics";

// format date to the format backend expects: YYYY-MM-DD
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// get the date range for the last 30 days
const getDateRange = () => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 29);
  return { startDate: formatDate(start), endDate: formatDate(end) };
};

// component to display the state of the path usage section
const PathUsageState = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "alert";
}) => (
  <div
    className="flex h-full min-h-0 flex-col items-center justify-center text-gray-400"
    role={role}
  >
    {children}
  </div>
);

export const PathUsage = () => {
  const buildingId = useSelectionStore((state) => state.buildingId);
  const building = useSelectionStore((state) => state.buildingList.find((b) => b.id === buildingId));
  const { startDate, endDate } = getDateRange();
  const metrics = useGetAllPathMetrics(buildingId ?? null, startDate, endDate);
  const aggregatedMetrics = aggregateMetricsByDate(metrics.data ?? []);

  let content: React.ReactNode;

  if (!buildingId) {
    content = <PathUsageState>No building selected</PathUsageState>;
  } else if (metrics.isLoading) {
    content = <PathUsageState>Loading path usage…</PathUsageState>;
  } else if (metrics.isError) {
    content = (
      <PathUsageState role="alert">
        <p className="text-red-300">Path usage could not be loaded for the selected building.</p>
        <button
          type="button"
          onClick={() => metrics.refetch()}
          className="mt-2 cursor-pointer text-sm text-lab-turquoise hover:underline"
        >
          Try again
        </button>
      </PathUsageState>
    );
  } else if (aggregatedMetrics.length === 0) {
    content = <PathUsageState>No path activity in the last 30 days for the selected building.</PathUsageState>;
  } else {
    content = (
      <div className="h-full min-h-0 min-w-0">
        <PathUsageChart pathMetrics={aggregatedMetrics} />
      </div>
    );
  }

  return (
    <section className="grid h-105 min-w-0 grid-rows-[auto_minmax(0,1fr)] rounded-xl border border-border-grey bg-sidebar-grey p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Path usage</h2>
          <p className="mt-1 text-sm text-gray-400">
            {buildingId
              ? `Selected building · ${startDate} – ${endDate}`
              : "Select a building below to see path activity."}
          </p>
        </div>
        {buildingId && (
          <span className="rounded-full bg-black px-3 py-1 text-xs text-gray-300">
            {building?.name ?? `Building ${buildingId}`}
          </span>
        )}
      </div>

      <div className="mt-4 min-h-0">{content}</div>
    </section>
  );
};
