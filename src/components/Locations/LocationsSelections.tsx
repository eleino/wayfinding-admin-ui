// LocationsSelections.tsx
// selection component for locations, with dropdowns for org, site, building
import { useGetOrganisationById, useGetOrganisations } from "@hooks/useOrganisations";
import { useGetBuildings } from "@hooks/useBuildings";
import { useGetSites } from "@hooks/useSites";
import { ListLocations } from "./ListLocations";
import { GridView } from "@components/Grid/GridView";
import type { SearchParams } from "@schemas/router.schema";
import { useSelectionStore } from "storage/store";
import { Link } from "@tanstack/react-router";



export const LocationsSelections = (props: {searchParams : SearchParams, page: string}) => {
  const { searchParams, page } = props;
  // if searchParams has orgId, siteId, buildingId, use those as initial values for selections
  const queryOrgId = searchParams?.orgId || null;
  const querySiteId = searchParams?.siteId || null;
  const queryBuildingId = searchParams?.buildingId || null;

  const orgs = useGetOrganisations();

  const sites = useGetSites(queryOrgId, { enabled: !!queryOrgId });
  const orgSites = useGetOrganisationById(queryOrgId, { enabled: !!queryOrgId });
  const buildings = useGetBuildings(querySiteId, {
    enabled: !!querySiteId,
  });
  if (!queryOrgId) {
    return <div>Please select an organization to view locations.
      <GridView
      searchParams={searchParams}
      type="org"
        items={orgs.data?.map(org => ({
          id: Number(org.id),
          title: org.name,
          subTitle: "",
          imageUrl: org.logoUrl || "",
        })) || []}
        setSelectedItem={(id) => {
          useSelectionStore.setState({ orgId: id, siteId: undefined, buildingId: undefined });

        }}
      />
    </div>;
  }
  if (!querySiteId) {
    return <div>Please select a site to view locations.
      {orgSites.data?.sites.length === 0 && <p>No sites found for this organization.</p>}
      <GridView
        type="site"
        searchParams={searchParams}
        items={orgSites.data?.sites.map(site => ({
          id: Number(site.id),
          title: site.name,
          subTitle: `${sites.data?.find((s) => s.id === site.id)?.address || ""}`,
          imageUrl: sites.data?.find((s) => s.id === site.id)?.image_url || "",
        })) || []}
        setSelectedItem={(id) => {
          useSelectionStore.setState({ siteId: id, buildingId: undefined });
        }}
      />
    </div>;
  }
  if (!queryBuildingId) {
    return <div>Please select a building to view locations.
      {buildings.data?.length === 0 && <p>No buildings found for this site.</p>}
      <GridView
        type="building"
        searchParams={searchParams}
        items={buildings.data?.map(building => ({
          id: Number(building.id),
          title: building.name,
          subTitle: "",
        })) || []}
        setSelectedItem={(id) => {
          useSelectionStore.setState({ buildingId: id });
        }}
      />
    </div>;
  }
  return (
    <div>
      {page !== "qrcodes" && (
        <Link to={`/locations/new`} search={{ orgId: queryOrgId, siteId: querySiteId, buildingId: queryBuildingId }} className="text-white hover:underline bg-lab-blue p-2 rounded ml-2">
          Add a new location
        </Link>
      )}
      <ListLocations buildingId={queryBuildingId} page={page} />
    </div>
  );
};
