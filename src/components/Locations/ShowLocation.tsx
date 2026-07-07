import type { SearchParams } from "@schemas/router.schema";
import { useGetLocationById } from "@hooks/useLocations";
import { useGetTranslationsEnFi } from "@hooks/useTranslations";
import { Link } from "@tanstack/react-router";

export const ShowLocation = (props: {
  locationId: number | null;
  searchParams: SearchParams;
}) => {
  const { locationId, searchParams } = props;
  const locationData = useGetLocationById(Number(locationId), {
    enabled: !!locationId,
  });
  const { location, image } = locationData.data || {};

  // fetch translations for keys defined in trl_location_name_key, trl_current_location_msg_key, trl_location_desc_key
  const trl_location_name = useGetTranslationsEnFi(
    location?.trl_location_name_key,
  );
  const trl_current_location_msg = useGetTranslationsEnFi(
    location?.trl_current_location_msg_key,
  );
  // NOTE: translation for desc appears to consistently be missing, maybe we should exclude it to not spam backend with requests? It's also not shown to users in the wayfinding app, so no reason to include it
  /*   const trl_location_desc = useGetTranslationsEnFi(
    location?.trl_location_desc_key,
  ); */

  if (locationData.isLoading) {
    return <div>Loading location details...</div>;
  }
  if (locationData.isError) {
    return <div>Error loading location details.</div>;
  }

  /* TODO: implement saving recent locations, and listing them somewhere for easy access
   const recentLocationIds = getRecentLocationIds();
  if (locationId) {
    if (recentLocationIds.includes(locationId)) {
      // Move the locationId to the end to mark it as most recently accessed
      const index = recentLocationIds.indexOf(locationId);
      recentLocationIds.splice(index, 1);
    }
    recentLocationIds.push(locationId);
    saveRecentLocationIds(recentLocationIds);
  } */
  if (locationId && !locationData.isLoading && location) {
    return (
      <div>
        <Link
          to="/locations"
          search={{ orgId: searchParams.orgId, siteId: searchParams.siteId, buildingId: searchParams.buildingId }}
          className="text-lab-green-dark p-2"
        >
          &larr; Back to locations list
        </Link>
        <div className="bg-sidebar-grey p-4 pl-3 rounded mt-2 relative">
          <div className="flex flex-row justify-between">
            <h2 className="text-lab-turquoise font-bold text-xl pb-2">
              Location Details
            </h2><span className="font-sm text-gray-400">Location ID: {locationId}</span>
            <button className="bg-lab-blue rounded py-1 px-2 cursor-pointer no-underline hover:text-lab-turquoise">
              <Link
                to="/locations/edit"
                search={{...searchParams, locationId: Number(locationId)}}
              >
                Edit Location
              </Link>
            </button>
          </div>
          <div className="flex flex-row gap-10 mt-2">
            <div className="flex flex-col gap-4 mt-2">
              <div className="grid grid-cols-[auto_1fr] gap-x-4">
                <span>
                  <strong>Name:</strong>
                </span>
                <span>{location.name}</span>
                <span>
                  <strong>Building ID:</strong>
                </span>
                <span>{location.building_id}</span>
                                <span>
                  <strong>Floor Number:</strong>
                </span>
                <span>{location.floor_number}</span>

                <span>
                  <strong>Is Entry Location:</strong>
                </span>
                <span>{location.is_entry_location ? "Yes" : "No"}</span>
                <span>
                  <strong>Image Key:</strong>
                </span>
                <span>{location.img_location_key}</span>
              </div>
              <div>
                <span>
                  <strong>Translations:</strong>
                </span>
                <div className="grid grid-cols-[auto_1fr] gap-1">
                  <h3 className="col-span-2 ">
                    {location.trl_location_name_key}
                  </h3>
                  <span className="text-lab-turquoise font-bold">En:</span>
                  <span>{trl_location_name.data?.[0]?.text_value}</span>
                  <span className="text-lab-turquoise font-bold">Fi:</span>
                  <span>{trl_location_name.data?.[1]?.text_value}</span>

                  <h3 className="col-span-2 mt-2">
                    {location.trl_current_location_msg_key}
                  </h3>
                  <span className="text-lab-turquoise font-bold">En:</span>
                  <span>{trl_current_location_msg.data?.[0]?.text_value}</span>
                  <span className="text-lab-turquoise font-bold">Fi:</span>
                  <span>{trl_current_location_msg.data?.[1]?.text_value}</span>

                  {/* desc is empty for every location currently, and not used on the users' frontend
            <li>{location.trl_location_desc_key}
              <p>En: {trl_location_desc.data?.[0]?.text_value}</p>
              <p>Fi: {trl_location_desc.data?.[1]?.text_value}</p>
            </li> */}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <strong>Image:</strong>
              {image && image.url ? (
                <img
                  src={image.url}
                  alt="Location"
                  className="fit-content w-100"
                />
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>There was a problem loading the location details.</div>;
};
