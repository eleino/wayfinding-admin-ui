import { LocationsSelections } from "@components/Locations/LocationsSelections";
import { ShowLocation } from "@components/Locations/ShowLocation";
import { getRouteApi } from "@tanstack/react-router";

const currRoute = getRouteApi("/locations")
const LocationsView = () => {
  const search = currRoute.useSearch();
  const locationId = search.locationId as number | undefined;
  console.log("LocationId:", locationId);

  return (
    <div className="p-5">
      <h1>Locations</h1>
      <LocationsSelections />
      { locationId && <ShowLocation locationId={locationId} /> }
    </div>
  );
};

export default LocationsView;