import type { SearchParams } from "@schemas/router.schema";
import { useDeleteLocation, useGetLocationById, useGetLocationDeletionImpact } from "@hooks/useLocations";
import { useGetTranslationsAllLangs } from "@hooks/useTranslations";
import { Link, useNavigate } from "@tanstack/react-router";
import { useLanguages } from "@hooks/useAppInit";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LocationDeletionDialog } from "./LocationDeletionDialog";

export const ShowLocation = (props: {
  locationId: number | null;
  searchParams: SearchParams;
}) => {
  const { locationId, searchParams } = props;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const locationData = useGetLocationById(Number(locationId), {
    enabled: !!locationId,
  });
  const deletionImpact = useGetLocationDeletionImpact(Number(locationId), {
    enabled: showDeleteDialog && !!locationId,
  });
  const deleteLocationMutation = useDeleteLocation();
  const { location, image } = locationData.data || {};
  const languageList = useLanguages();
  const convertLanguageCodeToName = (code: string) => {
    const language = languageList.data?.find((lang) => lang.code === code);
    return language ? language.name : code;
  };

  const handleDeleteLocation = () => {
    if (!locationId || !deletionImpact.data) return;

    deleteLocationMutation.mutate(
      {
        locationId,
        cascadePaths: deletionImpact.data.affected_paths.length > 0,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["locations", location?.building_id],
          });
          queryClient.removeQueries({ queryKey: ["location", locationId] });
          queryClient.removeQueries({
            queryKey: ["locationDeletionImpact", locationId],
          });
          navigate({
            to: "/locations",
            search: {
              orgId: searchParams.orgId,
              siteId: searchParams.siteId,
              buildingId: searchParams.buildingId,
            },
            replace: true,
          });
        },
      },
    );
  };

  // fetch translations for keys defined in trl_location_name_key, trl_current_location_msg_key, trl_location_desc_key
  const trl_location_name = useGetTranslationsAllLangs(
    location?.trl_location_name_key,
    {enabled: !!location?.trl_location_name_key,}
  );
  const trl_current_location_msg = useGetTranslationsAllLangs(
    location?.trl_current_location_msg_key,
    {enabled: !!location?.trl_current_location_msg_key,}
  );

  if (locationData.isLoading) {
    return <div>Loading location details...</div>;
  }
  if (locationData.isError) {
    return <div>Error loading location details: {locationData.error.message}</div>;
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
          <div className="flex flex-row justify-between gap-2 items-center">
            <h2 className="text-lab-turquoise font-bold text-xl">
              Location Details
            </h2><span className="font-sm text-gray-400">Location ID: {locationId}</span>
            <div className="flex flex-row gap-2 pl-5">
              <button className="bg-lab-blue rounded py-1 px-2 cursor-pointer no-underline hover:text-lab-turquoise">
                <Link
                  to="/locations/edit"
                  search={{...searchParams, locationId: Number(locationId)}}
                >
                  Edit Location
                </Link>
              </button>
              <button
                type="button"
                className="cursor-pointer rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                onClick={() => {
                  deleteLocationMutation.reset();
                  setShowDeleteDialog(true);
                }}
              >
                Delete Location
              </button>
            </div>
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
                    <div className="flex flex-col gap-1">
                  {trl_location_name.data?.map((translation) => (
                    <div key={translation.language_code} className="flex flex-row gap-1">
                      <span className="text-lab-turquoise font-bold">
                        {convertLanguageCodeToName(translation.language_code)}:
                      </span>
                      <span>{translation.text_value}</span>
                    </div>
                  ))}
                    </div>

                  <h3 className="col-span-2 mt-2">
                    {location.trl_current_location_msg_key}
                  </h3>
                  <div className="flex flex-col gap-1">
                  {trl_current_location_msg.data?.map((translation) => (
                    <div key={translation.language_code} className="flex flex-row gap-1">
                      <span className="text-lab-turquoise font-bold">
                        {convertLanguageCodeToName(translation.language_code)}:
                      </span>
                      <span>{translation.text_value}</span>
                    </div>
                  ))}
                  </div>
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
        {showDeleteDialog && (
          <LocationDeletionDialog
            impact={deletionImpact.data}
            isLoading={deletionImpact.isLoading}
            error={deletionImpact.error}
            isDeleting={deleteLocationMutation.isPending}
            deleteError={deleteLocationMutation.error}
            searchParams={searchParams}
            onConfirm={handleDeleteLocation}
            onCancel={() => {
              if (!deleteLocationMutation.isPending) {
                setShowDeleteDialog(false);
              }
            }}
          />
        )}
      </div>
    );
  }

  return <div>There was a problem loading the location details.</div>;
};
