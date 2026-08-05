import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    const user = userEvent.setup();
    await renderWithQuery(<RecentFeedback />);

    expect(
      await screen.findByText("The directions at the north entrance were unclear."),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "View" }));
    await user.selectOptions(screen.getByLabelText("Status"), "resolved");

    await waitFor(() => {
      expect(dashboardRequests.feedbackStatusUpdates).toEqual([
        { feedbackId: 7, status: "resolved" },
      ]);
    });

    await user.click(screen.getByRole("button", { name: "Remove" }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(dashboardRequests.deletedFeedbackIds).toEqual([7]);
    });
  });
});
