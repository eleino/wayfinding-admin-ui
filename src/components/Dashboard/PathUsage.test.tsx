import { http, HttpResponse } from "msw";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useSelectionStore } from "@storage/store";
import { server } from "test/server";
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
    server.use(
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

    await renderWithQuery(<PathUsage />);

    expect(await screen.findByText("Most started path")).toBeInTheDocument();
    expect(await screen.findByText("East entrance to library · 8 starts")).toBeInTheDocument();
    expect(screen.getByText("Most completed path")).toBeInTheDocument();
    expect(screen.getByText("Main entrance to lobby · 4 completions")).toBeInTheDocument();
  });
});
