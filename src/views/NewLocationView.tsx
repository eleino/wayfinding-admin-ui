import { useCreateLocation } from "@hooks/useLocations";
import { useUploadImage } from "@hooks/useImages";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useCreateTranslation } from "@hooks/useTranslations";
import { createPath } from "@utils/createPath";
import { useSelectionStore } from "@storage/store";
import { LocationForm } from "@components/Locations/LocationForm";
import type { EditLocationInput } from "@apptypes/location";
import { useQueryClient } from "@tanstack/react-query";

export const NewLocationView = () => {
  const { search } = useLocation();
  const buildingId =  search.buildingId;
  const savedBuildingId =
    useSelectionStore((state) => state.buildingId) || buildingId;
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const pathBack = createPath(
    "/locations",
    savedOrgId || undefined,
    savedSiteId || undefined,
    savedBuildingId || undefined,
  );
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const createLocationMutation = useCreateLocation();
  const uploadImageMutation = useUploadImage();
  const createTranslationMutation = useCreateTranslation();

  const handleCreateLocation = async (locationData: EditLocationInput) => {
    if (buildingId) {
      const location = {
        name: locationData.location_name,
        is_entry_location: locationData.is_entry_location,
        floor_number: locationData.floor_number,
      };
      createLocationMutation.mutate(
        { buildingId, location },
        {
          onSuccess: async (data) => {
            let uploadError = null;
            let translationError = null;
            if (locationData.imageFile && data.location_id) {
              const key = `LOCATION_${data.location_id}_IMG`;
              try {
                await uploadImageMutation.mutate({
                  itemType: "location",
                  key,
                  file: locationData.imageFile,
                  itemId: data.location_id,
                });
              } catch (error) {
                console.error("Error uploading image:", error);
                uploadError = error;
              }
            }
            if (data.location_id) {
              const nameKey = `LOCATION_${data.location_id}_NAME`;
              const atLocationMsgKey = `CURRENT_LOCATION_${data.location_id}_MSG`;
              try {
                await Promise.all([
                  createTranslationMutation.mutateAsync({
                    translation_key: nameKey,
                    language_code: "en",
                    type: "location_name",
                    text_value: locationData.trl_location_name_en,
                  }),
                  createTranslationMutation.mutateAsync({
                    translation_key: nameKey,
                    language_code: "fi",
                    type: "location_name",
                    text_value: locationData.trl_location_name_fi,
                  }),
                  createTranslationMutation.mutateAsync({
                    translation_key: atLocationMsgKey,
                    language_code: "en",
                    type: "at_location_message",
                    text_value: locationData.trl_at_current_location_msg_en,
                  }),
                  createTranslationMutation.mutateAsync({
                    translation_key: atLocationMsgKey,
                    language_code: "fi",
                    type: "at_location_message",
                    text_value: locationData.trl_at_current_location_msg_fi,
                  }),
                ]);
              } catch (error) {
                console.error("Error creating translations:", error);
                translationError = error;
              }
            }
              if (!uploadError && !translationError && data.location_id) {
                navigate({ to: createPath(
                  `/locations`,
                  savedOrgId || undefined,
                  savedSiteId || undefined,
                  savedBuildingId || undefined,
                  data.location_id,
                )});
              }
              queryClient.invalidateQueries({ queryKey: ["locations", buildingId]});
          },
        },
      );
    }
  };


  return (
    <div className="p-5">
      <div>
        <Link to={pathBack} className="text-lab-green-dark p-2">
          ← Back to locations list
        </Link>
      </div>
      <h1>Add a new location</h1>
      <div className="border-border-grey bg-sidebar-grey p-4 mt-4 w-150">
        {buildingId ? (
          <LocationForm handleSubmit={handleCreateLocation} />
        ) : (
          <div>Please select a building to add a location.</div>
        )}
        {createLocationMutation.isPending && <div>Creating location...</div>}
        {createLocationMutation.error && (
          <div className="text-red-500">
            Error creating location: {createLocationMutation.error.message}
          </div>
        )}
        {uploadImageMutation.isPending && <div>Uploading image...</div>}
        {uploadImageMutation.error && (
          <div className="text-red-500">
            Error uploading image: {uploadImageMutation.error.message}
          </div>
        )}
        {createTranslationMutation.isPending && <div>Creating translations...</div>}
        {createTranslationMutation.error && (
          <div className="text-red-500">
            Error creating translations: {createTranslationMutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
};
