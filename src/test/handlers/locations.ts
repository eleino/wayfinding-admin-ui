import { http, HttpResponse } from "msw";
import type { CreateLocationDTO } from "@apptypes/dtos/create-location.dto";
import type { UpdateLocationDTO } from "@apptypes/dtos/update-location.dto";

export const locationRequests = {
  created: [] as Array<{
    buildingId: number;
    location: CreateLocationDTO;
  }>,
  updated: [] as Array<{
    locationId: number;
    changes: UpdateLocationDTO;
  }>,
  copiedImages: [] as Array<Record<string, string>>,
  deletedImageKeys: [] as string[],
};

export const resetLocationMockData = () => {
  locationRequests.created = [];
  locationRequests.updated = [];
  locationRequests.copiedImages = [];
  locationRequests.deletedImageKeys = [];
};

export const locationHandlers = [
  // mock for fetching all locations for a building
  http.get("*/buildings/:buildingId/locations", () => {
    return HttpResponse.json({
      data: [
        { id: 1, name: "Location 1" },
        { id: 2, name: "Location 2" },
      ],
    });
  }),
  // mock for fetching a single location by ID
  http.get("*/locations/:locationId/overview", (req) => {
    const { locationId } = req.params;
    return HttpResponse.json({
      location: {
        location_id: Number(locationId),
        name: `Location ${locationId}`,
        building_id: 100,
        is_entry_location: true,
        qr_url: null,
        img_location_key: `LOCATION_${locationId}_IMG`,
        floor_number: 1,
        trl_location_name_key: `LOCATION_${locationId}_NAME`,
        trl_current_location_msg_key: `CURRENT_LOCATION_${locationId}_MSG`,
        trl_location_desc_key: `LOCATION_${locationId}_DESC`,
      },
      image: null,
    });
  }),
  // mock for fetching entry locations for a building
  http.get("*/buildings/:buildingId/enterances", (req) => {
    const { buildingId } = req.params;
    if (!buildingId) {
      return HttpResponse.json({ error: "Building ID is required" }, { status: 400 });
    }
    return HttpResponse.json([
      {
        location_id: 1,
        image_url: "https://example.com/image1.jpg",
        trl_location_name_key: "entry_location_1",
        translations: {
          fi: [{ translation_key: "entry_location_1", text_value: "Sisäänkäynti 1" }],
          en: [{ translation_key: "entry_location_1", text_value: "Entrance 1" }],
        },
      },
      {
        location_id: 2,
        image_url: "https://example.com/image2.jpg",
        trl_location_name_key: "entry_location_2",
        translations: {
          fi: [{ translation_key: "entry_location_2", text_value: "Sisäänkäynti 2" }],
          en: [{ translation_key: "entry_location_2", text_value: "Entrance 2" }],
        },
      },
    ]);
  }),
  http.post("*/buildings/:buildingId/locations", async ({ params, request }) => {
    const location = (await request.json()) as CreateLocationDTO;
    const buildingId = Number(params.buildingId);
    locationRequests.created.push({ buildingId, location });
    return HttpResponse.json(
      {
        location_id: 12,
        ...location,
        building_id: buildingId,
        qr_url: null,
        img_location_key: "LOCATION_12_IMG",
        trl_location_name_key: "LOCATION_12_NAME",
        trl_current_location_msg_key: "CURRENT_LOCATION_12_MSG",
        trl_location_desc_key: "LOCATION_12_DESC",
      },
      { status: 201 },
    );
  }),
  http.put("*/locations/:locationId", async ({ params, request }) => {
    const changes = (await request.json()) as UpdateLocationDTO;
    const locationId = Number(params.locationId);
    locationRequests.updated.push({ locationId, changes });
    return HttpResponse.json({
      location_id: locationId,
      name: changes.name ?? "Library",
      building_id: 100,
      is_entry_location: changes.is_entry_location ?? false,
      floor_number: changes.floor_number ?? 2,
      qr_url: null,
      img_location_key: `LOCATION_${locationId}_IMG`,
      trl_location_name_key: `LOCATION_${locationId}_NAME`,
      trl_current_location_msg_key: `CURRENT_LOCATION_${locationId}_MSG`,
      trl_location_desc_key: `LOCATION_${locationId}_DESC`,
    });
  }),
  http.post("*/images/copy", async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    locationRequests.copiedImages.push(body);
    return HttpResponse.json({
      entity: { image_key: body.key, file_path: "locations/12/copied.png" },
      url: "https://example.com/copied.png",
    });
  }),
  http.delete("*/images/:key", ({ params }) => {
    locationRequests.deletedImageKeys.push(String(params.key));
    return new HttpResponse(null, { status: 204 });
  }),
];
