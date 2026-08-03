// PathList.tsx
import { DataList } from "@components/List/DataList";
import { useGetPaths } from "@hooks/usePaths";
import type { SearchParams } from "@schemas/router.schema";
import { useSelectionStore } from "@storage/store";
import { useSearch } from "@tanstack/react-router";

export const PathList = (props: { buildingId: number | undefined }) => {
  const { buildingId } = props;
  
  const paths = useGetPaths(buildingId, {
    enabled: !!buildingId,
  });
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const search = useSearch({ from: '__root__'}) as SearchParams;
  const {orgId, siteId} = search;
  if (!buildingId) {
    return <p>Please select a building to view paths.</p>;
  }
  return (
    <div className="p-2">
      {paths.isLoading && <p>Loading paths...</p>}
      {paths.isError && <p>Error loading paths: {paths.error.message}</p>}
      <DataList
        data={paths.data || []}
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

        ]}
      />
    </div>
  );
}