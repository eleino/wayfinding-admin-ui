import { PathList } from "./PathList";
import { renderWithQuery } from "test/render";

describe("PathList", () => {
  test("shows each path's usage during the past 30 days", async () => {
    const screen = await renderWithQuery(<PathList buildingId={100} />, {
      searchParams: { orgId: 1, siteId: 10, buildingId: 100 },
    });

    await expect
      .element(screen.getByText("Usage", { exact: true }))
      .toBeInTheDocument();
    await expect.element(screen.getByText("Main entrance to lobby")).toBeInTheDocument();
    await expect.element(screen.getByText("5", { exact: true })).toBeInTheDocument();
    await expect.element(screen.getByText("East entrance to library")).toBeInTheDocument();
    await expect.element(screen.getByText("0", { exact: true })).toBeInTheDocument();
  });
});
