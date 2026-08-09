import { expect, test } from "vitest";
import { renderWithQuery } from "test/render";
import ImagesView from "./Images/ImagesView";
import QRCodesView from "./QRCodes/QRCodesView";

test("the images view reads search parameters from the active router", async () => {
  const screen = await renderWithQuery(<ImagesView />, {
    path: "/images",
  });

  await expect.element(screen.getByText("Media/Images")).toBeVisible();
});

test("the QR codes view reads search parameters from the active router", async () => {
  const screen = await renderWithQuery(<QRCodesView />, {
    path: "/qrcodes",
  });

  await expect.element(screen.getByText("QR Codes")).toBeVisible();
});
