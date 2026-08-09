import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useSelectionStore } from "@storage/store";
import { useGetLocationById,  } from "@hooks/useLocations";
import { useGetTranslationsAllLangs } from "@hooks/useTranslations";
import { LocationForm } from "@components/Locations/LocationForm";
import type { EditLocationInput } from "@schemas/location.schema";
import type { SearchParams } from "@schemas/router.schema";
import { useLocationUpdater } from "@hooks/useLocationUpdater";
import { useLanguages } from "@hooks/useAppInit";

export const EditLocationView = () => {
  const search = useSearch({ from: "__root__" }) as SearchParams;
  const { locationId, orgId, siteId, buildingId } = search;
  const savedBuildingId =
    useSelectionStore((state) => state.buildingId) || search.buildingId;
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const locationUpdater = useLocationUpdater();
  const languageList = useLanguages();

  const navigate = useNavigate();

  const locationData = useGetLocationById(locationId);
  const { location, image } = locationData.data || {};
  const trl_location_name = useGetTranslationsAllLangs(
    location?.trl_location_name_key,
    {enabled: !!location?.trl_location_name_key,}
  );
  const trl_current_location_msg = useGetTranslationsAllLangs(
    location?.trl_current_location_msg_key,
    {enabled: !!location?.trl_current_location_msg_key,}
  );
  const languageCodes = languageList.data?.map((lang) => lang.code) || [];
  const allLocationData = {
    location_name: location?.name || "",
    is_entry_location: location?.is_entry_location || false,
    floor_number: location?.floor_number || 1,
    trl_location_name: trl_location_name?.data ? trl_location_name?.data?.map((t) => ({
      lang: t.language_code,
      text: t.text_value || '',
    })) : languageCodes.length > 0 ? languageCodes.map((code) => ({ lang: code, text: "" })) : [],
    trl_at_current_location_msg: trl_current_location_msg?.data ? trl_current_location_msg?.data?.map((t) => ({
      lang: t.language_code,
      text: t.text_value || '',
    })) : languageCodes.length > 0 ? languageCodes.map((code) => ({ lang: code, text: "" })) : [],
    imageFile: undefined,
    imageUrl: image?.url || null,
  };

  const handleUpdateLocation = async (
    updatedLocationData: EditLocationInput,
  ) => {
    if (!locationId || !location) return;

    const result = await locationUpdater.mutateAsync(locationId, location, allLocationData, updatedLocationData);
    if (!result.error && result.data?.location.location_id) {
      // add slight delay to ensure the location data is updated before navigating
      setTimeout(() => {
        
      navigate({
        to: "/locations",
        search: {
          orgId: savedOrgId,
          siteId: savedSiteId,
          buildingId: savedBuildingId,
          locationId: result.data.location.location_id,
        },
        replace: true,
      });
    }, 300);
  }
  };

  if (languageList.isLoading) {
    return <div>Loading languages...</div>;
  }
  if (languageList.isError) {
    return <div>Error loading languages: {languageList.error.message}</div>;
  }
  if (!languageList.data || languageList.data.length === 0) {
    return <div>No languages available</div>;
  }

  return (
    <div className="p-4">
      <div>
        <Link
          to="/locations"
          search={{
            orgId: orgId || savedOrgId,
            siteId: siteId || savedSiteId,
            buildingId: buildingId || savedBuildingId,
          }}
          className="text-lab-green-dark p-2"
        >
          &larr; Back to locations list
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Edit Location</h1>
      {locationData.isLoading ||
      trl_current_location_msg.isLoading ||
      trl_location_name.isLoading ? (
        <p>Loading location data...</p>
      ) : locationData.error ? (
        <p className="text-red-500">Error loading location data</p>
      ) : location ? (
        <div className="bg-sidebar-grey p-4 rounded w-150">
          <LocationForm
            locationId={locationId}
            locationData={allLocationData}
            handleSubmit={handleUpdateLocation}
            languageList={languageList.data}
          />
        </div>
      ) : (
        <p className="text-red-500">Location not found</p>
      )}
      {locationUpdater.isLoading && (
        <div className="mt-4">{locationUpdater.loadingMessage}</div>
      )}
      {locationUpdater.error && (
        <div className="text-red-500 mt-4">
          Error updating location: {locationUpdater.error.message}
        </div>
      )}
    </div>
  );
};
