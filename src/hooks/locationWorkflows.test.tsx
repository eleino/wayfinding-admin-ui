import type { EditLocationInput } from "@schemas/location.schema";
import type { Location } from "@apptypes/location";
import { beforeEach, describe, expect, test } from "vitest";
import {
  locationRequests,
  resetLocationMockData,
} from "test/handlers/locations";
import {
  resetTranslationMockData,
  translationRequests,
} from "test/handlers/translations";
import { renderWithQuery } from "test/render";
import { useLocationCreator } from "./useLocationCreator";
import { useLocationUpdater } from "./useLocationUpdater";

const createInput: EditLocationInput = {
  location_name: "Library",
  is_entry_location: false,
  floor_number: 2,
  trl_location_name: [
    { lang: "fi", text: "Kirjasto" },
    { lang: "en", text: "" },
  ],
  trl_at_current_location_msg: [
    { lang: "fi", text: "Olet kirjastossa" },
    { lang: "en", text: undefined },
  ],
  imageFile: undefined,
  existingImageKey: "MEDIA_LIBRARY_IMAGE",
  removeImage: false,
};

const LocationCreatorHarness = () => {
  const workflow = useLocationCreator();
  return (
    <div>
      <button
        type="button"
        onClick={() => void workflow.mutateAsync(100, createInput)}
      >
        Create location
      </button>
      <output aria-label="Creation status">
        {workflow.error?.message ??
          (workflow.data ? `created ${workflow.data.location.location_id}` : "idle")}
      </output>
    </div>
  );
};

const locationDetails: Location = {
  location_id: 12,
  name: "Library",
  building_id: 100,
  is_entry_location: false,
  qr_url: null,
  img_location_key: "LOCATION_12_IMG",
  floor_number: 2,
  trl_location_name_key: "LOCATION_12_NAME",
  trl_current_location_msg_key: "CURRENT_LOCATION_12_MSG",
  trl_location_desc_key: "LOCATION_12_DESC",
};

const oldInput: EditLocationInput = {
  ...createInput,
  existingImageKey: undefined,
  trl_location_name: [
    { lang: "fi", text: "Kirjasto" },
    { lang: "en", text: "" },
  ],
  trl_at_current_location_msg: [
    { lang: "fi", text: "Olet kirjastossa" },
    { lang: "en", text: "" },
  ],
};

const updatedInput: EditLocationInput = {
  ...oldInput,
  location_name: "Campus Library",
  removeImage: true,
  trl_location_name: [
    { lang: "fi", text: "Kampuskirjasto" },
    { lang: "en", text: "Campus Library" },
  ],
  trl_at_current_location_msg: [
    { lang: "fi", text: "Olet kirjastossa" },
    { lang: "en", text: "You are in the library" },
  ],
};

const LocationUpdaterHarness = () => {
  const workflow = useLocationUpdater();
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          void workflow.mutateAsync(
            12,
            locationDetails,
            oldInput,
            updatedInput,
          )
        }
      >
        Update location
      </button>
      <output aria-label="Update status">
        {workflow.error?.message ??
          (workflow.data ? `updated ${workflow.data.location.location_id}` : "idle")}
      </output>
    </div>
  );
};

describe("location workflows", () => {
  beforeEach(() => {
    resetLocationMockData();
    resetTranslationMockData();
  });

  test("creates the location before copying its selected image and non-empty translations", async () => {
    const screen = await renderWithQuery(<LocationCreatorHarness />);
    await screen.getByRole("button", { name: "Create location" }).click();

    await expect
      .element(screen.getByLabelText("Creation status"))
      .toHaveTextContent("created 12");
    expect(locationRequests.created).toEqual([
      {
        buildingId: 100,
        location: {
          name: "Library",
          is_entry_location: false,
          floor_number: 2,
        },
      },
    ]);
    expect(locationRequests.copiedImages).toEqual([
      {
        sourceKey: "MEDIA_LIBRARY_IMAGE",
        key: "LOCATION_12_IMG",
        type: "location",
        locationId: "12",
      },
    ]);
    expect(translationRequests.created).toEqual([
      {
        translation_key: "LOCATION_12_NAME",
        language_code: "fi",
        type: "location_name",
        text_value: "Kirjasto",
      },
      {
        translation_key: "CURRENT_LOCATION_12_MSG",
        language_code: "fi",
        type: "at_location_message",
        text_value: "Olet kirjastossa",
      },
    ]);
  });

  test("updates only changed fields and chooses create/update translation operations correctly", async () => {
    const screen = await renderWithQuery(<LocationUpdaterHarness />);
    await screen.getByRole("button", { name: "Update location" }).click();

    await expect
      .element(screen.getByLabelText("Update status"))
      .toHaveTextContent("updated 12");
    expect(locationRequests.updated).toEqual([
      { locationId: 12, changes: { name: "Campus Library" } },
    ]);
    expect(locationRequests.deletedImageKeys).toEqual(["LOCATION_12_IMG"]);
    expect(translationRequests.updated).toEqual([
      {
        translationKey: "LOCATION_12_NAME",
        languageCode: "fi",
        textValue: "Kampuskirjasto",
      },
    ]);
    expect(translationRequests.created).toEqual([
      {
        translation_key: "LOCATION_12_NAME",
        language_code: "en",
        type: "location_name",
        text_value: "Campus Library",
      },
      {
        translation_key: "CURRENT_LOCATION_12_MSG",
        language_code: "en",
        type: "at_location_message",
        text_value: "You are in the library",
      },
    ]);
  });
});
