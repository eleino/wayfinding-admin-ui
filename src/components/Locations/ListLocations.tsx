import { useFetchLocations } from "@hooks/useLocations";
import { useSelectionStore } from "@storage/store";
import { Link } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";

export const ListLocations = (props: { buildingId: number | null }) => {
    const { buildingId } = props;
      const locations = useFetchLocations(buildingId, {
    enabled: !!buildingId,
  });
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const savedSiteId = useSelectionStore((state) => state.siteId);
  if (!buildingId) {
    return <p>Please select a building to view locations.</p>;
  }
    return (
        <div>
            <h2>List of locations:</h2>
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