import { beforeEach, describe, expect, test } from "vitest";
import { useSelectionStore } from "./store";

describe("selection store lists", () => {
  beforeEach(() => {
    useSelectionStore.setState({
      siteListsByOrgId: {},
      buildingListsBySiteId: {},
    });
  });

  test("keeps site lists saved for other organisations", () => {
    const store = useSelectionStore.getState();

    store.setSiteList(1, [{ id: 10, name: "Main site" }]);
    store.setSiteList(2, [{ id: 20, name: "Other site" }]);

    expect(useSelectionStore.getState().siteListsByOrgId).toEqual({
      1: [{ id: 10, name: "Main site" }],
      2: [{ id: 20, name: "Other site" }],
    });
  });

  test("keeps building lists saved for other sites", () => {
    const store = useSelectionStore.getState();

    store.setBuildingList(10, [{ id: 100, name: "Main building" }]);
    store.setBuildingList(20, [{ id: 200, name: "Other building" }]);

    expect(useSelectionStore.getState().buildingListsBySiteId).toEqual({
      10: [{ id: 100, name: "Main building" }],
      20: [{ id: 200, name: "Other building" }],
    });
  });
});
