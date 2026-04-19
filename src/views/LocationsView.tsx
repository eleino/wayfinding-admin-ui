import { BreadCrumbs } from "@components/List/BreadCrumbs";
import { LocationsSelections } from "@components/Locations/LocationsSelections";
import { ShowLocation } from "@components/Locations/ShowLocation";
import { getRouteApi } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";
import { useSelectionStore } from "storage/store";

const currRoute = getRouteApi("/locations");
const LocationsView = () => {
  const search = currRoute.useSearch();
  const locationId = search.locationId as number | undefined;
  const searchParams = { ...search };
  // show breadcrumbs path at the top of the page based on search params, e.g. "Organization > Site > Building"
  const breadcrumbs = [];
  const org = useSelectionStore((state) => state.orgList.find((org) => org.id === Number(searchParams.orgId)));
  if (searchParams.orgId) {
    breadcrumbs.push({
      label: `${org?.name ? org.name : `Organization ${searchParams.orgId}`}`,
      link: "/locations",
      onClick: () => {
        useSelectionStore.setState({
          orgId: null,
          siteId: null,
          buildingId: null,
        });
      },
    });
  }
  const site = useSelectionStore((state) => state.siteList.find((site) => site.id === Number(searchParams.siteId)));
  if (searchParams.siteId) {
    breadcrumbs.push({
      label: `${site?.name ? site.name : `Site ${searchParams.siteId}`}`,
      link: createPath("/locations", searchParams.orgId),
      onClick: () => {
        useSelectionStore.setState({ siteId: null, buildingId: null });
      },
    });
  }
  const building = useSelectionStore((state) => state.buildingList.find((building) => building.id === Number(searchParams.buildingId)));
  if (searchParams.buildingId) {
    breadcrumbs.push({
      label: `${building?.name ? building.name : `Building ${searchParams.buildingId}`}`,
      link: createPath("/locations", searchParams.orgId, searchParams.siteId),
      onClick: () => {
        useSelectionStore.setState({ buildingId: null });
      },
    });
  }
  return (
    <div className="p-5">
      {breadcrumbs.length > 0 && (
        <BreadCrumbs crumbs={breadcrumbs} />
      )}
      <h1>Locations</h1>

      {locationId ? (
        <ShowLocation locationId={locationId} searchParams={searchParams} />
      ) : (
        <LocationsSelections searchParams={searchParams} />
      )}
    </div>
  );
};

export default LocationsView;
