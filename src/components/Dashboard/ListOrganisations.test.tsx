import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    const user = userEvent.setup();
    await renderWithQuery(<ListOrganisations />);

    expect(await screen.findByText("Main Site")).toBeInTheDocument();
    expect(await screen.findByText("Main Building")).toBeInTheDocument();

    await user.click(screen.getByText("South Campus"));

    await waitFor(() => {
      const state = useSelectionStore.getState();
      expect(state.orgId).toBe(2);
      expect(state.siteId).toBeUndefined();
      expect(state.buildingId).toBeUndefined();
      expect(state.locationId).toBeUndefined();
      expect(state.pathId).toBeUndefined();
    });
    expect(await screen.findByText("No sites found for this organisation.")).toBeInTheDocument();
  });

  test("loads organisation details and saves edits through the API", async () => {
    const user = userEvent.setup();
    await renderWithQuery(<ListOrganisations />);
    const northCampus = await screen.findByText("North Campus");
    const card = northCampus.closest("article");
    expect(card).not.toBeNull();

    await user.click(within(card!).getByRole("button", { name: "View details" }));
    expect(await screen.findByText("north-campus")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    await user.click(within(card!).getByRole("button", { name: "Edit" }));
    const nameInput = await screen.findByLabelText("Name");
    await user.clear(nameInput);
    await user.type(nameInput, "Northern Campus");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(dashboardRequests.organisationUpdates).toEqual([
        { organisationId: 1, name: "Northern Campus" },
      ]);
    });
  });
});
