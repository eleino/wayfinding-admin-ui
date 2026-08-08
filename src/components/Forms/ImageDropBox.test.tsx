import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { ImageDropBox } from "./ImageDropBox";

describe("ImageDropBox", () => {
  test("keeps its controls visible and opens an optional larger preview", async () => {
    const screen = await render(
      <ImageDropBox
        imageUrl="https://example.com/location.jpg"
        onFileSelect={vi.fn()}
      />,
    );

    await expect
      .element(screen.getByText("Upload a different image"))
      .toBeInTheDocument();
    await expect.element(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();

    await screen.getByRole("button", { name: "Open larger image preview" }).click();

    await expect.element(screen.getByRole("dialog")).toBeInTheDocument();
    await expect.element(screen.getByAltText("Large image preview")).toHaveAttribute(
      "src",
      "https://example.com/location.jpg",
    );

    await screen.getByRole("button", { name: "Close image preview" }).click();
    await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
  });

  test("removes an existing image from the drop box", async () => {
    const onFileSelect = vi.fn();
    const onExistingImageRemove = vi.fn();
    const screen = await render(
      <ImageDropBox
        imageUrl="https://example.com/location.jpg"
        onFileSelect={onFileSelect}
        onExistingImageRemove={onExistingImageRemove}
      />,
    );

    await screen.getByRole("button", { name: "Remove" }).click();

    expect(onFileSelect).toHaveBeenCalledWith(undefined);
    expect(onExistingImageRemove).toHaveBeenCalledOnce();
    await expect.element(screen.getByText("Upload an image")).toBeInTheDocument();
    await expect.element(screen.getByAltText("Selected image preview")).not.toBeInTheDocument();
  });

  test("protects a restored existing image from an accidental double removal", async () => {
    const onExistingImageRemove = vi.fn();
    const screen = await render(
      <ImageDropBox
        imageUrl="https://example.com/original.jpg"
        onFileSelect={vi.fn()}
        onExistingImageRemove={onExistingImageRemove}
      />,
    );
    const replacement = new File(["replacement"], "replacement.png", {
      type: "image/png",
    });

    await screen.getByLabelText("Upload image").upload(replacement);
    const removeButton = screen.getByRole("button", { name: "Remove" });
    await removeButton.click();

    await expect.element(screen.getByAltText("Selected image preview")).toHaveAttribute(
      "src",
      "https://example.com/original.jpg",
    );
    await expect.element(removeButton).toBeDisabled();
    expect(onExistingImageRemove).not.toHaveBeenCalled();

    await new Promise((resolve) => window.setTimeout(resolve, 1_100));
    await expect.element(removeButton).toBeEnabled();
  });

  test("selects a keyed image from caller-provided library groups", async () => {
    const onExistingImageSelect = vi.fn();
    const screen = await render(
      <ImageDropBox
        onFileSelect={vi.fn()}
        onExistingImageSelect={onExistingImageSelect}
        existingImageGroups={[
          {
            label: "At location 5",
            images: [
              {
                key: "IMAGE_NEXT_5_TO_3",
                url: "https://example.com/next-5-to-3.jpg",
                type: "step",
              },
            ],
          },
        ]}
      />,
    );

    await screen.getByRole("button", { name: "Choose an existing image" }).click();
    await expect.element(screen.getByText("IMAGE_NEXT_5_TO_3")).toBeInTheDocument();

    await screen.getByRole("button", { name: /IMAGE_NEXT_5_TO_3/ }).click();

    expect(onExistingImageSelect).toHaveBeenCalledWith({
      key: "IMAGE_NEXT_5_TO_3",
      url: "https://example.com/next-5-to-3.jpg",
      type: "step",
    });
    await expect.element(screen.getByAltText("Selected image preview")).toHaveAttribute(
      "src",
      "https://example.com/next-5-to-3.jpg",
    );
  });
});
