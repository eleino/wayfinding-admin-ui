import { beforeEach, describe, expect, test } from "vitest";
import { useSelectionStore } from "@storage/store";
import { buildBreadcrumbs } from "./breadcrumbs";

describe("buildBreadcrumbs", () => {
  beforeEach(() => {
    useSelectionStore.setState({
      orgList: [
        { id: 1, name: "First organisation" },
        { id: 2, name: "Second organisation" },
      ],
      siteListsByOrgId: {
        1: [{ id: 10, name: "First site" }],
        2: [{ id: 10, name: "Second site" }],
      },
      buildingListsBySiteId: {
        10: [{ id: 100, name: "Selected building" }],
        20: [{ id: 100, name: "Different building" }],
      },
    });
  });

  test("uses the lists belonging to the breadcrumb organisation and site", () => {
    const breadcrumbs = buildBreadcrumbs("/locations", {
      orgId: 2,
      siteId: 10,
      buildingId: 100,
    });

    expect(breadcrumbs.find((crumb) => crumb.id === "crumb-site")?.label).toBe(
      "Second site",
    );
    expect(
      breadcrumbs.find((crumb) => crumb.id === "crumb-building")?.label,
    ).toBe("Selected building");
  });
});
