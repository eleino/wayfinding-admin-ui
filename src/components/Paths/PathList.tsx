// PathList.tsx
import { DataList } from "@components/List/DataList";
import { useGetAllPathMetrics } from "@hooks/useMetrics";
import { useGetPaths } from "@hooks/usePaths";
import type { SearchParams } from "@schemas/router.schema";
import { useSelectionStore } from "@storage/store";
import { useSearch } from "@tanstack/react-router";
import { getPast30DaysDateRange } from "@utils/dateRange";

export const PathList = (props: { buildingId: number | undefined }) => {
  const { buildingId } = props;
  
  const paths = useGetPaths(buildingId, {
    enabled: !!buildingId,
  });
  const { startDate, endDate } = getPast30DaysDateRange();
  const metrics = useGetAllPathMetrics(buildingId ?? null, startDate, endDate);
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const search = useSearch({ from: '__root__'}) as SearchParams;
  const {orgId, siteId} = search;
  if (!buildingId) {
    return <p>Please select a building to view paths.</p>;
  }

  const usageByPathId = new Map(
    (metrics.data ?? []).map((pathMetrics) => [
      pathMetrics.path_id,
      pathMetrics.usage_count,
    ]),
  );
  const pathsWithUsage = (paths.data ?? []).map((path) => ({
    ...path,
    usage_count: metrics.isLoading
      ? "Loading..."
      : metrics.isError
        ? "Unavailable"
        : (usageByPathId.get(path.id) ?? 0),
  }));

  return (
    <div className="p-2">
      {paths.isLoading && <p>Loading paths...</p>}
      {paths.isError && <p>Error loading paths: {paths.error.message}</p>}
      {metrics.isError && (
        <p role="alert">Path usage could not be loaded.</p>
      )}
      <DataList
        data={pathsWithUsage}
        columns={[
          {
            key: "id",
            label: "Path ID",
            width: "0.5fr",
          },
          {
            key: "name",
            label: "Path Name",
            page: "paths",
            idName: "pathId",
            search: { orgId: orgId || savedOrgId, siteId: siteId || savedSiteId, buildingId: buildingId },
            width: "3fr",
          },
          {
            key: "usage_count",
            label: "Usage",
            width: "0.5fr",
          },
        ]}
      />
    </div>
  );
}
