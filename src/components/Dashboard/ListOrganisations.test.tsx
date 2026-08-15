import { beforeEach, describe, expect, test } from "vitest";
import { useSelectionStore } from "@storage/store";
import { renderWithQuery } from "test/render";
import {
  dashboardRequests,
  resetDashboardMockData,
} from "test/handlers/dashboard";
import {
  resetTranslationMockData,
  translationRequests,
} from "test/handlers/translations";
import { ListOrganisations } from "./ListOrganisations";

describe("ListOrganisations", () => {
  beforeEach(() => {
    resetDashboardMockData();
    resetTranslationMockData();
    useSelectionStore.setState({
      orgId: 1,
      siteId: 10,
      buildingId: 100,
      locationId: 50,
      pathId: 60,
    });
  });

  test("shows the selected hierarchy and clears descendants when the organisation changes", async () => {
    const screen = await renderWithQuery(<ListOrganisations />);

    await expect.element(screen.getByText("Main Site")).toBeInTheDocument();
    await expect.element(screen.getByText("Main Building")).toBeInTheDocument();

    await screen.getByText("South Campus").click();

    await expect.poll(() => useSelectionStore.getState()).toMatchObject({
      orgId: 2,
      siteId: undefined,
      buildingId: undefined,
      locationId: undefined,
      pathId: undefined,
    });
    await expect.element(
      screen.getByText("No sites found for this organisation."),
    ).toBeInTheDocument();
  });

  test("creates organisations, sites, and buildings from their section headers", async () => {
    const screen = await renderWithQuery(<ListOrganisations />);

    await screen.getByRole("button", { name: "Add site" }).click();
    await screen.getByLabelText("Internal name").fill("New Site");
    await screen.getByLabelText("Address").fill("New Street 1");
    await screen
      .getByRole("group", { name: "Translated name" })
      .getByLabelText("English")
      .fill("New Site");
    await screen
      .getByLabelText("Upload image")
      .upload(new File(["site"], "site.png", { type: "image/png" }));
    await screen.getByRole("button", { name: "Add site" }).last().click();
    await expect.poll(() => dashboardRequests.siteCreates).toEqual([
      { organisationId: 1, name: "New Site", address: "New Street 1" },
    ]);
    await expect.poll(() => dashboardRequests.imageUploads).toContainEqual({
      type: "site",
      key: "CREATED_SITE_IMAGE",
      itemId: "11",
    });
    await expect.poll(() => translationRequests.created).toContainEqual({
      translation_key: "CREATED_SITE_NAME",
      language_code: "en",
      type: "site_name",
      text_value: "New Site",
    });

    await screen.getByRole("button", { name: "Add building" }).click();
    await screen.getByLabelText("Internal name").fill("New Building");
    await screen.getByLabelText("Number of floors").fill("3");
    await screen.getByRole("button", { name: "Add building" }).last().click();
    await expect.poll(() => dashboardRequests.buildingCreates).toEqual([
      {
        siteId: 11,
        name: "New Building",
        totalFloors: 3,
        organisations: [1],
      },
    ]);

    useSelectionStore.getState().setOrgId(1);
    await screen.getByRole("button", { name: "Add organisation" }).click();
    await screen.getByLabelText("Name").fill("New Organisation");
    await screen
      .getByLabelText("Upload image")
      .first()
      .upload(new File(["logo"], "logo.png", { type: "image/png" }));
    await screen.getByRole("button", { name: "Add organisation" }).last().click();
    await expect.poll(() => dashboardRequests.organisationCreates).toEqual([
      { parentId: 1, name: "New Organisation" },
    ]);
    await expect.poll(() => dashboardRequests.imageUploads).toContainEqual({
      type: "logo",
      key: "CREATED_ORGANIZATION_LIGHT_LOGO",
      itemId: "3",
    });
  });

  test("loads organisation details and saves edits through the API", async () => {
    const screen = await renderWithQuery(<ListOrganisations />);
    const card = screen.getByRole("article", { hasText: "North Campus" });

    await card.getByRole("button", { name: "View details" }).first().click();
    await expect.element(screen.getByText("north-campus")).toBeInTheDocument();
    await screen.getByRole("button", { name: "Close dialog" }).click();

    await card.getByRole("button", { name: "Edit" }).first().click();
    const nameInput = screen.getByLabelText("Name");
    await nameInput.clear();
    await nameInput.fill("Northern Campus");
    await screen.getByRole("button", { name: "Save changes" }).click();

    await expect.poll(() => dashboardRequests.organisationUpdates).toEqual([
      { organisationId: 1, name: "Northern Campus" },
    ]);
  });

  test("saves organisation colors and logos without updating unchanged core data", async () => {
    const screen = await renderWithQuery(<ListOrganisations />);
    const card = screen.getByRole("article", { hasText: "North Campus" });
    await card.getByRole("button", { name: "Edit" }).first().click();

    const lightTheme = screen.getByRole("region", { name: "Light theme" });
    await lightTheme.getByRole("button", { name: "Set custom color" }).first().click();
    const colorPicker = lightTheme.getByRole("group", {
      name: "Light primary color picker",
    });
    await expect.element(colorPicker).toBeInTheDocument();
    await expect.element(
      colorPicker.getByRole("slider", { name: "Hue" }),
    ).toBeInTheDocument();
    await colorPicker
      .getByLabelText("Light primary color hex value")
      .fill("#123456");
    await screen
      .getByLabelText("Upload image")
      .first()
      .upload(new File(["logo"], "logo.png", { type: "image/png" }));
    await screen.getByRole("button", { name: "Save changes" }).click();

    const themeJson =
      '{"dark":{},"light":{"palette":{"primary":{"main":"#123456"}}},"default":"light"}';
    await expect.poll(() => dashboardRequests.organisationSettingsUpdates).toEqual([
      { organisationId: 1, themeJson },
    ]);
    expect(dashboardRequests.organisationUpdates).toEqual([]);
    await expect.poll(() => dashboardRequests.imageUploads).toContainEqual({
      type: "logo",
      key: "ORGANIZATION_1_LOGO_LIGHT",
      itemId: "1",
    });
  });

  test("only enables save after each entity form has changed", async () => {
    const screen = await renderWithQuery(<ListOrganisations />);

    await screen
      .getByRole("article", { hasText: "North Campus" })
      .getByRole("button", { name: "Edit" })
      .first()
      .click();
    await expect.element(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeDisabled();
    await screen.getByLabelText("Name").fill("Northern Campus");
    await expect.element(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeEnabled();
    await screen.getByLabelText("Name").fill("North Campus");
    await expect.element(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeDisabled();
    await screen.getByRole("button", { name: "Cancel" }).click();

    await screen
      .getByRole("region", { name: "Sites" })
      .getByRole("button", { name: "Edit" })
      .click();
    await expect.element(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeDisabled();
    await screen.getByLabelText("Address").fill("Changed Street 2");
    await expect.element(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeEnabled();
    await screen.getByRole("button", { name: "Cancel" }).click();

    await screen
      .getByRole("region", { name: "Buildings" })
      .getByRole("button", { name: "Edit" })
      .click();
    await expect.element(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeDisabled();
    await screen.getByLabelText("Number of floors").fill("6");
    await expect.element(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeEnabled();
    await screen.getByRole("button", { name: "Cancel" }).click();

    expect(dashboardRequests.organisationUpdates).toEqual([]);
    expect(dashboardRequests.organisationSettingsUpdates).toEqual([]);
    expect(dashboardRequests.siteUpdates).toEqual([]);
    expect(dashboardRequests.buildingUpdates).toEqual([]);
    expect(dashboardRequests.imageUploads).toEqual([]);
    expect(dashboardRequests.imageCopies).toEqual([]);
    expect(dashboardRequests.deletedImageKeys).toEqual([]);
    expect(translationRequests.created).toEqual([]);
    expect(translationRequests.updated).toEqual([]);
    expect(translationRequests.deleted).toEqual([]);
  });

  test("updates site fields, translations, and image in one form submission", async () => {
    const screen = await renderWithQuery(<ListOrganisations />);
    const card = screen
      .getByRole("region", { name: "Sites" })
      .getByRole("article");
    await card.getByRole("button", { name: "Edit" }).click();

    await screen.getByLabelText("Address").fill("Updated Street 2");
    await screen
      .getByRole("group", { name: "Translated name" })
      .getByLabelText("English")
      .fill("Updated Site");
    await screen
      .getByRole("group", { name: "Description" })
      .getByLabelText("English")
      .fill("English site description");
    await screen
      .getByRole("group", { name: "Welcome message" })
      .getByLabelText("Finnish")
      .clear();
    await screen
      .getByLabelText("Upload image")
      .upload(new File(["site"], "site.png", { type: "image/png" }));
    await screen.getByRole("button", { name: "Save changes" }).click();

    await expect.poll(() => dashboardRequests.siteUpdates).toEqual([
      { siteId: 10, name: "Main Site", address: "Updated Street 2" },
    ]);
    await expect.poll(() => translationRequests.updated).toContainEqual({
      translationKey: "SITE_10_NAME",
      languageCode: "en",
      textValue: "Updated Site",
    });
    await expect.poll(() => translationRequests.created).toContainEqual({
      translation_key: "SITE_10_DESC",
      language_code: "en",
      type: "site_desc",
      text_value: "English site description",
    });
    await expect.poll(() => translationRequests.deleted).toContainEqual({
      translationKey: "SITE_10_WELCOME",
      languageCode: "fi",
    });
    await expect.poll(() => dashboardRequests.imageUploads).toContainEqual({
      type: "site",
      key: "SITE_10_IMG",
      itemId: "10",
    });
  });

  test("updates building access, translations, and image", async () => {
    const screen = await renderWithQuery(<ListOrganisations />);
    const card = screen
      .getByRole("region", { name: "Buildings" })
      .getByRole("article");
    await card.getByRole("button", { name: "Edit" }).click();

    await screen.getByLabelText("Number of floors").fill("6");
    await screen.getByLabelText("South Campus").click();
    await screen
      .getByRole("group", { name: "Description" })
      .getByLabelText("English")
      .fill("English building description");
    await screen
      .getByLabelText("Upload image")
      .upload(new File(["building"], "building.png", { type: "image/png" }));
    await screen.getByRole("button", { name: "Save changes" }).click();

    await expect.poll(() => dashboardRequests.buildingUpdates).toEqual([
      {
        buildingId: 100,
        name: "Main Building",
        totalFloors: 6,
        organisations: [1, 2],
      },
    ]);
    await expect.poll(() => translationRequests.created).toContainEqual({
      translation_key: "BUILDING_100_DESC",
      language_code: "en",
      type: "building_desc",
      text_value: "English building description",
    });
    await expect.poll(() => dashboardRequests.imageUploads).toContainEqual({
      type: "building",
      key: "BUILDING_100_IMG",
      itemId: "100",
    });
  });
});
