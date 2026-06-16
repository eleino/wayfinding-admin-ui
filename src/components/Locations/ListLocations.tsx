import { DataList } from "@components/List/DataList";
import { useGetLocations } from "@hooks/useLocations";
import { useSelectionStore } from "@storage/store";
//import { Link } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";

export const ListLocations = (props: { buildingId: number | null, page: string }) => {
    const { buildingId, page } = props;
      const locations = useGetLocations(buildingId, {
    enabled: !!buildingId,
  });
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const savedSiteId = useSelectionStore((state) => state.siteId);
  if (!buildingId) {
    return <p>Please select a building to view locations.</p>;
  }
    return (
        <div className="p-2 mt-4">
            {locations.isLoading && <p>Loading locations...</p>}
            {locations.isError && <p>Error loading locations: {String(locations.error)}</p>}
            <DataList data={locations.data || []} columns={[
                {
                    key: "id",
                    label: "Location ID",
                    width: "1fr",
                },
                {
                    key: "name",
                    label: "Location Name",
                    getLink: (item) => createPath(`${page ? `/${page}` : "/locations"}`, savedOrgId || undefined, savedSiteId || undefined, buildingId || undefined, Number(item.id)),
                    width: "3fr",
                },
            ]} />
        </div>
    );
}