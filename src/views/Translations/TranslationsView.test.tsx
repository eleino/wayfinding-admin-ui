import { beforeEach, describe, expect, test } from "vitest";
import { renderWithQuery } from "test/render";
import {
  resetTranslationMockData,
  translationRequests,
} from "test/handlers/translations";
import TranslationsView from "./TranslationsView";

describe("TranslationsView", () => {
  beforeEach(resetTranslationMockData);

  test("searches translations and filters keys with missing languages", async () => {
    const screen = await renderWithQuery(<TranslationsView />);

    await expect.element(screen.getByText("APP_WELCOME")).toBeInTheDocument();
    await expect.element(screen.getByText("APP_FINNISH_ONLY")).toBeInTheDocument();
    await expect.element(
      screen.getByText(/Translations missing:\s*1/),
    ).toBeInTheDocument();
    await expect.element(
      screen.getByRole("region", { name: "App translations" }),
    ).toHaveClass("w-full", "min-w-0");
    await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();

    await screen.getByLabelText("Search translations").fill("Welcome");
    await expect.element(screen.getByText("APP_WELCOME")).toBeInTheDocument();
    await expect.element(screen.getByText("APP_FINNISH_ONLY")).not.toBeInTheDocument();

    await screen.getByLabelText("Search translations").clear();
    await screen.getByLabelText("Show").selectOptions("missing");
    await expect.element(screen.getByText("APP_FINNISH_ONLY")).toBeInTheDocument();
    await expect.element(screen.getByText("APP_WELCOME")).not.toBeInTheDocument();
  });

  test("requires non-empty text and creates or updates app translations", async () => {
    const screen = await renderWithQuery(<TranslationsView />);
    const incompleteRow = screen.getByRole("article", {
      name: "Translation APP_FINNISH_ONLY",
    });
    await incompleteRow
      .getByRole("button", { name: "Edit APP_FINNISH_ONLY" })
      .click();
    let editDialog = screen.getByRole("dialog", {
      name: "Edit APP_FINNISH_ONLY",
    });
    const missingEnglishInput = editDialog.getByLabelText("English");

    await missingEnglishInput.fill("   ");
    await editDialog.getByRole("button", { name: "Save changes" }).click();
    await expect.element(
      editDialog.getByText("Translation text cannot be empty"),
    ).toBeInTheDocument();
    expect(translationRequests.created).toEqual([]);

    await missingEnglishInput.fill("Finnish only");
    await editDialog.getByRole("button", { name: "Save changes" }).click();
    await expect.poll(() => translationRequests.created).toContainEqual({
      translation_key: "APP_FINNISH_ONLY",
      language_code: "en",
      type: "app",
      text_value: "Finnish only",
    });
    expect(translationRequests.updated).toEqual([]);

    const welcomeRow = screen.getByRole("article", {
      name: "Translation APP_WELCOME",
    });
    await welcomeRow.getByRole("button", { name: "Edit APP_WELCOME" }).click();
    editDialog = screen.getByRole("dialog", { name: "Edit APP_WELCOME" });
    const englishInput = editDialog.getByLabelText("English");
    await englishInput.clear();
    await englishInput.fill("Hello");
    await editDialog.getByRole("button", { name: "Save changes" }).click();
    await expect.poll(() => translationRequests.updated).toContainEqual({
      translationKey: "APP_WELCOME",
      languageCode: "en",
      textValue: "Hello",
    });
    expect(translationRequests.created).toHaveLength(1);
  });

  test("creates a new key for every configured language", async () => {
    const screen = await renderWithQuery(<TranslationsView />);
    await screen
      .getByRole("button", { name: "Create app translation" })
      .click();
    const createForm = screen.getByRole("dialog", {
      name: "Create app translation",
    });

    await createForm.getByLabelText("Translation key").fill("APP_GOODBYE");
    await createForm.getByLabelText("Finnish").fill("Näkemiin");
    await createForm.getByLabelText("English").fill("Goodbye");
    await createForm
      .getByRole("button", { name: "Create translation" })
      .click();

    await expect.poll(() => translationRequests.created).toEqual(
      expect.arrayContaining([
        {
          translation_key: "APP_GOODBYE",
          language_code: "fi",
          type: "app",
          text_value: "Näkemiin",
        },
        {
          translation_key: "APP_GOODBYE",
          language_code: "en",
          type: "app",
          text_value: "Goodbye",
        },
      ]),
    );
    await expect.element(
      screen.getByRole("article", { name: "Translation APP_GOODBYE" }),
    ).toBeInTheDocument();
  });

  test("deletes every existing language only after explicit confirmation", async () => {
    const screen = await renderWithQuery(<TranslationsView />);
    const welcomeRow = screen.getByRole("article", {
      name: "Translation APP_WELCOME",
    });

    await welcomeRow
      .getByRole("button", { name: "Delete APP_WELCOME" })
      .click();
    expect(translationRequests.deleted).toEqual([]);
    const deleteDialog = screen.getByRole("dialog", {
      name: "Delete APP_WELCOME",
    });
    await deleteDialog
      .getByRole("button", { name: "Delete translation" })
      .click();

    await expect.poll(() => translationRequests.deleted).toEqual(
      expect.arrayContaining([
        { translationKey: "APP_WELCOME", languageCode: "fi" },
        { translationKey: "APP_WELCOME", languageCode: "en" },
      ]),
    );
    await expect.element(
      screen.getByRole("article", { name: "Translation APP_WELCOME" }),
    ).not.toBeInTheDocument();
  });
});
