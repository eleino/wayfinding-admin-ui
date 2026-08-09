import { http, HttpResponse } from "msw";

export const qrCodeRequests = {
  destinations: [] as Array<{
    locationId: number;
    accessibilityLevel: string | null;
  }>,
  codes: [] as Array<{ locationId: number; pathId: string | null }>,
};

export const resetQRCodeMockData = () => {
  qrCodeRequests.destinations = [];
  qrCodeRequests.codes = [];
};

const destination = (
  pathId: number,
  locationId: number,
  text: string,
) => ({
  path_id: pathId,
  step_order: 2,
  distance_meters: 50,
  estimated_time_minutes: 2,
  video_instruction_url: "",
  location_id: locationId,
  is_exit: false,
  trl_location_name_key: `LOCATION_${locationId}_NAME`,
  translations: {
    fi: [
      {
        translation_key: `LOCATION_${locationId}_NAME`,
        text_value: text,
      },
    ],
  },
});

export const qrCodeHandlers = [
  http.get("*/locations/:locationId/destinations", ({ params, request }) => {
    const accessibilityLevel = new URL(request.url).searchParams.get(
      "accessibility_level",
    );
    qrCodeRequests.destinations.push({
      locationId: Number(params.locationId),
      accessibilityLevel,
    });

    return HttpResponse.json({
      current_location: {
        location_id: Number(params.locationId),
        image_url: "",
        trl_current_location_msg_key: "CURRENT_LOCATION_1_MSG",
        translations: { fi: [] },
      },
      end_locations:
        accessibilityLevel === "1"
          ? [destination(22, 3, "Accessible reception")]
          : [destination(11, 2, "Library")],
    });
  }),

  http.get("*/locations/:locationId/qr", ({ params, request }) => {
    qrCodeRequests.codes.push({
      locationId: Number(params.locationId),
      pathId: new URL(request.url).searchParams.get("pathId"),
    });
    return new HttpResponse(new Blob(["mock png"], { type: "image/png" }), {
      headers: { "Content-Type": "image/png" },
    });
  }),
];
