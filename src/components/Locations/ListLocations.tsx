import { useFetchLocations } from "@hooks/useLocations";
export const ListLocations = (props: { buildingId: number | null }) => {
    const { buildingId } = props;
      const locations = useFetchLocations(buildingId, {
    enabled: !!buildingId,
  });
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
                    <li key={location.id}>{location.name}</li>
                ))}
            </ul>
        </div>
    );
}