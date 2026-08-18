import { describe, expect, test } from "vitest";
import { fillTranslationsForLanguages } from "./stepInstructionTranslations";

describe("fillTranslationsForLanguages", () => {
  test("includes every available language, using an empty string for missing text", () => {
    expect(
      fillTranslationsForLanguages(
        [
          { code: "fi" },
          { code: "en" },
          { code: "sv" },
        ],
        [
          { lang: "fi", text: "Jatka suoraan" },
          { lang: "sv" },
        ],
      ),
    ).toEqual([
      { lang: "fi", text: "Jatka suoraan" },
      { lang: "en", text: "" },
      { lang: "sv", text: "" },
    ]);
  });
});
