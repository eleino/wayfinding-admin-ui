import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";
import { renderWithQuery } from "test/render";
import { worker } from "test/worker";
import { ListLocations } from "./ListLocations";

describe("ListLocations", () => {
  test("matches location thumbnails using the complete image key", async () => {
    worker.use(
      http.get("*/buildings/:buildingId/locations", () =>
        HttpResponse.json({
          data: [
            { id: 1, name: "Lobby" },
            { id: 2, name: "Meeting room" },
          ],
        }),
      ),
      http.get("*/images/location", () =>
        HttpResponse.json({
          data: [
            {
              key: "LOCATION_1_IMG",
              url: "https://example.com/lobby.jpg",
            },
            {
              key: "LOCATION_12_IMG",
              url: "https://example.com/unrelated.jpg",
            },
          ],
          meta: { images: { limit: "1000", total: 2 } },
        }),
      ),
    );

    const screen = await renderWithQuery(
      <ListLocations buildingId={7} page="locations" />,
    );

    await expect.element(screen.getByRole("img", { name: "Lobby image" })).toHaveAttribute(
      "src",
      "https://example.com/lobby.jpg",
    );
    await expect.element(screen.getByText("No image")).toBeInTheDocument();
    await expect
      .element(screen.getByRole("img", { name: "Meeting room image" }))
      .not.toBeInTheDocument();
  });
});
