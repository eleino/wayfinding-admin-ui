import { http, HttpResponse } from "msw";
import { describe, expect, test, vi } from "vitest";
import { renderWithPathEditStepsProvider } from "test/render";
import { worker } from "test/worker";
import { EditStep } from "./EditStep";

describe("EditStep", () => {
  test("shows the start location message and image for the first step", async () => {
    worker.use(
      http.get("*/init/app", () =>
        HttpResponse.json({
          settings: {},
          languages: [{ code: "fi", name: "Finnish" }],
        }),
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
      http.get("*/translations/:key", ({ params }) =>
        HttpResponse.json({
          translation_key: params.key,
          translation_id: 1,
          language_code: "fi",
          type: "at_location_message",
          text_value: "You are here",
        }),
      ),
    );

    const pathInstructions = [
      {
        steps: [
          {
            step_order: 1,
            distance_to_next_meters: 10,
            video_instruction_url: "",
            img_on_approach: null,
            img_to_next: null,
            trl_instruction_on_approach_key: "CURRENT_LOCATION_1_MSG",
            trl_instruction_to_next_key: "TRL_NEXT_FROM_1_TO_2",
            translations: {
              fi: [
                {
                  translation_key: "CURRENT_LOCATION_1_MSG",
                  text_value: "",
                },
                {
                  translation_key: "TRL_NEXT_FROM_1_TO_2",
                  text_value: "Continue forward",
                },
              ],
            },
          },
        ],
        destination: {
          location_id: 2,
          trl_location_name_key: "LOCATION_2_NAME",
          translations: {
            fi: [
              {
                translation_key: "LOCATION_2_NAME",
                text_value: "Destination",
              },
            ],
          },
        },
      },
    ];

    const screen = await renderWithPathEditStepsProvider(
      <EditStep
        stepIndex={0}
        haveStepDataDetails
        onRemove={vi.fn()}
      />,
      {
        children: <></>,
        contextOverrides: {
          pathInstructions,
          languageList: [{ code: "fi", name: "Finnish" }],
        },
      },
    );

    await expect.element(screen.getByText(/FI: You are here/)).toBeInTheDocument();
    await expect
      .element(screen.getByAltText("Instruction image for step 1"))
      .toHaveAttribute("src", "https://example.com/start-location.jpg");
  });
});
