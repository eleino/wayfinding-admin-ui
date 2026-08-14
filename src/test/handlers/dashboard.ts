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
  organisationSettingsUpdates: [] as Array<{
    organisationId: number;
    themeJson: string;
  }>,
  siteUpdates: [] as Array<{ siteId: number; name: string; address: string }>,
  buildingUpdates: [] as Array<{
    buildingId: number;
    name: string;
    totalFloors: number;
    organisations: number[];
  }>,
  imageUploads: [] as Array<{ type: string; key: string; itemId: string }>,
  imageCopies: [] as Array<{ type: string; key: string; sourceKey: string }>,
  deletedImageKeys: [] as string[],
};

export const resetDashboardMockData = () => {
  feedback = initialFeedback.map((item) => ({ ...item }));
  dashboardRequests.feedbackStatusUpdates = [];
  dashboardRequests.deletedFeedbackIds = [];
  dashboardRequests.organisationUpdates = [];
  dashboardRequests.organisationSettingsUpdates = [];
  dashboardRequests.siteUpdates = [];
  dashboardRequests.buildingUpdates = [];
  dashboardRequests.imageUploads = [];
  dashboardRequests.imageCopies = [];
  dashboardRequests.deletedImageKeys = [];
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
      settings: {
        logo_image_key_light: `ORGANIZATION_${params.orgId}_LOGO_LIGHT`,
        logo_image_key_dark: `ORGANIZATION_${params.orgId}_LOGO_DARK`,
        theme_json: { dark: {}, light: {}, default: "light" },
      },
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

  http.put("*/organizations/:orgId/settings", async ({ params, request }) => {
    const body = (await request.json()) as { theme_json: string };
    dashboardRequests.organisationSettingsUpdates.push({
      organisationId: Number(params.orgId),
      themeJson: body.theme_json,
    });
    return HttpResponse.json({
      logo_image_key_light: `ORGANIZATION_${params.orgId}_LOGO_LIGHT`,
      logo_image_key_dark: `ORGANIZATION_${params.orgId}_LOGO_DARK`,
      theme_json: body.theme_json,
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
        img_site_key: "SITE_10_IMG",
        trl_site_name_key: "SITE_10_NAME",
        trl_site_desc_Key: "SITE_10_DESC",
        trl_site_welcome_msg_key: "SITE_10_WELCOME",
      },
      buildings: [{ id: 100, name: "Main Building" }],
      meta: { buildings: { total: 1, limit: 10 } },
    }),
  ),

  http.put("*/sites/:siteId", async ({ params, request }) => {
    const body = (await request.json()) as { name: string; address: string };
    dashboardRequests.siteUpdates.push({
      siteId: Number(params.siteId),
      name: body.name,
      address: body.address,
    });
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
        img_building_key: "BUILDING_100_IMG",
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
    dashboardRequests.buildingUpdates.push({
      buildingId: Number(params.buildingId),
      name: body.name,
      totalFloors: body.total_floors,
      organisations: body.organizations,
    });
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

  http.get("*/images/:type", ({ params }) => {
    const imagesByType: Record<string, Array<{ key: string; url: string }>> = {
      logo: [
        {
          key: "ORGANIZATION_1_LOGO_LIGHT",
          url: "https://example.com/logo-light.png",
        },
        {
          key: "ORGANIZATION_1_LOGO_DARK",
          url: "https://example.com/logo-dark.png",
        },
      ],
      site: [
        { key: "SITE_10_IMG", url: "https://example.com/site.png" },
        { key: "SITE_20_IMG", url: "https://example.com/other-site.png" },
      ],
      building: [
        {
          key: "BUILDING_100_IMG",
          url: "https://example.com/building.png",
        },
        {
          key: "BUILDING_200_IMG",
          url: "https://example.com/other-building.png",
        },
      ],
    };
    const type = String(params.type);
    if (!(type in imagesByType)) return undefined;
    const data = imagesByType[type] ?? [];
    return HttpResponse.json({
      data,
      meta: { images: { total: data.length, limit: "1000" } },
    });
  }),

  http.post("*/images/upload", async ({ request }) => {
    const data = await request.clone().formData();
    const type = String(data.get("type"));
    if (!["logo", "site", "building"].includes(type)) return undefined;
    const itemId = String(
      data.get("orgId") ?? data.get("siteId") ?? data.get("buildingId") ?? "",
    );
    const key = String(data.get("key"));
    dashboardRequests.imageUploads.push({ type, key, itemId });
    return HttpResponse.json({
      entity: { image_key: key, file_path: `${type}/${key}.png` },
      url: `https://example.com/${key}.png`,
    });
  }),

  http.post("*/images/copy", async ({ request }) => {
    const body = (await request.clone().json()) as {
      type: string;
      key: string;
      sourceKey: string;
    };
    if (!["logo", "site", "building"].includes(body.type)) return undefined;
    dashboardRequests.imageCopies.push(body);
    return HttpResponse.json({
      entity: { image_key: body.key, file_path: `${body.type}/${body.key}.png` },
      url: `https://example.com/${body.key}.png`,
    });
  }),

  http.delete("*/images/:key", ({ params }) => {
    const key = String(params.key);
    if (
      !key.startsWith("ORGANIZATION_") &&
      !key.startsWith("SITE_") &&
      !key.startsWith("BUILDING_")
    ) {
      return undefined;
    }
    dashboardRequests.deletedImageKeys.push(key);
    return new HttpResponse(null, { status: 204 });
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

  http.get("*/buildings/:buildingId/paths", () =>
    HttpResponse.json({
      data: [
        { id: 1, name: "Main entrance to lobby" },
        { id: 2, name: "East entrance to library" },
      ],
      meta: { paths: { total: 2, limit: 1000 } },
    }),
  ),
];
