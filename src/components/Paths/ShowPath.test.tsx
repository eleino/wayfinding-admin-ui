import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mockPathData } from "test/mockData";
import { renderWithQuery } from "test/render";
import { worker } from "test/worker";
import { ShowPath } from "./ShowPath";

vi.mock("@components/Dashboard/PathUsageChart", () => ({
  default: () => <div>Path usage chart</div>,
}));

describe("ShowPath", () => {
  const instructionRequests: string[] = [];
  let individualStepRequests = 0;

  beforeEach(() => {
    instructionRequests.length = 0;
    individualStepRequests = 0;

    worker.use(
      http.get("*/init/app", () =>
        HttpResponse.json({
          settings: {},
          languages: [
            { code: "fi", name: "Finnish" },
            { code: "en", name: "English" },
          ],
        }),
      ),
      http.get("*/paths/:pathId/overview", () =>
        HttpResponse.json(mockPathData),
      ),
      http.get("*/locations/:locationId/overview", () =>
        HttpResponse.json({
          location: {
            location_id: 1,
            name: "Start location",
            building_id: 1,
            is_entry_location: true,
            qr_url: null,
            img_location_key: "LOCATION_1_IMG",
            floor_number: 1,
            trl_location_name_key: "LOCATION_1_NAME",
            trl_current_location_msg_key: "CURRENT_LOCATION_1_MSG",
            trl_location_desc_key: "LOCATION_1_DESC",
          },
          image: {
            url: "https://example.com/start-location.jpg",
            overlay: null,
          },
        }),
      ),
      http.get("*/translations/:key", ({ params, request }) => {
        const language = new URL(request.url).searchParams.get("lang") ?? "";
        return HttpResponse.json({
          translation_key: params.key,
          translation_id: language === "fi" ? 1 : 2,
          language_code: language,
          type: "at_location_message",
          text_value: `${language} You are here`,
        });
      }),
      http.get("*/paths/:pathId/instructions", ({ request }) => {
        const url = new URL(request.url);
        const language = url.searchParams.get("lang") ?? "";
        instructionRequests.push(
          `${language}:${url.searchParams.get("fromLocation")}`,
        );

        return HttpResponse.json({
          steps: mockPathData.steps.map((step) => ({
            step_order: step.order,
            distance_to_next_meters: step.distance_to_next_meters,
            video_instruction_url: "",
            img_on_approach: null,
            img_to_next:
              step.order === 1
                ? {
                    url: "https://example.com/instruction.jpg",
                    overlay: {
                      overlay_image_url: "https://example.com/arrow.png",
                      position_x_percent: -80,
                      position_y_percent: 5,
                      overlay_size: 18,
                      rotation_deg: -15,
                      rotation_x_deg: 77,
                    },
                  }
                : null,
            trl_instruction_on_approach_key: `APPROACH_${step.order}`,
            trl_instruction_to_next_key: `NEXT_${step.order}`,
            translations: {
              [language]: [
                {
                  translation_key: `APPROACH_${step.order}`,
                  text_value:
                    step.order === 1
                      ? ""
                      : `${language} approach instruction ${step.order}`,
                },
                {
                  translation_key: `NEXT_${step.order}`,
                  text_value: `${language} next instruction ${step.order}`,
                },
              ],
            },
          })),
          destination: {
            location_id: 2,
            trl_location_name_key: "DESTINATION",
            translations: {
              [language]: [
                { translation_key: "DESTINATION", text_value: "Destination" },
              ],
            },
          },
        });
      }),
      http.get("*/steps/:stepId/overview", () => {
        individualStepRequests += 1;
        return HttpResponse.json({}, { status: 500 });
      }),
      http.get("*/metrics/paths", () =>
        HttpResponse.json([
          {
            path_id: 1,
            usage_count: 12,
            finished_count: 9,
            metrics: [
              { date: "2026-08-06", usage_count: 7, finished_count: 5 },
              { date: "2026-08-07", usage_count: 5, finished_count: 4 },
            ],
          },
        ]),
      ),
    );
  });

  test("shows totals, a chart, and all localized step instructions", async () => {
    const screen = await renderWithQuery(
      <ShowPath
        pathId={1}
        searchParams={{ orgId: 1, siteId: 10, buildingId: 1, pathId: 1 }}
      />,
      {
        searchParams: { orgId: 1, siteId: 10, buildingId: 1, pathId: 1 },
      },
    );

    await expect
      .element(screen.getByRole("heading", { name: "Path usage", exact: true }))
      .toBeInTheDocument();
    await expect.element(screen.getByText("12", { exact: true })).toBeInTheDocument();
    await expect.element(screen.getByText("9", { exact: true })).toBeInTheDocument();
    await expect.element(screen.getByText("Path usage chart")).toBeInTheDocument();
    await expect.element(screen.getByText("Step 1", { exact: true })).toBeInTheDocument();
    await expect
      .element(screen.getByText("fi You are here"))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText("en You are here"))
      .toBeInTheDocument();
    await expect
      .element(screen.getByAltText("On approach instruction"))
      .toHaveAttribute("src", "https://example.com/start-location.jpg");
    await expect
      .element(screen.getByText("en next instruction 2"))
      .toBeInTheDocument();
    await expect
      .element(screen.getByTestId("instruction-image-container").first())
      .toHaveClass("relative", "h-auto", "w-full");
    await expect
      .element(screen.getByAltText("To next step instruction"))
      .toHaveClass("relative", "h-auto", "w-full");
    await expect
      .element(screen.getByTestId("instruction-overlay"))
      .toHaveStyle({
        top: "50%",
        left: "50%",
        width: "18%",
        height: "auto",
      });

    expect(instructionRequests.sort()).toEqual(["en:1", "fi:1"]);
    expect(individualStepRequests).toBe(0);
  });
});
