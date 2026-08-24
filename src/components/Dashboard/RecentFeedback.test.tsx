import { beforeEach, describe, expect, test } from "vitest";
import { renderWithQuery } from "test/render";
import {
  dashboardRequests,
  resetDashboardMockData,
} from "test/handlers/dashboard";
import { RecentFeedback } from "./RecentFeedback";

describe("RecentFeedback", () => {
  beforeEach(resetDashboardMockData);

  test("allows an administrator to update status and confirm removal", async () => {
    const screen = await renderWithQuery(<RecentFeedback />);

    await expect.element(
      screen.getByText("The directions at the north entrance were unclear."),
    ).toBeInTheDocument();
    await expect.element(
      screen.getByText("The elevator route was inaccessible."),
    ).toBeInTheDocument();
    await expect.element(screen.getByText("Path #42")).toBeInTheDocument();

    await screen.getByRole("tab", { name: "General" }).click();
    await expect.element(
      screen.getByText("The elevator route was inaccessible."),
    ).not.toBeInTheDocument();
    await screen.getByRole("button", { name: "View" }).click();
    await screen.getByLabelText("Status").selectOptions("resolved");

    await expect.poll(() => dashboardRequests.feedbackStatusUpdates).toEqual([
      { feedbackId: 7, status: "resolved" },
    ]);

    await screen.getByRole("button", { name: "Remove" }).click();
    await screen.getByRole("button", { name: "Confirm" }).click();

    await expect.poll(() => dashboardRequests.deletedFeedbackIds).toEqual([7]);
  });
});
