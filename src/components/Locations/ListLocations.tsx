import { DataList } from "@components/List/DataList";
import { useGetLocations } from "@hooks/useLocations";
import type { SearchParams } from "@schemas/router.schema";
import { useSearch } from "@tanstack/react-router";
import { useSelectionStore } from "@storage/store";

export const ListLocations = (props: { buildingId: number | undefined, page: string }) => {
    const { buildingId, page } = props;
      const locations = useGetLocations(buildingId, {
    enabled: !!buildingId,
  });
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const search = useSearch({ from: '__root__'}) as SearchParams;
  const {orgId, siteId, buildingId: searchBuildingId} = search;
  if (!buildingId) {
    return <p>Please select a building to view locations.</p>;
  }
    return (
        <div className="p-2">
            {locations.isLoading && <p>Loading locations...</p>}
            {locations.isError && <p>Error loading locations: {String(locations.error)}</p>}
            {page==="qrcodes" && <p>Select a location to view its QR codes.</p>}
            <DataList data={locations.data || []} columns={[
                {
                    key: "id",
                    label: "Location ID",
                    width: "1fr",
                },
                {
                    key: "name",
                    label: "Location Name",
                    page: page,
                    idName: "locationId",
                    search: { orgId: orgId || savedOrgId, siteId: siteId || savedSiteId, buildingId: searchBuildingId || buildingId },
                    width: "3fr",
                },
            ]} />
        </div>
    );
}