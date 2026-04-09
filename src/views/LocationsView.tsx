import { LocationsSelections } from "@components/Locations/LocationsSelections";
import { ShowLocation } from "@components/Locations/ShowLocation";
import { getRouteApi, Link } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";
import { useSelectionStore } from "storage/store";

const currRoute = getRouteApi("/locations");
const LocationsView = () => {
  const search = currRoute.useSearch();
  const locationId = search.locationId as number | undefined;
  const searchParams = { ...search };
  console.log("LocationId:", locationId);
  console.log("SearchParams:", searchParams);
  // show breadcrumbs path at the top of the page based on search params, e.g. "Organization > Site > Building"
  const breadcrumbs = [];
  if (searchParams.orgId) {
    breadcrumbs.push({
      label: `Organization ${searchParams.orgId}`,
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
  if (searchParams.siteId) {
    breadcrumbs.push({
      label: `Site ${searchParams.siteId}`,
      link: createPath("/locations", searchParams.orgId),
      onClick: () => {
        useSelectionStore.setState({ siteId: null, buildingId: null });
      },
    });
  }
  if (searchParams.buildingId) {
    breadcrumbs.push({
      label: `Building ${searchParams.buildingId}`,
      link: createPath("/locations", searchParams.orgId, searchParams.siteId),
      onClick: () => {
        useSelectionStore.setState({ buildingId: null });
      },
    });
  }
  return (
    <div className="p-5">
      {breadcrumbs.length > 0 && (
        <div className="mb-4 text-sm text-lab-green">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              <Link
                to={crumb.link}
                onClick={crumb.onClick}
                className="text-lab-green-dark"
              >
                {crumb.label}
              </Link>
              {index < breadcrumbs.length - 1 && " > "}
            </span>
          ))}
        </div>
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
