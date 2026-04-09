import { GridView } from "@components/Grid/GridView";
import { useSelectionStore } from "@storage/store";
import { useGetOrganisations } from "@hooks/useOrganisations";
import { useGetSites } from "@hooks/useSites";
import { useGetBuildings } from "@hooks/useBuildings";
import type { SearchParams } from "@apptypes/searchParams";
import { PathList } from "./PathList";

export const PathSelections = (props: { searchParams: SearchParams }) => {
  const { searchParams } = props;
    // fetch orgs, sites, buildings for dropdowns from localStorage
    // if searchParams has orgId, siteId, buildingId, use those as initial values for dropdowns
    const queryOrgId = searchParams?.orgId || null;
    const querySiteId = searchParams?.siteId || null;
    const queryBuildingId = searchParams?.buildingId || null;
    const orgs = useGetOrganisations();

    const sites = useGetSites(queryOrgId, { enabled: !!queryOrgId });
    const buildings = useGetBuildings(querySiteId, {
      enabled: !!querySiteId,
    });

      if (!queryOrgId) {
        return <div>Please select an organization to view paths.
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
              useSelectionStore.setState({ orgId: id, siteId: null, buildingId: null });
    
            }}
          />
        </div>;
      }
      if (!querySiteId) {
        return <div>Please select a site to view paths.
          <GridView
            type="site"
            searchParams={searchParams}
            items={sites.data?.map(site => ({
              id: Number(site.id),
              title: site.address,
              subTitle: "",
              imageUrl: site.image_url || "",
            })) || []}
            setSelectedItem={(id) => {
              useSelectionStore.setState({ siteId: id, buildingId: null });
            }}
          />
        </div>;
      }
      if (!queryBuildingId) {
        return <div>Please select a building to view paths.
          <GridView
            type="building"
            searchParams={searchParams}
            items={buildings.data?.map(building => ({
              id: Number(building.id),
              title: building.name,
              subTitle: "",
              imageUrl: building.image_url || "",
            })) || []}
            setSelectedItem={(id) => {
              useSelectionStore.setState({ buildingId: id });
            }}
          />
        </div>;
      }
        return <PathList buildingId={Number(queryBuildingId)} />;
}