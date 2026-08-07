import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useSelectionStore } from "@storage/store";
import { worker } from "test/worker";
import { renderWithQuery } from "test/render";
import { PathUsage } from "./PathUsage";

vi.mock("./PathUsageChart", () => ({
  default: () => <div>Path usage chart</div>,
}));

describe("PathUsage", () => {
  beforeEach(() => {
    useSelectionStore.setState({
      buildingId: 100,
      buildingList: [{ id: 100, name: "Main Building" }],
    });
  });

  test("shows the paths with the most starts and completions", async () => {
    worker.use(
      http.get("*/metrics/paths", () =>
        HttpResponse.json([
          {
            path_id: 1,
            usage_count: 5,
            finished_count: 4,
            metrics: [{ date: "2026-08-03", usage_count: 5, finished_count: 4 }],
          },
          {
            path_id: 2,
            usage_count: 8,
            finished_count: 3,
            metrics: [{ date: "2026-08-03", usage_count: 8, finished_count: 3 }],
          },
        ]),
      ),
    );

    const screen = await renderWithQuery(<PathUsage />);

    await expect.element(screen.getByText("Most started path")).toBeInTheDocument();
    await expect.element(
      screen.getByText(/East entrance to library.*8 starts/),
    ).toBeInTheDocument();
    await expect.element(screen.getByText("Most completed path")).toBeInTheDocument();
    await expect.element(
      screen.getByText(/Main entrance to lobby.*4 completions/),
    ).toBeInTheDocument();
  });
});
