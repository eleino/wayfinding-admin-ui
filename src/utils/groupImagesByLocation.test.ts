import { describe, expect, test } from "vitest";
import { groupImagesByLocation } from "./groupImagesByLocation";

const image = (key: string) => ({
  key,
  url: `https://example.com/${key}.jpg`,
  type: key.startsWith("LOCATION_") ? "location" : "step",
});

describe("groupImagesByLocation", () => {
  test("ranks exact current and connected location IDs without excluding images", () => {
    const images = [
      image("IMAGE_NEXT_5_TO_3"),
      image("IMAGE_APPROACH_5_FROM_6"),
      image("LOCATION_5_IMG"),
      image("IMAGE_NEXT_3_TO_5"),
      image("IMAGE_APPROACH_11_FROM_5"),
      image("IMAGE_NEXT_15_TO_3"),
      image("IMAGE_APPROACH_10_FROM_25"),
    ];

    const groups = groupImagesByLocation(images, 5);

    expect(groups.map((group) => group.label)).toEqual([
      "At location 5",
      "Connected to location 5",
      "Other images",
    ]);
    expect(groups[0].images.map((item) => item.key)).toEqual([
      "IMAGE_APPROACH_5_FROM_6",
      "IMAGE_NEXT_5_TO_3",
      "LOCATION_5_IMG",
    ]);
    expect(groups[1].images.map((item) => item.key)).toEqual([
      "IMAGE_APPROACH_11_FROM_5",
      "IMAGE_NEXT_3_TO_5",
    ]);
    expect(groups.flatMap((group) => group.images)).toHaveLength(images.length);
    expect(groups[2].images.map((item) => item.key)).toContain(
      "IMAGE_NEXT_15_TO_3",
    );
  });

  test("keeps creation-time images in one unranked group", () => {
    const groups = groupImagesByLocation(
      [image("IMAGE_NEXT_5_TO_3"), image("LOCATION_2_IMG")],
      undefined,
    );

    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe("All images");
    expect(groups[0].images).toHaveLength(2);
  });
});
