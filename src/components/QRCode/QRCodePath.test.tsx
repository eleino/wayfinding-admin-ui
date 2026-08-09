import { beforeEach, describe, expect, test } from "vitest";
import {
  qrCodeRequests,
  resetQRCodeMockData,
} from "test/handlers/qrcodes";
import { renderWithQuery } from "test/render";
import { QRCodePath } from "./QRCodePath";

describe("QRCodePath", () => {
  beforeEach(resetQRCodeMockData);

  test("regenerates the code for the selected destination and accessibility mode", async () => {
    const screen = await renderWithQuery(
      <QRCodePath
        locationId={1}
        searchParams={{ orgId: 1, siteId: 10, buildingId: 100, locationId: 1 }}
      />,
      {
        path: "/qrcodes",
        searchParams: {
          orgId: 1,
          siteId: 10,
          buildingId: 100,
          locationId: 1,
        },
      },
    );

    await expect.poll(() => qrCodeRequests.destinations).toEqual([
      { locationId: 1, accessibilityLevel: "0" },
    ]);
    await expect.poll(() => qrCodeRequests.codes).toEqual([
      { locationId: 1, pathId: null },
    ]);

    const pathSelect = screen.getByLabelText(
      "Select a path to generate QR code for:",
    );
    await expect.element(pathSelect).toHaveValue("");
    await pathSelect.selectOptions("11");

    await expect
      .element(screen.getByText("Library", { exact: true }).last())
      .toBeInTheDocument();
    await expect.element(screen.getByText("(path id: 11)")).toBeInTheDocument();
    await expect.poll(() => qrCodeRequests.codes).toEqual([
      { locationId: 1, pathId: null },
      { locationId: 1, pathId: "11" },
    ]);

    await screen.getByLabelText("Accessibility:").selectOptions("1");

    await expect.poll(() => qrCodeRequests.destinations).toEqual([
      { locationId: 1, accessibilityLevel: "0" },
      { locationId: 1, accessibilityLevel: "1" },
    ]);
    await expect.element(pathSelect).toHaveValue("");
    await expect.element(screen.getByText("(path id: 11)")).not.toBeInTheDocument();
    await expect
      .element(pathSelect.getByRole("option", { name: "Accessible reception" }))
      .toBeInTheDocument();
  });
});
