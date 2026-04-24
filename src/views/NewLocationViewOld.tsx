import { useCreateLocation } from "@hooks/useLocations";
import { useUploadImage } from "@hooks/useImages";
import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useCreateTranslation } from "@hooks/useTranslations";
import { createPath } from "@utils/createPath";
import { useSelectionStore } from "@storage/store";

export const NewLocationView = () => {
  // when adding a new location, we can enter name, is_entry_location, and floor_number.
  // we will need the buildingId to add a location, include that in searchParams?
  // we could include adding an image here as well
  // adding an image requires key (for a location it will be LOCATION_(locationId)_IMG), type (location), locationId, and file (the image itself)
  // so we would first need to add the location to get the locationId, then we can add the image with the returned locationId
  // we need to also provide a way to add translations here, similarly to images we need to know the location id, as the translations will follow the format of LOCATION_(locationId)_NAME, LOCATION_(locationId)_DESC, and LOCATION_(locationId)_CURRENT_LOCATION_MSG
  //
  // translations to add: location_name, at_location_message (location_desc is not used anywhere currently)
  const { search } = useLocation();
  const [locationId, setLocationId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [buildingId, setBuildingId] = useState<number | null>(
    search.buildingId ? parseInt(search.buildingId) : null,
  );
  const savedBuildingId = useSelectionStore((state) => state.buildingId) || buildingId;
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const pathBack = createPath("/locations", savedOrgId || undefined, savedSiteId || undefined, savedBuildingId || undefined);
  const [locationData, setLocationData] = useState({
    name: "",
    is_entry_location: false,
    floor_number: 0,
  });
  const [translationsData, setTranslationsData] = useState({
    name_en: "",
    name_fi: "",
    at_location_msg_en: "",
    at_location_msg_fi: "",
  });
  const createLocationMutation = useCreateLocation();
  const uploadImageMutation = useUploadImage();
  const createTranslationMutation = useCreateTranslation();

  const handleCreateLocation = () => {
    if (buildingId) {
      createLocationMutation.mutate(
        { buildingId, location: locationData },
        {
          onSuccess: (data) => {
            setLocationId(data.location_id);
            setTranslationsData({
              ...translationsData,
              name_fi: locationData.name,
            }); // pre-fill the Finnish name translation with the location name
          },
        },
      );
    } else {
      alert("Please enter a valid Building ID.");
    }
  };

  const handleUploadImage = () => {
    if (imageFile && locationId) {
      const key = `LOCATION_${locationId}_IMG`;
      uploadImageMutation.mutate({
        itemType: "location",
        key,
        file: imageFile,
        itemId: locationId,
      });
    }
  };

  const handleCreateTranslations = async () => {
    if (locationId) {
      const nameKey = `LOCATION_${locationId}_NAME`;
      const atLocationMsgKey = `CURRENT_LOCATION_${locationId}_MSG`;
      try {
        await Promise.all([
          createTranslationMutation.mutateAsync({
            translation_key: nameKey,
            language_code: "en",
            type: "location_name",
            text_value: translationsData.name_en,
          }),
          createTranslationMutation.mutateAsync({
            translation_key: nameKey,
            language_code: "fi",
            type: "location_name",
            text_value: translationsData.name_fi,
          }),
          createTranslationMutation.mutateAsync({
            translation_key: atLocationMsgKey,
            language_code: "en",
            type: "at_location_message",
            text_value: translationsData.at_location_msg_en,
          }),
          createTranslationMutation.mutateAsync({
            translation_key: atLocationMsgKey,
            language_code: "fi",
            type: "at_location_message",
            text_value: translationsData.at_location_msg_fi,
          }),
        ]);
      } catch (error) {
        console.error("Error creating translations:", error);
      }
    }
  };

  return (
    <div className="p-5">
      <div><Link to={pathBack} className="text-lab-green-dark p-2">
        ← Back to locations list
      </Link></div>
      <h1>Add a new location</h1>
      <div className="border-border-grey bg-sidebar-grey p-4 mt-4 grid grid-cols-2 gap-2 w-150 justify-start">
        <label>Location name</label>
        <input
          type="text"
          placeholder="Location Name"
          value={locationData.name}
          onChange={(e) =>
            setLocationData({ ...locationData, name: e.target.value })
          }
          className="border border-border-grey rounded px-2 w-50"
        />
        <label>Is Entry Location?</label>
        <span className="text-lab-gray-light/50"><input
          type="checkbox"
          checked={locationData.is_entry_location}
          onChange={(e) =>
            setLocationData({
              ...locationData,
              is_entry_location: e.target.checked,
            })
          }
          className="justify-self-start mt-1 w-4 h-4"
        /> {String(locationData.is_entry_location)}</span>
        <label>Floor Number</label>
        <input
          type="number"
          placeholder="Floor Number"
          value={locationData.floor_number}
          className="border border-border-grey w-20 pl-2"
          onChange={(e) =>
            setLocationData({
              ...locationData,
              floor_number: parseInt(e.target.value) || 0,
            })
          }
        />
        {buildingId === null && (
          <input
            type="number"
            placeholder="Building ID"
            value={buildingId || ""}
            onChange={(e) => setBuildingId(parseInt(e.target.value) || null)}
          />
        )}
        <div className="flex flex-col">
          <button
            onClick={handleCreateLocation}
            className="bg-lab-blue rounded w-40 p-1"
          >
            Create Location
          </button>
          {createLocationMutation.isError && (
            <div className="text-red-500 w-130 pt-2">
              Error creating location: {String(createLocationMutation.error)}
            </div>
          )}
          {createLocationMutation.isSuccess && (
            <div className="text-green-500 w-130 pt-2">
              Location created successfully! You can now upload an image for the
              location.
            </div>
          )}
        </div>
      </div>
      <div className="imageUpload mt-5 flex flex-col gap-3 col-span-1 bg-sidebar-grey p-2 px-4 border-border-grey w-150">
        <h2 className="font-bold">
          Upload an image for the location{" "}
          {locationId && locationData.name
            ? locationData.name + ` (ID: ${locationId})`
            : ""}
        </h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
          className="border border-grey rounded w-60"
        />
        <button
          disabled={!imageFile || !locationId}
          onClick={handleUploadImage}
          className="bg-lab-blue p-1 px-2 rounded w-40"
        >
          Upload Image
        </button>
        {uploadImageMutation.isError && (
          <div className="text-red-500 pt-2 w-130">
            Error uploading image: {String(uploadImageMutation.error)}
          </div>
        )}
        {uploadImageMutation.isSuccess && (
          <div className="text-green-500 pt-2 w-130">
            Image uploaded successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5 w-150 bg-sidebar-grey pl-4 py-4 border-border-grey">
        <h2 className="font-bold col-span-2">Create Translations</h2>
        <label>Location Name (fi)</label>
        <input
          type="text"
          placeholder="Lokaation nimi"
          value={translationsData.name_fi}
          onChange={(e) =>
            setTranslationsData({
              ...translationsData,
              name_fi: e.target.value,
            })
          }
          className="border border-border-grey w-50 pl-2"
        />
        <label>Location Name (en)</label>
        <input
          type="text"
          placeholder="Location Name"
          value={translationsData.name_en}
          onChange={(e) =>
            setTranslationsData({
              ...translationsData,
              name_en: e.target.value,
            })
          }
          className="border border-border-grey w-50 pl-2"
        />
        <label>At Location Message (fi)</label>
        <input
          type="text"
          placeholder="Olet tässä lokaatiossa"
          value={translationsData.at_location_msg_fi}
          onChange={(e) => {
            const textValue = e.target.value;
            setTranslationsData({
              ...translationsData,
              at_location_msg_fi: textValue,
            });
          }}
          className="border border-border-grey w-50 pl-2"
        />
        <label>At Location Message (en)</label>
        <input
          type="text"
          placeholder="You are at this location"
          value={translationsData.at_location_msg_en}
          onChange={(e) => {
            const textValue = e.target.value;
            setTranslationsData({
              ...translationsData,
              at_location_msg_en: textValue,
            });
          }}
          className="border border-border-grey w-50 pl-2"
        />
        
        <div className="flex flex-col">
        <button
          disabled={!locationId}
          onClick={handleCreateTranslations}
          className="bg-lab-blue p-1 px-2 rounded w-40"
        >
          Create Translations
        </button>
        {createTranslationMutation.isError && (
          <div className="text-red-500 pt-2 w-90">
            Error creating translations:{" "}
            {String(createTranslationMutation.error)}
          </div>
        )}
        {createTranslationMutation.isSuccess && (
          <div className="text-green-500 pt-2 w-90">
            Translations created successfully!
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
