import { useGetLocations } from "@hooks/useLocations";
import { useSelectionStore } from "@storage/store";
import { Link } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";

export const ListLocations = (props: { buildingId: number | null }) => {
    const { buildingId } = props;
      const locations = useGetLocations(buildingId, {
    enabled: !!buildingId,
  });
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const savedSiteId = useSelectionStore((state) => state.siteId);
  if (!buildingId) {
    return <p>Please select a building to view locations.</p>;
  }
    return (
        <div className="bg-sidebar-grey p-2">
            <h2 className="text-lg font-semibold pe-2">List of locations:</h2>
            {locations.isLoading && <p>Loading locations...</p>}
            {locations.isError && <p>Error loading locations: {String(locations.error)}</p>}
            <ul>
                {locations.data?.map((location) => (
                    <li key={location.id}>
                        <Link to={createPath(`/locations`, savedOrgId || undefined, savedSiteId || undefined, buildingId || undefined, location.id)}>{location.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}