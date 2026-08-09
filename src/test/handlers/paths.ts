import type { CreatePathDTO } from "@apptypes/dtos/create-path.dto";
import { http, HttpResponse } from "msw";

export const pathRequests = {
  created: [] as Array<{ buildingId: number; path: CreatePathDTO }>,
};

export const resetPathMockData = () => {
  pathRequests.created = [];
};

export const pathHandlers = [
  http.post("*/buildings/:buildingId/paths", async ({ params, request }) => {
    const path = (await request.json()) as CreatePathDTO;
    const buildingId = Number(params.buildingId);
    pathRequests.created.push({ buildingId, path });

    return HttpResponse.json(
      {
        path_id: 77,
        ...path,
        building_id: buildingId,
        start_location_id: path.steps[0]?.location_id,
        end_location_id: path.steps.at(-1)?.location_id,
        is_active: true,
        elevated_priority_starts_at: null,
        elevated_priority_expires_at: null,
        distance_meters: path.steps.reduce(
          (total, step) => total + step.distance_to_next_meters,
          0,
        ),
        trl_path_name_key: null,
        allowed_organizations: [],
      },
      { status: 201 },
    );
  }),
];
