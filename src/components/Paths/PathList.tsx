// PathList.tsx
import { DataList } from "@components/List/DataList";
import { useGetPaths } from "@hooks/usePaths";
import { useSelectionStore } from "@storage/store";
import { createPath } from "@utils/createPath";

export const PathList = (props: { buildingId: number | null }) => {
  const { buildingId } = props;
  console.log("test", buildingId);
  const paths = useGetPaths(buildingId, {
    enabled: !!buildingId,
  });
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const savedSiteId = useSelectionStore((state) => state.siteId);
  if (!buildingId) {
    return <p>Please select a building to view paths.</p>;
  }
  return (
    <div className="p-2 mt-4">
      {paths.isLoading && <p>Loading paths...</p>}
      {paths.isError && <p>Error loading paths: {String(paths.error)}</p>}
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
            getLink: (item) => createPath(`/paths`, savedOrgId || undefined, savedSiteId || undefined, buildingId || undefined, undefined, Number(item.id)),
            width: "3fr",
          },

        ]}
      />
    </div>
  );
}