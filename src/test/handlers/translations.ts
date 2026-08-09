import { http, HttpResponse } from "msw";
import type { CreateTranslationDto } from "@apptypes/dtos/create-translation.dto";
import type { UpdateTranslationDTO } from "@apptypes/dtos/update-translation.dto";

type StoredTranslation = CreateTranslationDto & { translation_id: number };

const initialTranslations: StoredTranslation[] = [
  {
    translation_id: 1,
    translation_key: "APP_WELCOME",
    language_code: "fi",
    type: "app",
    text_value: "Tervetuloa",
  },
  {
    translation_id: 2,
    translation_key: "APP_WELCOME",
    language_code: "en",
    type: "app",
    text_value: "Welcome",
  },
  {
    translation_id: 3,
    translation_key: "APP_FINNISH_ONLY",
    language_code: "fi",
    type: "app",
    text_value: "Vain suomeksi",
  },
  {
    translation_id: 4,
    translation_key: "LOCATION_12_NAME",
    language_code: "fi",
    type: "location_name",
    text_value: "Kirjasto",
  },
  {
    translation_id: 5,
    translation_key: "CURRENT_LOCATION_12_MSG",
    language_code: "fi",
    type: "at_location_message",
    text_value: "Olet kirjastossa",
  },
  {
    translation_id: 6,
    translation_key: "STEP_9_APPROACH",
    language_code: "fi",
    type: "approach_instruction",
    text_value: "Käänny vasemmalle",
  },
  {
    translation_id: 7,
    translation_key: "STEP_9_NEXT",
    language_code: "fi",
    type: "to_next_instruction",
    text_value: "Jatka eteenpäin",
  },
];

let translations = initialTranslations.map((translation) => ({
  ...translation,
}));

export const translationRequests = {
  created: [] as CreateTranslationDto[],
  updated: [] as Array<{
    translationKey: string;
    languageCode: string;
    textValue: string;
  }>,
  deleted: [] as Array<{ translationKey: string; languageCode: string }>,
};

export const resetTranslationMockData = () => {
  translations = initialTranslations.map((translation) => ({
    ...translation,
  }));
  translationRequests.created = [];
  translationRequests.updated = [];
  translationRequests.deleted = [];
};

export const translationHandlers = [
  http.get("*/init/app", () =>
    HttpResponse.json({
      settings: {
        id: 1,
        default_language: "fi",
        maintenance_mode: false,
        app_name: "Wayfinding",
        version: "1.0.0",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
      languages: [
        { code: "fi", name: "Finnish" },
        { code: "en", name: "English" },
      ],
    }),
  ),

  http.get("*/translations/app", ({ request }) => {
    const languageCode = new URL(request.url).searchParams.get("lang") ?? "fi";
    return HttpResponse.json({
      [languageCode]: translations
        .filter(
          (translation) =>
            translation.type === "app" &&
            translation.language_code === languageCode,
        )
        .map(({ translation_key, text_value }) => ({
          translation_key,
          text_value,
        })),
    });
  }),

  http.post("*/translations", async ({ request }) => {
    const body = (await request.json()) as CreateTranslationDto;
    translationRequests.created.push(body);
    const translation = {
      ...body,
      translation_id: Math.max(0, ...translations.map((item) => item.translation_id)) + 1,
    };
    translations.push(translation);
    return HttpResponse.json(translation, { status: 201 });
  }),

  http.put("*/translations/:key", async ({ params, request }) => {
    const languageCode =
      new URL(request.url).searchParams.get("lang") ?? "fi";
    const body = (await request.json()) as UpdateTranslationDTO;
    const translationKey = String(params.key);
    translationRequests.updated.push({
      translationKey,
      languageCode,
      textValue: body.text_value,
    });
    const translation = translations.find(
      (item) =>
        item.translation_key === translationKey &&
        item.language_code === languageCode,
    );
    if (!translation) return new HttpResponse(null, { status: 404 });
    translation.text_value = body.text_value;
    return HttpResponse.json(translation);
  }),

  http.delete("*/translations/:key", ({ params, request }) => {
    const languageCode =
      new URL(request.url).searchParams.get("lang") ?? "fi";
    const translationKey = String(params.key);
    translationRequests.deleted.push({ translationKey, languageCode });
    translations = translations.filter(
      (item) =>
        item.translation_key !== translationKey ||
        item.language_code !== languageCode,
    );
    return new HttpResponse(null, { status: 204 });
  }),
];
