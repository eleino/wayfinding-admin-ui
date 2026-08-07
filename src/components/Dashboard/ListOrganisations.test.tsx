import { beforeEach, describe, expect, test } from "vitest";
import { useSelectionStore } from "@storage/store";
import { renderWithQuery } from "test/render";
import {
  dashboardRequests,
  resetDashboardMockData,
} from "test/handlers/dashboard";
import { ListOrganisations } from "./ListOrganisations";

describe("ListOrganisations", () => {
  beforeEach(() => {
    resetDashboardMockData();
    useSelectionStore.setState({
      orgId: 1,
      siteId: 10,
      buildingId: 100,
      locationId: 50,
      pathId: 60,
    });
  });

  test("shows the selected hierarchy and clears descendants when the organisation changes", async () => {
    const screen = await renderWithQuery(<ListOrganisations />);

    await expect.element(screen.getByText("Main Site")).toBeInTheDocument();
    await expect.element(screen.getByText("Main Building")).toBeInTheDocument();

    await screen.getByText("South Campus").click();

    await expect.poll(() => useSelectionStore.getState()).toMatchObject({
      orgId: 2,
      siteId: undefined,
      buildingId: undefined,
      locationId: undefined,
      pathId: undefined,
    });
    await expect.element(
      screen.getByText("No sites found for this organisation."),
    ).toBeInTheDocument();
  });

  test("loads organisation details and saves edits through the API", async () => {
    const screen = await renderWithQuery(<ListOrganisations />);
    const card = screen.getByRole("article", { hasText: "North Campus" });

    await card.getByRole("button", { name: "View details" }).first().click();
    await expect.element(screen.getByText("north-campus")).toBeInTheDocument();
    await screen.getByRole("button", { name: "Close dialog" }).click();

    await card.getByRole("button", { name: "Edit" }).first().click();
    const nameInput = screen.getByLabelText("Name");
    await nameInput.clear();
    await nameInput.fill("Northern Campus");
    await screen.getByRole("button", { name: "Save changes" }).click();

    await expect.poll(() => dashboardRequests.organisationUpdates).toEqual([
      { organisationId: 1, name: "Northern Campus" },
    ]);
  });
});
