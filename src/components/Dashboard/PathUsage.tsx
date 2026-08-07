import PathUsageChart from "./PathUsageChart";
import { useGetAllPathMetrics } from "@hooks/useMetrics";
import { useGetPaths } from "@hooks/usePaths";
import { useSelectionStore } from "@storage/store";
import {
  aggregateMetricsByDate,
  sortPathMetricsSummariesByFinishedCount,
  sortPathMetricsSummariesByUsageCount,
} from "@utils/sortMetrics";
import { getPast30DaysDateRange } from "@utils/dateRange";

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
  const savedPaths = useSelectionStore((state) => state.pathList);
  const { startDate, endDate } = getPast30DaysDateRange();
  const metrics = useGetAllPathMetrics(buildingId ?? null, startDate, endDate);
  const paths = useGetPaths(buildingId, { enabled: !!buildingId });
  const pathMetrics = metrics.data ?? [];
  const aggregatedMetrics = aggregateMetricsByDate(pathMetrics);
  const mostStartedPath = sortPathMetricsSummariesByUsageCount(pathMetrics)[0];
  const mostCompletedPath = sortPathMetricsSummariesByFinishedCount(pathMetrics)[0];
  const availablePaths = paths.data ?? savedPaths;
  const getPathName = (pathId: number) =>
    availablePaths.find((path) => path.id === pathId)?.name ?? `Path #${pathId}`;

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
      <div className="grid h-full min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border-grey bg-black/20 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Most started path
            </p>
            <p className="mt-1 text-sm font-semibold text-lab-turquoise">
              {getPathName(mostStartedPath.path_id)} · {mostStartedPath.usage_count}{" "}
              {mostStartedPath.usage_count === 1 ? "start" : "starts"}
            </p>
          </div>
          <div className="rounded-lg border border-border-grey bg-black/20 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Most completed path
            </p>
            <p className="mt-1 text-sm font-semibold text-lab-green-dark">
              {getPathName(mostCompletedPath.path_id)} · {mostCompletedPath.finished_count}{" "}
              {mostCompletedPath.finished_count === 1 ? "completion" : "completions"}
            </p>
          </div>
        </div>

        <div className="min-h-0 min-w-0">
          <PathUsageChart pathMetrics={aggregatedMetrics} />
        </div>
      </div>
    );
  }

  return (
    <section className="grid h-125 min-w-0 grid-rows-[auto_minmax(0,1fr)] rounded-xl border border-border-grey bg-sidebar-grey p-5">
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
