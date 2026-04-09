import type { SearchParams } from "@apptypes/searchParams";
import { useGetLocationById } from "@hooks/useLocations";
import { useGetTranslationsEnFi } from "@hooks/useTranslations";
import { Link } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";
import {
  getRecentLocationIds,
  saveRecentLocationIds,
} from "storage/localStorage";

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
  // TODO: translation for desc appears to consistently be missing, maybe we should exclude it to not spam backend with requests?
  const trl_location_desc = useGetTranslationsEnFi(
    location?.trl_location_desc_key,
  );

  if (locationData.isLoading) {
    return <div>Loading location details...</div>;
  }
  if (locationData.isError) {
    return <div>Error loading location details.</div>;
  }

  const recentLocationIds = getRecentLocationIds();
  if (locationId) {
    if (recentLocationIds.includes(locationId)) {
      // Move the locationId to the end to mark it as most recently accessed
      const index = recentLocationIds.indexOf(locationId);
      recentLocationIds.splice(index, 1);
    }
    recentLocationIds.push(locationId);
    saveRecentLocationIds(recentLocationIds);
  }
  if (locationId && !locationData.isLoading && location) {
    return (
      <div>
        <Link
          to={createPath(
            `/locations`,
            searchParams.orgId,
            searchParams.siteId,
            searchParams.buildingId,
          )}
          className="text-lab-green-dark p-2"
        >
          &lt; Back to locations list
        </Link>
        <div className="bg-sidebar-grey p-2">
          <h2 className="">Location Details:</h2>
          <div className="flex flex-cols gap-4">
            <div>
          <p>
            <strong>Name:</strong> {location.name}
          </p>
          <p>
            <strong>Building ID:</strong> {location.building_id}
          </p>
          <p>
            <strong>Is Entry Location:</strong>{" "}
            {location.is_entry_location ? "Yes" : "No"}
          </p>
          <p>
            <strong>QR URL:</strong> {location.qr_url || "N/A"}
          </p>
          <p>
            <strong>Image Location Key:</strong> {location.img_location_key}
          </p>
          <p>
            <strong>Floor Number:</strong> {location.floor_number}
          </p>
          <p>
            <strong>Translation Keys:</strong>
          </p>
          <ul>
            <li>{location.trl_location_name_key}
              <p>En: {trl_location_name.data?.[0]?.text_value}</p>
              <p>Fi: {trl_location_name.data?.[1]?.text_value}</p>
            </li>
            <li>{location.trl_current_location_msg_key}
              <p>En: {trl_current_location_msg.data?.[0]?.text_value}</p>
              <p>Fi: {trl_current_location_msg.data?.[1]?.text_value}</p>
            </li>
            <li>{location.trl_location_desc_key}
              <p>En: {trl_location_desc.data?.[0]?.text_value}</p>
              <p>Fi: {trl_location_desc.data?.[1]?.text_value}</p>
            </li>
          </ul>
          </div>
          <div>
            <strong>Image:</strong>{" "}
            {image && image.url ? (
              <img src={image.url} alt="Location" className="fit-content" />
            ) : (
              "N/A"
            )}
          </div>
          </div>
        </div>
      </div>
    );
  }

  return <div></div>;
};
