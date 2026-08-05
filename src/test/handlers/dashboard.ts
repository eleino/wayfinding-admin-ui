import { http, HttpResponse } from "msw";
import type { Feedback, FeedbackStatus } from "@apptypes/feedback";

const initialFeedback: Feedback[] = [
  {
    feedback_id: 7,
    feedback_text: "The directions at the north entrance were unclear.",
    status: "pending",
    submitted_at: "2026-08-04T09:00:00.000Z",
    updated_at: "2026-08-04T09:00:00.000Z",
  },
];

let feedback = initialFeedback.map((item) => ({ ...item }));

export const dashboardRequests = {
  feedbackStatusUpdates: [] as Array<{ feedbackId: number; status: FeedbackStatus }>,
  deletedFeedbackIds: [] as number[],
  organisationUpdates: [] as Array<{ organisationId: number; name: string }>,
};

export const resetDashboardMockData = () => {
  feedback = initialFeedback.map((item) => ({ ...item }));
  dashboardRequests.feedbackStatusUpdates = [];
  dashboardRequests.deletedFeedbackIds = [];
  dashboardRequests.organisationUpdates = [];
};

export const dashboardHandlers = [
  http.get("*/organizations", () =>
    HttpResponse.json([
      { id: 1, name: "North Campus", logoUrl: null },
      { id: 2, name: "South Campus", logoUrl: null },
    ]),
  ),

  http.get("*/organizations/:orgId/sites", ({ params }) => {
    if (params.orgId !== "1") return HttpResponse.json([]);

    return HttpResponse.json([
      {
        id: 10,
        address: "Main Street 1",
        image_url: null,
        trl_site_name_key: "SITE_10_NAME",
        trl_site_desc_key: "SITE_10_DESC",
        trl_site_welcome_msg_key: "SITE_10_WELCOME",
        translations: {
          en: [{ translation_key: "SITE_10_NAME", text_value: "Main Site" }],
        },
      },
    ]);
  }),

  http.get("*/sites/:siteId/buildings", ({ params }) =>
    HttpResponse.json({
      data: params.siteId === "10" ? [{ id: 100, name: "Main Building" }] : [],
      meta: { buildings: { total: params.siteId === "10" ? 1 : 0, limit: 10 } },
    }),
  ),

  http.get("*/organizations/:orgId/overview", ({ params }) =>
    HttpResponse.json({
      organization: {
        organization_id: Number(params.orgId),
        name: params.orgId === "1" ? "North Campus" : "South Campus",
        slug: params.orgId === "1" ? "north-campus" : "south-campus",
      },
      children: [],
      sites: params.orgId === "1" ? [{ id: 10, name: "Main Site" }] : [],
      settings: null,
      meta: { sites: { total: params.orgId === "1" ? 1 : 0, limit: 10 } },
    }),
  ),

  http.put("*/organizations/:orgId", async ({ params, request }) => {
    const body = (await request.json()) as { name: string };
    const organisationId = Number(params.orgId);
    dashboardRequests.organisationUpdates.push({ organisationId, name: body.name });
    return HttpResponse.json({
      organization_id: organisationId,
      name: body.name,
      slug: body.name.toLowerCase().replaceAll(" ", "-"),
    });
  }),

  http.get("*/sites/:siteId/overview", ({ params }) =>
    HttpResponse.json({
      site: {
        site_id: Number(params.siteId),
        name: "Main Site",
        organization: "North Campus",
        address: "Main Street 1",
        latitude: "61.05",
        longitude: "28.18",
        image_site_key: "SITE_10_IMG",
        trl_site_name_key: "SITE_10_NAME",
        trl_site_desc_key: "SITE_10_DESC",
        trl_site_welcome_msg_key: "SITE_10_WELCOME",
      },
      buildings: [{ id: 100, name: "Main Building" }],
      meta: { buildings: { total: 1, limit: 10 } },
    }),
  ),

  http.put("*/sites/:siteId", async ({ params, request }) => {
    const body = (await request.json()) as { name: string; address: string };
    return HttpResponse.json({
      site_id: Number(params.siteId),
      name: body.name,
      organization: "North Campus",
      address: body.address,
    });
  }),

  http.get("*/buildings/:buildingId/overview", ({ params }) =>
    HttpResponse.json({
      building: {
        building_id: Number(params.buildingId),
        name: "Main Building",
        site_id: 10,
        total_floors: 4,
        trl_building_name_key: "BUILDING_100_NAME",
        trl_building_desc_key: "BUILDING_100_DESC",
        allowed_organizations: [{ organization_id: 1, name: "North Campus" }],
      },
      locations: [],
      paths: [],
      meta: {
        locations: { total: 12, limit: 10 },
        paths: { total: 8, limit: 10 },
      },
    }),
  ),

  http.put("*/buildings/:buildingId", async ({ params, request }) => {
    const body = (await request.json()) as {
      name: string;
      total_floors: number;
      organizations: number[];
    };
    return HttpResponse.json({
      building_id: Number(params.buildingId),
      name: body.name,
      site_id: 10,
      total_floors: body.total_floors,
      allowed_organizations: body.organizations.map((organizationId) => ({
        organization_id: organizationId,
        name: organizationId === 1 ? "North Campus" : "South Campus",
      })),
    });
  }),

  http.get("*/feedback/general", ({ request }) => {
    const status = new URL(request.url).searchParams.get("status");
    return HttpResponse.json(feedback.filter((item) => item.status === status));
  }),

  http.put("*/feedback/:feedbackId/status", async ({ params, request }) => {
    const feedbackId = Number(params.feedbackId);
    const body = (await request.json()) as { status: FeedbackStatus };
    dashboardRequests.feedbackStatusUpdates.push({ feedbackId, status: body.status });
    const item = feedback.find((entry) => entry.feedback_id === feedbackId);
    if (!item) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    item.status = body.status;
    item.updated_at = "2026-08-04T10:00:00.000Z";
    return HttpResponse.json(item);
  }),

  http.delete("*/feedback/:feedbackId", ({ params }) => {
    const feedbackId = Number(params.feedbackId);
    dashboardRequests.deletedFeedbackIds.push(feedbackId);
    feedback = feedback.filter((item) => item.feedback_id !== feedbackId);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/metrics/paths", () =>
    HttpResponse.json([
      {
        path_id: 1,
        usage_count: 5,
        finished_count: 4,
        metrics: [
          { date: "2026-08-03", usage_count: 5, finished_count: 4 },
        ],
      },
    ]),
  ),
];
