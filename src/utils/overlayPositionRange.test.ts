import { describe, expect, test } from "vitest";
import { calculateOverlayPositionRanges } from "./overlayPositionRange";

describe("calculateOverlayPositionRanges", () => {
  test("uses the rendered image and overlay dimensions", () => {
    expect(
      calculateOverlayPositionRanges({
        imageWidth: 400,
        imageHeight: 300,
        overlayWidth: 80,
        overlayHeight: 40,
        transformedOverlayWidth: 80,
        transformedOverlayHeight: 40,
      }),
    ).toEqual({
      x: { min: -250, max: 150 },
      y: { min: -375, max: 275 },
    });
  });

  test("accounts for the overlay's transformed visual footprint", () => {
    expect(
      calculateOverlayPositionRanges({
        imageWidth: 400,
        imageHeight: 300,
        overlayWidth: 80,
        overlayHeight: 40,
        transformedOverlayWidth: 100,
        transformedOverlayHeight: 60,
      }),
    ).toEqual({
      x: { min: -237, max: 137 },
      y: { min: -350, max: 250 },
    });
  });

  test("centers an overlay that cannot fit on an axis", () => {
    expect(
      calculateOverlayPositionRanges({
        imageWidth: 100,
        imageHeight: 100,
        overlayWidth: 120,
        overlayHeight: 20,
        transformedOverlayWidth: 120,
        transformedOverlayHeight: 20,
      }),
    ).toEqual({
      x: { min: -50, max: -50 },
      y: { min: -250, max: 150 },
    });
  });

  test("returns null until both images have measurable dimensions", () => {
    expect(
      calculateOverlayPositionRanges({
        imageWidth: 0,
        imageHeight: 300,
        overlayWidth: 80,
        overlayHeight: 40,
        transformedOverlayWidth: 80,
        transformedOverlayHeight: 40,
      }),
    ).toBeNull();
  });
});
