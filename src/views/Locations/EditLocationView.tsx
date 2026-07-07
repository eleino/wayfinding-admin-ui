import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useSelectionStore } from "@storage/store";
import { useGetLocationById, useUpdateLocation } from "@hooks/useLocations";
import { useUploadImage } from "@hooks/useImages";
import {
  useCreateTranslation,
  useGetTranslationsEnFi,
  useUpdateTranslation,
} from "@hooks/useTranslations";
import { LocationForm } from "@components/Locations/LocationForm";
import type { EditLocationInput } from "@apptypes/location";
import { useQueryClient } from "@tanstack/react-query";
import type { SearchParams } from "@schemas/router.schema";

export const EditLocationView = () => {
  const search  = useSearch({ from: '__root__'}) as SearchParams;
  const { locationId, orgId, siteId, buildingId } = search;
  const savedBuildingId =
    useSelectionStore((state) => state.buildingId) || search.buildingId;
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const savedOrgId = useSelectionStore((state) => state.orgId);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const locationData = useGetLocationById(locationId);
  const { location, image } = locationData.data || {};
  const updateLocationMutation = useUpdateLocation();
  const uploadImageMutation = useUploadImage();
  const createTranslationMutation = useCreateTranslation();
  const updateTranslationMutation = useUpdateTranslation();
  const trl_location_name = useGetTranslationsEnFi(
    location?.trl_location_name_key,
  );
  const trl_current_location_msg = useGetTranslationsEnFi(
    location?.trl_current_location_msg_key,
  );
  const allLocationData = {
    location_name: location?.name || "",
    is_entry_location: location?.is_entry_location || false,
    floor_number: location?.floor_number || 1,
    trl_location_name_fi: trl_location_name?.data?.[1].text_value || "",
    trl_location_name_en: trl_location_name?.data?.[0].text_value || "",
    trl_at_current_location_msg_fi:
      trl_current_location_msg?.data?.[1].text_value || "",
    trl_at_current_location_msg_en:
      trl_current_location_msg?.data?.[0].text_value || "",
    imageFile: undefined,
    imageUrl: image?.url || null,
  };

  // TODO: move this functionality to its own hook to simplify this component
  const handleUpdateLocation = async (
    updatedLocationData: EditLocationInput,
  ) => {
    if (!locationId) return;
    const locChanges: Record<string, string | boolean | number> = {};
    if (updatedLocationData.location_name !== location?.name) {
      locChanges.name = updatedLocationData.location_name;
    }
    if (updatedLocationData.is_entry_location !== location?.is_entry_location) {
      locChanges.is_entry_location = updatedLocationData.is_entry_location;
    }
    if (updatedLocationData.floor_number !== location?.floor_number) {
      locChanges.floor_number = updatedLocationData.floor_number;
    }
    const promises = [];
    if (Object.keys(locChanges).length > 0) {
      promises.push(
        updateLocationMutation.mutateAsync({
          locationId,
          location: locChanges,
        }),
      );
    }
    if (updatedLocationData.imageFile) {
      const key = locationData.data?.location.img_location_key || `LOCATION_${locationId}_IMG`;
      promises.push(
        uploadImageMutation.mutateAsync({
          itemType: "location",
          key,
          file: updatedLocationData.imageFile,
          itemId:locationId,
        }),
      );
    }
    const nameKey = locationData.data?.location.trl_location_name_key || `LOCATION_${locationId}_NAME`;
    const atCurrentLocationMsgKey = locationData.data?.location.trl_current_location_msg_key || `CURRENT_LOCATION_${locationId}_MSG`;
    // check whether translation has changed before trying to update
    // also, if the translation keys didn't exist before, we need to create translations instead of updating
    if (
      updatedLocationData.trl_location_name_en !==
      allLocationData.trl_location_name_en
    ) {
      if (trl_location_name?.data?.[0]) {
        promises.push(
          updateTranslationMutation.mutateAsync({
            translationKey: nameKey,
            lang: "en",
            translation: {
              text_value: updatedLocationData.trl_location_name_en,
            },
          }),
        );
      } else {
        promises.push(
          createTranslationMutation.mutateAsync({
            translation_key: nameKey,
            language_code: "en",
            type: "location_name",
            text_value: updatedLocationData.trl_location_name_en,
          }),
        );
      }
    }
    if (
      updatedLocationData.trl_location_name_fi !==
      allLocationData.trl_location_name_fi
    ) {
      if (trl_location_name?.data?.[1]) {
        promises.push(
          updateTranslationMutation.mutateAsync({
            translationKey: nameKey,
            lang: "fi",
            translation: {
              text_value: updatedLocationData.trl_location_name_fi,
            },
          }),
        );
      } else {
        promises.push(
          createTranslationMutation.mutateAsync({
            translation_key: nameKey,
            language_code: "fi",
            type: "location_name",
            text_value: updatedLocationData.trl_location_name_fi,
          }),
        );
      }
    }
    if (
      updatedLocationData.trl_at_current_location_msg_en !==
      allLocationData.trl_at_current_location_msg_en
    ) {
      if (trl_current_location_msg?.data?.[0]) {
        promises.push(
          updateTranslationMutation.mutateAsync({
            translationKey: atCurrentLocationMsgKey,
            lang: "en",
            translation: {
              text_value: updatedLocationData.trl_at_current_location_msg_en,
            },
          }),
        );
      } else {
        promises.push(
          createTranslationMutation.mutateAsync({
            translation_key: atCurrentLocationMsgKey,
            language_code: "en",
            type: "at_location_message",
            text_value: updatedLocationData.trl_at_current_location_msg_en,
          }),
        );
      }
    }
    if (
      updatedLocationData.trl_at_current_location_msg_fi !==
      allLocationData.trl_at_current_location_msg_fi
    ) {
      if (trl_current_location_msg?.data?.[1]) {
        promises.push(
          updateTranslationMutation.mutateAsync({
            translationKey: atCurrentLocationMsgKey,
            lang: "fi",
            translation: {
              text_value: updatedLocationData.trl_at_current_location_msg_fi,
            },
          }),
        );
      } else {
        promises.push(
          createTranslationMutation.mutateAsync({
            translation_key: atCurrentLocationMsgKey,
            language_code: "fi",
            type: "at_location_message",
            text_value: updatedLocationData.trl_at_current_location_msg_fi,
          }),
        );
      }
    }

    try {
      await Promise.all(promises);
      queryClient.invalidateQueries({
        queryKey: ["location", locationId],
      });
      navigate({
        to:`/locations`,
        search:{
          orgId: orgId || savedOrgId,
          siteId: siteId || savedSiteId,
          buildingId: buildingId || savedBuildingId,
          locationId: locationId,}
      });
    } catch (error) {
      console.error("Error updating translations:", error);
    }
  };

  return (
    <div className="p-4">
      <div>
        <Link to="/locations" search={{orgId: orgId || savedOrgId, siteId: siteId || savedSiteId, buildingId: buildingId || savedBuildingId}} className="text-lab-green-dark p-2">
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
            locationData={allLocationData}
            handleSubmit={handleUpdateLocation}
          />
        </div>
      ) : (
        <p className="text-red-500">Location not found</p>
      )}
    </div>
  );
};
