import { http, HttpResponse } from "msw";

export const locationHandlers = [
  // mock for fetching all locations for a building
  http.get("/buildings/:buildingId/locations", () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "Location 1",
      },
      {
        id: 2,
        name: "Location 2",
      },
    ]);
  }),
  // mock for fetching a single location by ID
  http.get("/locations/:locationId/overview", (req) => {
    const { locationId } = req.params;
    return HttpResponse.json({
      location: {
        id: Number(locationId),
        name: `Location ${locationId}`,
      },
      image: null,
    });
  }),
  // mock for fetching entry locations for a building
  http.get("/buildings/:buildingId/enterances", (req) => {
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
];
