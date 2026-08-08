import type { ExistingImageGroup } from "@apptypes/image";
import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { ExistingImagePicker } from "./ExistingImagePicker";

// make multiple images
const makeImages = (prefix: string, amount: number) =>
  Array.from({ length: amount }, (_, index) => ({
    key: `${prefix}_${index + 1}`,
    url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", // inline image
    type: "step",
  }));

describe("ExistingImagePicker", () => {
  test("renders at most two groups and 20 images before loading more", async () => {
    const groups: ExistingImageGroup[] = [
      { label: "At location 5", images: makeImages("AT", 10) },
      { label: "Connected to location 5", images: makeImages("CONNECTED", 15) },
      { label: "Other images", images: makeImages("OTHER", 1) },
    ];
    const screen = await render(
      <ExistingImagePicker
        groups={groups}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await expect
      .element(screen.getByText("Showing 20 of 26 images"))
      .toBeInTheDocument();
    await expect.element(screen.getByText("CONNECTED_11")).not.toBeInTheDocument(); // only 10 at + 10 connected
    await expect.element(screen.getByText("OTHER_1")).not.toBeInTheDocument();

    await screen.getByRole("button", { name: "Load more images" }).click();

    await expect.element(screen.getByText("CONNECTED_11")).toBeInTheDocument();
    await expect.element(screen.getByText("OTHER_1")).toBeInTheDocument();
    await expect
      .element(screen.getByText("Showing 26 of 26 images"))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: "Load more images" }))
      .not.toBeInTheDocument();
  });
});
