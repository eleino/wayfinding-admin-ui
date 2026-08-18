import { LocationsSelections } from "@components/Locations/LocationsSelections";
import { ShowLocation } from "@components/Locations/ShowLocation";
import type { SearchParams } from "@schemas/router.schema";
import { useSearch } from "@tanstack/react-router";
import { DraftBanner } from "@components/Forms/DraftBanner";

const LocationsView = () => {
  const search = useSearch({ from: '__root__'}) as SearchParams;
  const {locationId} = search;
  const searchParams = { ...search };

  return (
    <div className="p-4">
      <h1>Locations</h1>
      <DraftBanner kinds={["location"]} />

      {locationId ? (
        <ShowLocation locationId={locationId} searchParams={searchParams} />
      ) : (
        <LocationsSelections searchParams={searchParams} page="locations" />
      )}
    </div>
  );
};

export default LocationsView;
