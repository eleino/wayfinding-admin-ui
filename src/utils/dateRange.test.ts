import { describe, expect, test } from "vitest";
import { getPast30DaysDateRange } from "./dateRange";

describe("getPast30DaysDateRange", () => {
  test("returns an inclusive 30-day date range", () => {
    expect(getPast30DaysDateRange(new Date(2026, 7, 7))).toEqual({
      startDate: "2026-07-09",
      endDate: "2026-08-07",
    });
  });
});
