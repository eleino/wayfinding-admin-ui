// PathList.tsx
import { useGetPaths } from "@hooks/usePaths";
import { useSelectionStore } from "@storage/store";
import { Link } from "@tanstack/react-router";
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
    <div className="bg-sidebar-grey p-2">
      <h2 className="text-lg font-semibold pe-2">List of paths:</h2>
      {paths.isLoading && <p>Loading paths...</p>}
      {paths.isError && <p>Error loading paths: {String(paths.error)}</p>}
      <ul>
        {paths.data?.map((path) => (
          <li key={path.id}>
            <Link to={createPath(`/paths`, savedOrgId || undefined, savedSiteId || undefined, buildingId || undefined, undefined, path.id)}>
              {path.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}