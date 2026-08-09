import { beforeEach, describe, expect, test } from "vitest";
import { useSelectionStore } from "@storage/store";
import { pathRequests, resetPathMockData } from "test/handlers/paths";
import { renderWithQuery } from "test/render";
import { NewPathView } from "./NewPathView";

describe("NewPathView", () => {
  beforeEach(() => {
    resetPathMockData();
    useSelectionStore.setState({
      orgId: 1,
      siteId: 10,
      buildingId: 100,
      locationId: undefined,
      pathId: undefined,
    });
  });

  test("submits an ordered multi-step path and opens the created path", async () => {
    const { router, ...screen } = await renderWithQuery(<NewPathView />, {
      path: "/paths/new",
      searchParams: { orgId: 1, siteId: 10, buildingId: 100 },
    });

    await expect
      .element(screen.getByRole("button", { name: "Add Step" }))
      .toBeInTheDocument();
    await screen.getByRole("textbox").first().fill("Entrance to library");
    await screen.getByRole("spinbutton").nth(0).fill("3");
    await screen.getByRole("spinbutton").nth(1).fill("7");
    await screen.getByRole("spinbutton").nth(2).fill("1");
    await screen
      .getByRole("textbox")
      .nth(1)
      .fill("https://example.com/path-video");

    const addStep = screen.getByRole("button", { name: "Add Step" });
    await addStep.click();
    await screen.getByRole("combobox").first().selectOptions("1");
    await screen.getByRole("spinbutton").nth(3).fill("15");

    await addStep.click();
    await screen.getByRole("combobox").nth(1).selectOptions("2");
    await screen.getByRole("spinbutton").nth(5).fill("0");

    await screen.getByRole("button", { name: "Save Path" }).click();

    await expect.poll(() => pathRequests.created).toEqual([
      {
        buildingId: 100,
        path: {
          name: "Entrance to library",
          priority: 3,
          estimated_time_minutes: 7,
          accessibility_level: 1,
          video_instruction_url: "https://example.com/path-video",
          organizations: [],
          steps: [
            {
              location_id: 1,
              step_order: 1,
              distance_to_next_meters: 15,
              video_timestamp_seconds: 0,
            },
            {
              location_id: 2,
              step_order: 2,
              distance_to_next_meters: 0,
              video_timestamp_seconds: 0,
            },
          ],
        },
      },
    ]);
    await expect.poll(() => router.state.location).toMatchObject({
      pathname: "/paths/edit",
      search: {
        orgId: 1,
        siteId: 10,
        buildingId: 100,
        pathId: 77,
        created: true,
      },
    });
  });
});
